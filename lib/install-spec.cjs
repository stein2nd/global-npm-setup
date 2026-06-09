'use strict';

const { spawnSync } = require('child_process');

const shell = process.platform === 'win32';

function resolvePinnedVersion(name, versionRange, { spawn = spawnSync } = {}) {
  const trimmed = typeof versionRange === 'string' ? versionRange.trim() : '';
  if (!trimmed) {
    return undefined;
  }

  const result = spawn('npm', ['view', `${name}@${trimmed}`, 'version', '--json'], {
    encoding: 'utf8',
    shell,
  });

  if (result.status !== 0) {
    return trimmed;
  }

  try {
    const parsed = JSON.parse(result.stdout.trim());
    if (typeof parsed === 'string' && parsed) {
      return parsed;
    }
  } catch {
    // fall through to range fallback
  }

  return trimmed;
}

function toGlobalInstallSpec(name, versionRange, { pinVersion = false, spawn = spawnSync } = {}) {
  if (typeof versionRange === 'string' && versionRange.trim() !== '') {
    const target = pinVersion
      ? resolvePinnedVersion(name, versionRange, { spawn })
      : versionRange.trim();
    return `${name}@${target}`;
  }

  return name;
}

module.exports = {
  resolvePinnedVersion,
  toGlobalInstallSpec,
};
