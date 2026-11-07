import { useEffect, useRef, useState, type RefObject } from 'react'
import { useLocale } from '../i18n/LocaleProvider'
import type { Locale } from '../i18n/LocaleProvider'
import { searchEntries } from '../data/search'
import type { HelpTopic } from './HelpModal'

interface TopBarProps {
  onOpenEntry: (id: string) => void
  locale: Locale
  onLocaleChange: (locale: Locale) => void
  inputRef?: RefObject<HTMLInputElement>
  onOpenCif: () => void
  onOpenHelp: (topic: HelpTopic) => void
}

export function TopBar({ onOpenEntry, locale, onLocaleChange, inputRef, onOpenCif, onOpenHelp }: TopBarProps) {
  const { t, entries } = useLocale()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const boxRef = useRef<HTMLDivElement>(null)

  const results = open ? searchEntries(query, entries) : []

  useEffect(() => {
    setHighlight(0)
  }, [query])

  useEffect(() => {
    const onDocMouseDown = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [])

  const openResult = (id: string) => {
    onOpenEntry(id)
    setQuery('')
    setOpen(false)
    inputRef?.current?.blur()
  }

  return (
    <header className="topbar">
      <span className="topbar-brand">solids-world</span>
      <div className="topbar-search" ref={boxRef}>
        <input
          ref={inputRef}
          type="search"
          className="topbar-search-input"
          placeholder={t('top.search.placeholder')}
          value={query}
          aria-label={t('top.search.placeholder')}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setOpen(false)
              inputRef?.current?.blur()
              return
            }
            if (event.key === 'Enter') {
              const target = results[highlight] ?? results[0]
              if (target) openResult(target.id)
              return
            }
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              if (results.length > 0) setHighlight((prev) => (prev + 1) % results.length)
              return
            }
            if (event.key === 'ArrowUp') {
              event.preventDefault()
              if (results.length > 0) setHighlight((prev) => (prev - 1 + results.length) % results.length)
            }
          }}
        />
        {open && query.trim().length > 0 && (
          <div className="topbar-search-drop" role="listbox">
            {results.length === 0 ? (
              <p className="topbar-search-empty">{t('top.search.no-result')}</p>
            ) : (
              results.map((entry, index) => (
                <button
                  key={entry.id}
                  role="option"
                  aria-selected={index === highlight}
                  className={`topbar-search-item${index === highlight ? ' highlighted' : ''}`}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => openResult(entry.id)}
                >
                  <span className="topbar-search-item-name">{entry.name}</span>
                  <span className="topbar-search-item-meta">{entry.english}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
      <div className="topbar-help" role="group">
        <button
          onClick={() => onOpenHelp('quickstart')}
          title={t('help.quickstart.title')}
          aria-label={t('help.quickstart.title')}
        >
          ?
        </button>
        <button
          onClick={() => onOpenHelp('shortcuts')}
          title={t('help.shortcuts.title')}
          aria-label={t('help.shortcuts.title')}
        >
          ⌘
        </button>
      </div>
      <div className="topbar-lang" role="group" aria-label="Language">
        <button className="topbar-cif" onClick={onOpenCif} title={t('top.open-cif')}>
          {t('top.open-cif')}
        </button>
        <button className={locale === 'zh' ? 'active' : ''} onClick={() => onLocaleChange('zh')}>
          中
        </button>
        <button className={locale === 'en' ? 'active' : ''} onClick={() => onLocaleChange('en')}>
          EN
        </button>
      </div>
    </header>
  )
}
