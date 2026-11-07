import { useLocale } from '../i18n/LocaleProvider'
import type { DictKey } from '../i18n/zh'

export type HelpTopic = 'quickstart' | 'shortcuts'

const QUICKSTART_KEYS: Array<[DictKey, DictKey]> = [
  ['help.q1.title', 'help.q1.body'],
  ['help.q2.title', 'help.q2.body'],
  ['help.q3.title', 'help.q3.body'],
  ['help.q4.title', 'help.q4.body'],
  ['help.q5.title', 'help.q5.body'],
]

const SHORTCUT_KEYS: Array<[DictKey, DictKey]> = [
  ['help.key.up', 'help.key.up.desc'],
  ['help.key.enter', 'help.key.enter.desc'],
  ['help.key.slash', 'help.key.slash.desc'],
  ['help.key.f', 'help.key.f.desc'],
  ['help.key.r', 'help.key.r.desc'],
  ['help.key.space', 'help.key.space.desc'],
  ['help.key.open', 'help.key.open.desc'],
  ['help.key.random', 'help.key.random.desc'],
]

interface HelpModalProps {
  topic: HelpTopic
  onClose: () => void
}

export function HelpModal({ topic, onClose }: HelpModalProps) {
  const { t } = useLocale()
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel help-panel" role="dialog" aria-label={t(topic === 'quickstart' ? 'help.quickstart.title' : 'help.shortcuts.title')} onClick={(event) => event.stopPropagation()}>
        <header className="notes-head">
          <span className="eyebrow">{t(topic === 'quickstart' ? 'help.quickstart.title' : 'help.shortcuts.title')}</span>
          <button className="modal-close" onClick={onClose} aria-label={t('help.close')}>
            ×
          </button>
        </header>
        <div className="help-body">
          {topic === 'quickstart' ? (
            <ol className="help-quickstart">
              {QUICKSTART_KEYS.map(([titleKey, bodyKey]) => (
                <li key={titleKey}>
                  <strong>{t(titleKey)}</strong>
                  <p>{t(bodyKey)}</p>
                </li>
              ))}
            </ol>
          ) : (
            <table className="help-shortcuts">
              <tbody>
                {SHORTCUT_KEYS.map(([keyKey, descKey]) => (
                  <tr key={keyKey}>
                    <th scope="row">
                      <kbd>{t(keyKey)}</kbd>
                    </th>
                    <td>{t(descKey)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
