# Global npm Package Setup - 配置 (脱 OS 依存改修)

## 背景

v1では `~/dotfiles/setup/package.json` にグローバル npm パッケージ一覧を保持し、`ncu:install` 経由で jq 列挙 → `npm install -g` していた。
v2でも同一 `package.json` を真実の源とし、install は C 型 (Node 列挙) で実装する ([install.md](./install.md))。
v2では npm パッケージ `@s2j/global-npm` として配布するため、**dependencies 一覧をどこに置くか** を決める必要がある。

## 方式の比較

| | 方式 A: パッケージ同梱 | 方式 B: ユーザー設定ディレクトリ |
|--|------------------------|----------------------------------|
| 配置 | `@s2j/global-npm` 内の `package.json` | 例: `~/.config/global-npm/package.json` |
| 更新 | `global-npm update` → npm publish → `npm update -g` | ユーザーが直接編集 |
| Mac / Windows 同期 | `npm update -g @s2j/global-npm` で同一一覧 | 手動または別 sync 手段 |
| カスタム | publish 版を fork する必要 | ファイルをローカル編集可能 |
| 複雑さ | 低 | 中 |

## 決定事項

**方式 A (パッケージ同梱)** を採用する。

### 根拠

- 自宅 macOS と勤務先 Windows11で **同一の dependencies 一覧** を使う要件に合致する。
- `@s2j/docs-linter` と同様、`npm update -g` で更新管理できる。
- CLI 実装が単純 (パッケージ root = setup ディレクトリ)。
- v1の「1つの `package.json` が真実の源」というモデルを維持できる。

### トレードオフ

- パッケージ一覧の変更は **リポジトリ更新 → npm publish** が必要。
- 勤務先だけ別一覧にしたい場合は v2初期では未対応。**v2残タスク** として方式 B (`GLOBAL_NPM_SETUP_DIR` 等) を実装する ([modification.md](./modification.md) 参照)。

## ディレクトリ構成 (v2)

```
global-npm-setup/          # Git リポジトリ root
├┬─ bin/
│└─ global-npm.js      # CLI エントリ
├─ package.json           # dependencies 一覧 + bin 定義
├─ LICENSE
├─ README.md
├─ CHANGELOG.md
└─ docs/
```

### package.json の役割

| フィールド | 用途 |
|------------|------|
| `name` | `@s2j/global-npm` |
| `bin` | `global-npm` コマンド |
| `dependencies` | グローバルインストール対象パッケージとバージョン範囲 |
| `files` | publish 時に同梱するパス (`bin/`, `package.json`, `LICENSE` 等) |

`@s2j/global-npm` 自身も `dependencies` に含める (自己参照)。

```json
"dependencies": {
  "@s2j/global-npm": "^2.0.0",
  "@s2j/docs-linter": "^1.0.0",
  "npm-check-updates": "^22.0.0",
  ...
}
```

`global-npm install` (C 型) 実行時に `@s2j/global-npm` も dependencies の1件として global install され、CLI 自身の更新が可能になる。

## ローカル開発配置

| 環境 | 推奨パス |
|------|----------|
| macOS | `~/dotfiles/global-npm-setup/` |
| Windows 11 | `%USERPROFILE%\dotfiles\global-npm-setup\` |

dotfiles リポジトリのサブディレクトリ、または独立 clone のいずれも可。

### 開発時のリンク

```sh
npm link
# または
npm install -g .
```

## 環境変数 (オプション)

| 変数 | 用途 |
|------|------|
| `GLOBAL_NPM_SETUP_DIR` | setup ディレクトリを上書き (**v2残タスク**: 方式 B。勤務先のみ別 pkg 集合) |

## npm publish 時の注意

- `files` フィールドで `bin/` と `package.json` が tarball に含まれることを確認する。
- `devDependencies` は含めない (グローバル install 対象は `dependencies` のみ)。

## ステータス

**確定** — `docs/layout.md` に移行済み。
