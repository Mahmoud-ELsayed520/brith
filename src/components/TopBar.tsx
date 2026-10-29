import { useRef, useState } from 'react'
import { useApp } from '../context'
import { resolveAsset } from '../lib/placeholder'

/** Language switch + optional music toggle. Audio never starts until the visitor presses play. */
export function TopBar({ onToggleLang }: { onToggleLang: () => void }) {
  const { config, t, lang } = useApp()
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(false)

  const toggle = async () => {
    const a = audio.current
    if (!a) return
    if (!a.paused) { a.pause(); setPlaying(false); return }
    try { await a.play(); setPlaying(true); setError(false) } catch { setPlaying(false); setError(true) }
  }

  return (
    <div className="top">
      <button type="button" onClick={onToggleLang} lang={lang === 'ar' ? 'en' : 'ar'}>{t.lang}</button>
      {config.music && (
        <>
          <button type="button" aria-pressed={playing} onClick={toggle}>♪ {t.sound}</button>
          <audio ref={audio} src={resolveAsset(config.music)} loop preload="none" />
          <span className="sr" role="status">{error ? t.musicMissing : ''}</span>
        </>
      )}
    </div>
  )
}
