'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');

const {
  mergeDependencies,
  mergeDevDependencies,
  buildMaterializedPkg,
} = require('../lib/sync-manifest.cjs');

test('SYNC-01: user-only dependencies are preserved after upstream update', () => {
  const merged = mergeDependencies({
    upstream: { dependencies: { textlint: '^16.0.0' } },
    current: {
      dependencies: {
        textlint: '^15.7.1',
        '@s2j/docs-linter': '^1.0.16',
      },
    },
    meta: {
      dependencies: { textlint: '^15.7.1' },
    },
    userDeps: {
      dependencies: { '@s2j/docs-linter': '^1.0.16' },
    },
  });

  assert.equal(merged.textlint, '^16.0.0');
  assert.equal(merged['@s2j/docs-linter'], '^1.0.16');
});

test('SYNC-02: stale upstream-managed dependency follows new upstream range', () => {
  const merged = mergeDependencies({
    upstream: { dependencies: { textlint: '^16.0.0' } },
    current: { dependencies: { textlint: '^15.7.1' } },
    meta: { dependencies: { textlint: '^15.7.1' } },
    userDeps: { dependencies: {} },
  });

  assert.equal(merged.textlint, '^16.0.0');
});

test('SYNC-03: ncu-updated dependency is preserved', () => {
  const merged = mergeDependencies({
    upstream: { dependencies: { 'npm-check-updates': '^22.2.3' } },
    current: { dependencies: { 'npm-check-updates': '^23.0.0' } },
    meta: { dependencies: { 'npm-check-updates': '^22.2.3' } },
    userDeps: { dependencies: {} },
  });

  assert.equal(merged['npm-check-updates'], '^23.0.0');
});

test('SYNC-04: user-deps pin overrides upstream range', () => {
  const merged = mergeDependencies({
    upstream: { dependencies: { textlint: '^16.0.0' } },
    current: { dependencies: { textlint: '^16.0.0' } },
    meta: { dependencies: { textlint: '^15.7.1' } },
    userDeps: { dependencies: { textlint: '^15.7.0' } },
  });

  assert.equal(merged.textlint, '^15.7.0');
});

test('SYNC-05: removed upstream-managed dependency is dropped from materialized', () => {
  const merged = mergeDependencies({
    upstream: { dependencies: {} },
    current: { dependencies: { wpapi: '^1.2.2' } },
    meta: { dependencies: { wpapi: '^1.2.2' } },
    userDeps: { dependencies: {} },
  });

  assert.equal(merged.wpapi, undefined);
});

test('SYNC-06: user-added dependency survives upstream removal', () => {
  const merged = mergeDependencies({
    upstream: { dependencies: {} },
    current: { dependencies: { typescript: '^5.9.3' } },
    meta: { dependencies: {} },
    userDeps: { dependencies: { typescript: '^5.9.3' } },
  });

  assert.equal(merged.typescript, '^5.9.3');
});

test('SYNC-07: user-deps devDependencies are merged into materialized', () => {
  const devDeps = mergeDevDependencies({
    current: { devDependencies: {} },
    meta: { userDeps: { devDependencies: {} } },
    userDeps: { devDependencies: { 'some-dev-tool': '^2.0.0' } },
  });

  const pkg = buildMaterializedPkg({
    dependencies: {},
    devDependencies: devDeps,
  });

  assert.equal(pkg.devDependencies['some-dev-tool'], '^2.0.0');
});

test('SYNC-08: upstream devDependencies are not merged without user-deps entry', () => {
  const devDeps = mergeDevDependencies({
    current: { devDependencies: {} },
    meta: { userDeps: { devDependencies: {} } },
    userDeps: { devDependencies: {} },
  });

  assert.equal(devDeps.eslint, undefined);
});

test('SYNC-09: removed user-deps devDependency is dropped from materialized', () => {
  const devDeps = mergeDevDependencies({
    current: { devDependencies: { 'some-dev-tool': '^2.0.0' } },
    meta: {
      userDeps: { devDependencies: { 'some-dev-tool': '^2.0.0' } },
    },
    userDeps: { devDependencies: {} },
  });

  assert.equal(devDeps['some-dev-tool'], undefined);
});

test('SYNC-10: ncu-updated devDependency is preserved', () => {
  const devDeps = mergeDevDependencies({
    current: { devDependencies: { 'some-dev-tool': '^3.0.0' } },
    meta: {
      userDeps: { devDependencies: { 'some-dev-tool': '^2.0.0' } },
    },
    userDeps: { devDependencies: { 'some-dev-tool': '^2.0.0' } },
  });

  assert.equal(devDeps['some-dev-tool'], '^3.0.0');
});
