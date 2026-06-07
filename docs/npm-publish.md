# Global npm Package Setup - npm 公開 (脱 OS 依存改修)

## 背景

v1では `"private": true` により npm 公開を禁止していた。
v2では `@s2j/global-npm` として npmjs に公開し、Mac / Windows 双方で `npm install -g` による導入・更新を可能にする。

## 決定事項

| 項目 | v1.0.0 | v2 |
|------|--------|-----|
| npm パッケージ名 | `global-npm-packages` | `@s2j/global-npm` |
| 公開 | `private: true` | 公開 (`private` 削除または `false`) |
| スコープ | なし | `@s2j` |
| バージョン | 1.0.x | 2.0.0 (メジャー bump) |
| レジストリ | — | https://registry.npmjs.org |

## 名称の可用性 (2026-06-07確認)

| 名称 | 状態 |
|------|------|
| `@s2j/global-npm` | 登録済み — v2.0.2 (2026-06-07) |
| `global-npm` (非スコープ) | 登録済み (別用途) — 使用不可 |
| `global-npm-setup` (非スコープ) | 未登録 — リポジトリ名として使用可 |

maintainer: `stein2nd` (`@s2j/docs-linter` と同一)。

## package.json (公開用)

```json
{
  "name": "@s2j/global-npm",
  "version": "2.0.2",
  "description": "Manage globally installed npm packages via package.json with ncu.",
  "author": "Koutarou ISHIKAWA <stein2nd@gmail.com>",
  "license": "GPL-3.0-or-later",
  "bin": {
    "global-npm": "bin/global-npm.cjs"
  },
  "files": [
    "bin/",
    "package.json",
    "LICENSE",
    "README.md"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/stein2nd/global-npm-setup.git"
  },
  "homepage": "https://github.com/stein2nd/global-npm-setup#readme",
  "bugs": {
    "url": "https://github.com/stein2nd/global-npm-setup/issues"
  },
  "keywords": [
    "npm",
    "global",
    "packages",
    "setup",
    "ncu",
    "npm-check-updates"
  ],
  "engines": {
    "node": ">=18"
  }
}
```

`private` フィールドは削除する。

## publish 手順

```sh
# 1. バージョン更新 (CHANGELOG 反映後)
npm version major   # 2.0.0

# 2. 公開内容の確認 (tarball は ./artifacts/ に出力)
npm run pack:dry-run

# 3. tarball 生成 (任意 — publish 前のローカル確認用)
npm run pack

# 4. 公開
npm publish --access public
```

`@s2j` はスコープ付きのため `--access public` が必要 (初回 publish 時)。

## CI / 自動 publish (将来)

`@s2j/docs-linter` と同様、GitHub Actions + npm OIDC による自動 publish を検討可能。

- tag push (`v2.0.0`) で publish
- `NPM_TOKEN` または OIDC trusted publishing

v2初期リリースは手動 publish でも可。

## ユーザー向けインストール

```sh
npm install -g @s2j/global-npm
global-npm install
```

## 更新

```sh
npm update -g @s2j/global-npm
global-npm install
```

または:

```sh
global-npm check    # @s2j/global-npm 自身の更新も表示される
global-npm update   # package.json 更新 (publish 済み版が前提)
global-npm install
```

## GitHub リポジトリ

| 項目 | 値 |
|------|-----|
| リポジトリ名 | `global-npm-setup` |
| 想定 URL | `https://github.com/stein2nd/global-npm-setup` |
| README | インストール手順 + OS 別セットアップ |

## トレードオフを受け入れる理由

v1廃止に伴い publish 運用が必須になるが、管理ツールとしての利便性と `@s2j/docs-linter` 更新管理の目的に合致するため受け入れる。

| トレードオフ | 受け入れ理由 |
|--------------|--------------|
| **npm publish 依存** — dependencies 一覧の変更は publish (または `npm link` 開発) が必要 | 一覧の正本を1箇所に固定し、自宅 macOS と勤務 Windows 11が同一 tarball を参照できる。`@s2j/docs-linter` と同じ ncu → publish → `npm update -g` フローで更新管理できる |
| **カスタム一覧** — 勤務先だけ別 pkg 集合にするには fork か方式 B が必要 | v2初期は方式 A (パッケージ同梱) で同期を優先。勤務先のみ `@s2j/docs-linter` を外す等の要件は **v2残タスク** として方式 B (`GLOBAL_NPM_SETUP_DIR` 等) を実装する |

## ステータス

**確定** — publish 済み (`@s2j/global-npm@2.0.2`)。`docs/npm-publish.md` に移行済み。
