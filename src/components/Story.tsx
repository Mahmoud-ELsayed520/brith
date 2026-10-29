import { useRef, useState } from 'react'
import { useApp } from '../context'
import { useFocusOnMount } from '../hooks/useFocusOnMount'
import { Reveal } from './Reveal'

/** Chapter 2 — short passages, one at a time. Nothing advances without the visitor. */
export function Story({ onDone }: { onDone: () => void }) {
  const { config, lang, t, f } = useApp()
  const passages = config.story[lang]
  const [i, setI] = useState(0)
  const last = i >= passages.length - 1
  const next = () => (last ? onDone() : setI((n) => n + 1))
  const prev = () => setI((n) => Math.max(0, n - 1))
  const btn = useFocusOnMount<HTMLButtonElement>()
  const tapGuard = useRef(false)

  return (
    <section className="scene story" aria-label={t.stepNames[0]}
      onClick={(e) => { // optional tap-anywhere-to-continue (buttons handle themselves)
        if ((e.target as HTMLElement).closest('button') || tapGuard.current) return
        tapGuard.current = true; setTimeout(() => { tapGuard.current = false }, 300); next()
      }}>
      <p key={`${lang}-${i}`} className="passage" aria-live="polite"><Reveal text={f(passages[i] ?? '')} /></p>
      <p className="dots" aria-hidden="true">{passages.map((_, n) => <i key={n} className={n === i ? 'on' : ''} />)}</p>
      <div className="row">
        {i > 0 && <button type="button" className="ghost" onClick={prev}>{t.back}</button>}
        <button ref={btn} type="button" className="primary" onClick={next}>{t.next}</button>
      </div>
    </section>
  )
}
