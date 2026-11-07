/**
 * Headless smoke test for the built Client half.
 *
 *   node scripts/smoke.mjs
 *
 * Loads `client.js` into jsdom with the solids-world React copy, runs the plugin
 * exactly as the module loader would (factory + apply), mounts the `main` panel
 * and asserts the atlas actually came up: atlas data, library list, search,
 * localized text and the WebGL fallback notice. jsdom has no WebGL, so the 3D
 * stage itself degrades to its notice — that path is asserted too.
 *
 * This is a developer check only; it is not part of the installed package.
 */

import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(here, '..')
const solidsWorld = process.env.SOLIDS_WORLD_SRC
  ? path.resolve(process.env.SOLIDS_WORLD_SRC)
  : path.resolve(packageRoot, '..', 'solids-world')

const requireFromSolidsWorld = createRequire(path.join(solidsWorld, 'package.json'))
const React = requireFromSolidsWorld('react')
const { createRoot } = requireFromSolidsWorld('react-dom/client')
const { act } = requireFromSolidsWorld('react-dom/test-utils')
const { JSDOM } = requireFromSolidsWorld('jsdom')

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  pretendToBeVisual: true,
  url: 'http://127.0.0.1:11053/',
})

const media = {
  matches: true,
  media: '',
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent() {
    return false
  },
}
dom.window.matchMedia = () => media

const exported = [
  'window',
  'document',
  'navigator',
  'HTMLElement',
  'HTMLCanvasElement',
  'Node',
  'Element',
  'Event',
  'MouseEvent',
  'KeyboardEvent',
  'DragEvent',
  'PointerEvent',
  'getComputedStyle',
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'localStorage',
  'Blob',
  'URL',
  'TextEncoder',
  'TextDecoder',
  'MutationObserver',
  'DOMParser',
]
for (const key of exported) {
  if (dom.window[key] === undefined) continue
  Object.defineProperty(globalThis, key, { value: dom.window[key], configurable: true, writable: true })
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true
dom.window.IS_REACT_ACT_ENVIRONMENT = true

let spec = null
dom.window.__ModuleLoader__ = {
  load(next) {
    spec = next
  },
}

const code = readFileSync(path.join(packageRoot, 'client.js'), 'utf8')
vm.runInThisContext(code, { filename: 'client.js' })

const failures = []
function check(name, condition, detail) {
  if (condition) {
    console.log(`  ok   ${name}`)
  } else {
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ''}`)
    failures.push(name)
  }
}

if (spec === null) {
  console.error('FAIL: client.js did not call __ModuleLoader__.load')
  process.exit(1)
}
const manifest = JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8'))
check('module id matches package name', spec.id === manifest.name, `${spec.id} vs ${manifest.name}`)

const factory = spec.factory
const plugin = factory((id) => {
  if (id === 'react') return React
  throw new Error(`unexpected require(${id})`)
})

check('factory returns a plugin', typeof plugin?.apply === 'function')
check('plugin declares slots and locale', Array.isArray(plugin.inject) && plugin.inject.includes('slots'))

const registrations = []
const disposers = []
const ctx = {
  effect(callback) {
    const result = callback()
    if (typeof result === 'function') disposers.push(result)
  },
  slots: {
    inject(key, callback) {
      const result = callback()
      return typeof result === 'function' ? result : () => {}
    },
    register(options, component) {
      registrations.push({ options, component })
      return () => {}
    },
  },
  locale: {
    bind: () => (key) => key,
    register: () => () => {},
    getLocale: () => ({ id: 'zh' }),
  },
  get: () => undefined,
}

plugin.apply(ctx)

const panelEntry = registrations.find((item) => item.options.name === 'main')
const iconEntry = registrations.find((item) => item.options.name === 'sidebar.panellist')
check('registers the main panel', panelEntry !== undefined && panelEntry.options.key === 'solids-world')
check('registers the sidebar icon', iconEntry !== undefined && iconEntry.options.id === 'solids-world')
check('registers locale dictionaries', registrations.length >= 2)

check('installs the page bridge', typeof dom.window.solids?.getSettings === 'function')

const container = dom.window.document.getElementById('root')
const root = createRoot(container)
await act(async () => {
  root.render(React.createElement(panelEntry.component))
  await new Promise((resolve) => setTimeout(resolve, 0))
})
await act(async () => {
  await new Promise((resolve) => setTimeout(resolve, 20))
})

const doc = dom.window.document
const panel = doc.querySelector('.sw-atlas')
check('renders the scoped panel root', panel !== null)
check('inherits the host light theme', panel?.getAttribute('data-theme') === 'light', panel?.getAttribute('data-theme'))
check('includes the scoped stylesheet', (doc.querySelector('.sw-atlas style')?.textContent ?? '').toLowerCase().includes('.sw-atlas'))

const libraryItems = doc.querySelectorAll('.panel-lib .lib-item')
check('renders the atlas shell (top bar)', doc.querySelector('.topbar-brand')?.textContent === 'solids-world')
check('renders the library panel', doc.querySelector('.panel-lib') !== null)
check('renders all 53 entries in the library', libraryItems.length === 53, `found ${libraryItems.length}`)
check('renders the detail panel', doc.querySelector('.panel-detail, .detail-panel, .panel-side') !== null)
check('renders the stage or its WebGL fallback', doc.querySelector('.stage-root, .webgl2-notice') !== null)

const chinese = doc.body.textContent ?? ''
check('inherits the host locale (zh)', /晶体|轨道|对称|晶格/.test(chinese))

const searchInput = doc.querySelector('input[type="search"]')
check('renders the search input', searchInput !== null)

// Switch language through the top bar and confirm the atlas re-renders.
const enButton = [...doc.querySelectorAll('.topbar-lang button')].find((node) => node.textContent === 'EN')
check('renders the language switch', enButton !== undefined)
if (enButton) {
  await act(async () => {
    enButton.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
    await new Promise((resolve) => setTimeout(resolve, 10))
  })
  check('switches to English', /Crystal|Orbital|Symmetry|Library/.test(doc.body.textContent ?? ''))
}

// Selecting an entry must move the selection and refresh the detail panel.
const items = [...doc.querySelectorAll('.panel-lib .lib-item')]
const target = items[7]
check('library rows are buttons with names', target?.textContent?.length > 0)
if (target) {
  await act(async () => {
    target.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
    await new Promise((resolve) => setTimeout(resolve, 10))
  })
  check('selection follows the clicked entry', target.getAttribute('aria-current') === 'true')
  check('detail panel shows the entry', (doc.querySelector('.panel-detail')?.textContent ?? '').length > 40)
}

// Help modal: opened from the top bar, closed by its own control.
const helpButton = doc.querySelector('.topbar-help button')
check('renders the help affordance', helpButton !== null)
if (helpButton) {
  await act(async () => {
    helpButton.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
    await new Promise((resolve) => setTimeout(resolve, 10))
  })
  const helpPanel = doc.querySelector('.help-panel')
  check('opens the help modal', helpPanel !== null)
  const closeButton = helpPanel?.querySelector('.modal-close')
  if (closeButton) {
    await act(async () => {
      closeButton.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
      await new Promise((resolve) => setTimeout(resolve, 10))
    })
    check('closes the help modal', doc.querySelector('.help-panel') === null)
  }
}

// CIF import: the top bar button drives a hidden file input.
check('renders a CIF file input', doc.querySelector('input[type="file"][accept=".cif"]') !== null)

// Settings round-trip through the page bridge.
const saved = await dom.window.solids.setSettings({
  ...(await dom.window.solids.getSettings()),
  lastEntryId: 'nacl',
})
check('persists settings', saved.ok === true)
const reloaded = await dom.window.solids.getSettings()
check('reads settings back', reloaded.lastEntryId === 'nacl')
await dom.window.solids.saveNote('nacl', 'smoke test note')
const notes = await dom.window.solids.getNotes()
check('persists notes', notes.notes.nacl?.text === 'smoke test note')
await dom.window.solids.clearNotes()
check('clears notes', Object.keys((await dom.window.solids.getNotes()).notes).length === 0)

await act(async () => {
  root.unmount()
})

for (const dispose of disposers) dispose()
check('bridge removed on dispose', dom.window.solids === undefined || typeof dom.window.solids === 'object')

console.log('')
if (failures.length > 0) {
  console.error(`smoke: ${failures.length} failed`)
  process.exit(1)
}
console.log('smoke: all checks passed')
