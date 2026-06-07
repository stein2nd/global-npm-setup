# 📦 Global npm Package Installer

このディレクトリは、Node.js の **グローバル npm パッケージ管理** を `package.json` で一元化する仕組みです。
Zsh スクリプト `install-global.zsh` を用いて、（`nvm use バージョン && nvm alias default バージョン` 等によって）有効化された node.js のバージョン下に対して、これらのパッケージを一括インストールできます。

---

## 📁 構成ファイル

- `package.json`
  管理したいグローバル npm パッケージとバージョン（`^16.0.0` など）を記述します。
- `install-global.zsh`
  グローバルにパッケージをインストールするスクリプトです。

---

## 🚀 セットアップ手順

### 1. `jq` のインストール（未導入の場合）

```sh
brew install jq
```

### 2. `package.json` を生成（初回のみ）

```sh
npm init -y
```

その後、package.json に以下を追記または修正してください：

```json
"private": true,
"scripts": {
  "ncu:check": "ncu -g --format time",
  "ncu:update": "ncu -g --format time -u",
  "ncu:install": "ncu -g --format time && npm install -g"
}
```

### 3. 現在のグローバルパッケージを dependencies に反映

```sh
npm ls -g --depth=0 --json > tmp.json
jq '.dependencies | to_entries | map({ key: .key, value: ("^" + (.value.version | tostring)) }) | from_entries' tmp.json > deps.json
jq '.dependencies = input' package.json deps.json > package.tmp.json && mv package.tmp.json package.json
rm tmp.json
```

### 4. ユーザー専用のローカル実行スクリプトディレクトリに「グローバル・エイリアス」を作る

`mkdir -p ~/bin` で、ユーザー専用のローカル実行スクリプトディレクトリを作成します。
続いて、下記内容で `global-npm` を作成します。

```
#!/bin/zsh

# このスクリプト自身のディレクトリを SETUP_DIR として使用
SETUP_DIR="${0:A:h}"

case "$1" in
  check)
    (cd "$SETUP_DIR" && npm run ncu:check)
    ;;
  update)
    (cd "$SETUP_DIR" && npm run ncu:update)
    ;;
  install)
    (cd "$SETUP_DIR" && npm run ncu:install)
    ;;
  *)
    echo "Usage: global-npm [check|update|install]"
    exit 1
    ;;
esac
```

作成したファイルを `chmod +x ~/bin/global-npm` で実行権限を付与します。

続いて、`~/.zshrc` に下記を追加し、環境変数 PATH に対して、作成したディレクトリを追加します。

```
path=(
  $HOME/bin(N-/)
  $path
)
```

---

## 🔧 パッケージの更新（npm-check-updates 使用）

1. アップデート確認

`global-npm check`

2. バージョン更新（package.json を書き換える）

`global-npm update`

3. 新バージョンで再インストール

`global-npm install`

---

## 📌 補足
- `package.json` の `"private": true` は、意図しない npm 公開を防ぐ設定です。
- この仕組みは、複数の Mac や開発環境間でグローバル npm パッケージを同期するのに非常に便利です。
	- Git 管理して、他のマシンでも簡単に再現できます（GitHub: [stein2nd/global-npm-setup](https://github.com/stein2nd/global-npm-setup)）。
- このセットアップは `nvm` でバージョン管理された Node.js の各バージョンに対して適用されます。

## ライセンス

GPL-3.0-or-later — 詳細は [LICENSE](./LICENSE) を参照してください。
