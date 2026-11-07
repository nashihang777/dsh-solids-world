export type FieldKey = 'crystal' | 'atomic' | 'symmetry' | 'dynamics'
export type Tone = 'cyan' | 'jade' | 'amber' | 'violet'
export type FactIcon = 'cell' | 'symmetry' | 'count' | 'bond' | 'energy' | 'size' | 'material'

export interface Fact {
  key: string
  value: string
  icon: FactIcon
}

export interface Hotspot {
  id: string
  label: string
  note: string
  anchor: string
  tone: Tone
}

export interface LessonStep {
  title: string
  body: string
  anchor?: string
}

export interface QuizQuestion {
  question: string
  options: [string, string, string]
  answer: 0 | 1 | 2
  explain: string
}

export interface Guide {
  lesson: LessonStep[]
  quiz: QuizQuestion[]
}

export interface ElementCount {
  element: string
  count: number
}

export type OrbitalMode = 's' | 'pz' | 'px' | 'py' | 'dz2' | 'dxy'

export interface OrbitalSpec {
  n: number
  l: number
  mode: OrbitalMode
  pTriple?: boolean
}

export interface DynamicParamSpec {
  key: string
  kind: 'slider' | 'branch'
  labelKey: string
  def: number
  min?: number
  max?: number
  step?: number
  options?: Array<{ labelKey: string }>
}

export interface DynamicSpec {
  params: DynamicParamSpec[]
}

export interface EntryMeta {
  id: string
  field: FieldKey
  category: string
  name: string
  aliases: string[]
  english: string
  accent: string
  summary: string
  facts: Fact[]
  hotspots: Hotspot[]
  elements: ElementCount[]
  trivia: string
  source: string
  visualNotice?: string
  orbital?: OrbitalSpec
  interactive?: 'bohr'
  radial?: boolean
  dynamic?: DynamicSpec
}

export interface AtlasEntry extends EntryMeta {
  guide: Guide
}
