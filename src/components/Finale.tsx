import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context'
import { useFocusOnMount } from '../hooks/useFocusOnMount'
import { buildWhatsAppUrl, copyText, openWhatsApp } from '../lib/share'
import { useConfetti } from './Confetti'
import { Reveal } from './Reveal'

/** Chapter 8 — one controlled burst, a monogram seal, replay/share. */
export function Finale({ onReplay, onBack }: { onReplay: () => void; onBack: () => void }) {
  const { config, t, name, sender, reduceMotion } = useApp()
  const burst = useConfetti()
  const title = useFocusOnMount<HTMLHeadingElement>()
  const [toast, setToast] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const monogram = config.monogram || ([...name][0] ?? '✦')

  useEffect(() => { const id = setTimeout(() => burst(70), reduceMotion ? 0 : 500); return () => clearTimeout(id) }, [burst, reduceMotion])
  useEffect(() => () => clearTimeout(timer.current), [])

  const say = (m: string) => { setToast(m); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(''), 3500) }
  const share = () => openWhatsApp(buildWhatsAppUrl(config.whatsapp.number, `${t.shareMsg} ${window.location.href}`))
  const copy = async () => say((await copyText(window.location.href)) ? t.copied : t.copyFail)

  return (
    <section className="scene finale" aria-labelledby="fTitle">
      <span className="lightburst" aria-hidden="true" />
      <div className="monogram" aria-hidden="true">{monogram}</div>
      <h2 id="fTitle" ref={title} tabIndex={-1} aria-label={t.finTitle}><Reveal text={t.finTitle} delay={200} /></h2>
      <p className="lead">{t.finMsg}</p>
      <p className="signature">{sender}</p>
      <div className="row">
        <button className="primary" type="button" onClick={onReplay}>{t.replay}</button>
        {config.whatsapp.enabled && <button type="button" onClick={share}>{t.share}</button>}
        <button type="button" onClick={copy}>{t.copy}</button>
        <button type="button" className="ghost" onClick={onBack}>{t.backToJourney}</button>
      </div>
      <div className="toast" role="status" aria-live="polite">{toast}</div>
    </section>
  )
}
