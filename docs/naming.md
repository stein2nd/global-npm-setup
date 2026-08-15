# Global npm Package Setup - 命名

Global Package Setup シリーズにおける、本プロジェクトの名前の決まりです。

## シリーズと本プロジェクト

| レイヤ | 名前 |
| --- | --- |
| シリーズ | Global Package Setup |
| 本プロジェクト (表示名) | Global npm Package Setup |
| 姉妹プロジェクト | Global Composer Setup (`global-composer-setup`) |
| アプリケーション類型 | CLUI ユーティリティ |

シリーズ名は「グローバルに入れるパッケージを、マニフェストでセットアップする」ことを示します。
パッケージマネージャーごとにリポジトリを分け、CLUI の操作感はそろえます。

## 決定事項

| レイヤ | v1.0.0 | v2以降 (維持) |
| --- | --- | --- |
| GitHub リポジトリ名 | (dotfiles 内 `setup/`) | `global-npm-setup` |
| ローカル配置 (推奨) | `~/dotfiles/setup/` | `~/dotfiles/global-npm-setup/` |
| npm パッケージ名 | `global-npm-packages` (`private: true`) | `@s2j/global-npm` |
| CLUI コマンド名 | `global-npm` (`~/bin` ラッパー) | `global-npm` (`bin` フィールド) |
| 表示名 (README 等) | Global npm Package Setup | 変更なし |

Vite 再構成後も、**リポジトリ名、npm 名、コマンド名は変えません。**
変わるのは成果物のパス (`dist/` 配下) です。

## 命名の根拠

### リポジトリ、ディレクトリ: `global-npm-setup`

* 「グローバル npm パッケージのセットアップ用プロジェクト」であることが伝わる。
* 日常操作で使う CLUI 名 `global-npm` と、リポジトリの役割を分離できる。
* シリーズの姉妹 `global-composer-setup` と、`global-<ecosystem>-setup` で並ぶ。
* GitHub 上の同名リポジトリ (`jomellikesturtles/global-npm-packages` 等) とは別名となり、検索時の混同を減らす。

### npm: `@s2j/global-npm`

* 非スコープ名 `global-npm` は [dracupid/global-npm](https://www.npmjs.com/package/global-npm) が使用中のため不可。
* `@s2j/global-npm` は登録済み。`@s2j/docs-linter` と同一 maintainer (`stein2nd`) で運用する。
* コマンド名 `global-npm` と npm パッケージ名を近付け、インストール後の操作感を v1と一致させる。

### CLUI: `global-npm`

* v1の `global-npm check|update|install` を維持し、v2.1で `sync`、`add`、v2.2で `list` を足した。
* `~/bin/global-npm` ラッパーは不要 (`npm install -g @s2j/global-npm` で `{prefix}/bin` に載る)。

## package.json への反映

現行 (v2.2) は `bin/global-npm.cjs` です。Vite 再構成後の想定は、下記です。

```json
{
  "name": "@s2j/global-npm",
  "description": "Manage globally installed npm packages via package.json with ncu.",
  "bin": {
    "global-npm": "./dist/global-npm.js"
  },
  "files": [
    "dist/",
    "package.json",
    "LICENSE",
    "README.md"
  ]
}
```

`name` と `bin.global-npm` は公開契約です。ビルド成果のファイル名だけが実装詳細です。

## ソース上の名前 (FOP)

実装の再構成では、次の方針で名前を付けます。

| 対象 | 方針 |
| --- | --- |
| 純関数 | 動詞句 (`mergeDependencies`、`toGlobalInstallSpec`) |
| データオブジェクト | 名詞 (`SetupContext`)。クラスにしない |
| ユースケース関数 | サブコマンドに対応 (`handleCheck`、`handleInstall`) |
| アダプタ | I/O が名前から分かる (`readJson`、`runNpm`) |

Clean Coding どおり、略語やレイヤ名の接頭辞 (`I`、`Impl`、`Service`) は使いません。

## 移行 (v1との対応)

| v1 | v2以降 |
| --- | --- |
| `~/dotfiles/setup/` | リネームまたは clone 先を `~/dotfiles/global-npm-setup/` に |
| `~/bin/global-npm` | 削除可 (npm グローバル `bin` が PATH に入っていれば不要) |
| `install-global.zsh` | 廃止 (CLUI `global-npm install` に統合) |
| `global-npm-packages` | `@s2j/global-npm` にリネーム |

## 未決定、将来検討

* GitHub organization `s2j` 配下に置くか、`stein2nd/global-npm-setup` とするか (現時点では `stein2nd` 想定)。
* dotfiles 内サブモジュール、subtree として管理するか。
* 姉妹 `global-composer-setup` とのドキュメント相互リンクの置き方。

## 関連ドキュメント

* [specs.md](./specs.md): シリーズ位置付けと設計方針
* [layout.md](./layout.md): リポジトリ構成 (Vite)
* [npm-publish.md](./npm-publish.md): 公開名と `files`

## ステータス

**確定:** 2026-08-15。以前の版は [archive/v2-specs/naming.md](./archive/v2-specs/naming.md)。
