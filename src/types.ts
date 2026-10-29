export type Lang = 'ar' | 'en'
export interface Localized<T> { ar: T; en: T }
export interface PathText { title: string; desc: string }
export type PathId = 'memories' | 'letter' | 'wishes'

export interface Messages {
  // opening + navigation
  subtitle: string; sealedFor: string; enter: string; skip: string
  next: string; back: string; skipScene: string; progress: string
  /** Names of the 4 progress steps: intro, journey, cake, finale. */
  stepNames: [string, string, string, string]
  // chapter 3
  chooseTitle: string; chooseHint: string
  pathMemories: PathText; pathLetter: PathText; pathWishes: PathText
  visited: string; toCake: string
  // chapter 4
  memTitle: string; memHint: string; memPlaceholder: string; close: string; backToJourney: string
  // chapter 5
  wishesTitle: string; wishesHint: string; star: string; wishesFound: string; revealAll: string; wishesReward: string
  // chapter 6
  letterTitle: string; unfold: string
  /** Paragraphs of the personal letter. `{name}` is replaced by the recipient. */
  letter: string[]
  // countdown
  cdTitle: string; cdUnits: [string, string, string, string]; cdNone: string; cdBad: string; cdPast: string
  // chapter 7
  cakeTitle: string; cakeHint: string; relight: string; wish: string; candle: string; toFinale: string
  // chapter 8
  finTitle: string; finMsg: string; replay: string
  share: string; copy: string; copied: string; copyFail: string; shareMsg: string
  sound: string; musicMissing: string; lang: string
}

export interface MemoryCard {
  date?: string
  /** Optional photo path under /public (e.g. "photos/1.jpg"). Empty/omitted = generated placeholder. */
  image?: string
  alt?: Localized<string>
  /** Hue (0-360) of the generated placeholder. */
  hue?: number
  ar: { title: string; text: string }
  en: { title: string; text: string }
}

export interface Theme { midnight: string; violet: string; blush: string; ivory: string; gold: string }

export interface BirthdayConfig {
  recipient: Localized<string>
  sender: Localized<string>
  defaultLang: Lang
  birthday: string
  utcOffset: string
  /** Optional scenes outside the three story paths. */
  sections: { countdown: boolean; cake: boolean }
  /** Which of the three story paths appear in "Choose your journey". */
  paths: Record<PathId, boolean>
  theme: Partial<Theme>
  /** Letter shown in the finale seal. Empty = first letter of the recipient's name. */
  monogram: string
  music: string
  whatsapp: { enabled: boolean; number: string }
  /** Chapter 2: short passages shown one at a time. `{name}` is replaced. */
  story: Localized<string[]>
  text: Localized<Messages>
  memories: MemoryCard[]
  /** Chapter 5: hidden wishes, one per star (1-5). */
  wishes: Localized<string>[]
}
