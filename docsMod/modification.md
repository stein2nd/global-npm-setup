# Global npm Package Setup - Modification

進行中の改修仕様への導線です。
論点が確定したら `docs/` に移動し、リンクを [docs/specs.md](../docs/specs.md) 側に移します。

## ドキュメント命名規則

- **ファイル名** — ASCII のみ。initiative ごとに接頭辞を付け、ソートしやすくする (例: `mod-os-agnostic-naming.md`)。
- **タイトル** — 各ファイルの1行目に `# Global npm Package Setup - …` 形式で記載する。

## 進行中 — 脱 OS 依存改修 (v2)

| ファイル | 概要 | ステータス |
|----------|------|------------|
| [mod-os-agnostic-naming.md](./mod-os-agnostic-naming.md) | 命名 (リポジトリ `global-npm-setup` / npm `@s2j/global-npm` / CLI `global-npm`)  | 確定 |
| [mod-os-agnostic-cli.md](./mod-os-agnostic-cli.md) | CLI サブコマンド (`check` / `update` / `install`) の挙動 | 確定 |
| [mod-os-agnostic-install.md](./mod-os-agnostic-install.md) | install 方式 C 型 (Node 列挙) と ncu 整合 | 確定 |
| [mod-os-agnostic-layout.md](./mod-os-agnostic-layout.md) | `package.json` (dependencies 一覧) の配置方式 | 確定 |
| [mod-os-agnostic-legacy-scripts.md](./mod-os-agnostic-legacy-scripts.md) | `install-global.zsh` / `~/bin/global-npm` 廃止の比較検討 | 確定 |
| [mod-os-agnostic-windows.md](./mod-os-agnostic-windows.md) | Windows 11向けセットアップ・制約 | 確定 |
| [mod-gpl3-license.md](./mod-gpl3-license.md) | ライセンス MIT → GPL-3.0-or-later | 確定 |
| [mod-npm-publish.md](./mod-npm-publish.md) | npm 公開 (`@s2j` スコープ) | 確定 |

## v2残タスク

v2初期リリース (方式 A: パッケージ同梱) 完了後に着手する。

| # | タスク | 概要 |
|---|--------|------|
| 1 | **方式 B — 環境別 pkg 集合** | `GLOBAL_NPM_SETUP_DIR` 等で setup ディレクトリを上書きし、勤務先のみ別 `package.json` (例: `@s2j/docs-linter` を除外) を使えるようにする |
| 2 | `bin/global-npm.js` 実装 | C 型 install、ncu 連携 |
| 3 | `package.json` v2化 | `@s2j/global-npm`、GPL-3.0-or-later、`bin` 定義 |
| 4 | `LICENSE` 追加 | GPL v3全文 |
| 5 | README 更新 | OS 別手順、移行 (v1→ v2) |
| 6 | `install-global.zsh` 削除 | レガシー廃止 |
| 7 | 初回 npm publish | `@s2j/global-npm` v2.0.0 |
| 8 | Windows 11実機確認 | check / update / install、CLI on PATH |
| 9 | CI / 自動 publish (任意) | GitHub Actions + npm OIDC |
