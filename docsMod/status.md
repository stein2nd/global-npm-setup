# Global npm Package Setup - 実装状況

最終更新…**2026-06-07**

## 全体進捗 (サマリー)

| 区分 | 進捗 | 備考 |
|------|------|------|
| **仕様確定** | **100%** (8/8) | `docs/` に移行済み ([specs.md](../docs/specs.md)) |
| **フェーズ1: コア実装** | **100%** | 完了 |
| **フェーズ2: リリース** | **100%** | npm publish ・自己参照・仕様書の移行完了 |
| **フェーズ3: リリース後** | **20%** | Docs Lint 基盤完成。CI PASS には `test-results.md` 修正要。Windows / 方式 B / OIDC CI 未着手 |
| **v2初期リリース全体** | **86%** (6/7) | [modification.md](./modification.md) タスク #8 (Windows 実機確認) のみ残 |
| **v2全体 (方式 B、CI 含む)** | **67%** (6/9) | #1、#8、#9 (OIDC) 未着手 |
| **仕様準拠テスト** | **98%** (PASS: 57/58) | ✖ FAIL: 0 / ⚠ WARN: 1… [test-results.md](./test-results.md) |
| **開発基盤 (lint / format / test)** | **100%** | ESLint / Prettier / 仕様準拠テスト / `lint:docs` script 済 |

> **進捗率の算定**
>
> - [modification.md](./modification.md) の v2 残タスク (#1〜#9) を実装タスクとみなす。#2〜#6 をフェーズ1、#7 をフェーズ2、#8・#9 をフェーズ3 に対応付け。
> - **フェーズ2 (100%)** — `@s2j/global-npm@2.0.2` を npm publish 済み。自己参照の追加、確定仕様8件を `docs/` へ移行 ([specs.md](../docs/specs.md))。
> - **フェーズ3 (20%)** — Docs Lint 基盤 (`lint:docs` script、`.textlintrc.json`、VS Code 設定、GA workflow) は完成。`npm run lint:docs` は実行可能だが、`docsMod/test-results.md` (自動生成) の lint エラー 21件 (うち 20件 auto-fixable) 解消まで CI は FAIL。Windows 実機確認・方式 B・npm OIDC publish CI は未着手。

## 仕様書 (参照元)

[docs/specs.md](../docs/specs.md) に移行済み。

| ファイル | 概要 | 仕様 | 実装 |
|----------|------|------|------|
| [naming.md](../docs/naming.md) | 命名 (`global-npm-setup` / `@s2j/global-npm` / `global-npm`) | 確定 | ✅ |
| [cli.md](../docs/cli.md) | CLI サブコマンド (check / update / install) | 確定 | ✅ |
| [install.md](../docs/install.md) | install 方式 C 型 (Node 列挙) | 確定 | ✅ |
| [layout.md](../docs/layout.md) | 方式 A — パッケージ同梱 `package.json` | 確定 | ✅ |
| [legacy-scripts.md](../docs/legacy-scripts.md) | レガシースクリプト廃止 | 確定 | ✅ |
| [windows.md](../docs/windows.md) | Windows 11セットアップ・制約 | 確定 | ⏳ 実機未確認 |
| [license.md](../docs/license.md) | GPL-3.0-or-later | 確定 | ✅ |
| [npm-publish.md](../docs/npm-publish.md) | npm 公開 (`@s2j` スコープ) | 確定 | ✅ v2.0.2 |

### 仕様書別テスト結果

| 仕様書 | PASS | WARN | FAIL |
|--------|------|------|------|
| mod-os-agnostic-naming | 4 | 0 | 0 |
| mod-os-agnostic-cli | 16 | 0 | 0 |
| mod-os-agnostic-install | 7 | 0 | 0 |
| mod-os-agnostic-layout | 9 | 1 | 0 |
| mod-os-agnostic-legacy-scripts | 4 | 0 | 0 |
| mod-gpl3-license | 6 | 0 | 0 |
| mod-npm-publish | 4 | 1 | 0 |
| mod-os-agnostic-windows | 4 | 1 | 0 |
| test-report | 1 | 0 | 0 |

詳細: [test-results.md](./test-results.md) — 実行: `npm test`

## 機能一覧 (実装状況サマリー)

| 機能 | 状態 | 備考 |
|------|------|------|
| `global-npm check` | ✅ 実装済 | `ncu -g --format time --packageFile` |
| `global-npm update` | ✅ 実装済 | `ncu -g -u --format time --packageFile` |
| `global-npm install` | ✅ 実装済 | C 型 — `dependencies` キー列挙 → `npm install -g` |
| CLI エントリ | ✅ 実装済 | `bin/global-npm.cjs` (CommonJS 明示) |
| setup ディレクトリ解決 | ✅ 実装済 | `path.resolve(__dirname, '..')` (package root) |
| Windows `spawnSync` 対応 | ✅ 実装済 | `shell: process.platform === 'win32'` |
| usage / 未知サブコマンド | ✅ 実装済 | `exit code: 1` |
| `dependencies` 空チェック | ✅ 実装済 | `exit code: 1` |
| 開発用 `ncu:check` / `ncu:update` | ✅ 維持 | `package.json` scripts |
| tarball 生成 | ✅ 実装済 | `npm run pack` → `./artifacts/` |
| ESLint / Prettier | ✅ 導入済 | `npm run lint` / `format:check` |
| 仕様準拠テスト | ✅ 導入済 | `npm test` (58項目、FAIL: 0) |
| README 下準備 (macOS / Windows) | ✅ 更新済 | docs-linter 形式のセットアップ手順 |
| Docs Lint (`@s2j/docs-linter`) | ⏳ 基盤完了 | devDep + `.textlintrc.json` + `lint:docs` + GA workflow。`test-results.md` の lint 解消で CI PASS |
| textlint エディター連携 | ✅ 設定済 | `.vscode/settings.json` に統合。拡張 (`3w36zj6.textlint`) の手動インストール要 |
| `@s2j/global-npm` 自己参照 | ✅ 追加済 | `dependencies` に `@s2j/global-npm: ^2.0.1` (v2.0.2publish) |
| `@s2j/docs-linter` 追加 (dependencies) | ⏸ 延期 | ユーザー側で後日 (devDep には存在) |
| `GLOBAL_NPM_SETUP_DIR` (方式 B) | ❌ 未実装 | フェーズ3 |
| npm publish | ✅ 実施済 | `@s2j/global-npm@2.0.2` (latest) |
| Windows 11実機確認 | ❌ 未実施 | フェーズ3 |
| CI / 自動 publish (npm OIDC) | ❌ 未実施 | 任意 (フェーズ3) |
| `docsMod/` → `docs/` 移行 | ✅ 完了 | 8仕様書を `docs/` へ移行、`docsMod/` は進行管理のみ |

## フェーズ1: コア実装

### フェーズ1: サマリー

**100% 完了** — CLI 本体、package.json v2化、README 更新、レガシー削除、ローカル検証まで完了。

### フェーズ1優先タスクと完了条件の対応

| # | タスク ([modification.md](./modification.md)) | 完了条件 | 状態 |
|---|----------------------------------------------|----------|------|
| 2 | `bin/global-npm.cjs` 実装 | check / update / install が仕様どおり動作する | ✅ |
| 3 | `package.json` v2化 | `@s2j/global-npm`、`bin`、`files`、`engines`、GPL、`private` 削除 | ✅ |
| 4 | `LICENSE` 追加 | GPL v3全文 + Copyright | ✅ |
| 5 | README 更新 | OS 別手順、v1移行、SETUP_DIR 解消の記載 | ✅ |
| 6 | `install-global.zsh` 削除 | ファイル削除、README / CHANGELOG から参照除去 | ✅ |

### フェーズ1完了条件

- [x] `bin/global-npm.cjs` が3サブコマンドを実装している
- [x] install が C 型 (Node 列挙) である
- [x] `package.json` が v2形式 (`@s2j/global-npm`、`bin`、`files`、`engines`) である
- [x] `LICENSE` (GPL-3.0-or-later) が存在する
- [x] README が v2の CLI 向けに更新されている (macOS / Windows 下準備含む)
- [x] `install-global.zsh` が削除されている
- [x] `npm link` または `node bin/global-npm.cjs` でローカル動作確認済
- [x] `npm run pack:dry-run` で tarball 内容 (4ファイル) を確認済
- [x] CHANGELOG にフェーズ1の変更を記載済
- [x] 仕様準拠テスト (`npm test`) が ✖ FAIL: 0である

**すべて達成 — フェーズ1完了。**

### フェーズ1で完了した項目

- `bin/global-npm.cjs` 新規作成 (check / update / install)
- `package.json` v2化 (`name`, `bin`, `files`, `engines`, `private` 削除)
- `README.md` v2向け全面更新 (macOS / Windows 下準備手順)
- `install-global.zsh` 削除
- `CHANGELOG.md` 更新
- ローカル検証 (`node bin/global-npm.cjs check`、`npm link`、`npm run pack:dry-run`)

### フェーズ1で完了した主な変更 (コード・文書)

| ファイル | 変更 |
|----------|------|
| `bin/global-npm.cjs` | 新規 — Node.js CLI |
| `package.json` | v2化 (`@s2j/global-npm`、公開準備) |
| `README.md` | macOS / Windows 11対応、v1移行手順、下準備 |
| `install-global.zsh` | 削除 |
| `CHANGELOG.md` | v2.0.0エントリ追記 |

### フェーズ1以降の整備

フェーズ1完了後に追加した品質・開発基盤。

| 項目 | 状態 | 備考 |
|------|------|------|
| ESLint + Prettier | ✅ | `eslint.config.mjs`、`prettier.config.mjs` |
| 仕様準拠テスト | ✅ | `test/spec-compliance.test.cjs` (58項目) |
| `.cjs` 化 | ✅ | CLI / テストを CommonJS 明示 (`ts(80001)` 抑制) |
| TypeScript 言語設定 | ✅ | `tsconfig.json`、`.vscode/settings.json` |
| tarball 出力先 | ✅ | `npm run pack` → `./artifacts/` (Git 管理外) |
| `.gitignore` 拡充 | ✅ | `artifacts/`、`.sandbox/` |
| Docs Lint 基盤 | ✅ | `@s2j/docs-linter` (devDep)、`.textlintrc.json`、`lint:docs` script、GA workflow |
| VS Code textlint | ✅ | `settings.json` 統合、`extensions.json`、設定 example (拡張は手動インストール) |

### フェーズ1のマイルストーン

| 日付 | 内容 |
|------|------|
| 2026-06-07 | 仕様8件すべて確定 |
| 2026-06-07 | LICENSE 追加、GPL 移行、`ncu:*` scripts 整備 |
| 2026-06-07 | **フェーズ1完了** — CLI 実装、package.json v2化、README 更新、レガシー削除 |
| 2026-06-07 | 仕様準拠テスト、ESLint / Prettier 導入、`.cjs` 化 |
| 2026-06-07 | `npm run pack` → `./artifacts/` 整備 |
| 2026-06-07 | README 下準備 (macOS / Windows) 追記、Docs Lint / VS Code 整備開始 |
| 2026-06-07 | Docs Lint 基盤完成 — `lint:docs` script、`.textlintrc.json` 修正、VS Code textlint 設定統合 |

### フェーズ1の残タスク

なし。

---

## フェーズ2: リリース

### フェーズ2: サマリー

**100% 完了** — npm publish (v2.0.2)、自己参照、`docs/` 移行まで完了。

### フェーズ2優先タスクと完了条件の対応

| # | タスク | 完了条件 | 状態 |
|---|--------|----------|------|
| 7 | npm publish | `@s2j/global-npm@2.0.2` が registry に公開される | ✅ |
| — | publish 前確認 | `npm run pack:dry-run` で tarball 内容を確認 | ✅ |
| — | tarball 生成 | `npm run pack` で `./artifacts/` に `.tgz` が出力される | ✅ |
| — | 品質チェック | `npm run lint` / `npm test` が PASS | ✅ |
| — | 自己参照の追加 | publish 後、`dependencies` に `@s2j/global-npm` を追加 | ✅ |
| — | `@s2j/docs-linter` 追加 | `dependencies` に追加 | ⏸ ユーザー側で後日 |
| — | 仕様書移行 | 確定 mod を `docs/` へ移動し [specs.md](../docs/specs.md) にリンク | ✅ |

### フェーズ2完了条件

- [x] `npm run pack:dry-run` で `bin/`、`package.json`、`LICENSE`、`README.md` が tarball に含まれる
- [x] `npm run pack` で `./artifacts/` に tarball が生成される (`artifacts/` は `.gitignore` 対象)
- [x] `npm run lint` がエラーなく完了する
- [x] 仕様準拠テスト (`npm test`) が ✖ FAIL: 0である
- [x] `npm publish --access public` が成功する
- [x] publish 後、`dependencies` に `@s2j/global-npm` 自己参照を追加する
- [x] 確定した mod ドキュメントを `docs/` へ移行する

**すべて達成 — フェーズ2完了。**

### フェーズ2で完了した項目

- `npm publish --access public` (`@s2j/global-npm` v2.0.0→ v2.0.2)
- GitHub Release (`v2.0.0` / `v2.0.1` / `v2.0.2`)
- `dependencies` へ `@s2j/global-npm` 自己参照の追加
- 確定仕様8件を `docs/` へ移行 ([specs.md](../docs/specs.md))
- `npm run pack:dry-run` / `npm run pack` (出力先 `./artifacts/`)
- ESLint / Prettier 導入 (`lint` / `format:check` scripts)
- 仕様準拠テスト58項目
- [npm-publish.md](../docs/npm-publish.md) publish 手順更新

### フェーズ2で完了した主な変更 (コード・文書)

| ファイル | 変更 |
|----------|------|
| `package.json` | v2.0.2、自己参照、`pack` scripts |
| `docs/` | 確定仕様8件 (`cli.md`, `install.md`, `layout.md` 等) |
| `docs/specs.md` | 仕様書一覧 |
| `docsMod/modification.md` | `docs/` 移行後の v2残タスク |
| `CHANGELOG.md` | v2.0.0〜 v2.0.2 |
| `.gitignore` | `artifacts/`、`.sandbox/` 追加 |
| `eslint.config.mjs` | ESLint v9の flat config |
| `prettier.config.mjs` | Prettier 設定 |
| `test/spec-compliance.test.cjs` | 仕様準拠テスト |

### フェーズ2のマイルストーン

| 日付 | 内容 |
|------|------|
| 2026-06-07 | `npm run pack:dry-run` 確認済 |
| 2026-06-07 | 仕様準拠テスト、ESLint / Prettier 導入 |
| 2026-06-07 | `npm run pack` → `./artifacts/` 整備 |
| 2026-06-07 | npm publish (`v2.0.0` / `v2.0.1` / `v2.0.2`)、自己参照の追加 |
| 2026-06-07 | **フェーズ2完了** — 確定仕様を `docs/` へ移行 |

### フェーズ2の残タスク

なし ( `@s2j/docs-linter` の `dependencies` 追加はユーザー判断で延期)。

---

## フェーズ3: リリース後

### フェーズ3: サマリー

**20% 進行中** — Docs Lint 基盤 (script / config / VS Code / workflow) は完成。CI が PASS するには `docsMod/test-results.md` (自動生成) の lint エラー解消が必要。npm publish CI、Windows 実機確認・方式 B は未着手。

### フェーズ3優先タスクと完了条件の対応

| # | タスク | 完了条件 | 状態 |
|---|--------|----------|------|
| 8 | Windows 11実機確認 | check / update / install、CLI on PATH が動作する | ❌ |
| 1 | 方式 B — 環境別 pkg 集合 | `GLOBAL_NPM_SETUP_DIR` で setup ディレクトリを上書きできる | ❌ |
| 9 | CI / 自動 publish (任意) | GitHub Actions + npm OIDC | ❌ |
| — | Docs Lint CI | `npm run lint:docs` が CI で PASS | ⏳ 基盤完成 (`test-results.md` にエラー21件… 修正可能20件) |

### フェーズ3完了条件

- [ ] Windows 11で `global-npm check|update|install` が動作する
- [ ] Windows 11で `textlint` / `ncu` 等の CLI が PATH に載る
- [ ] `GLOBAL_NPM_SETUP_DIR` 環境変数で別 `package.json` を参照できる (方式 B)
- [ ]  (任意) tag push で npm 自動 publish する CI が動作する
- [x] `package.json` に `lint:docs` script がある
- [x] `.textlintrc.json` が有効なルールで textlint を実行できる
- [ ] Docs Lint CI (`.github/workflows/docs-lint.yml`) が `npm run lint:docs` で成功する (`test-results.md` の lint エラー解消後)

### フェーズ3で完了した項目

- `.github/workflows/docs-lint.yml` 追加 (Markdown 変更時に lint 実行)
- `.textlintrc.json` 整備 (`extends` + base preset、`preset-wp-docs-ja`、allowlist)
- `@s2j/docs-linter` を devDependencies に追加
- `package.json` に `lint:docs` script 追加 (`s2j-docs-linter --profile base`、`README.md` / `docsMod/**/*.md` / `.vscode/**/*.md`)
- `.vscode/settings.json` に textlint 設定統合 (`configPath` / `nodePath` / autoFixOnSave)

### フェーズ3で完了した主な変更 (コード・文書)

| ファイル | 変更 |
|----------|------|
| `.github/workflows/docs-lint.yml` | Docs Lint CI workflow |
| `.textlintrc.json` | textlint 設定 (`extends` + `preset-wp-docs-ja` + allowlist) |
| `package.json` | `@s2j/docs-linter` (devDependencies)、`lint:docs` script |
| `.vscode/settings.json` | textlint 設定統合 |
| `.vscode/README.md` | textlint 拡張のセットアップ手順 |

### フェーズ3のマイルストーン

| 日付 | 内容 |
|------|------|
| 2026-06-07 | Docs Lint CI workflow 追加 |
| 2026-06-07 | `lint:docs` script 追加、`.textlintrc.json` 修正、VS Code textlint 設定統合 |
| 2026-06-07 | Docs Lint 対象ドキュメント整備 — `status.md` / `README.md` は PASS。残りは `test-results.md` (エラー21件) |

### フェーズ3の残タスク

1. `docsMod/test-results.md` の lint エラーを解消し Docs Lint CI を PASS させる (現状エラー21件… 修正可能20件。自動生成レポートと `wp-docs-ja/prh` の衝突)
2. Windows 11実機確認
3. 方式 B — `GLOBAL_NPM_SETUP_DIR` 実装
4. (任意) GitHub Actions + npm OIDC による自動 publish

---

## 補足

### ローカル検証メモ (2026-06-07)

| 確認項目 | 結果 |
|----------|------|
| `node bin/global-npm.cjs` (usage) | `exit code: 1`、usage 表示 |
| `node bin/global-npm.cjs check` | ncu 実行成功 |
| `npm run pack:dry-run` | 4ファイル確認 |
| `npm run pack` | `./artifacts/s2j-global-npm-2.0.0.tgz` 生成 |
| `npm run lint` | エラーなし |
| `npm test` | 53テスト PASS、仕様準拠 FAIL: 0 |
| `npm link` + nvm global bin 経由 | check / install 成功 |
| `npm run lint:docs` | 実行可能 (`exit code: 1`、エラー21件… すべて `docsMod/test-results.md`。`status.md` / `README.md` は PASS) |

### npm scripts 一覧

| script | 用途 |
|--------|------|
| `test` | 仕様準拠テスト |
| `lint` / `lint:fix` | ESLint |
| `format` / `format:check` | Prettier |
| `pack` / `pack:dry-run` | tarball 生成 / 確認 (`./artifacts/`) |
| `ncu:check` / `ncu:update` | 開発用 ncu |
| `lint:docs` | Docs Lint (`s2j-docs-linter --profile base`… `README.md`, `docs/**/*.md`, `docsMod/status.md`, `docsMod/modification.md`) |

### 既知のギャップ

| 項目 | 状態 | 対応予定 |
|------|------|----------|
| Docs Lint エラー | `npm run lint:docs` がエラー21件で FAIL (すべて `docsMod/test-results.md`) | フェーズ3… レポート生成側の表記修正、または lint 対象から除外 |
| `test-results.md` と textlint | `npm test` 自動生成の表記 (例: `（PASS）`, `exit 1`) が `wp-docs-ja/prh` に抵触 | テストレポート生成ロジックの調整を検討 |
| Prettier | `npm run format:check` が `.textlintrc.json`、`.cursor/rules/allowlist.json` で WARN | 必要に応じて `npm run format` |
| textlint 拡張 | 設定は `settings.json` に統合済。拡張本体は手動インストール要 | ユーザー環境 |
| `.textlintrc.json` の `rules` | `preset-wp-docs-ja` (WordPress 向け)。base 専用プリセット名は存在しない | 他プロジェクトと同形式を維持 |

### 既存環境での注意

`~/bin/global-npm` (v1の Zsh ラッパー) が PATH 上で npm global bin より優先される場合がある。v2の CLI を使うには旧ラッパーの削除を推奨 ([README.md](../README.md) 移行節参照)。

### 意図的に延期している項目

| 項目 | 理由 | 着手タイミング | テスト ID |
|------|------|----------------|-----------|
| `@s2j/global-npm` 自己参照 | publish 前に registry 未登録 | v2.0.2publish 後に追加済 | LAY-09: ✔ |
| `@s2j/docs-linter` 追加 (dependencies) | ユーザー側で管理 | ユーザー判断 | — |
| `GLOBAL_NPM_SETUP_DIR` | 方式 B は v2残タスク | フェーズ3 | LAY-10: ✔ (未実装であること) |
| npm publish | 別タイミングで実施 | v2.0.2まで完了 | PUB-05: ✔ |
| Windows 11実機確認 | macOS 環境で未実施 | フェーズ3 | WIN-05: ⚠ |
