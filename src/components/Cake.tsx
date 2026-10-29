import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context'
import { useFocusOnMount } from '../hooks/useFocusOnMount'
import { useConfetti } from './Confetti'

const CANDLES = 5

/** Chapter 7 — the cake ceremony. */
export function Cake({ onDone }: { onDone: () => void }) {
  const { t, f } = useApp()
  const burst = useConfetti()
  const title = useFocusOnMount<HTMLHeadingElement>()
  const [out, setOut] = useState<boolean[]>(() => Array(CANDLES).fill(false))
  const next = useRef<HTMLButtonElement>(null)
  const first = useRef<HTMLButtonElement>(null)
  const allOut = out.every(Boolean)
  const was = useRef(false)

  useEffect(() => {
    if (allOut && !was.current) { burst(120); next.current?.focus() }
    was.current = allOut
  }, [allOut, burst])

  const blow = (i: number) => setOut((o) => (o[i] ? o : o.map((v, j) => (j === i ? true : v))))
  const relight = () => { setOut(Array(CANDLES).fill(false)); setTimeout(() => first.current?.focus(), 0) }

  return (
    <section className="scene cake" aria-labelledby="cTitle">
      <h2 id="cTitle" ref={title} tabIndex={-1}>{t.cakeTitle}</h2>
      <p className="note">{t.cakeHint}</p>
      <div className={`cakebox ${allOut ? 'glow' : ''}`}>
        <div className="candles">
          {out.map((isOut, i) => (
            <button key={i} ref={i === 0 ? first : undefined} type="button" className={`candle ${isOut ? 'out' : ''}`}
              aria-pressed={isOut} aria-label={t.candle.replace('{n}', String(i + 1))} onClick={() => blow(i)}>
              <span className="fl" /><i />
            </button>
          ))}
        </div>
        <div className="tier t1" /><div className="tier t2" /><div className="plate" />
      </div>
      <p id="wish" aria-live="polite">{allOut ? f(t.wish) : ''}</p>
      <div className="row">
        {allOut && <button type="button" className="ghost" onClick={relight}>{t.relight}</button>}
        <button ref={next} type="button" className={allOut ? 'primary' : 'ghost'} onClick={onDone}>{t.toFinale}</button>
      </div>
    </section>
  )
}
