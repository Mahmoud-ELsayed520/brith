import { useState } from 'react'
import { useApp } from '../context'
import { useFocusOnMount } from '../hooks/useFocusOnMount'

// Fixed, well-spaced positions (percent of the sky). Large targets, no precision needed.
const SPOTS = [[18, 26], [70, 16], [46, 58], [84, 62], [16, 74]]

/** Chapter 5 — the hidden surprise: find the wishing stars. Slow, forgiving, skippable. */
export function Wishes({ onBack }: { onBack: () => void }) {
  const { config, lang, t, reduceMotion } = useApp()
  const wishes = config.wishes.slice(0, SPOTS.length)
  const title = useFocusOnMount<HTMLHeadingElement>()
  const [found, setFound] = useState<boolean[]>(() => wishes.map(() => false))
  const [order, setOrder] = useState<number[]>([])
  const total = wishes.length
  const count = found.filter(Boolean).length
  const done = total === 0 || count === total

  const find = (i: number) => {
    if (found[i]) return
    setFound((f) => f.map((v, j) => (j === i ? true : v)))
    setOrder((o) => [...o, i])
  }
  const revealAll = () => { setFound(wishes.map(() => true)); setOrder(wishes.map((_, i) => i)) }
  const fill = (s: string) => s.replace('{n}', String(count)).replace('{total}', String(total))

  return (
    <section className="scene wishes" aria-labelledby="wTitle">
      <h2 id="wTitle" ref={title} tabIndex={-1}>{t.wishesTitle}</h2>
      <p className="note">{done ? t.wishesReward : t.wishesHint}</p>
      <div className="wishsky">
        {wishes.map((_, i) => (
          <button key={i} type="button" className={`star ${found[i] ? 'found' : ''} ${reduceMotion ? 'still' : ''}`}
            style={{ left: `${SPOTS[i][0]}%`, top: `${SPOTS[i][1]}%` }} aria-pressed={found[i]}
            aria-label={t.star.replace('{n}', String(i + 1)).replace('{total}', String(total))} onClick={() => find(i)}>
            <span aria-hidden="true">✦</span>
          </button>
        ))}
      </div>
      {total > 0 && <p className="count" aria-live="polite">{fill(t.wishesFound)}</p>}
      <ul className="wishlist" aria-live="polite">
        {order.map((i) => <li key={i}>{wishes[i][lang]}</li>)}
      </ul>
      <div className="row">
        {!done && <button type="button" className="ghost" onClick={revealAll}>{t.revealAll}</button>}
        <button type="button" className={done ? 'primary' : 'ghost'} onClick={onBack}>{t.backToJourney}</button>
      </div>
    </section>
  )
}
