import type { AtlasEntry } from './types'
import { EXTRA_ALIASES } from './aliases'
import { PINYIN } from './pinyin'

export const SEARCH_RESULT_LIMIT = 12

export interface SearchHit {
  entry: AtlasEntry
  level: number
}

export function searchEntries(query: string, entries: AtlasEntry[]): AtlasEntry[] {
  const q = query.trim().toLowerCase()
  if (q.length === 0) return []
  const contentSearch = q.length >= 2
  const hits: SearchHit[] = []
  for (const entry of entries) {
    const name = entry.name.toLowerCase()
    const aliases = [...entry.aliases, ...(EXTRA_ALIASES[entry.id] ?? [])].map((alias) => alias.toLowerCase())
    const pinyins = (PINYIN[entry.id] ?? []).map((p) => p.toLowerCase())
    let level = 0
    if (name === q) level = 1
    else if (name.includes(q)) level = 2
    else if (aliases.some((alias) => alias.includes(q))) level = 3
    else if (pinyins.some((p) => p.includes(q))) level = 4
    else if (contentSearch) {
      const haystack = [
        entry.english,
        entry.summary,
        entry.trivia,
        ...entry.facts.map((fact) => fact.value),
        ...entry.guide.lesson.flatMap((step) => [step.title, step.body]),
        ...entry.guide.quiz.map((question) => question.question),
      ]
        .join('\n')
        .toLowerCase()
      if (haystack.includes(q)) level = 5
    }
    if (level > 0) hits.push({ entry, level })
  }
  hits.sort((a, b) => a.level - b.level || a.entry.id.localeCompare(b.entry.id))
  return hits.slice(0, SEARCH_RESULT_LIMIT).map((hit) => hit.entry)
}
