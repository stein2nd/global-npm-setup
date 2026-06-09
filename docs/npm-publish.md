# Global npm Package Setup - npm 公開 (脱 OS 依存改修)

## 背景

v1では `"private": true` により npm 公開を禁止していました。
v2では `@s2j/global-npm` として npmjs に公開し、Mac、Windows 双方で `npm install -g` による導入および更新を可能にします。

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
| `@s2j/global-npm` | 登録済み: v2.0.2 (2026-06-07) |
| `global-npm` (非スコープ) | 登録済み (別用途): 使用不可 |
| `global-npm-setup` (非スコープ) | 未登録: リポジトリ名として使用可 |

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

`private` フィールドは削除します。

## publish 手順

```sh
# 1. バージョン更新 (CHANGELOG 反映後)
npm version major   # 2.0.0

# 2. 公開内容の確認 (tarball は ./artifacts/ に出力)
npm run pack:dry-run

# 3. tarball 生成 (任意: publish 前のローカル確認用)
npm run pack

# 4. 公開
npm publish --access public
```

`@s2j` はスコープ付きのため `--access public` が必要です (初回 publish 時)。

### 自己参照 `@s2j/global-npm` の更新

`dependencies` の自己参照は、**npm publish 済みの最新バージョン** を `^x.y.z` で明示する運用とします ([layout.md](./layout.md))。

```sh
# publish 後: registry 上の latest を確認
npm view @s2j/global-npm version   # 例: 2.1.0

# package.json の dependencies を更新
# "@s2j/global-npm": "^2.1.0"
```

開発中に `version` だけ先に bump している間は、自己参照は前回 publish 版のままにします。未 publish の版 (`^2.1.1` など) を書かないようにしてください。

## CI、自動 publish

`@s2j/docs-linter` と同様、GitHub Actions + npm OIDC (Trusted Publishing) による自動 publish を利用します。

| 項目 | 内容 |
|------|------|
| workflow | `.github/workflows/npm-publish.yml` |
| 認証 | npm Trusted Publishing (OIDC): `stein2nd/global-npm-setup`、`npm-publish.yml` |
| トリガー | tag push (`v*`) または手動 dispatch (dry-run デフォルト) |
| 前提 | npm 側で Trusted Publisher 登録済み、`package.json` version と tag が一致 |

```sh
# tag push で publish + GitHub Release
git tag v2.0.3
git push origin v2.0.3
```

手動 dry-run とは、GitHub Actions → **Publish to npm** → Run workflow → `dry_run: true` という操作のことです。

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

v1廃止に伴い publish 運用が必須になるが、管理ツールとしての利便性と `@s2j/docs-linter` 更新管理の目的に合致するため、受け入れます。

| トレードオフ | 受け入れ理由 |
|--------------|--------------|
| **npm publish 依存:** dependencies 一覧の変更は publish (または `npm link` 開発) が必要 | 一覧の正本を1箇所に固定し、自宅 macOS と勤務先 Windows 11が同一 tarball を参照できる。`@s2j/docs-linter` と同じ ncu → publish → `npm update -g` フローで更新管理できる。 |
| **カスタム一覧:** 勤務先だけ別 pkg 集合にするには fork か方式 B が必要 | v2.1で overlay manifest を実装。`user-deps.json`、`global-npm add` で追加分を管理し、upstream は `npm update -g @s2j/global-npm` で同期する。 |

## ステータス

**確定:** publish 済み (`@s2j/global-npm@2.1.3`)。自己参照の range 運用を `docs/layout.md` に追記済み。
