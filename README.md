# solids-world for DeepSeek Harness

An interactive 3D atlas of solid-state and atomic physics, delivered as a DeepSeek
Harness plugin: **固体世界 / Solids world**.

This package re-hosts the desktop app
[solids-world](https://github.com/nashihang777/solids-world) inside the Harness
Web page. It contributes a global sidebar icon and a full central panel, so the
atlas reads like a first-class part of the app rather than a widget.

## What it does

- **53 bilingual atlas entries** in five sections: crystal structures (12),
  Bravais lattices (14), atoms and orbitals (11), symmetry (11), lattice
  dynamics (5).
- **Programmatic 3D**: every model is computed from the physics at run time —
  spheres, bonds, cell frames, isosurfaces and animations. No model files, no
  network access.
- **Stepped lessons** whose camera focus and hotspot highlights follow each step,
  plus a **quiz** per entry; passing both is recorded in the entry's progress.
- **Notes** per entry, an aggregate view, and one-click **Markdown export**
  (downloads a `.md` file).
- **Gallery** of all entries with lesson/quiz status.
- **Search** over Chinese, English, aliases and pinyin (`/` focuses the box).
- **3D controls**: 1×/2× supercell, bonds, atom labels, clipping planes, spin,
  reset/focus/zoom; orbitals add isosurface threshold, phase mode, opacity,
  nodal surfaces and radial range; symmetry and dynamics entries add play,
  pause, speed, single-step and parameter sliders.
- **CIF import**: drop a `.cif` file onto the panel or use **Open CIF** in the
  top bar. Lexing, parsing, space-group expansion and structure extraction all
  run locally; syntax errors, unknown space groups and oversized files are
  reported.
- **Bilingual** UI with a zh/en switch, a light/dark theme, and respect for the
  system "reduce motion" preference.
- **Keyboard**: arrow keys step entries, `/` focuses search, `F` focuses the
  stage, `Ctrl/⌘+D` opens a random entry, `Esc` closes the topmost layer.

## Install

From the workspace that contains this directory:

1. Make sure `client.js` is present (it is committed). To rebuild it, see below.
2. Install the bundle from the parent directory with the plugin manager,
   pointing at this package directory:

   ```
   plugin_manager action=install_bundle target=<absolute path to solids-world-harness>
   ```

3. Open **固体世界 / Solids world** from the sidebar panel column. Its icon sits
   below the built-in panel icons.

The bundle stores settings and notes in the page's `localStorage`, so they
survive a restart, and stay independent of any other profile data.

## Build

`client.js` is generated. Rebuild after changing anything under `src/`:

```bash
node scripts/build.mjs
```

The build needs esbuild, postcss and `three`. It looks for them in
`node_modules/` here first, then in a `solids-world` checkout (default: the
sibling `../solids-world`, or wherever `SOLIDS_WORLD_SRC` points). So either
`npm install` in this folder, or clone the
[upstream app](https://github.com/nashihang777/solids-world) and point
`SOLIDS_WORLD_SRC` at it. Running the plugin never needs either: `client.js` is
standalone.

`tsconfig.json` is for editors and type checking only. The build pins its own
compiler options (`tsconfigRaw`), so it cannot drift with that file — notably it
keeps `useDefineForClassFields: false`, the semantics the upstream Vite build
used.

The script:

1. generates `src/atlas/three/builders-map.ts` — the desktop app enumerated its
   53 builders with Vite's `import.meta.glob`, which esbuild does not support;
2. scopes the desktop stylesheet to `.sw-atlas` with PostCSS, so the atlas
   cannot restyle the host page;
3. bundles `src/client/index.tsx` as an IIFE with three.js inlined and `react`
   resolved to the host's instance;
4. wraps the bundle in the `window.__ModuleLoader__.load` factory contract.

## Verify

Two headless checks ship with the sources. Both reuse the `solids-world`
checkout's `node_modules`, so no install is needed:

```bash
node scripts/smoke.mjs          # loads client.js like the module loader does
node scripts/check-content.mjs  # atlas data, 53 models, CIF samples
```

`smoke.mjs` runs the built bundle inside jsdom with a stand-in module loader and
host context, mounts the panel and asserts what a broken port would lose: the
scoped panel root, inherited theme and locale, all 53 library rows, entry
selection, the help modal, the CIF input, settings/notes persistence, language
switching, and cleanup on unload. jsdom has no WebGL, so the 3D stage degrades
to its fallback notice there.

`check-content.mjs` asserts that both locales expose the same 53 entries with
lessons and quizzes, that every entry owns exactly one 3D builder, that all 53
models construct in 1× and 2× supercells, that a parsed CIF becomes a model, and
that the bundled CIF samples still produce their recorded atoms, elements and
error codes.

Type checking uses the same checkout:

```bash
New-Item -ItemType Junction -Path node_modules -Target ../solids-world/node_modules
node node_modules/typescript/bin/tsc -p tsconfig.json --noEmit
```

A page refresh (or a Harness restart) is needed after rebuilding `client.js` to
load the new Client module generation.

## Layout

```
index.js                 Host half (the atlas needs no Host service)
client.js                built Client half
cordis.patch.yml         bundle row
locale/{en,zh}.json      display metadata
src/client/index.tsx     slot registration, theme/locale inheritance, icon
src/client/bridge.ts     page replacement for the Electron preload
src/atlas/**             the desktop renderer, ported
src/electron/**          CIF parser + settings/notes schema, ported
```

The two regressions worth knowing about when editing `src/atlas`: `three/Stage.tsx`
is rewritten against plain three.js (the host page supplies no react-three-fiber),
and `App.tsx` scopes drag-and-drop plus keyboard handling to the panel instead of
the whole document.

## Differences from the desktop app

- **No post-processing**: the N8AO ambient-occlusion and bloom passes are gone,
  because they need react-three-fiber's composer. The `postfx` setting now only
  selects the render resolution tier. Lighting, geometry, materials and colors
  are otherwise unchanged.
- **No native window chrome**: regressions live in the panel; the Electron menu
  becomes the top bar's **Open CIF** button, and the notes export downloads a
  file instead of opening a save dialog.
- **Keyboard shortcuts are panel-scoped** so they never steal keys from the
  Harness shell.
- **Layout breakpoints** are viewport-based in the original stylesheet; in a
  narrow panel on a wide screen the three-column layout keeps its desktop
  proportions.

## Attribution and license

MIT. The renderer, entry data, lessons, quizzes and CIF parser come from
**solids-world** (© 2026 世界航海, MIT) — see [NOTICE](./NOTICE) and
[LICENSE](./LICENSE). The plugin scaffolding (bundle manifest, client entry,
page bridge, build script, icon) is original to this package.
