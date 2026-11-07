import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Settings } from '../electron/storage'
import type { Note } from '../electron/notes'
import type { CifError } from '../electron/cif/errors'
import { formatCifError } from '../electron/cif/errors'
import type { StructureData } from '../electron/cif/structure'
import { buildAtlasFor } from './data/atlas'
import type { Hotspot, LessonStep } from './data/types'
import { LibraryPanel } from './components/LibraryPanel'
import { StagePanel, type OrbitalControlState } from './components/StagePanel'
import { DetailPanel } from './components/DetailPanel'
import { TopBar } from './components/TopBar'
import { LessonModal } from './components/LessonModal'
import { QuizModal } from './components/QuizModal'
import { GalleryModal } from './components/GalleryModal'
import { NotesOverview } from './components/NotesOverview'
import { HelpModal, type HelpTopic } from './components/HelpModal'
import { applyTheme, resolveTheme } from './theme/theme'
import { LocaleProvider, translate, type Locale } from './i18n/LocaleProvider'
import type { StageApi } from './three/Stage'
import type { StageEvent } from './three/kit'

function buildNotesMarkdown(
  locale: Locale,
  notes: Record<string, Note>,
  entryNames: Map<string, string>,
): string {
  const lines: string[] = [translate(locale, 'notes.md.title'), '', translate(locale, 'notes.md.exported-at', { time: new Date().toISOString() }), '']
  for (const [entryId, note] of Object.entries(notes)) {
    const name = entryNames.get(entryId) ?? entryId
    lines.push(`## ${name}`, '', note.text, '', translate(locale, 'notes.md.updated-at', { time: new Date(note.at).toISOString() }), '')
  }
  return lines.join('\n')
}

export function App() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null)
  const [systemLight, setSystemLight] = useState(() => window.matchMedia('(prefers-color-scheme: light)').matches)
  const [supercell, setSupercell] = useState<1 | 2>(1)
  const [showBonds, setShowBonds] = useState(true)
  const [showLabels, setShowLabels] = useState(false)
  const [spin, setSpin] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [customStructure, setCustomStructure] = useState<StructureData | null>(null)
  const [cifError, setCifError] = useState<CifError | null>(null)
  const [cifErrorSize, setCifErrorSize] = useState<number | undefined>(undefined)
  const [notes, setNotes] = useState<Record<string, Note>>({})
  const [lessonOpen, setLessonOpen] = useState(false)
  const [quizOpen, setQuizOpen] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const [helpTopic, setHelpTopic] = useState<HelpTopic | null>(null)
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null)
  const [atomicLabels, setAtomicLabels] = useState(true)
  const [clipAxis, setClipAxis] = useState(0)
  const [symSpeed, setSymSpeed] = useState(1)
  const [animPlaying, setAnimPlaying] = useState(true)
  const [animSpeed, setAnimSpeed] = useState(1)
  const [animParams, setAnimParams] = useState<Record<string, number>>({})
  const [animStepTick, setAnimStepTick] = useState(0)
  const [orbitalControls, setOrbitalControls] = useState<OrbitalControlState>({
    isoFraction: 0.2,
    pMode: 'single',
    opacity: 0.6,
    showNodal: true,
    radialR: 1,
  })
  const stageApiRef = useRef<StageApi | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const locale: Locale = settings?.locale ?? 'zh'
  const entries = useMemo(() => buildAtlasFor(locale), [locale])
  const t = useMemo(() => (key: Parameters<typeof translate>[1], params?: Record<string, string | number>) => translate(locale, key, params), [locale])

  useEffect(() => {
    let alive = true
    void window.solids.getSettings().then((next) => {
      if (!alive) return
      setSettings(next)
      applyTheme(next.theme)
      setSelectedId(
        next.lastEntryId && entries.some((entry) => entry.id === next.lastEntryId) ? next.lastEntryId : entries[0]?.id ?? null,
      )
    })
    void window.solids.getNotes().then((result) => {
      if (!alive) return
      setNotes(result.notes)
    })
    const off = window.solids.onSettingsChanged((next) => {
      setSettings(next)
      applyTheme(next.theme)
    })
    return () => {
      alive = false
      off()
    }
  }, [entries])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = () => {
      setSystemLight(mq.matches)
      applyTheme(settings?.theme ?? 'system')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [settings?.theme])

  useEffect(() => {
    window.solids.log('info', `perf renderer:react-mounted +${Math.round(performance.now())}ms`)
  }, [])

  const showToast = useCallback((message: string) => {
    setToast({ id: Date.now(), message })
  }, [])

  const handleOrbitalChange = useCallback((patch: Partial<OrbitalControlState>) => {
    setOrbitalControls((prev) => ({ ...prev, ...patch }))
  }, [])

  const entry = useMemo(() => entries.find((item) => item.id === selectedId) ?? null, [entries, selectedId])

  useEffect(() => {
    setAnimPlaying(true)
    setAnimSpeed(1)
    setAnimParams({})
    setAnimStepTick(0)
    if (entry?.dynamic) {
      const defaults: Record<string, number> = {}
      for (const param of entry.dynamic.params) defaults[param.key] = param.def
      setAnimParams(defaults)
    }
  }, [entry?.id, entry?.dynamic])

  const handleStageEvent = useCallback(
    (event: StageEvent) => {
      showToast(
        t(event.emission ? 'bohr.emit' : 'bohr.absorb', {
          from: event.from,
          to: event.to,
          energy: event.energy.toFixed(2),
        }),
      )
    },
    [showToast, t],
  )

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(null), 3000)
    return () => window.clearTimeout(id)
  }, [toast])

  const openCifPath = useCallback((path: string) => {
    const started = performance.now()
    void window.solids.openCif(path).then((result) => {
      if (result.ok) {
        setCifError(null)
        setCifErrorSize(undefined)
        setCustomStructure(result.structure)
        setActiveHotspotId(null)
        setLessonOpen(false)
        setQuizOpen(false)
        setSupercell(1)
        setShowBonds(true)
        setShowLabels(false)
        window.solids.log('info', `perf cif-open:${path} ${Math.round(performance.now() - started)}ms render-ready`)
      } else {
        setCifError(result.error)
        setCifErrorSize(result.error.code === 'FILE_TOO_LARGE' ? 5 * 1024 * 1024 : undefined)
      }
    })
  }, [])

  useEffect(() => {
    const off = window.solids.onCifRequestOpen((path) => openCifPath(path))
    return () => off()
  }, [openCifPath])

  useEffect(() => {
    const off = window.solids.onShowHelp((topic) => setHelpTopic(topic))
    return () => off()
  }, [])

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    const onDragOver = (event: DragEvent) => {
      event.preventDefault()
    }
    const onDrop = (event: DragEvent) => {
      event.preventDefault()
      const files = event.dataTransfer?.files
      if (!files || files.length === 0) return
      const file = files[0]
      if (file && file.name.toLowerCase().endsWith('.cif')) {
        openCifPath(window.solids.pathForFile(file))
      }
    }
    node.addEventListener('dragover', onDragOver)
    node.addEventListener('drop', onDrop)
    return () => {
      node.removeEventListener('dragover', onDragOver)
      node.removeEventListener('drop', onDrop)
    }
  }, [openCifPath])

  useEffect(() => {
    const entryNames = new Map(entries.map((entry) => [entry.id, entry.name]))
    const off = window.solids.onRequestExportNotes(() => {
      if (Object.keys(notes).length === 0) {
        showToast(t('toast.export-empty'))
        return
      }
      const content = buildNotesMarkdown(locale, notes, entryNames)
      void window.solids.exportNotes(content).then((result) => {
        if (result.ok) showToast(t('toast.exported', { path: result.filePath }))
      })
    })
    return () => off()
  }, [notes, locale, t, showToast])

  const toggleLibrary = useCallback(() => {
    setSettings((prev) => {
      if (!prev) return prev
      const next = { ...prev, window: { ...prev.window, libraryCollapsed: !prev.window.libraryCollapsed } }
      void window.solids.setSettings(next)
      return next
    })
  }, [])

  const toggleDetail = useCallback(() => {
    setSettings((prev) => {
      if (!prev) return prev
      const next = { ...prev, window: { ...prev.window, detailCollapsed: !prev.window.detailCollapsed } }
      void window.solids.setSettings(next)
      return next
    })
  }, [])

  const changeLocale = useCallback((next: Locale) => {
    setSettings((prev) => {
      if (!prev || prev.locale === next) return prev
      const updated = { ...prev, locale: next }
      void window.solids.setSettings(updated)
      return updated
    })
  }, [])

  const selectEntry = useCallback((id: string) => {
    setActiveHotspotId(null)
    setSupercell(1)
    setShowBonds(true)
    setShowLabels(false)
    setCustomStructure(null)
    setCifError(null)
    setLessonOpen(false)
    setQuizOpen(false)
    setSelectedId(id)
    setSettings((prev) => {
      if (!prev || prev.lastEntryId === id) return prev
      const next = { ...prev, lastEntryId: id }
      void window.solids.setSettings(next)
      return next
    })
  }, [])

  const handleHotspotSelect = useCallback((hotspot: Hotspot) => {
    setActiveHotspotId((prev) => (prev === hotspot.id ? null : hotspot.id))
  }, [])

  const randomEntry = useCallback(() => {
    if (entries.length === 0) return
    const idx = entries.findIndex((entry) => entry.id === selectedId)
    const next = (idx * 5 + 3) % entries.length
    const target = next === idx ? (idx + 1) % entries.length : next
    selectEntry(entries[target]?.id ?? entries[0].id)
  }, [entries, selectedId, selectEntry])

  const resetView = useCallback(() => {
    stageApiRef.current?.reset()
    setSupercell(1)
    setShowBonds(true)
    setShowLabels(false)
  }, [])

  const stepEntry = useCallback(
    (delta: number) => {
      if (entries.length === 0) return
      const idx = entries.findIndex((entry) => entry.id === selectedId)
      const current = idx < 0 ? 0 : idx
      const next = (current + delta + entries.length) % entries.length
      selectEntry(entries[next]?.id ?? entries[0].id)
    },
    [entries, selectedId, selectEntry],
  )

  const handleStepChange = useCallback(
    (step: LessonStep | null) => {
      if (!step || !step.anchor) {
        setActiveHotspotId(null)
        return
      }
      const hotspot = entry?.hotspots.find((h) => h.anchor === step.anchor)
      if (hotspot) setActiveHotspotId(hotspot.id)
    },
    [entry],
  )

  const finishLesson = useCallback(() => {
    const id = selectedId
    if (!id) return
    setSettings((prev) => {
      if (!prev || prev.lessonDone.includes(id)) return prev
      const next = { ...prev, lessonDone: [...prev.lessonDone, id] }
      void window.solids.setSettings(next)
      return next
    })
  }, [selectedId])

  const finishQuiz = useCallback(
    (passed: boolean) => {
      const id = selectedId
      if (!passed || !id) return
      setSettings((prev) => {
        if (!prev || prev.quizPassed.includes(id)) return prev
        const next = { ...prev, quizPassed: [...prev.quizPassed, id] }
        void window.solids.setSettings(next)
        return next
      })
    },
    [selectedId],
  )

  const saveNoteFor = useCallback((entryId: string, text: string) => {
    setNotes((prev) => {
      const next = { ...prev }
      if (text.trim().length === 0) {
        delete next[entryId]
      } else {
        next[entryId] = { text, at: Date.now() }
      }
      return next
    })
    void window.solids.saveNote(entryId, text)
  }, [])

  const clearAllNotes = useCallback(() => {
    void window.solids.clearNotes().then(() => {
      setNotes({})
      showToast(t('toast.notes-cleared'))
    })
  }, [t, showToast])

  const exportNotesNow = useCallback(() => {
    if (Object.keys(notes).length === 0) {
      showToast(t('toast.export-empty'))
      return
    }
    const entryNames = new Map(entries.map((entry) => [entry.id, entry.name]))
    const content = buildNotesMarkdown(locale, notes, entryNames)
    void window.solids.exportNotes(content).then((result) => {
      if (result.ok) showToast(t('toast.exported', { path: result.filePath }))
    })
  }, [notes, entries, locale, t, showToast])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable === true
      if (event.key === 'Escape') {
        if (typing) return
        if (quizOpen) setQuizOpen(false)
        else if (lessonOpen) setLessonOpen(false)
        else if (galleryOpen) setGalleryOpen(false)
        else if (notesOpen) setNotesOpen(false)
        else if (helpTopic) setHelpTopic(null)
        else resetView()
        return
      }
      if (typing || event.isComposing) return
      if (lessonOpen || quizOpen || galleryOpen || notesOpen || helpTopic) return
      if (event.code === 'ArrowDown' || event.code === 'ArrowRight') {
        event.preventDefault()
        stepEntry(1)
        return
      }
      if (event.code === 'ArrowUp' || event.code === 'ArrowLeft') {
        event.preventDefault()
        stepEntry(-1)
        return
      }
      if (event.code === 'KeyF') {
        stageApiRef.current?.focus()
        return
      }
      if (event.code === 'Slash') {
        event.preventDefault()
        searchInputRef.current?.focus()
        return
      }
      if ((event.ctrlKey || event.metaKey) && event.code === 'KeyD') {
        event.preventDefault()
        randomEntry()
      }
    }
    // Scoped to the atlas panel rather than the window: the desktop build could
    // own the whole window, but inside the Harness page these shortcuts must not
    // steal keystrokes from the host shell.
    const node = rootRef.current
    if (!node) return
    node.addEventListener('keydown', onKeyDown)
    return () => node.removeEventListener('keydown', onKeyDown)
  }, [stepEntry, resetView, randomEntry, lessonOpen, quizOpen, galleryOpen, notesOpen, helpTopic])

  const libCollapsed = settings?.window.libraryCollapsed ?? false
  const detailCollapsed = settings?.window.detailCollapsed ?? false
  const resolvedTheme = resolveTheme(settings?.theme ?? 'system', systemLight)
  const postfx = settings?.postfx ?? true
  const bondTolerance = settings?.bondTolerance ?? 1.15
  const lessonDone = entry ? (settings?.lessonDone ?? []).includes(entry.id) : false
  const quizPassed = entry ? (settings?.quizPassed ?? []).includes(entry.id) : false

  const className = [
    'app',
    libCollapsed ? 'lib-collapsed' : '',
    detailCollapsed ? 'detail-collapsed' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <LocaleProvider locale={locale}>
      <div
        className="app-root"
        ref={rootRef}
        tabIndex={-1}
        onPointerDownCapture={(event) => {
          const target = event.target as HTMLElement | null
          const tag = target?.tagName ?? ''
          if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON') return
          if (target?.isContentEditable) return
          rootRef.current?.focus({ preventScroll: true })
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".cif"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ''
            if (file) openCifPath(window.solids.pathForFile(file))
          }}
        />
        <TopBar
          onOpenEntry={selectEntry}
          locale={locale}
          onLocaleChange={changeLocale}
          inputRef={searchInputRef}
          onOpenCif={() => fileInputRef.current?.click()}
          onOpenHelp={(topic) => setHelpTopic(topic)}
        />
        <div className={className}>
          <LibraryPanel
            entries={entries}
            selectedId={customStructure ? null : selectedId}
            onSelect={selectEntry}
            collapsed={libCollapsed}
            onToggle={toggleLibrary}
            onOpenGallery={() => setGalleryOpen(true)}
          />
          {entry ? (
            <StagePanel
              entry={entry}
              theme={resolvedTheme}
              postfx={postfx}
              bondTolerance={bondTolerance}
              supercell={supercell}
              showBonds={showBonds}
              showLabels={showLabels}
              spin={spin && !lessonOpen}
              activeHotspotId={activeHotspotId}
              onHotspotSelect={handleHotspotSelect}
              onToggleSupercell={() => setSupercell((prev) => (prev === 1 ? 2 : 1))}
              onToggleBonds={() => setShowBonds((prev) => !prev)}
              onToggleLabels={() => setShowLabels((prev) => !prev)}
              onToggleSpin={() => setSpin((prev) => !prev)}
              onReset={resetView}
              onRandom={randomEntry}
              onStageApi={(api) => {
                stageApiRef.current = api
              }}
              customStructure={customStructure}
              orbitalControls={orbitalControls}
              onOrbitalChange={handleOrbitalChange}
              onStageEvent={handleStageEvent}
              showAtomicLabels={atomicLabels}
              onToggleAtomicLabels={() => setAtomicLabels((prev) => !prev)}
              clipAxis={clipAxis}
              onCycleClip={() => setClipAxis((prev) => (prev + 1) % 4)}
              symSpeed={symSpeed}
              onSymSpeedChange={setSymSpeed}
              animPlaying={animPlaying}
              animSpeed={animSpeed}
              animParams={animParams}
              animStepTick={animStepTick}
              onToggleAnimPlay={() => setAnimPlaying((prev) => !prev)}
              onAnimSpeedChange={setAnimSpeed}
              onAnimParamChange={(key, value) => setAnimParams((prev) => ({ ...prev, [key]: value }))}
              onAnimStep={() => setAnimStepTick((prev) => prev + 1)}
            />
          ) : (
            <main className="stage-col" aria-label={t('app.title')}>
              <div className="stage">
                <div className="stage-loading" aria-label={t('stage.loading')}>
                  <span className="stage-loading-name">solids-world</span>
                </div>
              </div>
              <div className="toolbar" />
            </main>
          )}
          <DetailPanel
            entry={entry}
            theme={resolvedTheme}
            activeHotspotId={activeHotspotId}
            onHotspotSelect={handleHotspotSelect}
            collapsed={detailCollapsed}
            onToggle={toggleDetail}
            customStructure={customStructure}
            onExitCustom={() => setCustomStructure(null)}
            lessonDone={lessonDone}
            quizPassed={quizPassed}
            onStartLesson={() => setLessonOpen(true)}
            onStartQuiz={() => setQuizOpen(true)}
            note={entry ? notes[entry.id] : undefined}
            onSaveNote={saveNoteFor}
          />
        </div>
        {lessonOpen && entry && (
          <LessonModal
            entry={entry}
            onClose={() => setLessonOpen(false)}
            onStepChange={handleStepChange}
            onFinish={finishLesson}
            onQuiz={() => {
              setLessonOpen(false)
              setQuizOpen(true)
            }}
          />
        )}
        {quizOpen && entry && (
          <QuizModal entry={entry} onClose={() => setQuizOpen(false)} onFinish={finishQuiz} />
        )}
        {galleryOpen && (
          <GalleryModal
            lessonDone={settings?.lessonDone ?? []}
            quizPassed={settings?.quizPassed ?? []}
            onSelect={(id) => {
              setGalleryOpen(false)
              selectEntry(id)
            }}
            onClose={() => setGalleryOpen(false)}
            onOpenNotes={() => {
              setGalleryOpen(false)
              setNotesOpen(true)
            }}
          />
        )}
        {notesOpen && (
          <NotesOverview
            notes={notes}
            onClear={clearAllNotes}
            onExport={exportNotesNow}
            onClose={() => setNotesOpen(false)}
          />
        )}
        {helpTopic && <HelpModal topic={helpTopic} onClose={() => setHelpTopic(null)} />}
        {toast && (
          <div className="toast" role="status">
            {toast.message}
          </div>
        )}
        {cifError && (
          <div className="cif-error-overlay" role="alert">
            <div className="cif-error-card">
              <h3>{formatCifError(cifError, cifErrorSize)}</h3>
              <button
                onClick={() => {
                  setCifError(null)
                  setCifErrorSize(undefined)
                }}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </LocaleProvider>
  )
}
