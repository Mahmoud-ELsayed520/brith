import type { CSSProperties } from 'react'

/** Night-sky backdrop. Three star layers shift by different amounts when the scene changes (parallax). */
export function Sky({ depth, scene }: { depth: number; scene: string }) {
  return (
    <div className="sky" data-scene={scene} style={{ '--p': depth } as CSSProperties} aria-hidden="true">
      <i className="layer l1" /><i className="layer l2" /><i className="layer l3" />
    </div>
  )
}
