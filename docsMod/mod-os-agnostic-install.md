# Global npm Package Installer - install 方式（脱 OS 依存改修）

## 背景

`global-npm install` の実装方式について、v1 の jq 列挙（A 型）、setup ディレクトリでの `npm install -g`（B 型）、Node 列挙（C 型）を比較検討した。
**ncu との整合** および **依存 CLI を PATH に載せる** ことを最優先し、**C 型を採用** する。

## 方式の比較（要約）

| 方式 | 概要 | CLI on PATH | ncu 整合 | OS 非依存 |
|------|------|-------------|----------|-----------|
| A. jq 列挙 | `npm install -g $(jq …)` | ◎ | ◎ | △（jq + シェル） |
| B. setup で `npm install -g` | メタ pkg のみ global install | △ | △ | ◎ |
| **C. Node 列挙** | `package.json` を Node で読み、明示 global install | ◎ | ◎ | ◎ |

### B 型を採用しない理由

`npm install -g`（引数なし）は **カレント package を 1 つ global install** する npm の意味論であり、`dependencies` に列挙した CLI ツール（`textlint`、`ncu`、`s2j-docs-linter` 等）の `bin` を `{prefix}/bin` にリンクしない。

v1 の `install-global.zsh` は B 型だったが、実質的な本番フローは `ncu:install`（A 型）であった。

## 決定事項: C 型（Node 列挙）

### 挙動

1. setup ディレクトリの `package.json` を Node.js で読み込む。
2. `dependencies` の **キー（パッケージ名）** を列挙する。
3. `npm install -g <pkg1> <pkg2> …` を実行する。

v1 の jq 処理と **npm 上の意味論は同一**。実装を Node に移すだけである。

### jq について

- **ランタイム依存として jq は不要**（C 型は Node 標準 API のみ）。
- Windows 11 でも jq を必須にしてよいが、ユーザー側の追加インストールは求めない。
- 開発者が手元で `package.json` を触る際に jq を使うのは任意（README の初期取り込み手順等）。

## ncu との整合

3 サブコマンドは **同一の `package.json`・同一の `dependencies`** を真実の源とする。

| サブコマンド | 操作対象 | ncu / npm の入力 |
|--------------|----------|------------------|
| `global-npm check` | 更新確認のみ | `ncu -g --packageFile <setup>/package.json` |
| `global-npm update` | バージョン範囲の書き換え | `ncu -g -u --packageFile <setup>/package.json` |
| `global-npm install` | グローバルインストール | `dependencies` キー列挙 → `npm install -g …` |

### 整合のポイント

- **check / update** が読むパッケージ集合 = **install** が入れるパッケージ集合（いずれも `dependencies`）。
- `devDependencies` は対象外（global install しない）。
- スコープ付き名（`@s2j/docs-linter`）も `dependencies` キーとしてそのまま `npm install -g` に渡す。
- `update` で書き換えた semver 範囲が、直後の `install` で反映される。

### 定番フロー

```sh
global-npm check    # 更新候補の確認（package.json 不変）
global-npm update   # package.json の semver 範囲を更新
global-npm install  # 更新後の範囲で各 pkg を global install
```

`global-npm install` 単体では ncu は実行しない（v1 `ncu:install` が ncu + install を合体していた点からの改善）。

## 実装概要

```js
const pkgPath = path.join(setupDir, 'package.json');
const { dependencies = {} } = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const names = Object.keys(dependencies);

if (names.length === 0) {
  console.error('No dependencies to install.');
  process.exit(1);
}

spawnSync('npm', ['install', '-g', ...names], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});
```

### エッジケース

| ケース | 対応 |
|--------|------|
| `dependencies` が空 | エラー終了（exit 1） |
| 自己参照 `@s2j/global-npm` | 他 pkg と同様に列挙（自身も再インストール） |
| Windows | `shell: true` で `npm.cmd` を解決 |
| インストール失敗 | npm の exit code をそのまま返す |

## v1 からの移行

| v1 | v2（C 型） |
|----|------------|
| `ncu:install` 内 `jq …` | Node `Object.keys(dependencies)` |
| `install-global.zsh` | 廃止（B 型。CLI `global-npm install` に統合） |
| `npm run ncu:install` | `global-npm install`（ncu 非合体） |

## 関連ドキュメント

- [mod-os-agnostic-cli.md](./mod-os-agnostic-cli.md) — サブコマンド全体
- [mod-os-agnostic-layout.md](./mod-os-agnostic-layout.md) — setup ディレクトリ（package.json 配置）

## ステータス

**確定** — 実装完了後 `docs/install.md` へ移動する。
