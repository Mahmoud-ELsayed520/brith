import { useApp } from '../context'
import { useNow } from '../hooks/useNow'
import { getCountdown } from '../lib/countdown'

interface Props { birthday?: string; utcOffset?: string }

export function Countdown({ birthday, utcOffset }: Props) {
  const { config, t } = useApp()
  const now = useNow(1000)
  const s = getCountdown(birthday ?? config.birthday, utcOffset ?? config.utcOffset, now)
  const values = s.status === 'future' ? [s.days, s.hours, s.minutes, s.seconds] : []
  const message = s.status === 'empty' ? t.cdNone : s.status === 'invalid' ? t.cdBad : s.status === 'past' ? t.cdPast : ''

  return (
    <div className="cdblock">
      <div className="wrap">
        <h3>{t.cdTitle}</h3>
        {s.status === 'future' && (
          <div className="cd" role="timer" aria-live="off" data-testid="countdown">
            {values.map((v, i) => (
              <div key={i}><b>{String(v).padStart(i ? 2 : 1, '0')}</b><span>{t.cdUnits[i]}</span></div>
            ))}
          </div>
        )}
        <p className="note" aria-live="polite">{message}</p>
      </div>
    </div>
  )
}
