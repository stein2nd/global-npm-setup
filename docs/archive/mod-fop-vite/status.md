# Global npm Package Setup - 実装状況

最終更新…**2026-08-15**

## 全体進捗 (サマリー)

| 区分 | 進捗 | 備考 |
|------|------|------|
| **`mod-fop-vite` 必須 (#1〜#4)** | **100%** (4/4) | 草案、確定、archive freeze、`docs/` 正本化まで完了 |
| **v2.2振る舞い契約** | **維持** | サブコマンド、overlay、C 型 install は変えない |
| **実装 (Vite / FOP 再構成)** | **未着手** | 別 initiative |

> **進捗率の算定**
>
> * [modification.md](./modification.md) の仕様リライト残タスク #1〜#4。

## `mod-fop-vite`: 優先タスク

| # | タスク ([modification.md](./modification.md)) | 完了条件 | 状態 |
|---|----------------------------------------------|----------|------|
| 1 | 12仕様書を `docsMod/` に複製リライト | 一覧の全ファイルが草案として存在する | ✅ |
| 2 | 草案レビュー・確定 | 方針と契約が読み取れる。欠落がない | ✅ |
| 3 | 現行 `docs/` を archive に freeze | freeze 後は更新しない | ✅ |
| 4 | 確定版を `docs/` に移動 | `docs/specs.md` が新正本を指す | ✅ |

## 確定ファイル

正本は [docs/](../../specs.md)。以前の版は [v2-specs](../v2-specs/)。

| ファイル | 主なリライト |
|----------|----------------|
| [specs.md](../../specs.md) | シリーズ、FOP、部分的 CA、Vite、CLUI、ライフサイクル |
| [naming.md](../../naming.md) | シリーズ命名、今後の `dist/` bin |
| [cli.md](../../cli.md) | CLUI と domain / application / adapters |
| [cli-list.md](../../cli-list.md) | `list` を読み取り専用アダプタとして位置付け |
| [install.md](../../install.md) | C 型を関数合成として記述 |
| [layout.md](../../layout.md) | Vite 前提の `src/` 配置 |
| [overlay-manifest.md](../../overlay-manifest.md) | マージを domain 純関数として固定。`list` を追記 |
| [legacy-scripts.md](../../legacy-scripts.md) | シェル廃止を CLUI 一本化として再記述 |
| [windows.md](../../windows.md) | adapters に閉じる Windows 差分 |
| [license.md](../../license.md) | シリーズとビルド成果の GPL |
| [npm-publish.md](../../npm-publish.md) | Vite `dist/` と CI build |
| [usage.md](../../usage.md) | 操作契約は維持。CLUI / シリーズを追記 |

## 補足

* `docsMod/test-results.md` は `npm test` の自動生成先。本リライトでは仕様準拠テストを変更していない。
* 実装コード (`bin/`、`lib/`) は v2.2のまま。FOP / Vite 再構成は別 initiative。
