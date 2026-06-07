# Global npm Package Setup - 命名 (脱 OS 依存改修)

## 背景

v1ではプロジェクト名 `global-npm-packages`、ローカル配置 `~/dotfiles/setup/`、Zsh ラッパー `~/bin/global-npm` という構成だった。
v2では Windows 11 (勤務先) でも同じ操作感で使えるよう npm パッケージとして CLI を配布し、`@s2j/docs-linter` と同様の更新管理を行う。

## 決定事項

| レイヤ | v1.0.0 | v2 (決定) |
|--------|--------|------------|
| GitHub リポジトリ名 |  (dotfiles 内 `setup/`) | `global-npm-setup` |
| ローカル配置 (推奨) | `~/dotfiles/setup/` | `~/dotfiles/global-npm-setup/` |
| npm パッケージ名 | `global-npm-packages` (`private: true`) | `@s2j/global-npm` |
| CLI コマンド名 | `global-npm` (`~/bin` ラッパー) | `global-npm` (`bin` フィールド) |
| 表示名 (README 等) | Global npm Package Setup | 変更なし |

## 命名の根拠

### リポジトリ / ディレクトリ: `global-npm-setup`

* 「グローバル npm パッケージのセットアップ用プロジェクト」であることが伝わる。
* 日常操作で使う CLI 名 `global-npm` と役割を分離できる。
* GitHub 上の同名リポジトリ (`jomellikesturtles/global-npm-packages` 等) とは別名となり、検索時の混同を減らす。

### npm: `@s2j/global-npm`

* 非スコープ名 `global-npm` は [dracupid/global-npm](https://www.npmjs.com/package/global-npm) が使用中のため不可。
* `@s2j/global-npm` は未登録。`@s2j/docs-linter` と同一 maintainer (`stein2nd`) で運用可能。
* コマンド名 `global-npm` と npm パッケージ名を近付け、インストール後の操作感を v1と一致させる。

### CLI: `global-npm`

* v1の `global-npm check|update|install` をそのまま維持する。
* `~/bin/global-npm` ラッパーは v2では不要 (`npm install -g @s2j/global-npm` で代替)。

## package.json への反映 (v2)

```json
{
  "name": "@s2j/global-npm",
  "version": "2.0.0",
  "description": "Manage globally installed npm packages via package.json with ncu.",
  "bin": {
    "global-npm": "./bin/global-npm.js"
  },
  "files": [
    "bin/",
    "package.json",
    "LICENSE"
  ]
}
```

## 移行

| v1 | v2への対応 |
|----|-------------|
| `~/dotfiles/setup/` | リネームまたは clone 先を `~/dotfiles/global-npm-setup/` に |
| `~/bin/global-npm` | 削除可 (npm グローバル `bin` が PATH に入っていれば不要) |
| `install-global.zsh` | 廃止 (CLI `global-npm install` に統合) |
| `global-npm-packages` | `@s2j/global-npm` にリネーム |

## 未決定 / 将来検討

* GitHub org `s2j` 配下に置くか、`stein2nd/global-npm-setup` とするか (現時点では `stein2nd` 想定)。
* dotfiles 内サブモジュール / subtree として管理するか。

## ステータス

**確定** — `docs/naming.md` に移行済み。
