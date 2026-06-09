# Global npm Package Setup - Windows 11 (脱 OS 依存改修)

## 背景

v1は macOS 専用 (Zsh、`brew`、`~/bin`、nvm UNIX 版) でした。
勤務先 Windows 11でも `@s2j/docs-linter` 等と同じグローバル npm 更新フローを使えるようにします。

## v1で Windows 非対応だった要素

| 要素 | v1 | v2 |
|------|----|----|
| インストールスクリプト | `install-global.zsh` | Node CLI `global-npm` |
| コマンドラッパー | `~/bin/global-npm` (Zsh) | `npm install -g @s2j/global-npm` |
| パッケージ名の列挙 | `jq` + シェル展開 | Node `JSON.parse` (C 型。**jq 不要**) |
| パッケージマネージャー (OS) | Homebrew (jq 等) | fnm / winget 等 (Node 導入) |

## Windows 11セットアップ手順 (概要)

### 1. Node.js

以下いずれかで Node.js v18以降を導入します。

* [fnm](https://github.com/Schniz/fnm) (macOS / Windows 共通。推奨)
* [nvm-windows](https://github.com/coreybutler/nvm-windows)
* [Volta](https://volta.sh/)
* 公式インストーラ

### 2. `@s2j/global-npm` のインストール

```powershell
npm install -g @s2j/global-npm
```

インストールは、初回のみです。以降は `global-npm install` の C 型列挙に `@s2j/global-npm` 自身も含まれます。

### 3. ユーザー追加分の登録 (任意)

勤務先だけ別 pkg 集合にする場合は、下記のように指定します。

```powershell
global-npm add @s2j/docs-linter@^1.0.16
global-npm sync --dry-run
```

### 4. グローバルパッケージの一括インストール

```powershell
global-npm install
```

実効 `package.json` の `dependencies` がトップレベル global install され、`textlint` や `s2j-docs-linter` 等の CLI が `{prefix}/bin` にリンクされます。

### 5. 更新フロー

```powershell
global-npm check
global-npm update
global-npm install
```

## パス・ディレクトリ

| 項目 | Windows 11 |
|------|------------|
| ユーザーホーム | `%USERPROFILE%` (例: `C:\Users\<user>`) |
| setup ディレクトリ (デフォルト) | `%APPDATA%\global-npm` |
| setup 上書き | 環境変数 `GLOBAL_NPM_SETUP_DIR` |
| dotfiles 推奨配置 (開発) | `%USERPROFILE%\dotfiles\global-npm-setup\` |
| npm グローバル bin | `%AppData%\npm` (通常 PATH に含まれる) |
| npm グローバル modules | `%AppData%\npm\node_modules` |

overlay manifest のファイル (`user-deps.json`、実効 `package.json`) は setup ディレクトリに生成されます ([layout.md](./layout.md))。

`global-npm` コマンドは npm グローバル bin ディレクトリに配置されます。
PowerShell 再起動後、`global-npm --version` 等で PATH を確認します。

## CLI 実装上の Windows 対応

| 要件 | 対応 |
|------|------|
| シェル非依存 | Node.js `child_process.spawnSync` を使用 |
| パス区切り | `path.join` / `path.resolve` を使用 |
| shebang | `#!/usr/bin/env node` (Windows では npm が `.js` を node で実行) |
| 改行コード | リポジトリは LF 統一 (`.gitattributes` 推奨) |
| JSON 列挙 | Node 標準 API (PowerShell / cmd 不要) |

### spawn 時の注意

```js
const shell = process.platform === 'win32';

spawnSync('ncu', ['-g', '--format', 'time', '--packageFile', pkgPath], {
  stdio: 'inherit',
  shell,
});

spawnSync('npm', ['install', '-g', ...names], {
  stdio: 'inherit',
  shell,
});
```

Windows では `shell: true` により `npm.cmd` / `ncu.cmd` を解決します。

## jq について (Windows)

* **C 型のため、`global-npm` 実行に jq は不要。**
* 手動でグローバル pkg 一覧を `package.json` に取り込む作業に jq を使う場合は任意 (`winget install jqlang.jq` 等)。
* macOS も同様に、CLI ランタイム依存は Node + npm のみ。

## 勤務先環境の制約 (想定)

* 管理者権限なしでの `npm install -g` が可能か事前確認する。
* プロキシ / 社内 npm registry がある場合は `.npmrc` で設定する。
* Git 管理ポリシー: dotfiles を clone するか、`npm install -g` のみで完結させるかは環境次第。

## README への反映

v2の README は、OS 別セクションに分けます。

* **共通:** 概要、`global-npm` コマンド、更新フロー
* **macOS:** fnm / Homebrew (任意)、dotfiles 配置
* **Windows:** fnm / nvm-windows、PowerShell、PATH 確認

## テスト観点

| 確認項目 | macOS | Windows 11 |
|----------|-------|------------|
| `global-npm check` | ✓ | ✓ |
| `global-npm update` | ✓ | ✓ |
| `global-npm install` (C 型列挙) | ✓ | ✓ |
| `global-npm sync` / `add` | ✓ | ✓ |
| 未知サブコマンドで usage | ✓ | ✓ |
| `@s2j/docs-linter` の CLI が PATH に載る | ✓ | ✓ |
| `textlint` / `ncu` が PATH に載る | ✓ | ✓ |

## ステータス

**確定:** `docs/windows.md` に移行済み (Windows 11実機確認は [status.md](../docsMod/status.md) 参照)。
