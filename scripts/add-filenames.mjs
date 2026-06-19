// Enrich src/data/demo-apps.json with a `fileName` per entry, used to build the
// applet preview image URL: applets.pixelrunner.dev/$packageName/$fileName.webp
//
// Re-runnable: source of truth is each applet's manifest. Resolution per entry:
//   1. manifest `fileName:` with trailing `.star` stripped
//   2. else the lone `*.star` basename in the applet dir
//   3. else `packageName` (logged as a warning to verify against the CDN)
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(scriptDir, '../src/data/demo-apps.json');
const appsDir = path.resolve(scriptDir, '../../applets/vendor/tronbyt/apps');

const entries = JSON.parse(readFileSync(dataPath, 'utf8'));
const warnings = [];

for (const entry of entries) {
  entry.fileName = resolveFileName(entry.packageName);
}

writeFileSync(dataPath, `${JSON.stringify(entries, null, 2)}\n`);

console.log(`Enriched ${entries.length} entries -> ${path.relative(process.cwd(), dataPath)}`);
if (warnings.length) {
  console.warn(`\n${warnings.length} fell back to packageName (verify against CDN):`);
  warnings.forEach((w) => console.warn(`  - ${w}`));
}

function resolveFileName(packageName) {
  const dir = path.join(appsDir, packageName);

  const manifestFileName = readManifestFileName(dir);
  if (manifestFileName) {
    return manifestFileName.replace(/\.star$/, '');
  }

  const star = loneStarBasename(dir);
  if (star) {
    return star;
  }

  warnings.push(packageName);
  return packageName;
}

function readManifestFileName(dir) {
  const manifest = safeRead(path.join(dir, 'manifest.yaml'));
  if (!manifest) {
    return null;
  }
  const match = manifest.match(/^fileName:\s*(.+?)\s*$/m);
  return match ? match[1] : null;
}

function loneStarBasename(dir) {
  const stars = safeReaddir(dir).filter((f) => f.endsWith('.star'));
  return stars.length === 1 ? stars[0].replace(/\.star$/, '') : null;
}

function safeRead(filePath) {
  try {
    return readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function safeReaddir(dir) {
  try {
    return readdirSync(dir);
  } catch {
    return [];
  }
}
