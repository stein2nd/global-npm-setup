# Global npm Package Setup - レガシースクリプト廃止 (脱 OS 依存改修)

## 背景

v1では `./install-global.zsh` と `~/bin/global-npm` (Zsh ラッパー) が install / 更新フローの入口だった。
v2では `@s2j/global-npm` CLI に統一し、両者を **廃止** する。

## v1の構成 (2層)

| 層 | ファイル | 役割 |
|----|----------|------|
| install 専用 | `./install-global.zsh` | setup dir で `npm install -g` (B 型) |
| オーケストレータ | `~/bin/global-npm` | `check` / `update` / `install` を `npm run ncu:*` に委譲 |

`install` サブコマンドと `install-global.zsh` は **別経路** である。

```
global-npm install  →  npm run ncu:install  →  jq 列挙 + npm install -g … (A 型)
./install-global.zsh  →  npm install -g (引数なし、B 型)
```

## `./install-global.zsh` について

### 利点

| 利点 | 説明 |
|------|------|
| 極めて単純 | 12行。依存は zsh + npm のみ |
| リポジトリ同梱 | Git で追跡。npm publish 不要 |
| 自己の位置解決 | `cd "$(dirname "$0")"` で setup dir を確定 |
| PATH 不要 | `./install-global.zsh` で直接実行できる |
| install 専用 | 更新確認・書き換えと責務が分離 |
| オフライン寄り | すでに clone 済みならネットワーク最小限 |

### 欠点

| 欠点 | 説明 |
|------|------|
| B 型 install | 依存 CLI の `bin` が PATH に載らない ([install.md](./install.md) 参照) |
| Zsh 専用 | Windows / bash では動かない |
| 二重入口 | 本番は `ncu:install` 経由のことが多く、役割があいまい |
| ncu 非連携 | 単体では check / update フローに組み込めない |

## `~/bin/global-npm` ラッパーについて

### 利点

| 利点 | 説明 |
|------|------|
| 短いコマンド名 | どの cwd からも `global-npm check` |
| 3操作の統一入口 | check / update / install を1コマンド体系に |
| dotfiles 文化との親和性 | `~/bin` + `.zshrc` の PATH は UNIX ユーザーに馴染み深い |
| npm scripts への薄い委譲 | ロジックは `package.json` の `scripts` に置ける |
| カスタム容易 | シェルスクリプト1ファイルを編集するだけ |

### 欠点・脆弱性

| 欠点 | 説明 |
|------|------|
| Zsh 専用 | `${0:A:h}` 等は Windows 非対応 |
| SETUP_DIR のあいまいさ | README では `~/bin/global-npm` に置く想定だが、`SETUP_DIR="${0:A:h}"` だと `~/bin` を指す。正しく動かすには setup 内に置いて symlink する等の追加手順が必要 |
| 二重管理 | ラッパー + `package.json` scripts + `install-global.zsh` |
| PATH 設定が前提 | `~/.zshrc` 変更が必須。新マシンごとに再設定 |
| install 経路の不一致 | ラッパー `install` → A 型、`install-global.zsh` → B 型 |
| Mac 限定の再現 | 勤務先 Windows 11にはそのまま持ち込めない |

## 廃止し `@s2j/global-npm` CLI に統一する

### 廃止の利点

| 利点 | 説明 |
|------|------|
| OS 非依存 | Node + npm のみ。macOS / Windows 11で同一 |
| 入口の一本化 | check / update / install が1実装 (`bin/global-npm.js`) |
| C 型 install | Node 列挙。ncu 整合を保ちつつ jq ランタイム不要 |
| setup dir の明確化 | `path.resolve(__dirname, '..')` = npm global install 先の package root |
| 標準的な PATH 管理 | `npm install -g` が `{prefix}/bin` に `global-npm` を置く。`~/bin` 不要 |
| 新マシンセットアップ簡素化 | Node + `npm install -g @s2j/global-npm` で開始 |
| 自己更新が可能 | `@s2j/global-npm` を `dependencies` に含め、C 型 install で自身も更新 |
| npm エコシステム整合 | `@s2j/docs-linter` と同じ publish / update フロー |
| 重複の解消 | zsh ラッパー、B 型 zsh、jq シェル展開が消える |
| ncu フローの明確化 | `install` から ncu を外し、check → update → install が明示的 |

### 廃止のトレードオフ

| トレードオフ | 説明 | 受け入れ |
|--------------|------|----------|
| 初回 bootstrap | 先に `npm install -g @s2j/global-npm` が必要 | ◎ |
| npm publish 依存 | dependencies 一覧の変更は publish (または `npm link` 開発) が必要 | ◎ — [npm-publish.md](./npm-publish.md) 参照 |
| ネットワーク | 初回・更新時に registry 到達が前提 | ◎ |
| 純 dotfiles からの距離 | 「clone するだけ」より npm パッケージとしての運用に寄る | ◎ |
| カスタム一覧 | 勤務先だけ別 pkg 集合にするには fork か方式 B が必要 | △ — v2残タスクで方式 B を実装予定 |

## 横断比較

| 観点 | `install-global.zsh` | `~/bin/global-npm` | 廃止 → `@s2j/global-npm` |
|------|----------------------|--------------------|---------------------------|
| 対応 OS | macOS (Zsh) | macOS (Zsh) | macOS / Windows |
| 入口数 | install のみ (別系統) | 3操作 | 3操作 (統一) |
| install 方式 | B 型 (不適) | A 型 (jq、ラッパー経由) | C 型 (Node 列挙) |
| ncu 整合 | ✗ | △ (install だけ ncu 合体) | ◎ |
| setup dir 解決 | ◎ (`$0` 基準) | △ (README 通りだと誤り) | ◎ (package root) |
| 新マシンセットアップ | clone + 実行 | clone + ~/bin + zshrc | Node + npm install -g |
| 保守箇所 | zsh (1) | zsh + scripts + jq | Node CLI (1) |
| npm 公開 | 不要 | 不要 | 必要 |

## 決定事項

| 項目 | 判断 |
|------|------|
| `install-global.zsh` | **廃止** (B 型かつ冗長) |
| `~/bin/global-npm` | **廃止** (npm global `bin` が代替) |
| コマンド名 `global-npm` | **維持** (`@s2j/global-npm` の `bin` フィールド) |

### 移行時の注意

- Mac 既存環境では `~/bin/global-npm` を削除する (他ツール用に `~/bin` 自体は残してよい)。
- 同名ファイルが PATH 上で `@s2j/global-npm` の `global-npm` より優先されないよう確認する。

## 関連ドキュメント

- [cli.md](./cli.md) — v2の CLI 仕様
- [install.md](./install.md) — C 型 install
- [npm-publish.md](./npm-publish.md) — publish 依存の受け入れ理由

## ステータス

**確定** — `docs/legacy-scripts.md` に移行済み。
