'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const ROOT = path.resolve(__dirname, '..');
const CLI_PATH = path.join(ROOT, 'bin', 'global-npm.cjs');
const LIB_DIR = path.join(ROOT, 'lib');
const PATHS_PATH = path.join(LIB_DIR, 'paths.cjs');
const PKG_PATH = path.join(ROOT, 'package.json');
const SANDBOX_SETUP = path.join(ROOT, '.sandbox', 'setup');
const LICENSE_PATH = path.join(ROOT, 'LICENSE');
const README_PATH = path.join(ROOT, 'README.md');
const CHANGELOG_PATH = path.join(ROOT, 'CHANGELOG.md');

/** @type {Array<{ id: string, spec: string, condition: string, status: 'PASS' | 'WARN' | 'FAIL', detail?: string }>} */
const results = [];

function mark(id, spec, condition, pass, detail = '', { warnOnFail = false } = {}) {
  let status;

  if (pass) {
    status = 'PASS';
  } else if (warnOnFail) {
    status = 'WARN';
  } else {
    status = 'FAIL';
  }

  results.push({ id, spec, condition, status, detail: detail || undefined });
}

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function readLibSources() {
  return fs
    .readdirSync(LIB_DIR)
    .filter((name) => name.endsWith('.cjs'))
    .map((name) => read(path.join(LIB_DIR, name)))
    .join('\n');
}

function readCliAndLibSources() {
  return `${read(CLI_PATH)}\n${readLibSources()}`;
}

function readJson(filePath) {
  return JSON.parse(read(filePath));
}

function runCli(args, env = {}) {
  return spawnSync(process.execPath, [CLI_PATH, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
}

function runNpmPackDryRun() {
  return spawnSync('npm', ['pack', '--dry-run', '--pack-destination', 'artifacts'], {
    cwd: ROOT,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
}

function hasCommand(command) {
  const checker = process.platform === 'win32' ? 'where' : 'which';
  const result = spawnSync(checker, [command], {
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
  return result.status === 0;
}

// --- mod-os-agnostic-naming ---

test('naming: npm package name', () => {
  const pkg = readJson(PKG_PATH);
  mark(
    'NAM-01',
    'mod-os-agnostic-naming',
    'package.json の name が `@s2j/global-npm` であること。',
    pkg.name === '@s2j/global-npm',
    `actual: ${pkg.name}`,
  );
});

test('naming: CLI command name', () => {
  const pkg = readJson(PKG_PATH);
  mark(
    'NAM-02',
    'mod-os-agnostic-naming',
    'package.json の bin に `global-npm` コマンドが定義されていること。',
    pkg.bin && pkg.bin['global-npm'] === 'bin/global-npm.cjs',
  );
});

test('naming: repository URL', () => {
  const pkg = readJson(PKG_PATH);
  mark(
    'NAM-03',
    'mod-os-agnostic-naming',
    'repository.url に `global-npm-setup` が含まれること。',
    typeof pkg.repository?.url === 'string' && pkg.repository.url.includes('global-npm-setup'),
    pkg.repository?.url,
  );
});

test('naming: not v1 package name', () => {
  const pkg = readJson(PKG_PATH);
  mark(
    'NAM-04',
    'mod-os-agnostic-naming',
    'package.json の name が v1 名 `global-npm-packages` ではないこと。',
    pkg.name !== 'global-npm-packages',
  );
});

// --- mod-os-agnostic-cli ---

test('cli: entry file exists', () => {
  mark(
    'CLI-01',
    'mod-os-agnostic-cli',
    '`bin/global-npm.cjs` が存在すること。',
    fs.existsSync(CLI_PATH),
  );
});

test('cli: shebang', () => {
  const source = read(CLI_PATH);
  mark(
    'CLI-02',
    'mod-os-agnostic-cli',
    'CLI 先頭行が `#!/usr/bin/env node` であること。',
    source.startsWith('#!/usr/bin/env node'),
  );
});

test('cli: commonjs', () => {
  const pkg = readJson(PKG_PATH);
  mark(
    'CLI-03',
    'mod-os-agnostic-cli',
    'package.json の type が `commonjs` であること。',
    pkg.type === 'commonjs',
  );
});

test('cli: spawnSync usage', () => {
  const source = read(CLI_PATH);
  mark(
    'CLI-04',
    'mod-os-agnostic-cli',
    'CLI が `spawnSync` で子プロセスを起動すること。',
    source.includes('spawnSync'),
  );
});

test('cli: json parse without jq', () => {
  const source = readCliAndLibSources();
  mark(
    'CLI-05',
    'mod-os-agnostic-cli',
    'install 処理が `JSON.parse` と `readFileSync` を使うこと。',
    source.includes('JSON.parse') && source.includes('readFileSync'),
  );
  mark(
    'CLI-06',
    'mod-os-agnostic-cli',
    'CLI ソースに jq 呼び出しが含まれないこと。',
    !/\bjq\b/.test(source),
  );
});

test('cli: setup directory resolution', () => {
  const source = read(PATHS_PATH);
  mark(
    'CLI-07',
    'mod-os-agnostic-cli',
    'package root は upstream 正本、`defaultSetupDir()` で overlay setup を解決すること。',
    source.includes('defaultSetupDir') &&
      source.includes('resolveSetupContext') &&
      source.includes('upstreamPkgPath'),
  );
});

test('cli: GLOBAL_NPM_SETUP_DIR support', () => {
  const source = read(PATHS_PATH);
  mark(
    'CLI-08',
    'mod-os-agnostic-cli',
    '`GLOBAL_NPM_SETUP_DIR` で setup ディレクトリを上書きできること。',
    source.includes('GLOBAL_NPM_SETUP_DIR'),
  );
});

test('cli: check invokes ncu with expected args', () => {
  const source = readCliAndLibSources();
  mark(
    'CLI-09',
    'mod-os-agnostic-cli',
    'check が bundled ncu 経由で `-g --format time --packageFile` を使うこと。',
    source.includes("'check'") &&
      source.includes('runNcu') &&
      source.includes('resolveNcuInvocation') &&
      source.includes("'--format', 'time'") &&
      source.includes("'--packageFile', pkgPath"),
  );
});

test('cli: update invokes ncu with -u', () => {
  const source = readCliAndLibSources();
  mark(
    'CLI-10',
    'mod-os-agnostic-cli',
    'update が bundled ncu 経由で `-g --format time -u --packageFile` を使うこと。',
    source.includes("'update'") &&
      source.includes('runNcu') &&
      source.includes("'-u'") &&
      source.includes("'--packageFile', pkgPath"),
  );
});

test('cli: usage on missing subcommand', () => {
  const result = runCli([]);
  mark(
    'CLI-11',
    'mod-os-agnostic-cli',
    'サブコマンド未指定時に usage を表示して exit 1 すること。',
    result.status === 1 && (result.stderr + result.stdout).includes('Usage: global-npm'),
  );
});

test('cli: usage on unknown subcommand', () => {
  const result = runCli(['unknown-cmd']);
  mark(
    'CLI-12',
    'mod-os-agnostic-cli',
    '未知サブコマンド時に usage を表示して exit 1 すること。',
    result.status === 1 && (result.stderr + result.stdout).includes('Usage: global-npm'),
  );
});

test('cli: dev scripts retained', () => {
  const pkg = readJson(PKG_PATH);
  mark(
    'CLI-13',
    'mod-os-agnostic-cli',
    '開発用 script `ncu:check` が存在すること。',
    typeof pkg.scripts?.['ncu:check'] === 'string',
  );
  mark(
    'CLI-14',
    'mod-os-agnostic-cli',
    '開発用 script `ncu:update` が存在すること。',
    typeof pkg.scripts?.['ncu:update'] === 'string',
  );
});

test('cli: ncu install script removed', () => {
  const pkg = readJson(PKG_PATH);
  mark(
    'CLI-15',
    'mod-os-agnostic-cli',
    'v1 script `ncu:install` が存在しないこと。',
    pkg.scripts?.['ncu:install'] === undefined,
  );
});

test('cli: check does not modify repository package.json', () => {
  if (!hasCommand('ncu')) {
    mark(
      'CLI-16',
      'mod-os-agnostic-cli',
      'check 実行後もリポジトリ root の package.json が変わらないこと。',
      false,
      'ncu が PATH にないためスキップ',
      { warnOnFail: true },
    );
    return;
  }

  fs.rmSync(SANDBOX_SETUP, { recursive: true, force: true });
  const before = read(PKG_PATH);
  runCli(['check'], { GLOBAL_NPM_SETUP_DIR: SANDBOX_SETUP });
  const after = read(PKG_PATH);
  mark(
    'CLI-16',
    'mod-os-agnostic-cli',
    'check 実行後もリポジトリ root の package.json が変わらないこと。',
    before === after,
  );
});

test('cli: add subcommand updates user-deps.json', () => {
  fs.rmSync(SANDBOX_SETUP, { recursive: true, force: true });
  const result = runCli(['add', 'typescript@^5.9.3'], {
    GLOBAL_NPM_SETUP_DIR: SANDBOX_SETUP,
  });
  const userDeps = readJson(path.join(SANDBOX_SETUP, 'user-deps.json'));
  mark(
    'CLI-17',
    'mod-os-agnostic-cli',
    '`add` が `user-deps.json` の dependencies に追記すること。',
    result.status === 0 && userDeps.dependencies?.typescript === '^5.9.3',
  );
});

test('cli: add --dev updates user-deps devDependencies', () => {
  fs.rmSync(SANDBOX_SETUP, { recursive: true, force: true });
  const result = runCli(['add', 'eslint@^9.0.0', '--dev'], {
    GLOBAL_NPM_SETUP_DIR: SANDBOX_SETUP,
  });
  const userDeps = readJson(path.join(SANDBOX_SETUP, 'user-deps.json'));
  mark(
    'CLI-18',
    'mod-os-agnostic-cli',
    '`add --dev` が `user-deps.json` の devDependencies に追記すること。',
    result.status === 0 && userDeps.devDependencies?.eslint === '^9.0.0',
  );
});

test('cli: sync materializes overlay manifest', () => {
  fs.rmSync(SANDBOX_SETUP, { recursive: true, force: true });
  const result = runCli(['sync'], { GLOBAL_NPM_SETUP_DIR: SANDBOX_SETUP });
  const materialized = readJson(path.join(SANDBOX_SETUP, 'package.json'));
  const upstream = readJson(PKG_PATH);
  mark(
    'CLI-19',
    'mod-os-agnostic-cli',
    '`sync` が upstream dependencies を materialized package.json に反映すること。',
    result.status === 0 &&
      materialized?.name === 'global-npm-user-manifest' &&
      Object.keys(materialized.dependencies ?? {}).length ===
        Object.keys(upstream.dependencies ?? {}).length,
  );
});

// --- mod-os-agnostic-install ---

test('install: C-type npm install -g with semver specs', () => {
  const source = readCliAndLibSources();
  mark(
    'INS-01',
    'mod-os-agnostic-install',
    'install が `npm install -g` に `name@version` 形式 (range 解決済み) で渡すこと。',
    source.includes("'npm'") &&
      source.includes("'install', '-g', ...specs") &&
      source.includes('toGlobalInstallSpec') &&
      source.includes('pinVersion: true'),
  );
});

test('install: not B-type bare npm install -g', () => {
  const source = read(CLI_PATH);
  mark(
    'INS-02',
    'mod-os-agnostic-install',
    'install が引数なし `npm install -g`（B 型）を実行しないこと。',
    !/spawnSync\(\s*['"]npm['"]\s*,\s*\[\s*['"]install['"]\s*,\s*['"]-g['"]\s*\]/.test(source),
  );
});

test('install: uses dependencies entries', () => {
  const source = readCliAndLibSources();
  mark(
    'INS-03',
    'mod-os-agnostic-install',
    'install が `dependencies` の name / range を `Object.entries` で列挙すること。',
    source.includes('Object.entries(dependencies)'),
  );
});

test('install: empty dependencies error', () => {
  const source = read(CLI_PATH);
  mark(
    'INS-04',
    'mod-os-agnostic-install',
    'dependencies が空のとき `No dependencies to install.` で exit 1 すること。',
    source.includes('No dependencies to install.') && source.includes('specs.length === 0'),
  );
});

test('install: does not invoke ncu', () => {
  const source = read(CLI_PATH);
  const installBlock = source.slice(source.indexOf("case 'install'"), source.indexOf('default:'));
  mark(
    'INS-05',
    'mod-os-agnostic-install',
    'install サブコマンド単体で ncu を呼ばないこと。',
    !installBlock.includes("'ncu'"),
  );
});

test('install: windows shell flag', () => {
  const source = read(CLI_PATH);
  mark(
    'INS-06',
    'mod-os-agnostic-install',
    "spawn 時に Windows 向け `shell: process.platform === 'win32'` を使うこと。",
    source.includes("process.platform === 'win32'"),
  );
});

test('install: propagates npm exit code', () => {
  const source = read(CLI_PATH);
  mark(
    'INS-07',
    'mod-os-agnostic-install',
    '子プロセスの exit code をそのまま返すこと。',
    source.includes('process.exit(result.status'),
  );
});

// --- mod-os-agnostic-layout ---

test('layout: required files exist', () => {
  const required = ['bin/global-npm.cjs', 'package.json', 'LICENSE', 'README.md', 'CHANGELOG.md'];
  for (const relPath of required) {
    mark(
      `LAY-${required.indexOf(relPath) + 1}`,
      'mod-os-agnostic-layout',
      `\`${relPath}\` がリポジトリ root に存在すること。`,
      fs.existsSync(path.join(ROOT, relPath)),
    );
  }
});

test('layout: files field for publish', () => {
  const pkg = readJson(PKG_PATH);
  const expected = ['bin/', 'lib/', 'package.json', 'LICENSE', 'README.md'];
  const actual = pkg.files ?? [];
  mark(
    'LAY-06',
    'mod-os-agnostic-layout',
    'package.json の files に publish 同梱パスが定義されていること。',
    expected.every((entry) => actual.includes(entry)),
    `expected: ${expected.join(', ')}; actual: ${actual.join(', ')}`,
  );
});

test('layout: dependencies is source of truth', () => {
  const pkg = readJson(PKG_PATH);
  mark(
    'LAY-07',
    'mod-os-agnostic-layout',
    'package.json に `dependencies` が定義されていること。',
    pkg.dependencies && Object.keys(pkg.dependencies).length > 0,
  );
});

test('layout: no devDependencies install target', () => {
  const pkgIo = read(path.join(LIB_DIR, 'pkg-io.cjs'));
  const cli = read(CLI_PATH);
  const installBlock = cli.slice(cli.indexOf("case 'install'"), cli.indexOf("case 'sync'"));
  const readDependenciesFn = pkgIo.match(/function readDependencies[\s\S]*?^}/m)?.[0] ?? '';
  mark(
    'LAY-08',
    'mod-os-agnostic-layout',
    'install が `devDependencies` を参照しないこと。',
    installBlock.includes('readDependencies') &&
      !installBlock.includes('devDependencies') &&
      !readDependenciesFn.includes('devDependencies'),
  );
});

test('layout: self-reference', () => {
  const pkg = readJson(PKG_PATH);
  mark(
    'LAY-09',
    'mod-os-agnostic-layout',
    'dependencies に `@s2j/global-npm` 自己参照が含まれること。',
    Object.prototype.hasOwnProperty.call(pkg.dependencies ?? {}, '@s2j/global-npm'),
  );
});

test('layout: overlay manifest implemented', () => {
  const source = readCliAndLibSources();
  mark(
    'LAY-10',
    'mod-os-agnostic-layout',
    'overlay manifest（`syncManifest` / `user-deps.json`）が実装されていること。',
    source.includes('syncManifest') &&
      source.includes('user-deps.json') &&
      source.includes('GLOBAL_NPM_SETUP_DIR'),
  );
});

test('layout: default setup dir', () => {
  const source = read(PATHS_PATH);
  mark(
    'LAY-11',
    'mod-os-agnostic-layout',
    'デフォルト setupDir が `~/.config/global-npm`（Win: AppData）であること。',
    source.includes("'.config', 'global-npm'") && source.includes("'global-npm'"),
  );
});

test('layout: lib directory published', () => {
  mark(
    'LAY-12',
    'mod-os-agnostic-layout',
    '`lib/` ディレクトリが存在し publish files に含まれること。',
    fs.existsSync(LIB_DIR) && (readJson(PKG_PATH).files ?? []).includes('lib/'),
  );
});

// --- mod-os-agnostic-legacy-scripts ---

test('legacy: install-global.zsh removed', () => {
  mark(
    'LEG-01',
    'mod-os-agnostic-legacy-scripts',
    '`install-global.zsh` がリポジトリに存在しないこと。',
    !fs.existsSync(path.join(ROOT, 'install-global.zsh')),
  );
});

test('legacy: no main install-global.zsh', () => {
  const pkg = readJson(PKG_PATH);
  mark(
    'LEG-02',
    'mod-os-agnostic-legacy-scripts',
    'package.json に `main: install-global.zsh` が存在しないこと。',
    pkg.main === undefined,
  );
});

test('legacy: README does not instruct zsh wrapper setup', () => {
  const readme = read(README_PATH);
  mark(
    'LEG-03',
    'mod-os-agnostic-legacy-scripts',
    'README が v1 Zsh ラッパー新規作成手順を主要セットアップとして案内しないこと。',
    !readme.includes('SETUP_DIR="${0:A:h}"') && !readme.includes('chmod +x ~/bin/global-npm'),
  );
});

test('legacy: README documents v1 wrapper deprecation', () => {
  const readme = read(README_PATH);
  mark(
    'LEG-04',
    'mod-os-agnostic-legacy-scripts',
    'README が v1 `~/bin/global-npm` 廃止を記載していること。',
    readme.includes('~/bin/global-npm') && readme.includes('廃止'),
  );
});

// --- mod-gpl3-license ---

test('license: package.json field', () => {
  const pkg = readJson(PKG_PATH);
  mark(
    'LIC-01',
    'mod-gpl3-license',
    'package.json の license が `GPL-3.0-or-later` であること。',
    pkg.license === 'GPL-3.0-or-later',
  );
});

test('license: LICENSE file exists', () => {
  mark(
    'LIC-02',
    'mod-gpl3-license',
    '`LICENSE` ファイルが存在すること。',
    fs.existsSync(LICENSE_PATH),
  );
});

test('license: GPL v3 text', () => {
  const license = read(LICENSE_PATH);
  mark(
    'LIC-03',
    'mod-gpl3-license',
    'LICENSE に GNU GENERAL PUBLIC LICENSE Version 3 全文が含まれること。',
    license.includes('GNU GENERAL PUBLIC LICENSE') && license.includes('Version 3, 29 June 2007'),
  );
});

test('license: copyright notice', () => {
  const license = read(LICENSE_PATH);
  mark(
    'LIC-04',
    'mod-gpl3-license',
    'LICENSE に Copyright 表記が含まれること。',
    /Copyright \(C\) 2024-2026 Koutarou ISHIKAWA/.test(license),
  );
});

test('license: README section', () => {
  const readme = read(README_PATH);
  mark(
    'LIC-05',
    'mod-gpl3-license',
    'README にライセンス節があること。',
    readme.includes('## ライセンス') && readme.includes('GPL-3.0-or-later'),
  );
});

test('license: CHANGELOG mentions change', () => {
  const changelog = read(CHANGELOG_PATH);
  mark(
    'LIC-06',
    'mod-gpl3-license',
    'CHANGELOG v2.0.0 にライセンス変更が記載されていること。',
    changelog.includes('GPL-3.0-or-later'),
  );
});

// --- mod-npm-publish ---

test('publish: not private', () => {
  const pkg = readJson(PKG_PATH);
  mark(
    'PUB-01',
    'mod-npm-publish',
    'package.json に `private: true` が設定されていないこと。',
    pkg.private !== true,
  );
});

test('publish: version 2.1.2', () => {
  const pkg = readJson(PKG_PATH);
  mark(
    'PUB-02',
    'mod-npm-publish',
    'package.json の version が `2.1.2` であること。',
    pkg.version === '2.1.2',
  );
});

test('publish: engines node >=18', () => {
  const pkg = readJson(PKG_PATH);
  mark(
    'PUB-03',
    'mod-npm-publish',
    'package.json の engines.node が `>=18` であること。',
    pkg.engines?.node === '>=18',
  );
});

test('publish: tarball contents via dry-run', () => {
  const result = runNpmPackDryRun();
  const output = `${result.stdout}\n${result.stderr}`;
  const required = [
    'bin/global-npm.cjs',
    'lib/paths.cjs',
    'package.json',
    'LICENSE',
    'README.md',
  ];
  mark(
    'PUB-04',
    'mod-npm-publish',
    '`npm pack --dry-run` の tarball に必須ファイルが含まれること。',
    result.status === 0 && required.every((entry) => output.includes(entry)),
    result.status === 0 ? undefined : output.trim(),
  );
});

test('publish: registry publish status', () => {
  const pkg = readJson(PKG_PATH);
  const result = spawnSync('npm', ['view', `@s2j/global-npm@${pkg.version}`, 'version'], {
    cwd: ROOT,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
  const published = result.status === 0 && result.stdout.trim() === pkg.version;
  mark(
    'PUB-05',
    'mod-npm-publish',
    `npm registry に \`@s2j/global-npm@${pkg.version}\` が公開済みであること。`,
    published,
    published ? undefined : (result.stderr || result.stdout).trim(),
    { warnOnFail: !published },
  );
});

// --- mod-os-agnostic-windows ---

test('windows: path.join usage', () => {
  const source = readCliAndLibSources();
  mark(
    'WIN-01',
    'mod-os-agnostic-windows',
    'CLI が `path.join` / `path.resolve` を使うこと。',
    source.includes('path.join') && source.includes('path.resolve'),
  );
});

test('windows: shell flag for spawn', () => {
  const source = readCliAndLibSources();
  mark(
    'WIN-02',
    'mod-os-agnostic-windows',
    'spawn 時に Windows 判定付き shell オプションを使うこと。',
    /process\.platform\s*===\s*['"]win32['"]/.test(source) &&
      /spawnSync\([\s\S]*shell[,:]/.test(source),
  );
});

test('windows: no zsh dependency in CLI', () => {
  const source = read(CLI_PATH);
  mark(
    'WIN-03',
    'mod-os-agnostic-windows',
    'CLI ソースに Zsh 依存が含まれないこと。',
    !/\bzsh\b/i.test(source) && !source.includes('#!/bin/zsh'),
  );
});

test('windows: README has Windows section', () => {
  const readme = read(README_PATH);
  mark(
    'WIN-04',
    'mod-os-agnostic-windows',
    'README に Windows 11 向けセクションがあること。',
    readme.includes('Windows 11'),
  );
});

test('windows: real device verification', () => {
  mark(
    'WIN-05',
    'mod-os-agnostic-windows',
    'Windows 11 実機で check / update / install が動作すること。',
    process.platform === 'win32',
    process.platform === 'win32' ? undefined : 'macOS/Linux 環境のため手動確認待ち',
    { warnOnFail: true },
  );
});

// --- report ---

test('write markdown report', () => {
  const reportPath = path.join(ROOT, 'docsMod', 'test-results.md');
  mark('REP-01', 'test-report', 'test-results.md が生成されること。', true);

  const statusIcon = { PASS: '✔', WARN: '⚠', FAIL: '✖' };
  const bySpec = new Map();

  for (const item of results) {
    if (!bySpec.has(item.spec)) {
      bySpec.set(item.spec, []);
    }
    bySpec.get(item.spec).push(item);
  }

  const passCount = results.filter((item) => item.status === 'PASS').length;
  const warnCount = results.filter((item) => item.status === 'WARN').length;
  const failCount = results.filter((item) => item.status === 'FAIL').length;
  const total = results.length;
  const automatedPassRate = total > 0 ? Math.round((passCount / total) * 100) : 0;

  const lines = [
    '# Global npm Package Setup - 仕様準拠テスト結果',
    '',
    `最終実行: **${new Date().toISOString().slice(0, 10)}**`,
    '',
    '## サマリー',
    '',
    '| 区分 | 件数 |',
    '|------|------|',
    `| ✔ PASS | ${passCount} |`,
    `| ⚠ WARN | ${warnCount} |`,
    `| ✖ FAIL | ${failCount} |`,
    `| 合計 | ${total} |`,
    '',
    `自動テスト合格率（PASS / 合計）: **${automatedPassRate}%**`,
    '',
    '実行: `npm test`',
    '',
    '## 結果マーク',
    '',
    '- ✔ PASS — 条件を満たす',
    '- ⚠ WARN — 条件未達だが、延期・手動確認待ちなど意図的に許容',
    '- ✖ FAIL — 条件未達（要修正）',
    '',
  ];

  for (const [spec, items] of bySpec) {
    lines.push(`## ${spec}`);
    lines.push('');
    lines.push('| ID | 条件 | 結果 | 備考 |');
    lines.push('|----|------|------|------|');

    for (const item of items) {
      const note = item.detail ? item.detail.replace(/\|/g, '\\|') : '';
      lines.push(
        `| ${item.id} | ${item.condition} | ${statusIcon[item.status]} ${item.status} | ${note} |`,
      );
    }

    lines.push('');
  }

  fs.writeFileSync(reportPath, `${lines.join('\n')}\n`, 'utf8');
  results.find((item) => item.id === 'REP-01').detail = fs.existsSync(reportPath)
    ? undefined
    : 'ファイル生成に失敗';
});

test('summary: no FAIL results', () => {
  const failures = results.filter((item) => item.status === 'FAIL');
  assert.equal(
    failures.length,
    0,
    failures
      .map((item) => `[${item.id}] ${item.condition}${item.detail ? ` — ${item.detail}` : ''}`)
      .join('\n'),
  );
});
