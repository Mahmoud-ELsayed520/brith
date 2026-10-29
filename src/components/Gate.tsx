import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context'
import { useConfetti } from './Confetti'
import { Reveal } from './Reveal'

/** Chapter 1 — a sealed letter under the stars. */
export function Gate({ onEnter, onSkip }: { onEnter: () => void; onSkip: () => void }) {
  const { t, name, reduceMotion } = useApp()
  const burst = useConfetti()
  const [opening, setOpening] = useState(false)
  const btn = useRef<HTMLButtonElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => { btn.current?.focus({ preventScroll: true }); return () => clearTimeout(timer.current) }, [])

  const enter = () => {
    if (opening) return // never double-trigger
    setOpening(true)
    timer.current = setTimeout(() => { burst(40); onEnter() }, reduceMotion ? 0 : 1100)
  }

  return (
    <section className={`scene gate ${opening ? 'opening' : ''}`} aria-labelledby="gTitle">
      <div className="env" aria-hidden="true">
        <div className="back" /><div className="card">✦</div><div className="front" /><div className="flap" /><div className="seal">♥</div>
      </div>
      <p className="kicker"><Reveal text={t.sealedFor} delay={200} /></p>
      <h1 id="gTitle" className="gate-name"><Reveal text={name} delay={700} /></h1>
      <p className="lead"><Reveal text={t.subtitle} delay={1300} /></p>
      <div className="gate-btns">
        <button ref={btn} className="primary" type="button" onClick={enter} disabled={opening}>{t.enter}</button>
        <button className="ghost" type="button" onClick={onSkip}>{t.skip}</button>
      </div>
    </section>
  )
}
