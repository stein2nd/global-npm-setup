'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');

const { resolvePinnedVersion, toGlobalInstallSpec } = require('../lib/install-spec.cjs');

test('SPEC-01: resolvePinnedVersion returns registry version for range', () => {
  const version = resolvePinnedVersion('@s2j/global-npm', '^2.1.1', {
    spawn: () => ({
      status: 0,
      stdout: '"2.1.1"\n',
    }),
  });

  assert.equal(version, '2.1.1');
});

test('SPEC-02: resolvePinnedVersion falls back to range when npm view fails', () => {
  const version = resolvePinnedVersion('missing-package', '^9.9.9', {
    spawn: () => ({
      status: 1,
      stdout: '',
      stderr: 'not found',
    }),
  });

  assert.equal(version, '^9.9.9');
});

test('SPEC-03: toGlobalInstallSpec pins version when requested', () => {
  const spec = toGlobalInstallSpec('npm-check-updates', '^22.2.3', {
    pinVersion: true,
    spawn: () => ({
      status: 0,
      stdout: '"22.2.3"\n',
    }),
  });

  assert.equal(spec, 'npm-check-updates@22.2.3');
});

test('SPEC-04: toGlobalInstallSpec keeps range when pinVersion is false', () => {
  const spec = toGlobalInstallSpec('npm-check-updates', '^22.2.3');

  assert.equal(spec, 'npm-check-updates@^22.2.3');
});

test('SPEC-05: toGlobalInstallSpec handles scoped packages', () => {
  const spec = toGlobalInstallSpec('@s2j/docs-linter', '^1.0.16', {
    pinVersion: true,
    spawn: () => ({
      status: 0,
      stdout: '"1.0.17"\n',
    }),
  });

  assert.equal(spec, '@s2j/docs-linter@1.0.17');
});
