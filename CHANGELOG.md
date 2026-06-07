# Global npm Package Setup - CHANGELOG

## v2.0.3: 2026-06-07

### パッケージ本体

* `global-npm install` が `dependencies` の semver 範囲付きで `npm install -g` を実行するよう変更 (`name@range` 形式)
* `global-npm update` 後の install で、既存 global パッケージも semver 範囲に沿って更新される
* `dependencies` の `@s2j/global-npm` 自己参照を `^2.0.2` に更新

### リポジトリ整備 (tarball 非同梱)

* 確定仕様8件を `docsMod/mod-*.md` から `docs/` へ移行 ([specs.md](./docs/specs.md))
* GitHub Actions + npm OIDC による自動 publish を追加 (`.github/workflows/npm-publish.yml`)
* release tag と `package.json` version の一致検証を追加 (`scripts/verify-release-tag.cjs`)
* install / npm-publish 仕様書を semver 付き install・OIDC CI に合わせて更新
* 仕様準拠テスト (INS-01 / INS-03 等) を v2.0.3 向けに更新

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
* Node.js CLI (`bin/global-npm.cjs`) を追加 — `check` / `update` / `install` サブコマンド
* `global-npm install` を C 型 (Node 列挙 → `npm install -g <each>`) で実装。jq ランタイム不要
* `install-global.zsh` と `~/bin/global-npm` (Zsh ラッパー) を廃止
* v1の README の SETUP_DIR 問題を解消 — CLI は package root (`npm install -g` 先) を setup ディレクトリとして参照
* ライセンスを MIT から GPL-3.0-or-later に変更 (`LICENSE` 追加)
* `ncu:check` / `ncu:update` に `--packageFile package.json` を追加 (開発用 scripts として維持)
* `ncu:install` を削除 (`global-npm install` へ移行)
* README を v2 向けに更新 (macOS / Windows 11対応、移行手順)
* tarball 同梱は `bin/`、`package.json`、`LICENSE`、`README.md` の4ファイル

### リポジトリ整備 (tarball 非同梱)

* CLI / テストを `.cjs` 化 (CommonJS 明示)
* ESLint / Prettier、仕様準拠テスト (`npm test`、58項目) を追加
* `npm run pack` / `pack:dry-run` で `./artifacts/` に tarball を生成
* Docs Lint 基盤 (`@s2j/docs-linter`、`lint:docs` script、`.textlintrc.json`、GitHub Actions workflow)

## v1.0.1: 2026-06-07

* `dependencies` を最新版に更新 (`npm-check-updates` ^22.2.3 ほか)
* `ncu:check` / `ncu:update` / `ncu:install` に `--format time` を追加し、公開日時を表示
