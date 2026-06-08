'use strict';

function toGlobalInstallSpec(name, versionRange) {
  if (typeof versionRange === 'string' && versionRange.trim() !== '') {
    return `${name}@${versionRange}`;
  }

  return name;
}

module.exports = {
  toGlobalInstallSpec,
};
