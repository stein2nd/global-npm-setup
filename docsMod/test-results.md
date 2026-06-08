# Global npm Package Setup - 仕様準拠テスト結果

最終実行: **2026-06-08**

## サマリー

| 区分 | 件数 |
|------|------|
| ✔ PASS | 62 |
| ⚠ WARN | 1 |
| ✖ FAIL | 0 |
| 合計 | 63 |

自動テスト合格率（PASS / 合計）: **98%**

実行: `npm test`

## 結果マーク

- ✔ PASS — 条件を満たす
- ⚠ WARN — 条件未達だが、延期・手動確認待ちなど意図的に許容
- ✖ FAIL — 条件未達（要修正）

## mod-os-agnostic-naming

| ID | 条件 | 結果 | 備考 |
|----|------|------|------|
| NAM-01 | package.json の name が `@s2j/global-npm` であること。 | ✔ PASS | actual: @s2j/global-npm |
| NAM-02 | package.json の bin に `global-npm` コマンドが定義されていること。 | ✔ PASS |  |
| NAM-03 | repository.url に `global-npm-setup` が含まれること。 | ✔ PASS | git+https://github.com/stein2nd/global-npm-setup.git |
| NAM-04 | package.json の name が v1 名 `global-npm-packages` ではないこと。 | ✔ PASS |  |

## mod-os-agnostic-cli

| ID | 条件 | 結果 | 備考 |
|----|------|------|------|
| CLI-01 | `bin/global-npm.cjs` が存在すること。 | ✔ PASS |  |
| CLI-02 | CLI 先頭行が `#!/usr/bin/env node` であること。 | ✔ PASS |  |
| CLI-03 | package.json の type が `commonjs` であること。 | ✔ PASS |  |
| CLI-04 | CLI が `spawnSync` で子プロセスを起動すること。 | ✔ PASS |  |
| CLI-05 | install 処理が `JSON.parse` と `readFileSync` を使うこと。 | ✔ PASS |  |
| CLI-06 | CLI ソースに jq 呼び出しが含まれないこと。 | ✔ PASS |  |
| CLI-07 | package root は upstream 正本、`defaultSetupDir()` で overlay setup を解決すること。 | ✔ PASS |  |
| CLI-08 | `GLOBAL_NPM_SETUP_DIR` で setup ディレクトリを上書きできること。 | ✔ PASS |  |
| CLI-09 | check が `ncu -g --format time --packageFile` を使うこと。 | ✔ PASS |  |
| CLI-10 | update が `ncu -g --format time -u --packageFile` を使うこと。 | ✔ PASS |  |
| CLI-11 | サブコマンド未指定時に usage を表示して exit 1 すること。 | ✔ PASS |  |
| CLI-12 | 未知サブコマンド時に usage を表示して exit 1 すること。 | ✔ PASS |  |
| CLI-13 | 開発用 script `ncu:check` が存在すること。 | ✔ PASS |  |
| CLI-14 | 開発用 script `ncu:update` が存在すること。 | ✔ PASS |  |
| CLI-15 | v1 script `ncu:install` が存在しないこと。 | ✔ PASS |  |
| CLI-16 | check 実行後もリポジトリ root の package.json が変わらないこと。 | ✔ PASS |  |
| CLI-17 | `add` が `user-deps.json` の dependencies に追記すること。 | ✔ PASS |  |
| CLI-18 | `add --dev` が `user-deps.json` の devDependencies に追記すること。 | ✔ PASS |  |
| CLI-19 | `sync` が upstream dependencies を実効 package.json に反映すること。 | ✔ PASS |  |

## mod-os-agnostic-install

| ID | 条件 | 結果 | 備考 |
|----|------|------|------|
| INS-01 | install が `npm install -g` に `name@range` 形式で渡すこと。 | ✔ PASS |  |
| INS-02 | install が引数なし `npm install -g`（B 型）を実行しないこと。 | ✔ PASS |  |
| INS-03 | install が `dependencies` の name / range を `Object.entries` で列挙すること。 | ✔ PASS |  |
| INS-04 | dependencies が空のとき `No dependencies to install.` で exit 1 すること。 | ✔ PASS |  |
| INS-05 | install サブコマンド単体で ncu を呼ばないこと。 | ✔ PASS |  |
| INS-06 | spawn 時に Windows 向け `shell: process.platform === 'win32'` を使うこと。 | ✔ PASS |  |
| INS-07 | 子プロセスの exit code をそのまま返すこと。 | ✔ PASS |  |

## mod-os-agnostic-layout

| ID | 条件 | 結果 | 備考 |
|----|------|------|------|
| LAY-1 | `bin/global-npm.cjs` がリポジトリ root に存在すること。 | ✔ PASS |  |
| LAY-2 | `package.json` がリポジトリ root に存在すること。 | ✔ PASS |  |
| LAY-3 | `LICENSE` がリポジトリ root に存在すること。 | ✔ PASS |  |
| LAY-4 | `README.md` がリポジトリ root に存在すること。 | ✔ PASS |  |
| LAY-5 | `CHANGELOG.md` がリポジトリ root に存在すること。 | ✔ PASS |  |
| LAY-06 | package.json の files に publish 同梱パスが定義されていること。 | ✔ PASS | expected: bin/, lib/, package.json, LICENSE, README.md; actual: bin/, lib/, package.json, LICENSE, README.md |
| LAY-07 | package.json に `dependencies` が定義されていること。 | ✔ PASS |  |
| LAY-08 | install が `devDependencies` を参照しないこと。 | ✔ PASS |  |
| LAY-09 | dependencies に `@s2j/global-npm` 自己参照が含まれること。 | ✔ PASS |  |
| LAY-10 | overlay manifest（`syncManifest` / `user-deps.json`）が実装されていること。 | ✔ PASS |  |
| LAY-11 | デフォルト setupDir が `~/.config/global-npm`（Win: AppData）であること。 | ✔ PASS |  |
| LAY-12 | `lib/` ディレクトリが存在し publish files に含まれること。 | ✔ PASS |  |

## mod-os-agnostic-legacy-scripts

| ID | 条件 | 結果 | 備考 |
|----|------|------|------|
| LEG-01 | `install-global.zsh` がリポジトリに存在しないこと。 | ✔ PASS |  |
| LEG-02 | package.json に `main: install-global.zsh` が存在しないこと。 | ✔ PASS |  |
| LEG-03 | README が v1 Zsh ラッパー新規作成手順を主要セットアップとして案内しないこと。 | ✔ PASS |  |
| LEG-04 | README が v1 `~/bin/global-npm` 廃止を記載していること。 | ✔ PASS |  |

## mod-gpl3-license

| ID | 条件 | 結果 | 備考 |
|----|------|------|------|
| LIC-01 | package.json の license が `GPL-3.0-or-later` であること。 | ✔ PASS |  |
| LIC-02 | `LICENSE` ファイルが存在すること。 | ✔ PASS |  |
| LIC-03 | LICENSE に GNU GENERAL PUBLIC LICENSE Version 3 全文が含まれること。 | ✔ PASS |  |
| LIC-04 | LICENSE に Copyright 表記が含まれること。 | ✔ PASS |  |
| LIC-05 | README にライセンス節があること。 | ✔ PASS |  |
| LIC-06 | CHANGELOG v2.0.0 にライセンス変更が記載されていること。 | ✔ PASS |  |

## mod-npm-publish

| ID | 条件 | 結果 | 備考 |
|----|------|------|------|
| PUB-01 | package.json に `private: true` が設定されていないこと。 | ✔ PASS |  |
| PUB-02 | package.json の version が `2.1.0` であること。 | ✔ PASS |  |
| PUB-03 | package.json の engines.node が `>=18` であること。 | ✔ PASS |  |
| PUB-04 | `npm pack --dry-run` の tarball に必須ファイルが含まれること。 | ✔ PASS |  |
| PUB-05 | npm registry に `@s2j/global-npm@2.1.0` が公開済みであること。 | ✔ PASS |  |

## mod-os-agnostic-windows

| ID | 条件 | 結果 | 備考 |
|----|------|------|------|
| WIN-01 | CLI が `path.join` / `path.resolve` を使うこと。 | ✔ PASS |  |
| WIN-02 | spawn 時に Windows 判定付き shell オプションを使うこと。 | ✔ PASS |  |
| WIN-03 | CLI ソースに Zsh 依存が含まれないこと。 | ✔ PASS |  |
| WIN-04 | README に Windows 11 向けセクションがあること。 | ✔ PASS |  |
| WIN-05 | Windows 11 実機で check / update / install が動作すること。 | ⚠ WARN | macOS/Linux 環境のため手動確認待ち |

## test-report

| ID | 条件 | 結果 | 備考 |
|----|------|------|------|
| REP-01 | test-results.md が生成されること。 | ✔ PASS |  |
