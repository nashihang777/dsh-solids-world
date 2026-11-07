/**
 * Page-side replacement for the Electron preload bridge.
 *
 * The desktop app reached the main process through `window.solids` (see
 * electron/preload.ts). The Harness plugin runs entirely in the Web page, so
 * this module provides the same object with the same method signatures:
 * settings and notes persist in localStorage, CIF files arrive through the
 * browser File API, and the notes export downloads a Markdown file.
 */

import { DEFAULT_SETTINGS, normalizeSettings, type Settings } from '../electron/storage'
import { normalizeNotes, withNote, type Note, type NotesMap } from '../electron/notes'
import { parseCifText } from '../electron/cif/parse'
import { cifError, type CifError } from '../electron/cif/errors'
import type { StructureData } from '../electron/cif/structure'

export type CifOpenResult = { ok: true; structure: StructureData } | { ok: false; error: CifError }
export type ExportNotesResult = { ok: true; filePath: string } | { ok: false; canceled: true }

const SETTINGS_KEY = 'sw:settings'
const NOTES_KEY = 'sw:notes'
const RECENT_KEY = 'sw:recent-cif'
const MAX_RECENT = 10

type LogLevel = 'info' | 'warn' | 'error'

function readJson(key: string): unknown {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? null : JSON.parse(raw)
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Quota or a blocked storage partition: the atlas keeps working in memory.
  }
}

/** Files handed over by drag-and-drop or the file picker, keyed by a synthetic path. */
const pendingFiles = new Map<string, File>()

function virtualPath(file: File): string {
  return `sw-file:///${encodeURIComponent(file.name)}`
}

export interface SolidsApi {
  getSettings(): Promise<Settings>
  setSettings(next: Settings): Promise<{ ok: true }>
  log(level: LogLevel, message: string): void
  onSettingsChanged(callback: (next: Settings) => void): () => void
  openCif(path: string): Promise<CifOpenResult>
  pathForFile(file: File): string
  getRecentCif(): Promise<{ paths: string[] }>
  onCifRequestOpen(callback: (path: string) => void): () => void
  getNotes(): Promise<{ notes: Record<string, Note> }>
  saveNote(entryId: string, note: string): Promise<{ ok: true }>
  exportNotes(content: string): Promise<ExportNotesResult>
  clearNotes(): Promise<{ ok: true }>
  onRequestExportNotes(callback: () => void): () => void
  onShowHelp(callback: (topic: 'quickstart' | 'shortcuts') => void): () => void
}

let seedSettings: Partial<Settings> | null = null
let settings: Settings | null = null
const settingsListeners = new Set<(next: Settings) => void>()
const cifRequestListeners = new Set<(path: string) => void>()
const exportListeners = new Set<() => void>()
const helpListeners = new Set<(topic: 'quickstart' | 'shortcuts') => void>()

function currentSettings(): Settings {
  if (settings === null) {
    const stored = readJson(SETTINGS_KEY)
    settings =
      stored === null
        ? normalizeSettings({ ...DEFAULT_SETTINGS, ...(seedSettings ?? {}) })
        : normalizeSettings(stored)
  }
  return settings
}

export function createSolidsApi(seed?: Partial<Settings>): SolidsApi {
  seedSettings = seed ?? null
  settings = null
  return {
    async getSettings() {
      const value = currentSettings()
      return { ...value, window: { ...value.window } }
    },
    async setSettings(next) {
      settings = normalizeSettings(next)
      writeJson(SETTINGS_KEY, settings)
      const snapshot = currentSettings()
      for (const listener of settingsListeners) listener({ ...snapshot, window: { ...snapshot.window } })
      return { ok: true }
    },
    log(level, message) {
      if (level === 'error') console.warn(`[solids-world] ${message}`)
      else if (level === 'warn') console.debug(`[solids-world] ${message}`)
      else console.debug(`[solids-world] ${message}`)
    },
    onSettingsChanged(callback) {
      settingsListeners.add(callback)
      return () => settingsListeners.delete(callback)
    },
    async openCif(path) {
      const file = pendingFiles.get(path)
      if (!file) {
        return {
          ok: false,
          error: cifError('SYNTAX', 0, '无法读取该文件', '请重新拖入 .cif 文件。'),
        }
      }
      try {
        const source = await file.text()
        const structure = parseCifText(source, file.name)
        const recent = [file.name, ...readRecent().filter((item) => item !== file.name)].slice(0, MAX_RECENT)
        writeJson(RECENT_KEY, recent)
        return { ok: true, structure }
      } catch (err) {
        return { ok: false, error: err as CifError }
      }
    },
    pathForFile(file) {
      const path = virtualPath(file)
      pendingFiles.set(path, file)
      return path
    },
    async getRecentCif() {
      return { paths: readRecent() }
    },
    onCifRequestOpen(callback) {
      cifRequestListeners.add(callback)
      return () => cifRequestListeners.delete(callback)
    },
    async getNotes() {
      return { notes: normalizeNotes(readJson(NOTES_KEY)) }
    },
    async saveNote(entryId, note) {
      const next = withNote(normalizeNotes(readJson(NOTES_KEY)), entryId, note, Date.now())
      writeJson(NOTES_KEY, next)
      return { ok: true }
    },
    async exportNotes(content) {
      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
      downloadText(`solids-world-notes-${stamp}.md`, content)
      return { ok: true, filePath: `solids-world-notes-${stamp}.md` }
    },
    async clearNotes() {
      writeJson(NOTES_KEY, {})
      return { ok: true }
    },
    onRequestExportNotes(callback) {
      exportListeners.add(callback)
      return () => exportListeners.delete(callback)
    },
    onShowHelp(callback) {
      helpListeners.add(callback)
      return () => helpListeners.delete(callback)
    },
  }
}

function readRecent(): string[] {
  const value = readJson(RECENT_KEY)
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

function downloadText(fileName: string, content: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.rel = 'noopener'
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Install the bridge, returning a disposer that restores the previous value. */
export function installSolidsBridge(seed?: Partial<Settings>): () => void {
  const target = window as unknown as { solids?: SolidsApi }
  const previous = target.solids
  target.solids = createSolidsApi(seed)
  return () => {
    target.solids = previous
  }
}

export { DEFAULT_SETTINGS, type NotesMap, type Settings }
