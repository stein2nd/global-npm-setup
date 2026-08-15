# Global npm Package Setup - Modification

「仕様書 FOP / Vite / CLUI リライト」改修のタスク管理資料です。
確定した仕様は [specs.md](../../specs.md) に移行済みです。

## Initiative: `mod-fop-vite`

今後の開発に向け、確定仕様を次の方針でリライトした。

* 設計手法: FOP + Clean Coding
* アーキテクチャー: Clean Architecture のフルセットは使わず、部分借用
* 位置付け: Global Package Setup シリーズ (姉妹: `global-composer-setup`)
* ビルドツール: Vite
* アプリケーション類型: CLUI ユーティリティ

v2.2までの **振る舞い契約は維持** する。実装コードの Vite 移行は、別 initiative とする。

以前の仕様書は [v2-specs](../v2-specs/) に freeze 済み。

## 仕様リライト 残タスク

| # | タスク | 概要 | 状態 |
| --- | --- | --- | --- |
| 1 | 12仕様書を `docsMod/` に複製リライト | [specs.md](../../specs.md) ほか | ✅ |
| 2 | 草案レビュー・確定 | 振る舞い契約の欠落がないこと、方針の書きぶり | ✅ |
| 3 | 現行 `docs/` を archive に freeze | [v2-specs](../v2-specs/) | ✅ |
| 4 | 確定版を `docs/` に移動 | `docs/` を正本化 | ✅ |
