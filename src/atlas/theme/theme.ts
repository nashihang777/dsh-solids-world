/**
 * Atlas theme resolution.
 *
 * The desktop build wrote `data-theme` on <html>. Inside the Harness page that
 * would restyle the host shell, so the attribute lands on the atlas panel root
 * instead: `setThemeTarget` is called once by the panel wrapper, and the scoped
 * stylesheet reads `.sw-atlas[data-theme='light']`.
 */

export type ThemeSetting = 'system' | 'dark' | 'light'
export type ResolvedTheme = 'dark' | 'light'

let target: HTMLElement | null = null

export function setThemeTarget(element: HTMLElement | null): void {
  target = element
}

export function resolveTheme(theme: ThemeSetting, systemPrefersLight: boolean): ResolvedTheme {
  if (theme === 'dark') return 'dark'
  if (theme === 'light') return 'light'
  return systemPrefersLight ? 'light' : 'dark'
}

export function applyTheme(theme: ThemeSetting): void {
  const mq = window.matchMedia('(prefers-color-scheme: light)')
  const resolved = resolveTheme(theme, mq.matches)
  if (target) target.dataset.theme = resolved
  try {
    localStorage.setItem('sw:theme', theme)
  } catch {
    return
  }
}
