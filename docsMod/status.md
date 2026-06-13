# Global npm Package Setup - 実装状況

進行中 initiative の進捗資料です。完了分は [docs/archive/](../docs/archive/README.md) をご覧ください。

## 全体進捗 (サマリー)

| 区分 | 進捗 | 備考 |
|------|------|------|
| **v2.2の list サブコマンド** | **60%** (3/5) | #1〜#3完了。#4publish、#5Windows 実機 (任意) 残 |
| **仕様準拠テスト** | **100%** (PASS: 66/66) | CLI-20〜22追加済 |
| **自動テスト (`npm test`)** | **100%** (81/81) | 仕様準拠 (66) + ユニット (17)。FAIL: 0 |

## v2.2 `list`: 優先タスク

| # | タスク ([modification.md](./modification.md)) | 完了条件 | 状態 |
|---|----------------------------------------------|----------|------|
| 1 | `list` サブコマンド実装 | `global-npm list` が `npm ls -g --depth=0` と同等の出力、および exit code | ✅ |
| 2 | 仕様準拠テスト | CLI-20〜22に PASS | ✅ |
| 3 | docs 更新 | `docs/cli.md`、README に `list` 反映 | ✅ |
| 4 | npm publish | `@s2j/global-npm@2.2.0` | ⬜ |
| 5 | Windows 11実機確認 (任意) | prefix 行 + 一覧表示 | ⬜ |
