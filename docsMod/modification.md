# Global npm Package Setup - Modification

進行中の改修 initiative のタスク管理資料です。完了時は [docs/archive/](../docs/archive/README.md) に退避します。

確定した仕様は [docs/specs.md](../docs/specs.md) に移行します。

## v2.2仕様 (list サブコマンド)

詳細は [mod-cli-list.md](./mod-cli-list.md) をご覧ください。

* `global-npm list` … `npm ls -g --depth=0` を透過実行。
* 事前 `sync` なし。prefix 行は npm 出力どおり表示。

## v2.2残タスク

| # | タスク | 概要 | 状態 |
|---|--------|------|------|
| 1 | `list` サブコマンド実装 | [mod-cli-list.md](./mod-cli-list.md) に従い `bin/global-npm.cjs` を更新 | ✅ |
| 2 | 仕様準拠テスト | CLI-20〜22を追加 | ✅ |
| 3 | docs 更新 | `docs/cli.md`、`README.md` (`usage.md` は任意) | ✅ |
| 4 | npm publish | `@s2j/global-npm` v2.2.0 | ⬜ |
| 5 | Windows 11実機確認 (任意) | `list` が prefix 行付きで動作すること | ⬜ |
