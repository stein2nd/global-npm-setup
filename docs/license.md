# Global npm Package Setup - ライセンス GPL-3 (脱 OS 依存改修)

## 背景

v1.0.0は MIT ライセンスでした。
v2では npm 公開し `@s2j/docs-linter` (GPL-2.0-or-later) と同一エコシステムとして運用します。
併せて、ライセンスを **GPL-3.0-or-later** に変更します。

## 決定事項

| 項目 | v1.0.0 | v2 |
|------|--------|-----|
| ライセンス | MIT | GPL-3.0-or-later |
| LICENSE ファイル | なし | GNU GPL v3全文を追加 |
| package.json `"license"` | `"MIT"` | `"GPL-3.0-or-later"` |

### GPL-3.0-or-later を選ぶ理由

* `@s2j/docs-linter` が GPL-2.0-or-later。同一 maintainer のツール群として copyleft の方向性をそろえる。
* `-or-later` により将来の GPL 改訂版への適用を許容できる。
* npm registry 上でも SPDX として広く認識されている。

## 変更対象ファイル

| ファイル | 変更内容 |
|----------|----------|
| `LICENSE` | 新規作成 (GPL v3全文 + Copyright 表記) |
| `package.json` | `"license": "GPL-3.0-or-later"` |
| `README.md` | ライセンス節を追加 |
| `CHANGELOG.md` | v2.0.0にライセンス変更を明記 |

## Copyright 表記 (案)

```
Copyright (C) 2024-2026 Koutarou ISHIKAWA

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
...
```

## 依存パッケージとの関係

本プロジェクトは **グローバル npm パッケージの一覧と CLI** を提供します。

* `dependencies` に列挙するパッケージ (textlint、docs-linter 等) を **ソース同梱して再配布するわけではない**。
* CLI 自身のソースコードが GPL-3.0-or-later で公開される。
* 各 dependency のライセンスは個別に遵守する (`npm ls`、各 package の LICENSE を参照)。

## バージョニング

MIT → GPL-3.0-or-later は **後方互換のないライセンス変更** のため、**v2.0.0 (メジャー bump)** とします。

## ステータス

**確定:** `docs/license.md` に移行済み。
