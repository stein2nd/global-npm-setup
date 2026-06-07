# Global npm Package Setup - Modification

v2脱 OS 依存改修の進行管理です。
確定した仕様は [docs/specs.md](../docs/specs.md) に移行済みです。

## ドキュメント命名規則

- **ファイル名** — ASCII のみ。initiative ごとに接頭辞を付け、ソートしやすくする (例: `mod-os-agnostic-naming.md` → 確定後 `docs/naming.md`)。
- **タイトル** — 各ファイルの1行目に `# Global npm Package Setup - …` 形式で記載する。

## 確定仕様 (docs/ へ移行済み)

| ファイル | 概要 |
|----------|------|
| [naming.md](../docs/naming.md) | 命名 (リポジトリ `global-npm-setup` / npm `@s2j/global-npm` / CLI `global-npm`) |
| [cli.md](../docs/cli.md) | CLI サブコマンド (`check` / `update` / `install`) の挙動 |
| [install.md](../docs/install.md) | install 方式 C 型 (Node 列挙) と ncu 整合 |
| [layout.md](../docs/layout.md) | `package.json` (dependencies 一覧) の配置方式 |
| [legacy-scripts.md](../docs/legacy-scripts.md) | `install-global.zsh` / `~/bin/global-npm` 廃止の比較検討 |
| [windows.md](../docs/windows.md) | Windows 11向けセットアップ・制約 |
| [license.md](../docs/license.md) | ライセンス MIT → GPL-3.0-or-later |
| [npm-publish.md](../docs/npm-publish.md) | npm 公開 (`@s2j` スコープ) |

## v2残タスク

| # | タスク | 概要 | 状態 |
|---|--------|------|------|
| 1 | **方式 B — 環境別 pkg 集合** | `GLOBAL_NPM_SETUP_DIR` 等で setup ディレクトリを上書き | ❌ フェーズ3 |
| 2 | `bin/global-npm.cjs` 実装 | C 型 install、ncu 連携 | ✅ |
| 3 | `package.json` v2化 | `@s2j/global-npm`、GPL-3.0-or-later、`bin` 定義 | ✅ |
| 4 | `LICENSE` 追加 | GPL v3全文 | ✅ |
| 5 | README 更新 | OS 別手順、移行 (v1→ v2) | ✅ |
| 6 | `install-global.zsh` 削除 | レガシー廃止 | ✅ |
| 7 | 初回 npm publish | `@s2j/global-npm` v2.0.x | ✅ v2.0.2 |
| 8 | Windows 11実機確認 | check / update / install、CLI on PATH | ❌ フェーズ3 |
| 9 | CI / 自動 publish (任意) | GitHub Actions + npm OIDC | ❌ フェーズ3 |
