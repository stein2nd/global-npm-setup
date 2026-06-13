# Global npm Package Setup - SPECS

確定した仕様ドキュメントへの導線です。

## ドキュメント命名規則

* **ファイル名:** ASCII のみ (英数字、ハイフン)。日本語やスペースは使わない。
* **タイトル:** 各ファイルの1行目に `# Global npm Package Setup - …` 形式で記載する。

## 仕様書一覧 (v2)

| ファイル | 概要 |
|----------|------|
| [usage.md](./usage.md) | 使い方 (鮮度管理、`check`、`update`、`install`、`add`、`sync`、`list`) |
| [naming.md](./naming.md) | 命名 (`global-npm-setup`、`@s2j/global-npm`、`global-npm`) |
| [cli.md](./cli.md) | CLI サブコマンド (`check`、`update`、`install`、`sync`、`add`、`list`) |
| [cli-list.md](./cli-list.md) | `list` サブコマンド (`npm ls -g --depth=0`) の詳細仕様 |
| [install.md](./install.md) | install 方式 C 型 (Node 列挙) と ncu 整合 |
| [layout.md](./layout.md) | overlay manifest、`$SETUP_DIR` 配置 |
| [overlay-manifest.md](./overlay-manifest.md) | overlay manifest (方式 B) の詳細仕様 |
| [legacy-scripts.md](./legacy-scripts.md) | `install-global.zsh`、`~/bin/global-npm` 廃止 |
| [windows.md](./windows.md) | Windows 11向けセットアップ、制約 |
| [license.md](./license.md) | ライセンス MIT → GPL-3.0-or-later |
| [npm-publish.md](./npm-publish.md) | npm 公開 (`@s2j` スコープ) |

## 進行管理

| 種別 | 場所 |
|------|------|
| 進行中 | [docsMod/modification.md](../docsMod/modification.md)、[status.md](../docsMod/status.md) |
| テスト結果 (自動生成) | [docsMod/test-results.md](../docsMod/test-results.md) — `npm test` |
| 完了した改修 | [archive/](./archive/README.md) |
