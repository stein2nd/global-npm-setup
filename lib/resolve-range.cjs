'use strict';

const { spawnSync } = require('child_process');

const shell = process.platform === 'win32';

function resolveDefaultRange(pkgName, { spawn = spawnSync, log = console.error } = {}) {
  const result = spawn('npm', ['view', pkgName, 'version', '--json'], {
    encoding: 'utf8',
    shell,
  });

  if (result.status === 0) {
    try {
      const version = JSON.parse(result.stdout.trim());
      if (typeof version === 'string' && version) {
        return `^${version}`;
      }
    } catch {
      // fall through to wildcard fallback
    }
  }

  log(`Warning: could not resolve latest version for ${pkgName}; using "*".`);
  return '*';
}

function parseAddSpec(arg) {
  if (!arg || typeof arg !== 'string') {
    return { name: '', range: undefined };
  }

  if (!arg.startsWith('@')) {
    const at = arg.lastIndexOf('@');
    if (at > 0) {
      return { name: arg.slice(0, at), range: arg.slice(at + 1) };
    }
    return { name: arg, range: undefined };
  }

  const slash = arg.indexOf('/');
  const at = arg.lastIndexOf('@');
  if (at > 0 && at > slash) {
    return { name: arg.slice(0, at), range: arg.slice(at + 1) };
  }

  return { name: arg, range: undefined };
}

module.exports = {
  resolveDefaultRange,
  parseAddSpec,
};
