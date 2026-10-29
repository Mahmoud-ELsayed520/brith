import { createContext, useContext } from 'react'
import type { BirthdayConfig, Lang, Messages } from './types'

export interface AppCtx {
  config: BirthdayConfig
  lang: Lang
  t: Messages
  name: string
  sender: string
  /** Replace `{name}` in a message with the recipient's name. */
  f: (s: string) => string
  reduceMotion: boolean
}

export const AppContext = createContext<AppCtx | null>(null)

export function useApp(): AppCtx {
  const c = useContext(AppContext)
  if (!c) throw new Error('useApp must be used inside <AppContext.Provider>')
  return c
}
