/** Word-by-word "soft focus" text reveal (CSS only; disabled under reduced motion). */
export function Reveal({ text, delay = 0, step = 70 }: { text: string; delay?: number; step?: number }) {
  return (
    <>
      {text.split(' ').map((w, i, a) => (
        <span key={i}>
          <span className="w" style={{ animationDelay: `${delay + Math.min(i * step, 1200)}ms` }}>{w}</span>
          {i < a.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  )
}
