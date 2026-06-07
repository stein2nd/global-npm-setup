# 📦 Global npm Package Setup

Node.js の **グローバル npm パッケージ管理** を `package.json` で一元化する CLI です。
macOS / Windows 11で同じ `global-npm check|update|install` フローを使えます。

GitHub: [stein2nd/global-npm-setup](https://github.com/stein2nd/global-npm-setup)

## コマンド

```
global-npm check    # グローバルパッケージの更新確認 (ncu)
global-npm update   # package.json のバージョン範囲を更新 (ncu -u)
global-npm install  # dependencies を列挙して npm install -g を実行
```

定番フロー:

```sh
global-npm check
global-npm update
global-npm install
```

`install` 単体では ncu は実行しません。

## セットアップ

`@s2j/global-npm` は npm パッケージとして利用することを推奨します。

### macOS での下準備

Homebrew、Node.js v18以降が未導入の場合は、先にインストールしてください。

1. `node -v` を実行する。
   1. 失敗する場合は、`brew install node` または `nvm install` などで、Node.js をインストールする。
2. `node --version`、`npm --version` でバージョンを確認する。
3. 移行する場合、`~/bin/global-npm` (Zsh ラッパー) が PATH に残っていないか確認する。残っている場合は削除する (npm グローバル bin の `global-npm` と競合する場合がある)。

推奨配置: `~/dotfiles/global-npm-setup/`  
npm グローバル bin: 通常 `$(npm prefix -g)/bin` (nvm 利用時はその Node に紐づく prefix)

### Windows での下準備

Node.js v18以上 (LTS 推奨) が未導入の場合は、先にインストールしてください。[fnm](https://github.com/Schniz/fnm)、[nvm-windows](https://github.com/coreybutler/nvm-windows)、[Volta](https://volta.sh/)、公式インストーラのいずれでもかまいません。

1. `node -v` を実行する。
   1. 失敗する場合は、[Node.js 公式サイト](https://nodejs.org/ja) などから Node.js をインストールする。
   2. PowerShell で `where.exe node`、`where.exe npm` を実行して、Node.js が正常にインストールされているか確認する。
2. PowerShell でスクリプトの実行権限を `Get-ExecutionPolicy` (勤務先 PC の場合は `Get-ExecutionPolicy -List`) で確認する。
   1. `Restricted` の場合は、`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` を実行する。
   2. あらためて `Get-ExecutionPolicy` で `RemoteSigned` になっているか確認する。
3. `node --version`、`npm --version` でバージョンを確認する。
4. PowerShell を再起動後、`global-npm check` (導入後) で PATH を確認する。

推奨配置: `%USERPROFILE%\dotfiles\global-npm-setup\`  
npm グローバル bin: `%AppData%\npm` (通常 PATH に含まれる)

### npm パッケージの導入

初回 publish 後:

```sh
npm install -g @s2j/global-npm
global-npm install
```

### 開発 — リポジトリ clone

```sh
git clone https://github.com/stein2nd/global-npm-setup.git
cd global-npm-setup
npm link
global-npm install
```

## package.json の役割

同梱の `package.json` の `dependencies` が、グローバルインストール対象パッケージ一覧です。
`check` / `update` / `install` はいずれもこの一覧を参照します。

一覧の変更はリポジトリ更新 → npm publish → `npm update -g @s2j/global-npm` で各環境に反映します。

## 開発用 scripts

CLI 実装のデバッグ用に、リポジトリ root から次の npm scripts も使えます。

```sh
npm run ncu:check
npm run ncu:update
```

## グローバルパッケージ一覧の初期取り込み (任意)

手元のグローバル npm パッケージを `dependencies` に反映する作業です。CLI 実行には jq は不要ですが、この作業で jq を使う場合は任意です。

```sh
npm ls -g --depth=0 --json > tmp.json
jq '.dependencies | to_entries | map({ key: .key, value: ("^" + (.value.version | tostring)) }) | from_entries' tmp.json > deps.json
jq '.dependencies = input' package.json deps.json > package.tmp.json && mv package.tmp.json package.json
rm tmp.json deps.json
```

## 移行 (v1→ v2)

| v1 | v2 |
|----|-----|
| `~/bin/global-npm` (Zsh) | 廃止 — `npm install -g @s2j/global-npm` |
| `install-global.zsh` | 廃止 — `global-npm install` |
| `ncu:install` (jq 列挙) | `global-npm install` (Node 列挙) |
| SETUP_DIR = ラッパー配置 dir (`~/bin`) | package root (npm global install 先) を参照 |

## ライセンス

GPL-3.0-or-later — 詳細は [LICENSE](./LICENSE) を参照してください。
