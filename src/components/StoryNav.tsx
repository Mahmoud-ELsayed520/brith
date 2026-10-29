import { useApp } from '../context'

export interface StoryNavProps { step: number; steps: number[]; onBack?: () => void; onSkip?: () => void }

/** Compact bottom navigation: back, progress, skip. `steps` lists indexes into t.stepNames. */
export function StoryNav({ step, steps, onBack, onSkip }: StoryNavProps) {
  const { t } = useApp()
  return (
    <nav className="snav" aria-label={t.progress}>
      <button type="button" className="ghost" onClick={onBack} hidden={!onBack}>{t.back}</button>
      <ol>
        {steps.map((s) => (
          <li key={s} className={s < step ? 'past' : s === step ? 'now' : ''} aria-current={s === step ? 'step' : undefined}>
            <span className="sr">{t.stepNames[s]}</span>
          </li>
        ))}
      </ol>
      <button type="button" className="ghost" onClick={onSkip} hidden={!onSkip}>{t.skipScene}</button>
    </nav>
  )
}
