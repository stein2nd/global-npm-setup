# Global npm Package Setup - CLI (脱 OS 依存改修)

## 背景

v1では `~/bin/global-npm` (Zsh) が `npm run ncu:*` を呼び出していた。
v2では Node.js 製 CLI として `@s2j/global-npm` に同梱し、macOS / Windows 11で同一のサブコマンドを提供する。

install の実装は **C 型 (Node 列挙 → 明示 `npm install -g`)** とする。詳細は [mod-os-agnostic-install.md](./mod-os-agnostic-install.md)。

## コマンド一覧

```
global-npm check    # グローバルパッケージの更新確認 (ncu)
global-npm update   # package.json のバージョン範囲を更新 (ncu -u)
global-npm install  # dependencies を列挙して npm install -g を実行
```

## 各サブコマンドの仕様

### `global-npm check`

| 項目 | 内容 |
|------|------|
| 目的 | 管理対象パッケージに利用可能な更新があるか確認する |
| 実装 | `ncu -g --format time --packageFile <setup-dir>/package.json` |
| 副作用 | なし (`package.json` は変更しない) |
| v1相当 | `npm run ncu:check` |

`--format time` により各パッケージの公開日時を表示する (v1.0.1で導入済みの挙動を維持)。

### `global-npm update`

| 項目 | 内容 |
|------|------|
| 目的 | `package.json` の `dependencies` バージョン範囲を最新に書き換える |
| 実装 | `ncu -g --format time -u --packageFile <setup-dir>/package.json` |
| 副作用 | `package.json` を更新する (Git コミットはユーザー任せ) |
| v1相当 | `npm run ncu:update` |

### `global-npm install`

| 項目 | 内容 |
|------|------|
| 目的 | `dependencies` に列挙されたパッケージを **各々トップレベルの global pkg** としてインストールする |
| 実装 | C 型 — Node で `dependencies` キーを列挙し `npm install -g <names…>` |
| 副作用 | グローバル node_modules / `{prefix}/bin` を更新 |
| v1相当 | `ncu:install` の install 部分 (jq 列挙)。`install-global.zsh` (B 型) は非採用 |

#### ncu との整合

`check` / `update` / `install` はいずれも **同一 `package.json` の `dependencies`** を対象とする。
`update` 後に `install` すれば、ncu が書き換えた semver 範囲が global install に反映される。

#### 定番フロー

```sh
global-npm check
global-npm update
global-npm install
```

`install` 単体では ncu は走らない。

## CLI 実装

| 項目 | 内容 |
|------|------|
| 言語 | Node.js (CommonJS。`package.json` の `"type": "commonjs"` に合わせる) |
| エントリ | `bin/global-npm.js` |
| shebang | `#!/usr/bin/env node` |
| 引数解析 | サブコマンド3つのみ。未知の引数は usage 表示して `exit code: 1` |
| 子プロセス | `child_process.spawnSync` で `ncu` / `npm` を呼び出す |
| JSON 処理 | `fs.readFileSync` + `JSON.parse` (**jq 不要**) |

### usage

```
Usage: global-npm <check|update|install>

  check    Check for available updates (ncu -g)
  update   Update version ranges in package.json (ncu -g -u)
  install  Install dependencies globally (npm install -g <each>)
```

## setup ディレクトリの解決

CLI は **自身が属するパッケージ root** (`@s2j/global-npm` のインストール先) を setup ディレクトリとする ([mod-os-agnostic-layout.md](./mod-os-agnostic-layout.md))。

```js
const setupDir = process.env.GLOBAL_NPM_SETUP_DIR
  ?? path.resolve(__dirname, '..');
```

`GLOBAL_NPM_SETUP_DIR` による上書きは **v2残タスク** (方式 B。詳細は [modification.md](./modification.md))。v2初期は package root のみ。

## 廃止するもの

| v1 | v2 |
|----|-----|
| `~/bin/global-npm` (Zsh) | 廃止 |
| `install-global.zsh` | 廃止 |
| `ncu:install` 内 `jq` | Node 列挙 (C 型) に置換 |
| `main: install-global.zsh` | 削除 |

`package.json` の `scripts` (`ncu:check` 等) は開発・デバッグ用として残してもよいが、ユーザー向け入口は CLI に一本化する。

## ステータス

**確定** — 実装完了後 `docs/cli.md` へ移動する。
