import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react'
import { useApp } from '../context'

interface P { x: number; y: number; vx: number; vy: number; r: number; c: string; a: number; life: number }
const COLORS = ['#f4a7bf', '#c9b6f2', '#e8c98a', '#fff', '#f7d3df']
const LIFE = 150

const BurstContext = createContext<(n: number) => void>(() => {})
export const useConfetti = () => useContext(BurstContext)

/** Lightweight canvas confetti. Does nothing when the visitor prefers reduced motion. */
export function ConfettiProvider({ children }: { children: ReactNode }) {
  const { reduceMotion } = useApp()
  const ref = useRef<HTMLCanvasElement>(null)
  const parts = useRef<P[]>([])
  const raf = useRef(0)

  useEffect(() => {
    const resize = () => {
      const cv = ref.current
      if (cv) { cv.width = window.innerWidth; cv.height = window.innerHeight }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf.current) }
  }, [])

  const burst = useCallback((n: number) => {
    const cv = ref.current
    const cx = cv?.getContext('2d')
    if (reduceMotion || !cv || !cx) return
    for (let i = 0; i < n; i++) {
      parts.current.push({ x: cv.width / 2, y: cv.height * 0.55, vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 13 - 3, r: Math.random() * 5 + 3, c: COLORS[i % 5], a: Math.random() * 6, life: 0 })
    }
    if (raf.current) return
    const loop = () => {
      cx.clearRect(0, 0, cv.width, cv.height)
      parts.current = parts.current.filter((p) => p.life < LIFE && p.y < cv.height + 20)
      for (const p of parts.current) {
        p.life++; p.vy += 0.32; p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.a += 0.15
        cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a)
        cx.globalAlpha = Math.max(0, 1 - p.life / LIFE); cx.fillStyle = p.c
        cx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); cx.restore()
      }
      if (parts.current.length) raf.current = requestAnimationFrame(loop)
      else { raf.current = 0; cx.clearRect(0, 0, cv.width, cv.height) }
    }
    raf.current = requestAnimationFrame(loop)
  }, [reduceMotion])

  return (
    <BurstContext.Provider value={burst}>
      {children}
      <canvas id="confetti" ref={ref} aria-hidden="true" />
    </BurstContext.Provider>
  )
}
