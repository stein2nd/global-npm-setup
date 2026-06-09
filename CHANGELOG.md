# Global npm Package Setup - CHANGELOG

## Unreleased

## v2.1.2: 2026-06-09

### パッケージ本体

* `global-npm check`、`update` が同梱 `npm-check-updates` を優先起動。`npm install -g @s2j/global-npm` 直後でも PATH に `ncu` がなくても動作。
* `global-npm install` が各 dependency の range を `npm view` で具体 version に解決し、`npm install -g <name>@<version>` を実行するよう変更 (ncu `check` が案内する global 更新と同等)
* `lib/resolve-ncu.cjs` を追加。同梱 tarball に `lib/` が含まれる
* publish 後: リポジトリの自己参照を `^2.1.2` に追従

## v2.1.1: 2026-06-09

### パッケージ本体

* 同梱 tarball: 自己参照 `@s2j/global-npm` を `^2.1.0` に更新
* publish 後: リポジトリの自己参照を `^2.1.1` に追従

### リポジトリ整備 (tarball 非同梱)

* 自己参照の range 運用を明文化: npm publish 済み latest を `^x.y.z` で明示 (`docs/layout.md`、`docs/npm-publish.md`)
* `docs/usage.md` を追加: 鮮度管理、各サブコマンドの役割、`sync` の要否、upstream 管理分と追加分の衝突
* README に「使い方」セクションを追加し、`docs/usage.md` に導線。`specs.md` にも同ファイルを追記
* 各種ドキュメントで用語を **実効 package.json** に統一 (`materialized`、誤訳「物理的なアーカイブ」を整理)
* textlint (prh) に合わせた表記調整 (README、`docs/`、`docsMod/` ほか)

## v2.1.0: 2026-06-08

### パッケージ本体

* **方式 B (overlay manifest)** を実装: upstream 同梱 `package.json` と `user-deps.json` をマージし、実効 `package.json` を生成。
* setup ディレクトリのデフォルトを `~/.config/global-npm` (Windows: `%APPDATA%\global-npm`) に変更。`GLOBAL_NPM_SETUP_DIR` で上書き可能。
* `global-npm sync`、`global-npm add` サブコマンドを追加。
* `add` の range 省略時は `npm view` で `^x.y.z` を設定。失敗時は `*` にフォールバック。
* `user-deps.json` の `devDependencies` を、実効 package.json にマージ (`install` は `dependencies` のみ)

### リポジトリ整備 (tarball 同梱)

* `lib/` モジュール分割 (`paths`, `pkg-io`, `sync-manifest`, `resolve-range`, `install-spec`)
* 仕様: [docsMod/mod-overlay-manifest.md](./docsMod/mod-overlay-manifest.md)
* ユニットテスト `test/sync-manifest.test.cjs`、`test/resolve-range.test.cjs` を追加

## v2.0.3: 2026-06-07

### パッケージ本体

* `global-npm install` が `dependencies` の semver 範囲付きで `npm install -g` を実行するよう変更 (`name@range` 形式)
* `global-npm update` 後の install で、既存 global パッケージも semver 範囲に沿って更新される
* `dependencies` の `@s2j/global-npm` 自己参照を `^2.0.2` に更新

### リポジトリ整備 (tarball 非同梱)

* 確定仕様8件を `docsMod/mod-*.md` から `docs/` に移行 ([specs.md](./docs/specs.md))
* GitHub Actions + npm OIDC による自動 publish を追加 (`.github/workflows/npm-publish.yml`)
* release tag と `package.json` version の一致検証を追加 (`scripts/verify-release-tag.cjs`)
* install、npm-publish 仕様書を semver 付き install、OIDC CI に合わせて更新
* 仕様準拠テスト (INS-01、INS-03等) を v2.0.3向けに更新

## v2.0.2: 2026-06-07

* `dependencies` に `@s2j/global-npm` 自己参照を追加 (`^2.0.1`)
* `global-npm install` (C 型) で CLI 自身も global install 対象に含め、自己更新を可能にする

## v2.0.1: 2026-06-07

* npm レジストリのルートメタデータ不整合を解消するため再 publish
* `package.json` の `bin` パス表記を修正 (`./bin/global-npm.cjs` → `bin/global-npm.cjs`)
* `repository.url` を `git+https://…` 形式に正規化

## v2.0.0: 2026-06-07

初回 npm publish 向け (`@s2j/global-npm@2.0.0`、`npm publish --access public`)。

### パッケージ本体

* npm パッケージ名を `@s2j/global-npm` に変更 (CLI コマンド名 `global-npm` は維持)
* Node.js CLI (`bin/global-npm.cjs`) を追加: `check`、`update`、`install` サブコマンド
* `global-npm install` を C 型 (Node 列挙 → `npm install -g <each>`) で実装。jq ランタイム不要
* `install-global.zsh` と `~/bin/global-npm` (Zsh ラッパー) を廃止
* v1の README の SETUP_DIR 問題を解消: CLI は package root (`npm install -g` 先) を setup ディレクトリとして参照
* ライセンスを MIT から GPL-3.0-or-later に変更 (`LICENSE` 追加)
* `ncu:check`、`ncu:update` に `--packageFile package.json` を追加 (開発用 scripts として維持)
* `ncu:install` を削除 (`global-npm install` に移行)
* README を v2向けに更新 (macOS、Windows 11対応、移行手順)
* tarball 同梱は `bin/`、`package.json`、`LICENSE`、`README.md` の4ファイル

### リポジトリ整備 (tarball 非同梱)

* CLI、テストを `.cjs` 化 (CommonJS 明示)
* ESLint、Prettier、仕様準拠テスト (`npm test`、58項目) を追加
* `npm run pack`、`pack:dry-run` で `./artifacts/` に tarball を生成
* Docs Lint 基盤 (`@s2j/docs-linter`、`lint:docs` script、`.textlintrc.json`、GitHub Actions workflow)

## v1.0.1: 2026-06-07

* `dependencies` を最新版に更新 (`npm-check-updates` ^22.2.3ほか)
* `ncu:check`、`ncu:update`、`ncu:install` に `--format time` を追加し、公開日時を表示
