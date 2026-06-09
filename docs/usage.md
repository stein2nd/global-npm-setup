# Global npm Package Setup - Usage

利用側がグローバル npm モジュールの **鮮度** (バージョン範囲と実インストール) を管理するための使い方です。
従来から使える `check`、`update`、`install` と、v2.1で追加した `add` / `sync` の役割を整理します。

関連: [layout.md](./layout.md) (ファイル構成)、[cli.md](./cli.md) (サブコマンド仕様)

## 何を管理しているか

v2.1以降、一覧は次の2ヵ所に分かれます。

| 種別 | 置き場所 | 誰が更新するか |
|------|----------|----------------|
| **upstream 管理分** | `@s2j/global-npm` 同梱の公式 `package.json` | `npm update -g @s2j/global-npm` で取り込む |
| **利用側の追加分** | `~/.config/global-npm/user-deps.json` 等 | `global-npm add` または手編集 |

`check`、`update`、`install` が読むのは、これらをマージした **実効 package.json** (`$SETUP_DIR/package.json`) です。
鮮度管理は「実効 package.json の range を最新に保ち、`install` で global 環境に反映する」ことと認識してください。

## コマンドと鮮度への役割

| コマンド | 従来から | 主な役割 (鮮度の観点) |
|----------|--------|------------------------|
| `check` | ✅ | 実効 package.json を前提に、更新候補を **確認するだけ** (range は変えない) |
| `update` | ✅ | 実効 package.json の range を ncu で **最新に書き換える** |
| `install` | ✅ | 実効 package.json の `dependencies` を **global に実インストール** |
| `add` | v2.1で追加 | 追加分を `user-deps.json` に登録し、実効 package.json を更新 |
| `sync` | v2.1で追加 | upstream + 追加分をマージし、実効 package.json を **再生成** |

### 定番フロー: `check` → `update` → `install`

```sh
global-npm check
global-npm update
global-npm install
```

| 段階 | やること | 鮮度への意味 |
|---|---|---|
| `check` | registry 上の新しい版があるか表示 | 「何が古いか」を把握。ファイルは (ncu 以外は) 変えない。 |
| `update` | 実効 package.json の semver range を更新 | 「次に入れる版」の **宣言** を新しくする。 |
| `install` | `npm install -g` を一括実行 | 宣言どおり **実際の global 環境** を更新する。 |

従来の `ncu:check`、`ncu:update`、install 部分と同じ考え方です。
違いは、操作対象がリポジトリの1ファイルではなく **実効 package.json** になった点だけです。

`install` だけでは range は上がりません。`update` だけでは global 環境は変わりません。
鮮度を保つには、通常は3つをこの順で使います。

### `add`: 追加分の登録

利用側だけが使いたいモジュールを **追加分** として登録します。

```sh
global-npm add @s2j/docs-linter@^1.0.16
global-npm add typescript          # range 省略時は npm view → ^x.y.z (失敗時は *)
global-npm add eslint --dev        # devDependencies (ncu 対象、install はしない)
```

| 項目 | 内容 |
|------|------|
| 書き込み先 | `user-deps.json`。 |
| その後 | 内部で `sync` が走り、実効 package.json に反映。 |
| `install` | **自動では実行しない**。global に入れるには続けて `global-npm install`。 |

追加分の **初回登録** に使います。すでに一覧にあるパッケージの range を ncu で上げるのは `update` の仕事です。

### `sync`: 実効 package.json の再生成

upstream 正本と `user-deps.json` をマージし、実効 package.json を作り直します。

```sh
global-npm sync
global-npm sync --dry-run   # 書き込みなしで差分だけ表示
```

| 使う場面 | 例 |
|----------|-----|
| マージ結果だけ確認したい | `sync --dry-run` |
| `user-deps.json` を手編集した直後 | `sync` (または次の `check` 等で自動 sync) |
| upstream を取り込んだ直後で、中身を確定させたい | `npm update -g @s2j/global-npm` のあと |

`sync` 単体では ncu も `npm install -g` も走りません。**一覧の合成** だけです。

## 毎回、明示的に `sync` を実行する必要があるか

**通常は不要です。**

次のコマンドは実行前に自動で `sync` します。

* `check`
* `update`
* `install`
* `add` (追記のあと)

したがって、定番の鮮度更新は、下記だけで足ります。

```sh
global-npm check
global-npm update
global-npm install
```

**明示的な `sync` が向くのは、下記のときです。**

* マージ差分を **dry-run で確認** したい (`sync --dry-run`)
* `user-deps.json` をエディターで編集し、`check` 等をまだ実行していない
* upstream 取り込み後、実効 package.json の中身だけ先に確定させたい

`npm update -g @s2j/global-npm` だけ実行して CLI をまだ触っていない場合も、次の `check` (など) のときに自動 sync されるため、必ずしも `sync` 単体実行はいりません。

## upstream 管理分と追加分の衝突

同じパッケージ名が upstream と追加分の両方に関わるとき、マージ規則は次のとおりです。

### 優先順位 (高い順)

1. **`user-deps.json` に同名がある** → その range で **ピン留め** (upstream の新 range より優先)
2. **実効 package.json が前回 upstream と異なる** → `global-npm update` 済みとみなし **維持**
3. **それ以外** → upstream の新 range で **上書き** (未 `update` の追従)

### 起こりうるパターン

| 状況 | 結果 |
|------|------|
| 追加分だけのパッケージ (`typescript` 等) | upstream 更新でも **消えない** |
| upstream 管理分で、まだ `update` していない | upstream 更新後の最初の `check` 等で **新 range に追従** |
| upstream 管理分で、すでに `update` 済み | 利用側が選んだ range を **維持** |
| upstream 公式一覧から削除された (upstream 管理だった) | 実効 package.json から **削除** |
| upstream から削除されたが、追加分として `user-deps` に残している | **維持** |
| upstream パッケージを古い版に固定したい | `user-deps.json` に同名で range を書く (ピン留め) |

### 衝突を避けるコツ

* **追加分だけ** にしたいモジュール → `global-npm add` で `user-deps.json` に載せる
* **upstream 公式と同じ名前** を追加分に書く → ピン留めになる。意図的でなければ避ける
* upstream 更新後に「公式の新 range に乗せたい」→ `user-deps` からその名前を外し、`check` → `update` → `install`
* 「自分で `update` した range を維持したい」→ そのまま `check` → `install` (`update` は不要な場合も)

## よくあるシナリオ

### 定期メンテナンス (従来と同じ)

```sh
global-npm check
global-npm update
global-npm install
```

### 初めて追加分を入れる

```sh
global-npm add @s2j/docs-linter@^1.0.16
global-npm install
```

### `@s2j/global-npm` 本体を upstream 更新したあと

```sh
npm update -g @s2j/global-npm
global-npm check      # 内部で sync。未 update 分は新 upstream に追従
global-npm update     # 必要なら
global-npm install
```

### upstream 取り込み前に差分だけ見る

```sh
npm update -g @s2j/global-npm
global-npm sync --dry-run
```

## 関連ドキュメント

* [layout.md](./layout.md): 実効 package.json、`user-deps.json`、マージ仕様
* [cli.md](./cli.md): 各サブコマンドの実装詳細
* [install.md](./install.md): `install` が `dependencies` のみを対象とする理由
* [README.md](../README.md): セットアップと v2.0.x からの移行
