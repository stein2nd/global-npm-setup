# Global npm Package Setup - 実装状況

最終更新…**2026-06-13**

## 全体進捗 (サマリー)

| 区分 | 進捗 | 備考 |
|------|------|------|
| **v2.2必須タスク (#1〜#4)** | **100%** (4/4) | 実装、テスト、docs、npm publish 完了 |
| **v2.2全体 (#1〜#5)** | **100%** (5/5) | #5Windows 11実機 (`list`) 完了。定番フロー後の手動 install は既知ギャップ |
| **v2.2の list サブコマンド** | **100%** (実装 ・ docs ・ publish) | [cli-list.md](../../cli-list.md) 準拠 |
| **仕様準拠テスト** | **100%** (PASS: 66/66) | CLI-20〜22、PUB-05 (`@2.2.0`) PASS |
| **自動テスト (`npm test`)** | **100%** (81/81) | 仕様準拠 (66) + ユニット (17)。FAIL: 0 |
| **開発基盤 (lint、format、test)** | **100%** | ESLint、Prettier、仕様準拠 + ユニットテスト、`lint:docs` script 済 |

> **進捗率の算定**
>
> * [modification.md](./modification.md) の v2.2残タスク #1〜#5。#1〜#4を必須、#5を任意実機確認とみなす。
> * **v2.2必須 (100%):** `list` 実装、CLI-20〜22、docs (`cli.md` / README / `usage.md`)、`@s2j/global-npm@2.2.0` publish 完了。
> * **v2.2全体 (100%):** 必須4件 + 任意 #5 (Windows 11で `list`) 完了。定番フロー後の差分残存は既知ギャップ (macOS と同根)。

## v2.2 `list`: 優先タスク

| # | タスク ([modification.md](./modification.md)) | 完了条件 | 状態 |
|---|----------------------------------------------|----------|------|
| 1 | `list` サブコマンド実装 | `global-npm list` が `npm ls -g --depth=0` と同等の出力、および exit code | ✅ |
| 2 | 仕様準拠テスト | CLI-20〜22に PASS | ✅ |
| 3 | docs 更新 | `docs/cli.md`、README、`docs/usage.md` に `list` 反映 | ✅ |
| 4 | npm publish | `@s2j/global-npm@2.2.0` | ✅ |
| 5 | Windows 11実機確認 (任意) | prefix 行 + 一覧表示 (`list`)。定番フロー後の挙動も確認 | ✅ |

## v2.2 `list`: 完了条件

| 条件 | 状態 |
|------|------|
| `bin/global-npm.cjs` に `case 'list':` (`npm ls -g --depth=0`、事前 sync なし) | ✅ |
| 余分な引数で usage → `exit 1` | ✅ |
| `usage` に `list` を追記 | ✅ |
| CLI-20〜22が PASS | ✅ |
| `docs/cli.md`、README に `list` | ✅ |
| `docs/usage.md` に使い方 (セクション、シナリオ) | ✅ (publish 後追記) |
| `CHANGELOG.md` v2.2.0エントリ | ✅ |
| npm publish `@s2j/global-npm@2.2.0` | ✅ |
| GitHub Release [`v2.2.0`](https://github.com/stein2nd/global-npm-setup/releases/tag/v2.2.0) | ✅ |
| publish 後: リポジトリ自己参照 `^2.2.0` | ✅ |
| Windows 11で `global-npm list` (任意) | ✅ |
| Windows 11定番フロー後の global 追従 | ℹ️ 既知ギャップ | `check` → `update` → `install` 後も `@s2j/docs-linter`、`@s2j/global-npm`、`npm` で手動 install が必要な場合あり |

**必須10/10 + 任意 #5 (`list`) 達成。v2.2.0の publish 完了。**

## 機能一覧 (`list` 関連)

| 機能 | 状態 | 備考 |
|------|------|------|
| `global-npm list` | ✅ 実装済 | `npm ls -g --depth=0` 透過。prefix 行を省略しない |
| macOS 実機 (`list`) | ✅ 確認済 | nvm 環境で prefix 行 + 一覧を確認 (開発時) |
| Windows 11実機 (`list`) | ✅ 確認済 | PowerShell7.6.2。prefix `AppData\Roaming\npm` + 一覧表示 |
| Windows 11定番フロー | ℹ️ 既知ギャップ | 追加分・一部 pkg で `install` 後も `check` 差分 → 手動 `npm install -g` |

## 補足

### ローカル検証メモ (2026-06-13)

| 確認項目 | 結果 |
|----------|------|
| `npm test` | 81件 PASS (仕様準拠66 + ユニット17)、FAIL: 0 |
| `npm run lint` | エラーなし |
| `npm run lint:docs` | PASS |
| `global-npm list` (macOS + nvm) | prefix 行表示、`npm ls -g --depth=0` と一致 |
| `global-npm list` (Windows 11 + PowerShell7.6.2) | prefix `C:\Users\ishikawa.k\AppData\Roaming\npm`、一覧表示 OK |
| GitHub Actions `Publish to npm` (v2.2.0) | success |
| npm registry latest | `@s2j/global-npm@2.2.0` |
| PUB-05 (registry `@2.2.0`) | ✔ PASS |

### Windows 11実機確認 (#5)

環境: **Windows 11**、**Microsoft.PowerShell7.6.2.0**、`@s2j/global-npm@2.2.0`。

| 確認項目 | 状態 | メモ |
|----------|------|------|
| `global-npm list` | ✅ | prefix 行 `C:\Users\ishikawa.k\AppData\Roaming\npm`。`+--` 形式の一覧表示 |
| `global-npm check` → `update` → `install` | ℹ️ | 実行後も `@s2j/docs-linter@1.0.18`、`@s2j/global-npm@2.2.0`、`npm@11.17.0` 等で `check` 差分が残る場合あり |
| 手動 `npm install -g` | ✅ | `npm install -g @s2j/docs-linter@1.0.18 @s2j/global-npm@2.2.0 npm@11.17.0` で解消。`list` で反映を確認 |
| `list` と `npm ls -g --depth=0` | ✅ | 同等の global 一覧 (prefix 行含む) |

**#5 (`list`) の完了条件を充足。** 定番フロー後の手動 install 要否は overlay manifest の既知ギャップ (下記)。

### 既知のギャップ (v2.2、Windows 11で再確認)

| 項目 | 状態 | 対応 |
|------|------|------|
| 追加分の `update` → `install` | ℹ️ 再確認 | `user-deps.json` の range が sync で優先され、ncu が上げた実効 manifest が `install` 前に戻りうる | `npm install -g <pkg>@<version>` (check 案内どおり)、または `user-deps.json` の range を手動更新 |
| `@s2j/docs-linter` (追加分) | ℹ️ 再確認 | 定番フロー後も1.0.18等への更新が `install` だけでは届かない場合あり | 上記手動 install、または `user-deps.json` を `^1.0.18` 等に更新 |
| `@s2j/global-npm` / `npm` | ℹ️ 再確認 | 実効 manifest の range 解決と global 実体のずれ | `npm update -g @s2j/global-npm`、または check が示す version で `npm install -g` |

macOS 実機 (v2.1.3) と同根。将来: `update` が `user-deps.json` に書き戻す改善を検討 ([v2-os-agnostic/status.md](../v2-os-agnostic/status.md) 参照)。

### v2.2の残タスク

なし (任意 #5完了。上記ギャップは運用回避で対応)。
