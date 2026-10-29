import { useApp } from '../context'
import { useFocusOnMount } from '../hooks/useFocusOnMount'
import type { PathId } from '../types'
import { Countdown } from './Countdown'

const ICON: Record<PathId, string> = { memories: '✧', letter: '✉', wishes: '★' }
export const PATH_ORDER: PathId[] = ['memories', 'letter', 'wishes']

/** Chapter 3 — choose a story path. */
export function Hub({ visited, onPick, onNext }: { visited: PathId[]; onPick: (p: PathId) => void; onNext: () => void }) {
  const { config, t } = useApp()
  const title = useFocusOnMount<HTMLHeadingElement>()
  const text: Record<PathId, { title: string; desc: string }> = { memories: t.pathMemories, letter: t.pathLetter, wishes: t.pathWishes }
  const paths = PATH_ORDER.filter((p) => config.paths[p])

  return (
    <section className="scene hub" aria-labelledby="hubTitle">
      <h2 id="hubTitle" ref={title} tabIndex={-1}>{t.chooseTitle}</h2>
      <p className="note">{t.chooseHint}</p>
      <ul className="paths">
        {paths.map((p) => (
          <li key={p}>
            <button type="button" className="path" data-path={p} onClick={() => onPick(p)}>
              <span className="icon" aria-hidden="true">{ICON[p]}</span>
              <span className="ptxt"><b>{text[p].title}</b><small>{text[p].desc}</small></span>
              {visited.includes(p) && <span className="seen"><span aria-hidden="true">✓</span><span className="sr">{t.visited}</span></span>}
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className={visited.length ? 'primary' : 'ghost'} onClick={onNext}>{t.toCake}</button>
      {config.sections.countdown && <Countdown />}
    </section>
  )
}
