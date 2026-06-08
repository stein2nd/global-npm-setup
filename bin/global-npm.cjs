#!/usr/bin/env node

const { spawnSync } = require('child_process');
const path = require('path');

const { toGlobalInstallSpec } = require('../lib/install-spec.cjs');
const { ensureSetupDir, readDependencies, readUserDeps, writeJson } = require('../lib/pkg-io.cjs');
const { resolveSetupContext } = require('../lib/paths.cjs');
const { parseAddSpec, resolveDefaultRange } = require('../lib/resolve-range.cjs');
const { formatReport, syncManifest } = require('../lib/sync-manifest.cjs');

const packageRoot = path.resolve(__dirname, '..');
const ctx = resolveSetupContext(packageRoot);
const { pkgPath } = ctx;
const shell = process.platform === 'win32';

function usage() {
  console.error(`Usage: global-npm <check|update|install|sync|add>

  check    Check for available updates (ncu -g)
  update   Update version ranges in package.json (ncu -g -u)
  install  Install dependencies globally (npm install -g <name>@<range>…)
  sync     Merge upstream + user-deps into materialized package.json
  add      Add a package to user-deps.json (optional: --dev)`);
  process.exit(1);
}

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell,
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  process.exit(result.status ?? 1);
}

function prepare() {
  ensureSetupDir(ctx);
  return syncManifest(ctx);
}

function handleSync(dryRun) {
  ensureSetupDir(ctx);
  const { changed, report } = syncManifest(ctx, { dryRun });

  if (dryRun) {
    const lines = formatReport(report);
    if (lines.length === 0) {
      console.error('No changes.');
    } else {
      for (const line of lines) {
        console.error(line);
      }
    }
    process.exit(0);
  }

  if (changed) {
    console.error(`Synced materialized manifest: ${pkgPath}`);
  }

  process.exit(0);
}

function handleAdd(args) {
  const isDev = args.includes('--dev');
  const positional = args.filter((arg) => arg !== '--dev');

  if (positional.length !== 1) {
    console.error('Usage: global-npm add <pkg>[@range] [--dev]');
    process.exit(1);
  }

  const { name, range: explicitRange } = parseAddSpec(positional[0]);
  if (!name) {
    console.error('Package name is required.');
    process.exit(1);
  }

  const range =
    explicitRange !== undefined ? explicitRange : resolveDefaultRange(name);

  ensureSetupDir(ctx);
  const userDeps = readUserDeps(ctx);
  const section = isDev ? 'devDependencies' : 'dependencies';
  userDeps[section][name] = range;
  writeJson(ctx.userDepsPath, userDeps);

  syncManifest(ctx);
  console.error(`Added ${name}@${range} to user-deps.json (${section}).`);
  process.exit(0);
}

const subcommand = process.argv[2];
const restArgs = process.argv.slice(3);

switch (subcommand) {
  case 'check':
    prepare();
    run('ncu', ['-g', '--format', 'time', '--packageFile', pkgPath]);
    break;

  case 'update':
    prepare();
    run('ncu', ['-g', '--format', 'time', '-u', '--packageFile', pkgPath]);
    break;

  case 'install': {
    prepare();
    const dependencies = readDependencies(pkgPath);
    const specs = Object.entries(dependencies).map(([name, versionRange]) =>
      toGlobalInstallSpec(name, versionRange),
    );

    if (specs.length === 0) {
      console.error('No dependencies to install.');
      process.exit(1);
    }

    run('npm', ['install', '-g', ...specs]);
    break;
  }

  case 'sync':
    handleSync(restArgs.includes('--dry-run'));
    break;

  case 'add':
    handleAdd(restArgs);
    break;

  default:
    usage();
}
