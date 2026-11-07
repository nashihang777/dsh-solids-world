/**
 * Client half of the solids-world Harness plugin.
 *
 * It contributes two seats: a global panel icon in the sidebar and the keyed
 * `main` panel that renders the atlas. The atlas itself is the desktop app's
 * renderer (data, 3D builders, lessons, quizzes, notes, CIF parsing) re-hosted
 * inside the page, with `./bridge.ts` standing in for the Electron preload.
 */

import { useCallback } from 'react'
import { App } from '../atlas/App'
import { resolveTheme, setThemeTarget, type ThemeSetting } from '../atlas/theme/theme'
import { installSolidsBridge } from './bridge'
import type { Settings } from '../electron/storage'

declare const __SW_CSS__: string

const PANEL_ID = 'solids-world'
const NS = 'solidsWorld'
const THEME_KEY = 'sw:theme'

const DICT = {
  zh: {
    'panel.title': '固体世界',
    'panel.description': '固体物理与原子物理的交互式 3D 图鉴',
  },
  en: {
    'panel.title': 'Solids world',
    'panel.description': 'An interactive 3D atlas of solid-state and atomic physics',
  },
}

type Locale = 'zh' | 'en'

/** Read the resolved `--dsw-alias-bg-base` token to match the host light/dark mode. */
function detectHostTheme(): 'light' | 'dark' {
  try {
    const raw = getComputedStyle(document.body).getPropertyValue('--dsw-alias-bg-base').trim()
    if (raw.length > 0) {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (context) {
        context.fillStyle = '#000000'
        context.fillStyle = raw
        const normalized = String(context.fillStyle)
        const hex = /^#([0-9a-f]{6})$/i.exec(normalized)
        if (hex) {
          const value = parseInt(hex[1], 16)
          const r = (value >> 16) & 0xff
          const g = (value >> 8) & 0xff
          const b = value & 0xff
          const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
          return luminance > 0.55 ? 'light' : 'dark'
        }
      }
    }
  } catch {
    // Fall through to the operating-system preference.
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

/** Read the host locale defensively: the snapshot shape is not part of the contract. */
function detectHostLocale(localeService: unknown): Locale {
  const candidate = localeService as
    | { getLocale?: () => unknown; getSnapshot?: () => unknown }
    | undefined
  for (const method of ['getLocale', 'getSnapshot'] as const) {
    try {
      const snapshot = candidate?.[method]?.()
      const id =
        typeof snapshot === 'string'
          ? snapshot
          : snapshot && typeof snapshot === 'object'
            ? ((snapshot as { id?: unknown; locale?: unknown; language?: unknown }).id ??
              (snapshot as { locale?: unknown }).locale ??
              (snapshot as { language?: unknown }).language)
            : undefined
      if (typeof id === 'string' && id.length > 0) {
        return id.toLowerCase().startsWith('zh') ? 'zh' : 'en'
      }
    } catch {
      // Try the next accessor.
    }
  }
  const language = (document.documentElement.lang || navigator.language || '').toLowerCase()
  return language.startsWith('zh') ? 'zh' : language.length > 0 ? 'en' : 'zh'
}

function readStoredTheme(): ThemeSetting | null {
  try {
    const value = localStorage.getItem(THEME_KEY)
    return value === 'dark' || value === 'light' || value === 'system' ? value : null
  } catch {
    return null
  }
}

function prefersLight(): boolean {
  return window.matchMedia('(prefers-color-scheme: light)').matches
}

interface PanelEnv {
  hostTheme: 'light' | 'dark'
}

function createAtlasPanel(env: PanelEnv) {
  return function AtlasPanel() {
    const mountRef = useCallback(
      (element: HTMLDivElement | null) => {
        setThemeTarget(element)
        if (!element) return
        element.dataset.theme = resolveTheme(readStoredTheme() ?? env.hostTheme, prefersLight())
      },
      [],
    )
    return (
      <div className="sw-atlas" ref={mountRef}>
        <style>{__SW_CSS__}</style>
        <App />
      </div>
    )
  }
}

function PanelIcon({ size, active }: { size: number; active: boolean }) {
  const stroke = active ? 'var(--dsw-alias-brand-primary)' : 'var(--dsw-alias-label-secondary)'
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.1 20.2 7.7v8.6L12 20.9 3.8 16.3V7.7z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M3.8 7.7 12 12.3l8.2-4.6M12 12.3v8.6" stroke={stroke} strokeWidth="1.2" opacity="0.65" />
      <circle cx="12" cy="12.3" r="1.65" fill={stroke} />
    </svg>
  )
}

export interface ClientContext {
  effect(callback: () => (() => void) | void, label?: string): void
  slots: {
    inject(key: string, callback: () => () => void): () => void
    register(options: Record<string, unknown>, component: unknown): () => void
  }
  locale: {
    bind(namespace: string): (key: string, params?: Record<string, string | number>) => string
    register(namespace: string, dicts: Record<string, Record<string, string>>): () => void
  }
  get(name: string): unknown
}

export default function createPlugin() {
  return {
    inject: ['slots', 'locale'],
    apply(ctx: ClientContext) {
      const t = ctx.locale.bind(NS)
      const hostTheme = detectHostTheme()
      const hostLocale = detectHostLocale(ctx.locale ?? ctx.get('locale'))

      ctx.effect(() => ctx.locale.register(NS, DICT), 'solids world: dictionaries')

      const seed: Partial<Settings> = { theme: hostTheme, locale: hostLocale }
      ctx.effect(() => installSolidsBridge(seed), 'solids world: page bridge')

      ctx.effect(
        () =>
          ctx.slots.inject('sidebar.panellist', () =>
            ctx.slots.register(
              {
                name: 'sidebar.panellist',
                id: PANEL_ID,
                order: 20,
                label: () => t('panel.title'),
              },
              PanelIcon,
            ),
          ),
        'solids world: sidebar entry',
      )

      const AtlasPanel = createAtlasPanel({ hostTheme })
      ctx.effect(
        () =>
          ctx.slots.inject('main', () =>
            ctx.slots.register(
              {
                name: 'main',
                key: PANEL_ID,
                label: () => t('panel.title'),
              },
              AtlasPanel,
            ),
          ),
        'solids world: atlas panel',
      )
    },
  }
}
