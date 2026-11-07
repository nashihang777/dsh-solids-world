/**
 * Content integrity check.
 *
 *   node scripts/check-content.mjs
 *
 * Bundles the atlas data, the builder registry and the CIF parser for Node and
 * asserts the things a broken port would silently lose:
 *   - every locale exposes the same 53 entries, with guides attached;
 *   - every entry has a 3D builder and no builder is orphaned;
 *   - the bundled CIF samples still parse to their recorded expectations,
 *     including the two samples that must fail with a specific error code.
 *
 * Developer check only; it is not part of the installed package.
 */

import { createRequire } from 'node:module'
import { readFileSync, readdirSync, writeFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(here, '..')
const solidsWorld = process.env.SOLIDS_WORLD_SRC
  ? path.resolve(process.env.SOLIDS_WORLD_SRC)
  : path.resolve(packageRoot, '..', 'solids-world')

const requireFromSolidsWorld = createRequire(path.join(solidsWorld, 'package.json'))
const esbuild = requireFromSolidsWorld('esbuild')

const failures = []
function check(name, condition, detail) {
  if (condition) console.log(`  ok   ${name}`)
  else {
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ''}`)
    failures.push(name)
  }
}

const entryFile = path.join(mkdtempSync(path.join(tmpdir(), 'sw-content-')), 'probe.mjs')
const posix = (value) => value.split(path.sep).join('/')
writeFileSync(
  entryFile,
  [
    `import { buildAtlasFor } from '${posix(path.join(packageRoot, 'src/atlas/data/atlas.ts'))}'`,
    `import { listBuilderIds } from '${posix(path.join(packageRoot, 'src/atlas/three/registry.ts'))}'`,
    `import { loadEntry } from '${posix(path.join(packageRoot, 'src/atlas/three/registry.ts'))}'`,
    `import { buildFromStructureData } from '${posix(path.join(packageRoot, 'src/atlas/three/customStructure.ts'))}'`,
    `import { parseCifText } from '${posix(path.join(packageRoot, 'src/electron/cif/parse.ts'))}'`,
    'export { buildAtlasFor, listBuilderIds, loadEntry, buildFromStructureData, parseCifText }',
    '',
  ].join('\n'),
  'utf8',
)

const outFile = path.join(path.dirname(entryFile), 'probe.bundle.mjs')
await esbuild.build({
  entryPoints: [entryFile],
  bundle: true,
  outfile: outFile,
  format: 'esm',
  platform: 'node',
  nodePaths: [path.join(solidsWorld, 'node_modules')],
  logLevel: 'warning',
})

const probe = await import(pathToFileURL(outFile).href)

const zh = probe.buildAtlasFor('zh')
const en = probe.buildAtlasFor('en')
const builders = new Set(probe.listBuilderIds())

check('chinese atlas has 53 entries', zh.length === 53, String(zh.length))
check('english atlas has 53 entries', en.length === 53, String(en.length))
check(
  'locales cover the same entry ids',
  zh.length === en.length && zh.every((entry, index) => entry.id === en[index].id),
)
check(
  'every entry carries a lesson and a quiz',
  zh.every((entry) => entry.guide.lesson.length > 0 && entry.guide.quiz.length > 0),
)
check(
  'every entry has a 3D builder',
  zh.every((entry) => builders.has(entry.id)),
  zh.filter((entry) => !builders.has(entry.id)).map((entry) => entry.id).join(','),
)
check(
  'no orphan builders',
  [...builders].every((id) => zh.some((entry) => entry.id === id)),
  [...builders].filter((id) => !zh.some((entry) => entry.id === id)).join(','),
)
check(
  'entries expose hotspots keyed to anchors',
  zh.every((entry) => entry.hotspots.every((hotspot) => typeof hotspot.anchor === 'string')),
)
check(
  'dynamic entries declare parameters',
  zh.filter((entry) => entry.dynamic).every((entry) => entry.dynamic.params.length > 0),
)

// Build every entry's model for real: the 3D builders are pure three.js, so
// they construct geometry without a renderer or a GPU.
globalThis.solids = { log() {} }

const palette = { muted: '#93a8b0', ink: '#e9f1f2' }
const buildFailures = []
let meshTotal = 0
for (const entry of zh) {
  for (const supercell of [1, 2]) {
    try {
      const model = await probe.loadEntry(entry.id, {
        supercell,
        theme: 'dark',
        bondTolerance: 1.15,
        palette,
        orbitalView: entry.orbital ? { isoFraction: 0.2, pMode: entry.orbital.l === 1 ? 'triple' : 'single' } : undefined,
      })
      let meshes = 0
      model.group.traverse((object) => {
        if (object.isMesh) meshes += 1
      })
      meshTotal += meshes
      if (!(model.radius > 0) || !Number.isFinite(model.radius)) {
        buildFailures.push(`${entry.id}@${supercell} radius=${model.radius}`)
      }
      if (meshes === 0) buildFailures.push(`${entry.id}@${supercell} no meshes`)
    } catch (error) {
      buildFailures.push(`${entry.id}@${supercell} ${String(error)}`)
    }
  }
}
check('all 53 entries build in 1× and 2× supercells', buildFailures.length === 0, buildFailures.slice(0, 5).join(' | '))
check('models produce geometry', meshTotal > 500, `meshes=${meshTotal}`)

// The CIF → 3D path used by custom structures.
const naclSource = readFileSync(path.join(solidsWorld, 'resources', 'cif-samples', 'nacl.cif'), 'utf8')
const naclStructure = probe.parseCifText(naclSource, 'nacl.cif')
const custom = probe.buildFromStructureData(naclStructure, {
  supercell: 1,
  theme: 'light',
  bondTolerance: 1.15,
  palette,
})
let customMeshes = 0
custom.group.traverse((object) => {
  if (object.isMesh) customMeshes += 1
})
check('builds a 3D model from a parsed CIF', customMeshes > 0 && custom.radius > 0, `meshes=${customMeshes}`)

const samplesDir = path.join(solidsWorld, 'resources', 'cif-samples')
const samples = readdirSync(samplesDir)
  .filter((file) => file.endsWith('.cif'))
  .sort()
for (const file of samples) {
  const expectation = JSON.parse(readFileSync(path.join(samplesDir, file.replace(/\.cif$/, '.json')), 'utf8'))
  const source = readFileSync(path.join(samplesDir, file), 'utf8')
  let outcome
  try {
    const structure = probe.parseCifText(source, file)
    outcome = { structure }
  } catch (error) {
    outcome = { error }
  }
  if (expectation.errorCode) {
    check(
      `${file} fails with ${expectation.errorCode}`,
      outcome.error?.code === expectation.errorCode,
      outcome.error ? String(outcome.error.code) : 'parsed successfully',
    )
    if (expectation.errorLine !== undefined) {
      check(`${file} reports line ${expectation.errorLine}`, outcome.error?.line === expectation.errorLine, String(outcome.error?.line))
    }
    continue
  }
  const structure = outcome.structure
  check(`${file} parses`, structure !== undefined, String(outcome.error))
  if (!structure) continue
  check(`${file} yields ${expectation.atomCount} atoms`, structure.atoms.length === expectation.atomCount, String(structure.atoms.length))
  if (expectation.elements) {
    const counts = {}
    for (const atom of structure.atoms) counts[atom.element] = (counts[atom.element] ?? 0) + 1
    check(
      `${file} element counts`,
      Object.entries(expectation.elements).every(([element, count]) => counts[element] === count),
      JSON.stringify(counts),
    )
  }
}

console.log('')
if (failures.length > 0) {
  console.error(`content: ${failures.length} failed`)
  process.exit(1)
}
console.log('content: all checks passed')
