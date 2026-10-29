import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context'
import { useFocusOnMount } from '../hooks/useFocusOnMount'
import { placeholderImage, resolveAsset } from '../lib/placeholder'
import type { MemoryCard } from '../types'
import { Reveal } from './Reveal'

const srcOf = (m: MemoryCard) => (m.image ? resolveAsset(m.image) : placeholderImage(m.hue))

/** Chapter 4 — floating memory cards; selecting one brings it into focus. */
export function MemoryUniverse({ onBack }: { onBack: () => void }) {
  const { config, lang, t } = useApp()
  const title = useFocusOnMount<HTMLHeadingElement>()
  const [open, setOpen] = useState<number | null>(null)
  const opener = useRef<HTMLElement | null>(null)
  const items = config.memories
  const hasPlaceholders = items.some((m) => !m.image)

  return (
    <section className="scene memories" aria-labelledby="memTitle">
      <h2 id="memTitle" ref={title} tabIndex={-1}>{t.memTitle}</h2>
      <p className="note">{t.memHint}</p>
      {hasPlaceholders && <p className="note small">{t.memPlaceholder}</p>}
      <div className="universe" inert={open !== null}>
        {items.map((m, i) => (
          <button key={i} type="button" className="orbit" style={{ ['--d' as string]: `${(i % 4) * -1.7}s` }}
            onClick={(e) => { opener.current = e.currentTarget; setOpen(i) }}>
            <img src={srcOf(m)} alt={m.alt?.[lang] ?? m[lang].title} loading="lazy" width={200} height={250} />
            <small>{m[lang].title}</small>
          </button>
        ))}
      </div>
      <button type="button" className="primary" onClick={onBack}>{t.backToJourney}</button>
      {open !== null && items[open] && (
        <MemoryDialog card={items[open]} variant={open % 3} onClose={() => { setOpen(null); setTimeout(() => opener.current?.focus(), 0) }} />
      )}
    </section>
  )
}

function MemoryDialog({ card, variant, onClose }: { card: MemoryCard; variant: number; onClose: () => void }) {
  const { lang, t } = useApp()
  const close = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    close.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') { e.preventDefault(); close.current?.focus() } // the close button is the only control
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const c = card[lang]
  return (
    <div className="dim" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <article className={`mcard reveal-${variant}`} role="dialog" aria-modal="true" aria-labelledby="mcTitle">
        <button ref={close} type="button" className="x" aria-label={t.close} onClick={onClose}>✕</button>
        <img src={srcOf(card)} alt={card.alt?.[lang] ?? c.title} width={400} height={300} />
        {card.date && <time>{card.date}</time>}
        <h3 id="mcTitle">{c.title}</h3>
        <p><Reveal text={c.text} delay={500} /></p>
      </article>
    </div>
  )
}
