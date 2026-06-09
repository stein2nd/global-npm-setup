'use strict';

const { existsSync } = require('fs');
const path = require('path');

function bundledNcuCliPath(packageRoot) {
  const nestedCli = path.join(
    packageRoot,
    'node_modules',
    'npm-check-updates',
    'build',
    'cli.js',
  );
  if (existsSync(nestedCli)) {
    return nestedCli;
  }

  try {
    const pkgJson = require.resolve('npm-check-updates/package.json', {
      paths: [packageRoot],
    });
    const cliJs = path.join(path.dirname(pkgJson), 'build', 'cli.js');
    if (existsSync(cliJs)) {
      return cliJs;
    }
  } catch {
    // fall through to .bin / PATH
  }

  return undefined;
}

function resolveNcuInvocation(packageRoot) {
  const cliJs = bundledNcuCliPath(packageRoot);
  if (cliJs) {
    return {
      command: process.execPath,
      prefixArgs: [cliJs],
      useShell: false,
    };
  }

  const binName = process.platform === 'win32' ? 'ncu.cmd' : 'ncu';
  const localBin = path.join(packageRoot, 'node_modules', '.bin', binName);
  if (existsSync(localBin)) {
    return {
      command: localBin,
      prefixArgs: [],
      useShell: process.platform === 'win32',
    };
  }

  return {
    command: 'ncu',
    prefixArgs: [],
    useShell: process.platform === 'win32',
  };
}

module.exports = {
  resolveNcuInvocation,
};
