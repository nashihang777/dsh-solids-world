import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { zh, type DictKey } from './zh'
import { en } from './en'
import { buildAtlasFor } from '../data/atlas'
import type { AtlasEntry } from '../data/types'

export type Locale = 'zh' | 'en'

const DICTS: Record<Locale, Record<DictKey, string>> = { zh, en }

export function translate(locale: Locale, key: DictKey, params?: Record<string, string | number>): string {
  let text = DICTS[locale][key] ?? key
  if (params) {
    for (const [name, val] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${name}\\}`, 'g'), String(val))
    }
  }
  return text
}

export interface LocaleContextValue {
  locale: Locale
  t: (key: DictKey, params?: Record<string, string | number>) => string
  entries: AtlasEntry[]
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      t: (key, params) => translate(locale, key, params),
      entries: buildAtlasFor(locale),
    }),
    [locale],
  )
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale 必须在 LocaleProvider 内使用')
  return ctx
}
