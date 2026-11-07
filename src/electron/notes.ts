/**
 * Notes model of the desktop build, kept as a pure schema here.
 *
 * The filesystem half lives in `../client/store.ts` for the Harness plugin.
 */

export interface Note {
  text: string
  at: number
}

export type NotesMap = Record<string, Note>

/** Return the next notes map for one entry: an empty note removes the record. */
export function withNote(notes: NotesMap, entryId: string, text: string, at: number): NotesMap {
  const next: NotesMap = { ...notes }
  if (text.trim().length === 0) {
    delete next[entryId]
  } else {
    next[entryId] = { text, at }
  }
  return next
}

/** Accept only well-formed persisted records. */
export function normalizeNotes(raw: unknown): NotesMap {
  if (raw === null || typeof raw !== 'object') return {}
  const out: NotesMap = {}
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (value === null || typeof value !== 'object') continue
    const record = value as { text?: unknown; at?: unknown }
    if (typeof record.text !== 'string' || typeof record.at !== 'number') continue
    out[key] = { text: record.text, at: record.at }
  }
  return out
}
