#!/usr/bin/env node

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const setupDir = path.resolve(__dirname, '..');
const pkgPath = path.join(setupDir, 'package.json');
const shell = process.platform === 'win32';

function usage() {
  console.error(`Usage: global-npm <check|update|install>

  check    Check for available updates (ncu -g)
  update   Update version ranges in package.json (ncu -g -u)
  install  Install dependencies globally (npm install -g <name>@<range>…)`);
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

function toGlobalInstallSpec(name, versionRange) {
  if (typeof versionRange === 'string' && versionRange.trim() !== '') {
    return `${name}@${versionRange}`;
  }

  return name;
}

function readDependencies() {
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return pkg.dependencies ?? {};
  } catch (err) {
    console.error(`Failed to read ${pkgPath}: ${err.message}`);
    process.exit(1);
  }
}

const subcommand = process.argv[2];

switch (subcommand) {
  case 'check':
    run('ncu', ['-g', '--format', 'time', '--packageFile', pkgPath]);
    break;

  case 'update':
    run('ncu', ['-g', '--format', 'time', '-u', '--packageFile', pkgPath]);
    break;

  case 'install': {
    const dependencies = readDependencies();
    const specs = Object.entries(dependencies).map(([name, range]) =>
      toGlobalInstallSpec(name, range),
    );

    if (specs.length === 0) {
      console.error('No dependencies to install.');
      process.exit(1);
    }

    run('npm', ['install', '-g', ...specs]);
    break;
  }

  default:
    usage();
}
