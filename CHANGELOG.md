# Global npm Package Installer - CHANGELOG

## v2.0.0 - 2026-06-07

- プロジェクト名を `global-npm-setup` に変更（GitHub リポジトリ名と一致）
- ライセンスを MIT から GPL-3.0-or-later に変更（`LICENSE` 追加）
- `ncu:check` / `ncu:update` に `--packageFile package.json` を追加
- `ncu:install` を削除（v2 CLI 実装時に `global-npm install` へ移行予定）

## v1.0.1 - 2026-06-07

- `dependencies` を最新版に更新（`npm-check-updates` ^22.2.3 ほか）
- `ncu:check` / `ncu:update` / `ncu:install` に `--format time` を追加し、公開日時を表示