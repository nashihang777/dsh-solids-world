/**
 * Settings model shared with the desktop build of solids-world.
 *
 * The original file owned the on-disk settings.json lifecycle through node:fs.
 * The Harness plugin runs in the page, so persistence moves to the browser
 * storage owned by `../client/store.ts`; only the schema and its defaults stay
 * here so every renderer reference to `../electron/storage` keeps working.
 */

export interface WindowState {
  width: number
  height: number
  libraryCollapsed: boolean
  detailCollapsed: boolean
}

export type ThemeSetting = 'system' | 'dark' | 'light'
export type LocaleSetting = 'zh' | 'en'

export interface Settings {
  theme: ThemeSetting
  locale: LocaleSetting
  window: WindowState
  lastEntryId: string
  recentCif: string[]
  lessonDone: string[]
  quizPassed: string[]
  postfx: boolean
  bondTolerance: number
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  locale: 'zh',
  window: { width: 1280, height: 800, libraryCollapsed: false, detailCollapsed: false },
  lastEntryId: '',
  recentCif: [],
  lessonDone: [],
  quizPassed: [],
  postfx: true,
  bondTolerance: 1.15,
}

export function freshSettings(): Settings {
  return { ...DEFAULT_SETTINGS, window: { ...DEFAULT_SETTINGS.window } }
}

/** Merge a persisted (possibly partial or stale) document onto the defaults. */
export function normalizeSettings(raw: unknown): Settings {
  const base = freshSettings()
  if (raw === null || typeof raw !== 'object') return base
  const input = raw as Partial<Settings> & { window?: Partial<WindowState> }
  const theme = input.theme
  const locale = input.locale
  return {
    theme: theme === 'dark' || theme === 'light' || theme === 'system' ? theme : base.theme,
    locale: locale === 'zh' || locale === 'en' ? locale : base.locale,
    window: { ...base.window, ...(typeof input.window === 'object' && input.window ? input.window : {}) },
    lastEntryId: typeof input.lastEntryId === 'string' ? input.lastEntryId : base.lastEntryId,
    recentCif: Array.isArray(input.recentCif) ? input.recentCif.filter((item) => typeof item === 'string') : base.recentCif,
    lessonDone: Array.isArray(input.lessonDone) ? input.lessonDone.filter((item) => typeof item === 'string') : base.lessonDone,
    quizPassed: Array.isArray(input.quizPassed) ? input.quizPassed.filter((item) => typeof item === 'string') : base.quizPassed,
    postfx: typeof input.postfx === 'boolean' ? input.postfx : base.postfx,
    bondTolerance: typeof input.bondTolerance === 'number' ? input.bondTolerance : base.bondTolerance,
  }
}
