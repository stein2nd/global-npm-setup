# Global npm Package Setup - 配置 (脱 OS 依存改修)

## 背景

v1では `~/dotfiles/setup/package.json` にグローバル npm パッケージ一覧を保持し、`ncu:install` 経由で jq 列挙 → `npm install -g` していました。
v2では npm パッケージ `@s2j/global-npm` として配布し、install は C 型 (Node 列挙) で実装します ([install.md](./install.md))。

v2.0.x は **方式 A: パッケージ同梱** のみでした。v2.1以降は **方式 B: overlay manifest** を採用し、upstream 正本とユーザー追加分をマージします。

## 方式の比較

| | 方式 A: パッケージ同梱のみ | 方式 B: overlay manifest (v2.1) |
|--|---------------------------|----------------------------------|
| 配置 | `@s2j/global-npm` 内の `package.json` のみ | upstream 正本 + `$SETUP_DIR` の物理的なアーカイブ |
| 更新 | `npm update -g @s2j/global-npm` で upstream 更新 | sync が upstream を物理的なアーカイブに反映 |
| Mac / Windows 同期 | upstream を npm publish で同期 | upstream + 同一 `$SETUP_DIR` 構成で同期 |
| カスタム | fork が必要だった | `user-deps.json` / `global-npm add` で追記 |
| 複雑さ | 低 | 中 |

## 決定事項 (v2.1)

**方式 B: overlay manifest** を採用する。

### 根拠

* 自宅 macOS と勤務先 Windows 11で **upstream 公式一覧** を `npm update -g` で同期できる。
* 勤務先だけ別 pkg 集合にしたい要件に、`user-deps.json` で対応できる。
* upstream 更新時にユーザー追加分を消さず、未 update の upstream 管理分は新 range に追従できる。

### レイヤの役割

| レイヤ | パス | 更新者 | 用途 |
|--------|------|--------|------|
| Upstream 正本 | `<packageRoot>/package.json` | npm publish | 公式 `dependencies` 一覧 |
| ユーザー overlay | `$SETUP_DIR/user-deps.json` | ユーザー / `global-npm add` | 追加分、ピン留め |
| 物理的なアーカイブ | `$SETUP_DIR/package.json` | CLI `sync` | ncu / install の実効マニフェスト |
| Meta | `$SETUP_DIR/.upstream-meta.json` | CLI `sync` | 差分検出用スナップショット |

`packageRoot` = `path.resolve(__dirname, '..')` で解決し、CLI が属する `@s2j/global-npm` のインストール先になります。

## setup ディレクトリ (`$SETUP_DIR`)

### デフォルト

| OS | パス |
|----|------|
| macOS / Linux | `~/.config/global-npm` |
| Windows 11 | `%APPDATA%\global-npm` |

### 環境変数

| 変数 | 用途 |
|------|------|
| `GLOBAL_NPM_SETUP_DIR` | デフォルト setup ディレクトリを上書き |

```js
const setupDir = path.resolve(
  process.env.GLOBAL_NPM_SETUP_DIR?.trim() || defaultSetupDir(),
);
```

### ファイル構成

```
~/.config/global-npm/          # または GLOBAL_NPM_SETUP_DIR
├── user-deps.json             # ユーザー追加分・ピン留め
├── package.json               # 物理的なアーカイブ (ncu / install 入力)
└── .upstream-meta.json        # 同期メタ (ユーザー環境のみ)
```

### `user-deps.json`

```json
{
  "dependencies": {
    "@s2j/docs-linter": "^1.0.16"
  },
  "devDependencies": {
    "some-dev-tool": "^2.0.0"
  }
}
```

* upstream に存在するパッケージ名でも `dependencies` に書けば、**ピン留め:** 最優先。
* `devDependencies` は物理的なアーカイブにマージするが、global install 対象外 ([install.md](./install.md))。

### 物理的なアーカイブ化 `package.json`

```json
{
  "name": "global-npm-user-manifest",
  "private": true,
  "dependencies": {},
  "devDependencies": {}
}
```

## マージ仕様 (`syncManifest`)

`check` / `update` / `install` / `sync` / `add` 実行時に upstream + `user-deps.json` から物理的なアーカイブを再生成します。

### `dependencies` の優先順位 — 高い順

1. `user-deps.json` の `dependencies` にキーがある → その range にピン留め。
2. 物理的なアーカイブの値が前回 upstream と異なる → `global-npm update` 済みとみなし維持。
3. それ以外 → 新 upstream の range で上書き。未 update 追従。

### upstream から削除されたパッケージ

| 種別 | 扱い |
|------|------|
| ユーザー追加分 | 物理的なアーカイブに維持 |
| upstream 管理分 | 物理的なアーカイブから削除 |

### `devDependencies` — B 案

* upstream の `devDependencies` は物理的なアーカイブに含めない。リポジトリ開発用ツールをユーザー環境に流さない。
* `user-deps.json` の `devDependencies` のみをマージする。

詳細なマージ手順・実行フローは [mod-overlay-manifest.md](../docsMod/mod-overlay-manifest.md) を参照してください。

## リポジトリ構成 (開発)

```
global-npm-setup/          # Git リポジトリ root
├── bin/global-npm.cjs     # CLI エントリ
├── lib/                   # paths, sync-manifest 等
├── package.json           # upstream 正本 + bin 定義
├── LICENSE
├── README.md
└── docs/
```

### upstream `package.json` の役割

| フィールド | 用途 |
|------------|------|
| `name` | `@s2j/global-npm` |
| `bin` | `global-npm` コマンド |
| `dependencies` | 公式グローバルインストール対象 |
| `files` | publish 同梱パス (`bin/`, `lib/`, `package.json` 等) |

`@s2j/global-npm` 自身も `dependencies` に含めます (自己参照)。

## ローカル開発配置

| 環境 | 推奨パス |
|------|----------|
| macOS | `~/dotfiles/global-npm-setup/` |
| Windows 11 | `%USERPROFILE%\dotfiles\global-npm-setup\` |

開発時は `GLOBAL_NPM_SETUP_DIR` を `.sandbox/setup` 等に向けて overlay を検証します。

```sh
npm link
GLOBAL_NPM_SETUP_DIR=.sandbox/setup global-npm sync
```

## npm publish 時の注意

* `files` に `bin/`、`lib/`、`package.json` が tarball に含まれることを確認する。
* publish される `package.json` は **upstream 正本**。ユーザーの物理的なアーカイブは各環境の `$SETUP_DIR` に生成される。

## ステータス

**確定 (v2.1):** overlay manifest を `docs/layout.md` に反映済み。
