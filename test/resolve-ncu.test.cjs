'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const { test } = require('node:test');

const { resolveNcuInvocation } = require('../lib/resolve-ncu.cjs');

const packageRoot = path.resolve(__dirname, '..');

test('NCU-01: resolves bundled npm-check-updates cli.js', () => {
  const invocation = resolveNcuInvocation(packageRoot);

  assert.equal(invocation.command, process.execPath);
  assert.equal(
    invocation.prefixArgs[0],
    path.join(packageRoot, 'node_modules', 'npm-check-updates', 'build', 'cli.js'),
  );
  assert.equal(invocation.useShell, false);
});

test('NCU-02: falls back to PATH ncu when bundle is missing', () => {
  const invocation = resolveNcuInvocation('/tmp/no-global-npm-deps');

  assert.equal(invocation.command, 'ncu');
  assert.deepEqual(invocation.prefixArgs, []);
});
