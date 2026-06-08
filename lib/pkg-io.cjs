'use strict';

const fs = require('fs');
const path = require('path');

const EMPTY_USER_DEPS = {
  dependencies: {},
  devDependencies: {},
};

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function ensureSetupDir(ctx) {
  fs.mkdirSync(ctx.setupDir, { recursive: true });

  if (!fs.existsSync(ctx.userDepsPath)) {
    writeJson(ctx.userDepsPath, { ...EMPTY_USER_DEPS });
  }
}

function readUserDeps(ctx) {
  const data = readJson(ctx.userDepsPath);
  return {
    dependencies: { ...(data?.dependencies ?? {}) },
    devDependencies: { ...(data?.devDependencies ?? {}) },
  };
}

function readDependencies(pkgPath) {
  const pkg = readJson(pkgPath);
  if (!pkg) {
    return {};
  }

  return pkg.dependencies ?? {};
}

module.exports = {
  EMPTY_USER_DEPS,
  readJson,
  writeJson,
  ensureSetupDir,
  readUserDeps,
  readDependencies,
};
