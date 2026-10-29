import { useEffect, useMemo, useState } from 'react'
import { birthdayConfig } from './config/birthday'
import { AppContext, type AppCtx } from './context'
import { useReducedMotion } from './hooks/useReducedMotion'
import type { BirthdayConfig, Lang, PathId } from './types'
import { Cake } from './components/Cake'
import { ConfettiProvider } from './components/Confetti'
import { Finale } from './components/Finale'
import { Gate } from './components/Gate'
import { Hub } from './components/Hub'
import { Letter } from './components/Letter'
import { MemoryUniverse } from './components/MemoryUniverse'
import { Sky } from './components/Sky'
import { Story } from './components/Story'
import { StoryNav } from './components/StoryNav'
import { TopBar } from './components/TopBar'
import { Wishes } from './components/Wishes'

type SceneId = 'gate' | 'story' | 'hub' | PathId | 'cake' | 'finale'

const THEME_VARS = { midnight: '--midnight', violet: '--violet', blush: '--blush', ivory: '--ivory', gold: '--gold' } as const
const DEPTH: Record<SceneId, number> = { gate: 0, story: 1, hub: 2, memories: 3, letter: 3, wishes: 3, cake: 4, finale: 5 }
const isPath = (s: SceneId): s is PathId => s === 'memories' || s === 'letter' || s === 'wishes'

export default function App({ config = birthdayConfig }: { config?: BirthdayConfig }) {
  const [lang, setLang] = useState<Lang>(config.defaultLang === 'en' ? 'en' : 'ar')
  const [scene, setScene] = useState<SceneId>('gate')
  const [visited, setVisited] = useState<PathId[]>([])
  const [run, setRun] = useState(0) // bumped on replay so every scene starts fresh
  const reduceMotion = useReducedMotion()
  const cake = config.sections.cake

  const ctx = useMemo<AppCtx>(() => {
    const name = config.recipient[lang]
    return { config, lang, t: config.text[lang], name, sender: config.sender[lang], reduceMotion, f: (s) => s.replace(/\{name\}/g, name) }
  }, [config, lang, reduceMotion])

  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.title = lang === 'ar' ? 'عالَمٌ صغير لنا' : 'A Little World of Us'
  }, [lang])

  useEffect(() => {
    const root = document.documentElement
    for (const [k, v] of Object.entries(THEME_VARS)) {
      const val = config.theme[k as keyof typeof THEME_VARS]
      if (val) root.style.setProperty(v, val)
    }
  }, [config.theme])

  useEffect(() => { window.scrollTo?.(0, 0) }, [scene])

  const go = (s: SceneId) => {
    setScene(s)
    if (isPath(s)) setVisited((v) => (v.includes(s) ? v : [...v, s]))
  }
  const afterHub: SceneId = cake ? 'cake' : 'finale'
  const replay = () => { setVisited([]); setRun((n) => n + 1); setScene('gate') }

  // progress: 0 intro, 1 journey, 2 cake, 3 finale
  const stepOf = scene === 'story' ? 0 : scene === 'hub' || isPath(scene) ? 1 : scene === 'cake' ? 2 : 3
  const steps = cake ? [0, 1, 2, 3] : [0, 1, 3]
  const back: Partial<Record<SceneId, SceneId>> = { hub: 'story', memories: 'hub', letter: 'hub', wishes: 'hub', cake: 'hub', finale: cake ? 'cake' : 'hub' }
  const skip: Partial<Record<SceneId, SceneId>> = { story: 'hub', hub: afterHub, memories: 'hub', letter: 'hub', wishes: 'hub', cake: 'finale' }

  return (
    <AppContext.Provider value={ctx}>
      <ConfettiProvider>
        <Sky depth={DEPTH[scene]} scene={isPath(scene) ? 'path' : scene} />
        <div key={`${run}-${scene}`} className="bloom" aria-hidden="true" />
        <TopBar onToggleLang={() => setLang((l) => (l === 'ar' ? 'en' : 'ar'))} />
        <main key={`${run}-${scene}`}>
          {scene === 'gate' && <Gate onEnter={() => go('story')} onSkip={() => go('hub')} />}
          {scene === 'story' && <Story onDone={() => go('hub')} />}
          {scene === 'hub' && <Hub visited={visited} onPick={go} onNext={() => go(afterHub)} />}
          {scene === 'memories' && <MemoryUniverse onBack={() => go('hub')} />}
          {scene === 'letter' && <Letter onBack={() => go('hub')} />}
          {scene === 'wishes' && <Wishes onBack={() => go('hub')} />}
          {scene === 'cake' && <Cake onDone={() => go('finale')} />}
          {scene === 'finale' && <Finale onReplay={replay} onBack={() => go(cake ? 'cake' : 'hub')} />}
        </main>
        {scene !== 'gate' && (
          <StoryNav step={stepOf} steps={steps}
            onBack={back[scene] ? () => go(back[scene]!) : undefined}
            onSkip={skip[scene] ? () => go(skip[scene]!) : undefined} />
        )}
      </ConfettiProvider>
    </AppContext.Provider>
  )
}
