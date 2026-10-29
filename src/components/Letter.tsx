import { useEffect, useState } from 'react'
import { useApp } from '../context'
import { useFocusOnMount } from '../hooks/useFocusOnMount'

/** Chapter 6 — the letter unfolds, paragraph by paragraph. Selectable real text. */
export function Letter({ onBack }: { onBack: () => void }) {
  const { t, f, sender, reduceMotion } = useApp()
  const title = useFocusOnMount<HTMLHeadingElement>()
  const [shown, setShown] = useState(false)
  const [instant, setInstant] = useState(false)

  useEffect(() => {
    if (reduceMotion) { setInstant(true); setShown(true); return }
    const id = setTimeout(() => setShown(true), 400)
    return () => clearTimeout(id)
  }, [reduceMotion])

  return (
    <section className="scene letter" aria-labelledby="lTitle">
      <h2 id="lTitle" ref={title} tabIndex={-1}>{t.letterTitle}</h2>
      <div className={`paper ${shown ? 'show' : ''} ${instant ? 'instant' : ''}`} data-testid="paper">
        {t.letter.map((p, i) => <p key={i}>{f(p)}</p>)}
        <p className="sign">{sender}</p>
      </div>
      <div className="row">
        {!instant && <button type="button" className="ghost" onClick={() => { setInstant(true); setShown(true) }}>{t.unfold}</button>}
        <button type="button" className="primary" onClick={onBack}>{t.backToJourney}</button>
      </div>
    </section>
  )
}
