import type { SolidsApi } from './bridge'

declare global {
  interface Window {
    /** Installed by `installSolidsBridge` for the lifetime of the plugin. */
    solids: SolidsApi
  }
}

export {}
