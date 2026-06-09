# Global npm Package Setup - install 方式 (脱 OS 依存改修)

## 背景

`global-npm install` の実装方式について、v1の jq 列挙 (A 型)、setup ディレクトリでの `npm install -g` (B 型)、Node 列挙 (C 型) を比較検討しました。
**ncu との整合** および **依存 CLI を PATH に載せる** ことを最優先し、**C 型を採用** します。

v2.1以降、install の入力は **実効 `package.json`**、`$SETUP_DIR/package.json` です ([layout.md](./layout.md))。

## 方式の比較 (要約)

| 方式 | 概要 | CLI on PATH | ncu 整合 | OS 非依存 |
|------|------|-------------|----------|-----------|
| A. jq 列挙 | `npm install -g $(jq …)` | ◎ | ◎ | △ (jq + シェル) |
| B. setup で `npm install -g` | メタ pkg のみ global install | △ | △ | ◎ |
| **C. Node 列挙** | `package.json` を Node で読み、明示 global install | ◎ | ◎ | ◎ |

### B 型を採用しない理由

`npm install -g` (引数なし) は **カレント package を1つ global install** する npm の意味論であり、`dependencies` に列挙した CLI ツール (`textlint`、`ncu`、`s2j-docs-linter` 等) の `bin` を `{prefix}/bin` にリンクしません。

## 決定事項: C 型 (Node 列挙)

### 挙動

1. `syncManifest()` で実効 `package.json` を最新化する。
2. 実効 package.json の `dependencies` を Node.js で読み込む。
3. `npm install -g <name>@<range>…` を実行する。

v1の jq 処理と **npm 上の意味論は同一** です。実装を Node に移すだけです。

### `devDependencies`: v2.1 / B 案

| 操作 | `dependencies` | `devDependencies` |
|------|----------------|-------------------|
| `check` / `update` (ncu) | 対象 | 対象。実効 package.json にマージ済みの分 |
| `install` | 対象 | **対象外** |

`user-deps.json` の `devDependencies` は ncu 管理用に実効 package.json にマージするが、global install はしません。

## ncu との整合

| サブコマンド | 操作対象 | ncu / npm の入力 |
|--------------|----------|------------------|
| `global-npm check` | 更新確認のみ | 実効 `package.json` |
| `global-npm update` | バージョン範囲の書き換え | 実効 `package.json` |
| `global-npm install` | グローバルインストール | 実効 package.json の **dependencies** のみ |

### 整合のポイント

* **install** が入れるパッケージ集合 = 実効 package.json の `dependencies`。
* **check / update** は実効 package.json の `dependencies` + `devDependencies` を読む。
* スコープ付き名称も `name@range` 形式で `npm install -g` に渡す (例: `@s2j/docs-linter@^1.0.16`)。
* `update` で書き換えた semver 範囲が、直後の `install` で反映される。

### 定番フロー

```sh
global-npm check    # sync → 更新候補の確認
global-npm update   # 実効 package.json の semver 範囲を更新
global-npm install  # 更新後の範囲で各 pkg を global install
```

`global-npm install` 単体では ncu は実行しません。

## 実装概要

```js
prepare(); // syncManifest()
const dependencies = readDependencies(materializedPkgPath);
const specs = Object.entries(dependencies).map(([name, range]) =>
  toGlobalInstallSpec(name, range),
);

if (specs.length === 0) {
  console.error('No dependencies to install.');
  process.exit(1);
}

spawnSync('npm', ['install', '-g', ...specs], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});
```

### エッジケース

| ケース | 対応 |
|--------|------|
| `dependencies` が空 | エラー終了 (`exit code: 1`) |
| 自己参照 `@s2j/global-npm` | 他 pkg と同様に列挙 (自身も再インストール) |
| Windows | `shell: true` で `npm.cmd` を解決 |
| インストール失敗 | npm の exit code をそのまま返す |

## 移行

| 版 | setup / install 入力 |
|----|----------------------|
| v1 | jq 列挙 |
| v2.0.x | package root の `package.json` |
| v2.1 | 実効 package.json (`$SETUP_DIR/package.json`) |

## 関連ドキュメント

* [cli.md](./cli.md): サブコマンド全体
* [layout.md](./layout.md): overlay manifest ・`$SETUP_DIR`

## ステータス

**確定 (v2.1):** `docs/install.md` に反映済み。
