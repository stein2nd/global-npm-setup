'use strict';

const { readJson, writeJson } = require('./pkg-io.cjs');

const MATERIALIZED_NAME = 'global-npm-user-manifest';

function mergeDependencies({ upstream, current, meta, userDeps }) {
  const merged = {};
  const upstreamDeps = upstream.dependencies ?? {};
  const userDepOverrides = userDeps.dependencies ?? {};
  const prevUpstream = meta?.dependencies ?? {};
  const currentDeps = current?.dependencies ?? {};

  for (const [name, upstreamRange] of Object.entries(upstreamDeps)) {
    if (Object.hasOwn(userDepOverrides, name)) {
      merged[name] = userDepOverrides[name];
      continue;
    }

    const currentRange = currentDeps[name];
    const prevRange = prevUpstream[name];

    if (
      currentRange !== undefined &&
      prevRange !== undefined &&
      currentRange !== prevRange
    ) {
      merged[name] = currentRange;
    } else {
      merged[name] = upstreamRange;
    }
  }

  for (const [name, range] of Object.entries(userDepOverrides)) {
    if (!Object.hasOwn(upstreamDeps, name)) {
      merged[name] = range;
    }
  }

  for (const [name, range] of Object.entries(currentDeps)) {
    if (Object.hasOwn(merged, name)) {
      continue;
    }

    const wasUpstream = Object.hasOwn(prevUpstream, name);
    const stillUpstream = Object.hasOwn(upstreamDeps, name);

    if (wasUpstream && !stillUpstream && !Object.hasOwn(userDepOverrides, name)) {
      continue;
    }

    merged[name] = range;
  }

  return merged;
}

function mergeDevDependencies({ current, meta, userDeps }) {
  const merged = {};
  const userDevDeps = userDeps.devDependencies ?? {};
  const prevUserDevDeps = meta?.userDeps?.devDependencies ?? {};
  const currentDevDeps = current?.devDependencies ?? {};

  for (const [name, userRange] of Object.entries(userDevDeps)) {
    const currentRange = currentDevDeps[name];
    const prevRange = prevUserDevDeps[name];

    if (
      currentRange !== undefined &&
      prevRange !== undefined &&
      currentRange !== prevRange
    ) {
      merged[name] = currentRange;
    } else {
      merged[name] = userRange;
    }
  }

  for (const [name, range] of Object.entries(currentDevDeps)) {
    if (Object.hasOwn(merged, name) || Object.hasOwn(userDevDeps, name)) {
      continue;
    }

    if (Object.hasOwn(prevUserDevDeps, name)) {
      continue;
    }

    merged[name] = range;
  }

  return merged;
}

function diffSections(before = {}, after = {}) {
  const added = [];
  const updated = [];
  const removed = [];

  for (const [name, range] of Object.entries(after)) {
    if (!Object.hasOwn(before, name)) {
      added.push({ name, range });
    } else if (before[name] !== range) {
      updated.push({ name, from: before[name], to: range });
    }
  }

  for (const name of Object.keys(before)) {
    if (!Object.hasOwn(after, name)) {
      removed.push({ name, range: before[name] });
    }
  }

  return { added, updated, removed };
}

function buildReport(beforePkg, afterPkg) {
  return {
    dependencies: diffSections(beforePkg?.dependencies, afterPkg.dependencies),
    devDependencies: diffSections(
      beforePkg?.devDependencies,
      afterPkg.devDependencies,
    ),
  };
}

function hasReportChanges(report) {
  for (const section of Object.values(report)) {
    if (section.added.length > 0 || section.updated.length > 0 || section.removed.length > 0) {
      return true;
    }
  }

  return false;
}

function formatReport(report) {
  const lines = [];

  for (const [sectionName, section] of Object.entries(report)) {
    for (const { name, range } of section.added) {
      lines.push(`+ ${sectionName} ${name}@${range}`);
    }
    for (const { name, from, to } of section.updated) {
      lines.push(`~ ${sectionName} ${name}: ${from} -> ${to}`);
    }
    for (const { name, range } of section.removed) {
      lines.push(`- ${sectionName} ${name}@${range}`);
    }
  }

  return lines;
}

function buildMaterializedPkg(merged) {
  return {
    name: MATERIALIZED_NAME,
    private: true,
    dependencies: merged.dependencies,
    devDependencies: merged.devDependencies,
  };
}

function syncManifest(ctx, { dryRun = false } = {}) {
  const upstream = readJson(ctx.upstreamPkgPath);
  if (!upstream) {
    throw new Error(`Failed to read upstream package.json: ${ctx.upstreamPkgPath}`);
  }

  const userDeps = readJson(ctx.userDepsPath) ?? {
    dependencies: {},
    devDependencies: {},
  };
  const normalizedUserDeps = {
    dependencies: { ...(userDeps.dependencies ?? {}) },
    devDependencies: { ...(userDeps.devDependencies ?? {}) },
  };

  const current = readJson(ctx.pkgPath);
  const meta = readJson(ctx.metaPath);

  const merged = {
    dependencies: mergeDependencies({
      upstream,
      current,
      meta,
      userDeps: normalizedUserDeps,
    }),
    devDependencies: mergeDevDependencies({
      current,
      meta,
      userDeps: normalizedUserDeps,
    }),
  };

  const nextPkg = buildMaterializedPkg(merged);
  const report = buildReport(current, nextPkg);
  const changed = hasReportChanges(report);

  if (!dryRun) {
    writeJson(ctx.pkgPath, nextPkg);
    writeJson(ctx.metaPath, {
      upstreamVersion: upstream.version,
      dependencies: { ...(upstream.dependencies ?? {}) },
      userDeps: {
        dependencies: { ...normalizedUserDeps.dependencies },
        devDependencies: { ...normalizedUserDeps.devDependencies },
      },
    });
  }

  return { changed, report, pkgPath: ctx.pkgPath, nextPkg };
}

module.exports = {
  MATERIALIZED_NAME,
  mergeDependencies,
  mergeDevDependencies,
  buildMaterializedPkg,
  syncManifest,
  formatReport,
};
