import { useMemo, useRef } from 'react'
import { useLocale } from '../i18n/LocaleProvider'
import { CATEGORIES } from '../data/categories'
import { Stage, type StageApi } from '../three/Stage'
import type { StageEvent } from '../three/kit'
import { mostProbableR, radialPDF } from '../three/builders/orbital-'
import type { AtlasEntry, Hotspot } from '../data/types'
import type { StructureData } from '../../electron/cif/structure'
import type { DictKey } from '../i18n/zh'

const CLIP_KEYS = ['tool.clip.off', 'tool.clip.x', 'tool.clip.y', 'tool.clip.z'] as const satisfies readonly DictKey[]

export interface OrbitalControlState {
  isoFraction: number
  pMode: 'single' | 'triple'
  opacity: number
  showNodal: boolean
  radialR: number
}

interface StagePanelProps {
  entry: AtlasEntry
  theme: 'dark' | 'light'
  postfx: boolean
  bondTolerance: number
  supercell: 1 | 2
  showBonds: boolean
  showLabels: boolean
  spin: boolean
  activeHotspotId: string | null
  onHotspotSelect: (hotspot: Hotspot) => void
  onToggleSupercell: () => void
  onToggleBonds: () => void
  onToggleLabels: () => void
  onToggleSpin: () => void
  onReset: () => void
  onRandom: () => void
  onStageApi: (api: StageApi) => void
  customStructure: StructureData | null
  orbitalControls: OrbitalControlState
  onOrbitalChange: (patch: Partial<OrbitalControlState>) => void
  onStageEvent: (event: StageEvent) => void
  showAtomicLabels: boolean
  onToggleAtomicLabels: () => void
  clipAxis: number
  onCycleClip: () => void
  symSpeed: number
  onSymSpeedChange: (speed: number) => void
  animPlaying: boolean
  animSpeed: number
  animParams: Record<string, number>
  animStepTick: number
  onToggleAnimPlay: () => void
  onAnimSpeedChange: (speed: number) => void
  onAnimParamChange: (key: string, value: number) => void
  onAnimStep: () => void
}

export function StagePanel(props: StagePanelProps) {
  const { t, locale } = useLocale()
  const { entry, customStructure, orbitalControls } = props
  const labelText = customStructure ? customStructure.name : entry.name
  const apiRef = useRef<StageApi | null>(null)
  const isCrystal = customStructure !== null || entry.field === 'crystal'
  const isSymmetry = !customStructure && entry.field === 'symmetry'
  const isDynamic = !customStructure && entry.dynamic !== undefined
  const isOrbital = !customStructure && entry.orbital !== undefined
  const isRadial = !customStructure && entry.radial === true
  const handleStageApi = (api: StageApi) => {
    apiRef.current = api
    props.onStageApi(api)
  }
  const categoryName = (category: string): string => {
    const names = CATEGORIES[category]
    if (names) return locale === 'en' ? names.en : names.zh
    return category
  }
  const radialPdfReadout = useMemo(() => {
    const defs = [
      { n: 1, l: 0 },
      { n: 2, l: 1 },
      { n: 2, l: 0 },
    ]
    const r = orbitalControls.radialR
    let closest = defs[0]
    for (const def of defs) {
      if (Math.abs(mostProbableR(def.n, def.l) - r) < Math.abs(mostProbableR(closest.n, closest.l) - r)) closest = def
    }
    return radialPDF(closest.n, closest.l, r).toFixed(3)
  }, [orbitalControls.radialR])
  const orbitalView = useMemo(
    () => (isOrbital ? { isoFraction: orbitalControls.isoFraction, pMode: orbitalControls.pMode } : undefined),
    [isOrbital, orbitalControls.isoFraction, orbitalControls.pMode],
  )
  return (
    <main className="stage-col" aria-label={t('app.title')}>
      <div className="stage">
        <Stage
          entryId={entry.id}
          entryName={labelText}
          supercell={props.supercell}
          showBonds={props.showBonds}
          showLabels={props.showLabels}
          spin={props.spin}
          theme={props.theme}
          postfx={props.postfx}
          bondTolerance={props.bondTolerance}
          hotspots={customStructure ? [] : entry.hotspots}
          activeHotspotId={props.activeHotspotId}
          onHotspotSelect={props.onHotspotSelect}
          customStructure={customStructure}
          onApi={handleStageApi}
          orbitalView={orbitalView}
          orbitalOpacity={isOrbital ? orbitalControls.opacity : undefined}
          showNodalSurfaces={isOrbital ? orbitalControls.showNodal : undefined}
          radialR={isRadial ? orbitalControls.radialR : undefined}
          onStageEvent={props.onStageEvent}
          standingLabels={!customStructure && (isCrystal ? props.showLabels : props.showAtomicLabels)}
          symSpeed={isSymmetry ? props.symSpeed : undefined}
          clipAxis={isCrystal ? props.clipAxis : undefined}
          animPlayback={isDynamic ? { playing: props.animPlaying, speed: props.animSpeed } : undefined}
          animParams={isDynamic ? props.animParams : undefined}
          animStepTick={isDynamic ? props.animStepTick : undefined}
        />
        <div className="stage-entry-label">
          <span className="eyebrow">{customStructure ? t('custom.banner') : categoryName(entry.category)}</span>
          <strong>{labelText}</strong>
        </div>
        {!customStructure && (
          <button className="stage-random" onClick={props.onRandom} title={t('random.aria')} aria-label={t('random.aria')}>
            ⚄
          </button>
        )}
        {customStructure && <div className="custom-banner">{customStructure.fileName}</div>}
        {isOrbital && <div className="stage-phase-legend">{t('orbital.phase-legend')}</div>}
      </div>
      {isOrbital && (
        <div className="stage-controls" role="group" aria-label={t('orbital.opacity')}>
          <label className="stage-slider">
            <span>{t('orbital.opacity')}</span>
            <input
              type="range"
              min="0.15"
              max="0.95"
              step="0.05"
              value={orbitalControls.opacity}
              onChange={(event) => props.onOrbitalChange({ opacity: Number(event.target.value) })}
            />
          </label>
          <label className="stage-slider">
            <span>{t('orbital.iso')}</span>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={orbitalControls.isoFraction}
              onChange={(event) => props.onOrbitalChange({ isoFraction: Number(event.target.value) })}
            />
          </label>
          <button
            className={`tool-btn${orbitalControls.showNodal ? ' pressed' : ''}`}
            aria-pressed={orbitalControls.showNodal}
            onClick={() => props.onOrbitalChange({ showNodal: !orbitalControls.showNodal })}
            title={t('orbital.nodes')}
          >
            {t('orbital.nodes')}
          </button>
          {entry.orbital?.l === 1 && (
            <button
              className={`tool-btn${orbitalControls.pMode === 'triple' ? ' pressed' : ''}`}
              aria-pressed={orbitalControls.pMode === 'triple'}
              onClick={() => props.onOrbitalChange({ pMode: orbitalControls.pMode === 'triple' ? 'single' : 'triple' })}
              title={t('orbital.p-mode')}
            >
              {t('orbital.p-mode')}
            </button>
          )}
        </div>
      )}
      {isRadial && (
        <div className="stage-controls" role="group" aria-label={t('radial.slider', { value: orbitalControls.radialR })}>
          <label className="stage-slider">
            <span>{t('radial.slider', { value: orbitalControls.radialR.toFixed(1) })}</span>
            <input
              type="range"
              min="0.2"
              max="8"
              step="0.1"
              value={orbitalControls.radialR}
              onChange={(event) => props.onOrbitalChange({ radialR: Number(event.target.value) })}
            />
          </label>
          <span className="stage-readout">{t('radial.pdf-value', { value: radialPdfReadout })}</span>
        </div>
      )}
      {isSymmetry && (
        <div className="stage-controls" role="group" aria-label={t('sym.speed')}>
          <label className="stage-slider">
            <span>{t('sym.speed')}</span>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.25"
              value={props.symSpeed}
              onChange={(event) => props.onSymSpeedChange(Number(event.target.value))}
            />
          </label>
          <span className="stage-readout">{props.symSpeed.toFixed(2)}×</span>
        </div>
      )}
      {isDynamic && (
        <div className="stage-controls" role="group" aria-label={t('dyn.play')}>
          <button
            className={`tool-btn${props.animPlaying ? ' pressed' : ''}`}
            aria-pressed={props.animPlaying}
            onClick={props.onToggleAnimPlay}
            title={props.animPlaying ? t('dyn.pause') : t('dyn.play')}
          >
            {props.animPlaying ? t('dyn.pause') : t('dyn.play')}
          </button>
          <button className="tool-btn" onClick={props.onAnimStep} title={t('dyn.step')} disabled={props.animPlaying}>
            {t('dyn.step')}
          </button>
          {entry.dynamic?.params.map((param) => {
            const paramLabel = t(param.labelKey as DictKey)
            if (param.kind === 'branch') {
              return (
                <span key={param.key} className="stage-branch">
                  {param.options?.map((option, index) => (
                    <button
                      key={option.labelKey}
                      className={`tool-btn${props.animParams[param.key] === index ? ' pressed' : ''}`}
                      aria-pressed={props.animParams[param.key] === index}
                      onClick={() => props.onAnimParamChange(param.key, index)}
                      title={paramLabel}
                    >
                      {t(option.labelKey as DictKey)}
                    </button>
                  ))}
                </span>
              )
            }
            const value = props.animParams[param.key] ?? param.def
            return (
              <label key={param.key} className="stage-slider">
                <span>
                  {paramLabel} = {value.toFixed(param.step && param.step < 0.1 ? 2 : 1)}
                </span>
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={value}
                  onChange={(event) => props.onAnimParamChange(param.key, Number(event.target.value))}
                />
              </label>
            )
          })}
          <span className="stage-branch" aria-label={t('dyn.speed')}>
            {[0.25, 0.5, 1, 2].map((speed) => (
              <button
                key={speed}
                className={`tool-btn${props.animSpeed === speed ? ' pressed' : ''}`}
                aria-pressed={props.animSpeed === speed}
                onClick={() => props.onAnimSpeedChange(speed)}
                title={`${t('dyn.speed')} ${speed}×`}
              >
                {speed}×
              </button>
            ))}
          </span>
        </div>
      )}
      <div className="toolbar" role="toolbar" aria-label={t('app.title')}>
        <button
          className={`tool-btn${props.spin ? ' pressed' : ''}`}
          aria-pressed={props.spin}
          onClick={props.onToggleSpin}
          title={t('tool.spin')}
        >
          {t('tool.spin')}
        </button>
        <button className="tool-btn" onClick={() => apiRef.current?.zoom(-1)} title={t('tool.zoom-out')} aria-label={t('tool.zoom-out')}>
          −
        </button>
        <button className="tool-btn" onClick={() => apiRef.current?.zoom(1)} title={t('tool.zoom-in')} aria-label={t('tool.zoom-in')}>
          +
        </button>
        <button className="tool-btn" onClick={() => apiRef.current?.focus()} title={t('tool.focus')} aria-label={t('tool.focus')}>
          {t('tool.focus')}
        </button>
        <button className="tool-btn" onClick={props.onReset} title={t('tool.reset')} aria-label={t('tool.reset')}>
          {t('tool.reset')}
        </button>
        {isCrystal && (
          <>
            <button
              className={`tool-btn${props.supercell === 2 ? ' pressed' : ''}`}
              aria-pressed={props.supercell === 2}
              onClick={props.onToggleSupercell}
              title={t('tool.supercell.state', { n: props.supercell })}
            >
              {t('tool.supercell.state', { n: props.supercell })}
            </button>
            <button
              className={`tool-btn${props.showBonds ? ' pressed' : ''}`}
              aria-pressed={props.showBonds}
              onClick={props.onToggleBonds}
              title={t('tool.bonds')}
            >
              {t('tool.bonds')}
            </button>
            <button
              className={`tool-btn${props.showLabels ? ' pressed' : ''}`}
              aria-pressed={props.showLabels}
              onClick={props.onToggleLabels}
              title={t('tool.labels')}
            >
              {t('tool.labels')}
            </button>
          </>
        )}
        {!isCrystal && !customStructure && (
          <button
            className={`tool-btn${props.showAtomicLabels ? ' pressed' : ''}`}
            aria-pressed={props.showAtomicLabels}
            onClick={props.onToggleAtomicLabels}
            title={t('tool.labels')}
          >
            {t('tool.labels')}
          </button>
        )}
        {isCrystal && (
          <button
            className={`tool-btn${props.clipAxis > 0 ? ' pressed' : ''}`}
            aria-pressed={props.clipAxis > 0}
            onClick={props.onCycleClip}
            title={t('tool.clip.desc')}
          >
            {t('tool.clip.state', { axis: t(CLIP_KEYS[props.clipAxis]) })}
          </button>
        )}
      </div>
    </main>
  )
}
