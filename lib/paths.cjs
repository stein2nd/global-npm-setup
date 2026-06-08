'use strict';

const os = require('os');
const path = require('path');

function defaultSetupDir() {
  if (process.platform === 'win32') {
    const appData =
      process.env.APPDATA ?? path.join(os.homedir(), 'AppData', 'Roaming');
    return path.join(appData, 'global-npm');
  }

  return path.join(os.homedir(), '.config', 'global-npm');
}

function resolveSetupContext(packageRoot) {
  const setupDir = path.resolve(
    process.env.GLOBAL_NPM_SETUP_DIR?.trim() || defaultSetupDir(),
  );

  return {
    packageRoot,
    setupDir,
    upstreamPkgPath: path.join(packageRoot, 'package.json'),
    pkgPath: path.join(setupDir, 'package.json'),
    userDepsPath: path.join(setupDir, 'user-deps.json'),
    metaPath: path.join(setupDir, '.upstream-meta.json'),
  };
}

module.exports = {
  defaultSetupDir,
  resolveSetupContext,
};
