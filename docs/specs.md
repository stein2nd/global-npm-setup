# Global npm Package Setup - SPECS

確定した仕様ドキュメントへの導線です。

## ドキュメント命名規則

* **ファイル名:** ASCII のみ (英数字、ハイフン)。日本語やスペースは使わない。
* **タイトル:** 各ファイルの1行目に `# Global npm Package Setup - …` 形式で記載する。

## 仕様書一覧 (v2)

| ファイル | 概要 |
|----------|------|
| [usage.md](./usage.md) | 使い方 (鮮度管理、`check`、`update`、`install`、`add`、`sync`) |
| [naming.md](./naming.md) | 命名 (`global-npm-setup`、`@s2j/global-npm`、`global-npm`) |
| [cli.md](./cli.md) | CLI サブコマンド (`check`、`update`、`install`、`sync`、`add`) |
| [install.md](./install.md) | install 方式 C 型 (Node 列挙) と ncu 整合 |
| [layout.md](./layout.md) | overlay manifest、`$SETUP_DIR` 配置 |
| [legacy-scripts.md](./legacy-scripts.md) | `install-global.zsh`、`~/bin/global-npm` 廃止 |
| [windows.md](./windows.md) | Windows 11向けセットアップ、制約 |
| [license.md](./license.md) | ライセンス MIT → GPL-3.0-or-later |
| [npm-publish.md](./npm-publish.md) | npm 公開 (`@s2j` スコープ) |

## 進行管理

| ファイル | 概要 |
|----------|------|
| [../docsMod/status.md](../docsMod/status.md) | 実装状況・進捗率 |
| [../docsMod/modification.md](../docsMod/modification.md) | v2残タスク (#1 (方式 B)、#8 (Windows 実機確認) 等) |
| [../docsMod/mod-overlay-manifest.md](../docsMod/mod-overlay-manifest.md) | v2.1の overlay manifest 仕様 (方式 B 確定稿) |
| [../docsMod/test-results.md](../docsMod/test-results.md) | 仕様準拠テスト結果 (`npm test` で自動生成) |
