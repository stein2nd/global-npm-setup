# Global npm Package Setup - 実装状況

最終更新…**2026-06-09**

## 全体進捗 (サマリー)

| 区分 | 進捗 | 備考 |
|------|------|------|
| **仕様確定** | **100%** (8/8) | `docs/` に移行済み。v2.1の overlay は [mod-overlay-manifest.md](./mod-overlay-manifest.md) → `docs/` 反映済 |
| **フェーズ1: コア実装** | **100%** | 完了 |
| **フェーズ2: リリース** | **100%** | npm publish、自己参照、仕様書の移行完了 |
| **フェーズ3: リリース後** | **75%** (3/4) | 方式 B (#1)、Docs Lint CI、npm OIDC publish CI、`v2.1.1` publish 完了。Windows 実機 (#8) は部分確認のみ |
| **v2初期リリース全体** | **86%** (6/7) | [modification.md](./modification.md) タスク #8 (Windows 実機確認) のみ残 |
| **v2全体 (方式 B、CI 含む)** | **89%** (8/9) | #8 (Windows 実機) のみ残 |
| **v2.1の overlay manifest** | **100%** (12/12) | 実装、docs、README、`@s2j/global-npm@2.1.0` npm publish 完了 |
| **v2.1.1パッチ** | **100%** (publish 済) | ドキュメント整備、自己参照 tarball 更新、`@s2j/global-npm@2.1.1` publish |
| **Unreleased (ローカル)** | **実装済、publish 待ち** (11/12) | 同梱 ncu 起動 (`resolve-ncu`)、`install` の version 解決 (`pinVersion`) |
| **仕様準拠テスト** | **100%** (PASS: 63/63) | ✖ FAIL: 0、⚠ WARN: 1 (WIN-05) … [test-results.md](./test-results.md) |
| **開発基盤 (lint、format、test)** | **100%** | ESLint、Prettier、仕様準拠 + ユニットテスト、`lint:docs` script 済 |

> **進捗率の算定**
>
> * [modification.md](./modification.md) の v2残タスク (#1〜#9) を実装タスクとみなす。#2〜#6をフェーズ1、#7をフェーズ2、#8、#9、#1をフェーズ3に対応付け。
> * **フェーズ3 (75%):** 優先タスク4件のうち #1 (overlay manifest)、#9 (npm OIDC publish CI)、Docs Lint CI、`v2.1.1` publish が完了。残り #8 (Windows 実機の完了条件充足) のみ。
> * **v2.1 (100%):** [mod-overlay-manifest.md](./mod-overlay-manifest.md) に従う実装、`docs/` 移行、README 更新、`v2.1.0` tag push + OIDC publish まで完了 ([GitHub Release `v2.1.0`](https://github.com/stein2nd/global-npm-setup/releases/tag/v2.1.0))。
> * **v2.1.1 (100%):** ドキュメント、自己参照運用の整備、`v2.1.1` tag push + OIDC publish 完了 ([GitHub Release `v2.1.1`](https://github.com/stein2nd/global-npm-setup/releases/tag/v2.1.1))。

## 仕様書 (参照元)

[docs/specs.md](../docs/specs.md) に移行済みです。
v2.1の overlay の詳細仕様は [mod-overlay-manifest.md](./mod-overlay-manifest.md) をご覧ください。

| ファイル | 概要 | 仕様 | 実装 |
|----------|------|------|------|
| [naming.md](../docs/naming.md) | 命名 (`global-npm-setup`、`@s2j/global-npm`、`global-npm`) | 確定 | ✅ |
| [cli.md](../docs/cli.md) | CLI サブコマンド (check、update、install、sync、add) | 確定 (v2.1) | ✅ |
| [install.md](../docs/install.md) | install 方式 C 型 (Node 列挙、version 解決) | 確定 (v2.1 + Unreleased 追記) | ✅ |
| [layout.md](../docs/layout.md) | overlay manifest、`$SETUP_DIR`、自己参照 range 運用 | 確定 (v2.1.1) | ✅ |
| [usage.md](../docs/usage.md) | 鮮度管理、定番フロー、衝突整理 | 確定 (v2.1.1) | ✅ |
| [legacy-scripts.md](../docs/legacy-scripts.md) | レガシースクリプト廃止 | 確定 | ✅ |
| [windows.md](../docs/windows.md) | Windows 11セットアップ、制約 | 確定 | ⏳ 実機は部分確認 |
| [license.md](../docs/license.md) | GPL-3.0-or-later | 確定 | ✅ |
| [npm-publish.md](../docs/npm-publish.md) | npm 公開 (`@s2j` スコープ)、自己参照の更新手順 | 確定 | ✅ v2.1.1 + OIDC CI |

### 仕様書別テスト結果 (仕様準拠マーク)

| 仕様書 | PASS | WARN | FAIL |
|--------|------|------|------|
| mod-os-agnostic-naming | 4 | 0 | 0 |
| mod-os-agnostic-cli | 19 | 0 | 0 |
| mod-os-agnostic-install | 7 | 0 | 0 |
| mod-os-agnostic-layout | 12 | 0 | 0 |
| mod-os-agnostic-legacy-scripts | 4 | 0 | 0 |
| mod-gpl3-license | 6 | 0 | 0 |
| mod-npm-publish | 5 | 0 | 0 |
| mod-os-agnostic-windows | 4 | 1 | 0 |
| test-report | 1 | 0 | 0 |

ユニットテスト (仕様準拠マーク外): `test/sync-manifest.test.cjs` (10)、`test/resolve-range.test.cjs` (5)、`test/install-spec.test.cjs` (5)、`test/resolve-ncu.test.cjs` (2)。`npm test` 合計 **80** 件 PASS。

詳細: [test-results.md](./test-results.md) - 実行: `npm test`

## 機能一覧 (実装状況サマリー)

| 機能 | 状態 | 備考 |
|------|------|------|
| `global-npm check` | ✅ 実装済 | 事前 sync → 同梱 ncu 優先起動 (`lib/resolve-ncu.cjs`)。Unreleased |
| `global-npm update` | ✅ 実装済 | 事前 sync → 同梱 ncu 優先起動。Unreleased |
| `global-npm install` | ✅ 実装済 | 事前 sync → range を `npm view` で具体 version に解決 → `npm install -g` (Unreleased、publish 待ち) |
| `global-npm sync` | ✅ 実装済 | upstream + user-deps → 実効 package.json。`--dry-run` 対応 (v2.1) |
| `global-npm add` | ✅ 実装済 | user-deps 追記 → sync。`--dev`、`npm view`、`*` フォールバック (v2.1) |
| overlay manifest (`syncManifest`) | ✅ 実装済 | `lib/sync-manifest.cjs` |
| setup ディレクトリ解決 | ✅ 実装済 | デフォルト `~/.config/global-npm` (Win: `%APPDATA%\global-npm`)。`GLOBAL_NPM_SETUP_DIR` で上書き |
| CLI エントリ | ✅ 実装済 | `bin/global-npm.cjs` + `lib/` |
| Windows `spawnSync` 対応 | ✅ 実装済 | `shell: process.platform === 'win32'` |
| usage、未知サブコマンド | ✅ 実装済 | `exit code: 1` |
| `dependencies` 空チェック | ✅ 実装済 | `exit code: 1` |
| 開発用 `ncu:check`、`ncu:update` | ✅ 維持 | `package.json` scripts |
| tarball 生成 | ✅ 実装済 | `npm run pack` → `./artifacts/` (`lib/` 同梱) |
| ESLint、Prettier | ✅ 導入済 | `npm run lint`、`format:check` |
| 仕様準拠テスト | ✅ 導入済 | `npm test` (80件、FAIL: 0) |
| README、docs (v2.1.1) | ✅ 更新済 | overlay manifest、移行手順、`usage.md` 導線 |
| Docs Lint (`@s2j/docs-linter`) | ✅ PASS | `lint:docs` + GA workflow |
| textlint エディター連携 | ✅ 設定済 | `.vscode/settings.json` に統合 |
| `@s2j/global-npm` 自己参照 | ✅ 運用確定 | publish 済み latest を `^x.y.z` で明示。リポジトリ: `^2.1.1` |
| `@s2j/docs-linter` 追加 (dependencies) | ⏸ 延期 | ユーザー側で後日 (devDep には存在) |
| npm publish | ✅ 実施済 | `@s2j/global-npm@2.1.1` (latest)。OIDC CI + [`v2.1.1`](https://github.com/stein2nd/global-npm-setup/releases/tag/v2.1.1) |
| Windows 11実機確認 | ⏳ 部分確認 | check、update、install は PowerShell で確認 (`v2.1.1` は `install` 後)。sync、add 未確認。初回 bootstrap は Unreleased で解消済 |
| CI、自動 publish (npm OIDC) | ✅ 稼働中 | `.github/workflows/npm-publish.yml` |
| `docsMod/` → `docs/` 移行 | ✅ 完了 | v2.1の overlay 仕様も `docs/` に反映済 |

## フェーズ1: コア実装

### フェーズ1: サマリー

**100% 完了:** CLI 本体、package.json v2化、README 更新、レガシー削除、ローカル検証まで完了。

### フェーズ1優先タスクと完了条件の対応

| # | タスク ([modification.md](./modification.md)) | 完了条件 | 状態 |
|---|----------------------------------------------|----------|------|
| 2 | `bin/global-npm.cjs` 実装 | check、update、install が仕様どおり動作する | ✅ |
| 3 | `package.json` v2化 | `@s2j/global-npm`、`bin`、`files`、`engines`、GPL、`private` 削除 | ✅ |
| 4 | `LICENSE` 追加 | GPL v3全文 + Copyright | ✅ |
| 5 | README 更新 | OS 別手順、v1移行、SETUP_DIR 解消の記載 | ✅ |
| 6 | `install-global.zsh` 削除 | ファイル削除、README、CHANGELOG から参照除去 | ✅ |

### フェーズ1完了条件

* [x] `bin/global-npm.cjs` が3サブコマンドを実装している (v2.1で5サブコマンドに拡張)
* [x] install が C 型 (Node 列挙、`name@version` 形式。range は `npm view` で解決) である
* [x] `package.json` が v2形式 (`@s2j/global-npm`、`bin`、`files`、`engines`) である
* [x] `LICENSE` (GPL-3.0-or-later) が存在する
* [x] README が v2の CLI 向けに更新されている (macOS、Windows 下準備含む)
* [x] `install-global.zsh` が削除されている
* [x] `npm link` または `node bin/global-npm.cjs` でローカル動作確認済
* [x] `npm run pack:dry-run` で tarball 内容を確認済
* [x] CHANGELOG にフェーズ1の変更を記載済
* [x] 仕様準拠テスト (`npm test`) が ✖ FAIL: 0である

**すべて達成: フェーズ1完了。**

### フェーズ1の残タスク

なし。

---

## フェーズ2: リリース

### フェーズ2: サマリー

**100% 完了:** npm publish (v2.0.2)、自己参照、`docs/` 移行まで完了。v2.0.3 (semver 付き install) は2026-06-07に publish 済。

### フェーズ2優先タスクと完了条件の対応

| # | タスク | 完了条件 | 状態 |
|---|--------|----------|------|
| 7 | npm publish | `@s2j/global-npm@2.0.3` が registry に公開される | ✅ |
| — | publish 前確認 | `npm run pack:dry-run` で tarball 内容を確認 | ✅ |
| — | tarball 生成 | `npm run pack` で `./artifacts/` に `.tgz` が出力される | ✅ |
| — | 品質チェック | `npm run lint`、`npm test` が PASS | ✅ |
| — | 自己参照の追加 | publish 後、`dependencies` に `@s2j/global-npm` を追加 | ✅ |
| — | `@s2j/docs-linter` 追加 | `dependencies` に追加 | ⏸ ユーザー側で後日 |
| — | 仕様書移行 | 確定 mod を `docs/` へ移動し [specs.md](../docs/specs.md) にリンク | ✅ |

### フェーズ2完了条件

* [x] `npm run pack:dry-run` で `bin/`、`package.json`、`LICENSE`、`README.md` が tarball に含まれる
* [x] `npm run pack` で `./artifacts/` に tarball が生成される
* [x] `npm run lint` がエラーなく完了する
* [x] 仕様準拠テスト (`npm test`) が ✖ FAIL: 0である
* [x] `npm publish --access public` が成功する (v2.0.x)
* [x] publish 後、`dependencies` に `@s2j/global-npm` 自己参照を追加する
* [x] 確定した mod ドキュメントを `docs/` へ移行する

**すべて達成: フェーズ2完了。**

### フェーズ2の残タスク

なし (`@s2j/docs-linter` の `dependencies` 追加はユーザー判断で延期)。

---

## フェーズ3: リリース後

### フェーズ3: サマリー

**75% 進行中 (3/4優先タスク完了):** overlay manifest (#1)、Docs Lint CI、npm OIDC publish CI、`v2.1.0`、`v2.1.1` publish が完了。Windows 実機確認 (#8) は部分確認のみで、完了条件は未充足。

### フェーズ3優先タスクと完了条件の対応

| # | タスク | 完了条件 | 状態 |
|---|--------|----------|------|
| 1 | 方式 B: overlay manifest (v2.1) | [mod-overlay-manifest.md](./mod-overlay-manifest.md) に従い実装、docs 移行、npm publish | ✅ |
| 8 | Windows 11実機確認 | check、update、install、sync、add、CLI on PATH が動作する | ⏳ 部分確認 |
| 9 | CI、自動 publish (任意) | GitHub Actions + npm OIDC (Trusted Publisher) | ✅ |
| — | Docs Lint CI | `npm run lint:docs` が CI で PASS | ✅ |
| — | v2.1.1パッチ publish | ドキュメント整備、自己参照 tarball 更新、tag `v2.1.1` | ✅ |

### フェーズ3完了条件

* [x] Windows 11で `global-npm check` が動作する (PowerShell、2026-06-09確認。registry `v2.1.1` は `global-npm install` 後。Unreleased では `install` 前も可)
* [x] Windows 11で `global-npm update` が動作する (同上)
* [x] Windows 11で `global-npm install` が動作する (同上)
* [ ] Windows 11で `global-npm sync`、`add` が動作する
* [ ] Windows 11で `textlint`、`ncu` 等の CLI が PATH に載る (`global-npm install` 後は `ncu` 可。`textlint` は未確認)
* [ ] Windows 11で `npm install -g` 直後の `global-npm check` が動作する (Unreleased 実装済、publish 後に再確認)
* [x] overlay manifest が動作する (デフォルト `~/.config/global-npm`、`GLOBAL_NPM_SETUP_DIR`、`sync`、`add`)
* [x] `user-deps.json` で追加分を管理し、upstream 更新時にマージされる
* [x] (任意) tag push で npm 自動 publish する CI が動作する (`v2.1.0`、`v2.1.1` publish 確認済)
* [x] `package.json` に `lint:docs` script がある
* [x] Docs Lint CI が `npm run lint:docs` で成功する

**7/10達成:** Windows (#8) の sync、add、PATH、`install` 前 check の publish 後確認が残り。

### Windows 11実機確認 (#8) の進捗

| 確認項目 | 状態 | メモ |
|----------|------|------|
| `npm install -g @s2j/global-npm` | ✅ | PowerShell で実施済 |
| `global-npm install` (初回) | ✅ | 実施後に `ncu` が PATH に載る |
| `global-npm check` (`install` 前) | ⏳ | registry `v2.1.1` では `ncu` 不在で失敗。Unreleased (`resolve-ncu`) で解消済、publish 待ち |
| `global-npm check` (`install` 後) | ✅ | PowerShell で動作確認済 |
| `global-npm update` | ✅ | 同上 |
| `global-npm install` (更新サイクル) | ✅ | 同上 |
| `global-npm sync`、`add` | ❌ | 未確認 |
| `textlint`、`ncu` on PATH | ⏳ | `install` 後は `ncu` 利用可。`textlint` は未確認 |
| 同梱 ncu 起動 (`resolve-ncu`) | ✅ | ローカル実装済。registry 未 publish |
| install の version 解決 (`pinVersion`) | ✅ | ローカル実装済。registry 未 publish |

### v2.1の overlay manifest: 完了条件

| 条件 | 状態 |
|------|------|
| `lib/` モジュール (`paths`, `pkg-io`, `sync-manifest`, `resolve-range`, `install-spec`, `resolve-ncu`) | ✅ |
| 5サブコマンド (`check`、`update`、`install`、`sync`、`add`) | ✅ |
| デフォルト setupDir (`~/.config/global-npm`、Win `%APPDATA%\global-npm`) | ✅ |
| `syncManifest` マージ (dependencies、devDependencies B 案) | ✅ |
| `add` range 省略: `npm view` → `^x.y.z`、オフライン `*` フォールバック | ✅ |
| ユニットテスト SYNC-01〜10、RANGE-01〜02 | ✅ |
| 仕様準拠テスト CLI-17〜19、LAY-10〜12更新 | ✅ |
| `docs/layout.md`、`cli.md`、`install.md`、`windows.md` 更新 | ✅ |
| `README.md` v2.1移行手順 | ✅ |
| `CHANGELOG.md` v2.1.0エントリ | ✅ |
| `package.json` version `2.1.0`、`files` に `lib/` | ✅ |
| npm publish `@s2j/global-npm@2.1.0` | ✅ |

**12/12達成: v2.1の overlay manifest 完了。**

### v2.1.1パッチ: 完了条件

| 条件 | 状態 |
|------|------|
| `docs/usage.md` 追加 (鮮度管理、各コマンドの役割) | ✅ |
| README、`specs.md` に `usage.md` 導線 | ✅ |
| 用語統一 (実効 package.json) | ✅ |
| 自己参照 range 運用の明文化 (`layout.md`、`npm-publish.md`) | ✅ |
| tarball 自己参照 `^2.1.0`、publish 後リポジトリ `^2.1.1` | ✅ |
| `CHANGELOG.md` v2.1.1エントリ | ✅ |
| npm publish `@s2j/global-npm@2.1.1` | ✅ |
| GitHub Release [`v2.1.1`](https://github.com/stein2nd/global-npm-setup/releases/tag/v2.1.1) | ✅ |

**8/8達成: v2.1.1パッチ完了。**

### Unreleased (ローカル実装済み、publish 待ち): 完了条件

| 条件 | 状態 |
|------|------|
| `check`、`update` が同梱 `npm-check-updates` を優先起動 (`lib/resolve-ncu.cjs`) | ✅ |
| `test/resolve-ncu.test.cjs` (NCU-01〜02) | ✅ |
| `docs/windows.md`、`cli.md`、`README.md` に初回 bootstrap 追記 | ✅ |
| `install` が range を `npm view` で具体 version に解決 (`pinVersion`) | ✅ |
| `lib/install-spec.cjs` に `resolvePinnedVersion` | ✅ |
| `test/install-spec.test.cjs` (SPEC-01〜05) | ✅ |
| `docs/install.md`、`usage.md` 更新 | ✅ |
| 仕様準拠テスト (CLI-09、CLI-10、WIN-02) 更新 | ✅ |
| `CHANGELOG.md` Unreleased エントリ | ✅ |
| Windows 11で `install` 前 `check` の再確認 | ❌ |
| npm publish (次版) | ❌ |

**9/11達成: Windows 再確認と publish が残り。**

### フェーズ3で完了した項目 (v2.1、v2.1.1)

* overlay manifest 実装 (`lib/`、`bin/global-npm.cjs` リファクタ)
* `global-npm sync`、`global-npm add` サブコマンド
* `test/sync-manifest.test.cjs`、`test/resolve-range.test.cjs` 追加
* `docs/` v2.1仕様反映、`README.md` 更新
* [mod-overlay-manifest.md](./mod-overlay-manifest.md) 仕様確定・実装完了
* tag `v2.1.0`、`v2.1.1` push → GitHub Actions OIDC publish
* `docs/usage.md` 追加、自己参照 range 運用の明文化
* 同梱 ncu 起動 (`resolve-ncu`)、`install` の version 解決 (ローカル、publish 待ち)

### フェーズ3で完了した主な変更 (v2.1.1、Unreleased)

| ファイル | 変更 |
|----------|------|
| `docs/usage.md` | 新規: 鮮度管理、定番フロー、衝突整理 |
| `docs/layout.md`、`docs/npm-publish.md` | 自己参照 range 運用 |
| `README.md`、`docs/specs.md` | `usage.md` 導線 |
| `lib/resolve-ncu.cjs` | 同梱 ncu 解決、`runNcu` (Unreleased) |
| `test/resolve-ncu.test.cjs` | NCU-01〜02 (Unreleased) |
| `lib/install-spec.cjs` | `resolvePinnedVersion`、`pinVersion` オプション (Unreleased) |
| `test/install-spec.test.cjs` | SPEC-01〜05 (Unreleased) |
| `bin/global-npm.cjs` | `runNcu`、`install` で `pinVersion: true` (Unreleased) |
| `package.json` | 自己参照 `^2.1.1` (publish 後追従) |

### フェーズ3のマイルストーン

| 日付 | 内容 |
|------|------|
| 2026-06-07 | `@s2j/global-npm@2.0.3` npm publish、Docs Lint CI、npm OIDC publish CI |
| 2026-06-08 | [mod-overlay-manifest.md](./mod-overlay-manifest.md) 仕様確定 |
| 2026-06-08 | **v2.1の overlay manifest 実装完了:** コード、テスト、`docs/`、README |
| 2026-06-08 | `npm test` 73件 PASS、`npm run lint:docs` PASS |
| 2026-06-08 | **`@s2j/global-npm@2.1.0` npm publish:** tag `v2.1.0`、OIDC CI success |
| 2026-06-09 | `docs/usage.md` 追加、自己参照 range 運用の明文化 |
| 2026-06-09 | **`@s2j/global-npm@2.1.1` npm publish:** tag `v2.1.1`、OIDC CI success |
| 2026-06-09 | Windows 11で check、update、install を部分確認 (`global-npm install` 後) |
| 2026-06-09 | `install` の version 解決をローカル実装 (Unreleased) |
| 2026-06-09 | 同梱 ncu 起動 (`resolve-ncu`) をローカル実装。初回 `check` の bootstrap 改善 (Unreleased) |

### フェーズ3の残タスク

1. Windows 11実機確認 (#8) の完了…`sync`、`add`、`textlint` on PATH、Unreleased publish 後の `install` 前 `check` 再確認
2. Unreleased 変更の npm publish (次版: 同梱 ncu、`pinVersion`)

---

## 補足

### ローカル検証メモ (2026-06-09)

| 確認項目 | 結果 |
|----------|------|
| `npm test` | 80件 PASS (仕様準拠63 + ユニット17)、FAIL: 0、WARN: 1 (WIN-05) |
| `npm run lint` | エラーなし |
| `npm run lint:docs` | PASS |
| `npm run pack:dry-run` | `bin/`、`lib/`、`package.json` 等を確認 |
| `global-npm add`、`sync` (`.sandbox/setup`) | CLI-17〜19PASS |
| `node scripts/verify-release-tag.cjs v2.1.1` | tag、version 一致確認 OK |
| GitHub Actions `Publish to npm` (v2.1.1) | success |
| npm registry latest | `@s2j/global-npm@2.1.1` |
| GitHub Release | [`v2.1.1`](https://github.com/stein2nd/global-npm-setup/releases/tag/v2.1.1) |
| PUB-05 (registry `@2.1.1`) | ✔ PASS |

### npm scripts 一覧

| script | 用途 |
|--------|------|
| `test` | 仕様準拠 + ユニットテスト (`test/*.test.cjs`) |
| `lint`、`lint:fix` | ESLint |
| `format`、`format:check` | Prettier |
| `pack`、`pack:dry-run` | tarball 生成、確認 (`./artifacts/`) |
| `ncu:check`、`ncu:update` | 開発用 ncu |
| `lint:docs` | Docs Lint |

### 既知のギャップ

| 項目 | 状態 | 対応予定 |
|------|------|----------|
| Windows 11実機 (#8) | check、update、install は確認済。sync、add 未確認 | フェーズ3残タスク |
| 初回 bootstrap (`ncu` on PATH) | registry `v2.1.1` では `install` 前に `check` 失敗。Unreleased (`resolve-ncu`) で解消済 | 次版 publish 後に Win11再確認 |
| `install` の version 解決 (`pinVersion`) | ローカル実装済、registry 未反映 | 次版 publish |
| 手動 dry-run (公開済 version) | 既存 version で `npm publish --dry-run` FAIL | pack 系で代替 |
| textlint 拡張 | 拡張本体は手動インストール要 | ユーザー環境 |

### 既存環境での注意

* `~/bin/global-npm` (v1の Zsh ラッパー) が PATH 上で優先される場合がある。v2の CLI 利用時は旧ラッパー削除を推奨。
* v2.0.x から v2.1に移行後、管理定義は `~/.config/global-npm/` に移る。Windows 11では `%APPDATA%\global-npm`。初回は `global-npm sync` を実行する。
* Windows 11 (registry `v2.1.1`): `npm install -g` のあと `global-npm install` を実行してから `check`、`update` を使う。Unreleased (次版) では `install` 前から `check` が動作する予定。

### 意図的に延期している項目

| 項目 | 理由 | 着手タイミング | テスト ID |
|------|------|----------------|-----------|
| `@s2j/docs-linter` 追加 (dependencies) | ユーザー側で管理 | ユーザー判断 | — |
| Windows 11実機確認 (完了) | sync、add 等が未確認 | フェーズ3 | WIN-05: ⚠ |
