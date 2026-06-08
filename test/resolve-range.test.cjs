'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');

const { parseAddSpec, resolveDefaultRange } = require('../lib/resolve-range.cjs');

test('RANGE-01: npm view success returns caret range', () => {
  const warnings = [];
  const range = resolveDefaultRange('lodash', {
    spawn: () => ({
      status: 0,
      stdout: '"4.17.21"\n',
    }),
    log: (message) => warnings.push(message),
  });

  assert.equal(range, '^4.17.21');
  assert.equal(warnings.length, 0);
});

test('RANGE-02: npm view failure falls back to wildcard with warning', () => {
  const warnings = [];
  const range = resolveDefaultRange('missing-package', {
    spawn: () => ({
      status: 1,
      stdout: '',
      stderr: 'network error',
    }),
    log: (message) => warnings.push(message),
  });

  assert.equal(range, '*');
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /Warning: could not resolve latest version/);
});

test('parseAddSpec handles scoped package with range', () => {
  assert.deepEqual(parseAddSpec('@s2j/docs-linter@^1.0.16'), {
    name: '@s2j/docs-linter',
    range: '^1.0.16',
  });
});

test('parseAddSpec handles unscoped package with range', () => {
  assert.deepEqual(parseAddSpec('typescript@^5.9.3'), {
    name: 'typescript',
    range: '^5.9.3',
  });
});

test('parseAddSpec handles package without range', () => {
  assert.deepEqual(parseAddSpec('typescript'), {
    name: 'typescript',
    range: undefined,
  });
});
