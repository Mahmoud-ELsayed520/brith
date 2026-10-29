import { render, screen, within, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { Countdown } from './components/Countdown'
import { AppContext } from './context'
import { birthdayConfig } from './config/birthday'
import type { BirthdayConfig } from './types'

const en: BirthdayConfig = { ...birthdayConfig, defaultLang: 'en' }
const T = en.text.en
const btn = (name: string | RegExp) => screen.getByRole('button', { name })

/** Render and jump to the journey hub via the gate's skip action. */
async function toHub(cfg = en) {
  const user = userEvent.setup()
  render(<App config={cfg} />)
  await user.click(btn(cfg.text[cfg.defaultLang].skip))
  return user
}
const heading = (name: string | RegExp) => screen.getByRole('heading', { name })

describe('chapter 1 — opening', () => {
  it('shows the sealed letter with the personalised name and subtitle', () => {
    render(<App config={en} />)
    expect(heading('Layla')).toBeInTheDocument()
    expect(document.querySelector('.kicker')).toHaveTextContent(T.sealedFor)
    expect(btn(T.enter)).toBeInTheDocument()
  })
  it('Enter opens the seal once (no double trigger) and moves into the story', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App config={en} />)
    await user.click(btn(T.enter))
    expect(document.querySelector('.gate')).toHaveClass('opening')
    expect(btn(T.enter)).toBeDisabled()
    await act(async () => { vi.advanceTimersByTime(1300) })
    expect(screen.getByText(/Somewhere/)).toBeInTheDocument()
  })
  it('Skip goes straight to the journey', async () => {
    await toHub()
    expect(heading(T.chooseTitle)).toBeInTheDocument()
  })
})

describe('chapter 2 — the story', () => {
  async function toStory() {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App config={en} />)
    await user.click(btn(T.enter))
    await act(async () => { vi.advanceTimersByTime(1300) })
    return user
  }
  it('reveals one passage at a time and never auto-advances', async () => {
    const user = await toStory()
    const p = document.querySelector('.passage')!
    expect(p.textContent).toContain('Somewhere')
    await act(async () => { vi.advanceTimersByTime(15000) })
    expect(document.querySelector('.passage')!.textContent).toContain('Somewhere')
    await user.click(btn(T.next))
    expect(document.querySelector('.passage')!.textContent).toContain('Layla')
    await user.click(btn(T.back))
    expect(document.querySelector('.passage')!.textContent).toContain('Somewhere')
  })
  it('supports tap-to-continue and finishes at the journey', async () => {
    const user = await toStory()
    await user.click(document.querySelector('.passage')!)
    expect(document.querySelector('.passage')!.textContent).toContain('Layla')
    await user.click(btn(T.next))
    await user.click(btn(T.next))
    expect(heading(T.chooseTitle)).toBeInTheDocument()
  })
})

describe('chapter 3 — choose your journey', () => {
  it('lists the three paths and marks visited ones; returns from each path', async () => {
    const user = await toHub()
    expect(screen.getAllByRole('button').filter((b) => b.hasAttribute('data-path'))).toHaveLength(3)
    for (const [path, title] of [['memories', T.memTitle], ['letter', T.letterTitle], ['wishes', T.wishesTitle]] as const) {
      await user.click(document.querySelector(`[data-path=${path}]`)!)
      expect(heading(title)).toBeInTheDocument()
      await user.click(btn(T.backToJourney))
      expect(heading(T.chooseTitle)).toBeInTheDocument()
    }
    expect(screen.getAllByText(T.visited)).toHaveLength(3)
  })
  it('bottom navigation returns to the hub and shows progress', async () => {
    const user = await toHub()
    await user.click(document.querySelector('[data-path=letter]')!)
    const nav = screen.getByRole('navigation', { name: T.progress })
    expect(within(nav).getAllByRole('listitem')).toHaveLength(4)
    expect(nav.querySelector('[aria-current=step]')).toHaveTextContent(T.stepNames[1])
    await user.click(within(nav).getByRole('button', { name: T.back }))
    expect(heading(T.chooseTitle)).toBeInTheDocument()
  })
  it('hides disabled paths', async () => {
    await toHub({ ...en, paths: { memories: true, letter: false, wishes: false } })
    expect(document.querySelectorAll('[data-path]')).toHaveLength(1)
  })
})

describe('chapter 4 — memory universe', () => {
  it('opens a memory in a dialog, closes with Escape/✕/backdrop and restores focus', async () => {
    const user = await toHub()
    await user.click(document.querySelector('[data-path=memories]')!)
    expect(screen.getByText(T.memPlaceholder)).toBeInTheDocument()
    const cards = document.querySelectorAll<HTMLElement>('.orbit')
    expect(cards).toHaveLength(en.memories.length)
    await user.click(cards[0])
    expect(screen.getByRole('dialog', { name: 'The first laugh' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(cards[0]).toHaveFocus()
    await user.click(cards[1])
    await user.click(btn(T.close))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(cards[2])
    await user.click(document.querySelector('.dim')!)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
  it('gives cards different reveal variants', async () => {
    const user = await toHub()
    await user.click(document.querySelector('[data-path=memories]')!)
    const cards = document.querySelectorAll<HTMLElement>('.orbit')
    await user.click(cards[1])
    expect(document.querySelector('.mcard')).toHaveClass('reveal-1')
  })
})

describe('chapter 5 — hidden wishes', () => {
  it('reveals a wish per star and the reward when all are found', async () => {
    const user = await toHub()
    await user.click(document.querySelector('[data-path=wishes]')!)
    expect(screen.getByText(T.wishesHint)).toBeInTheDocument()
    await user.click(btn('Star 1 of 3'))
    expect(screen.getByText('A year full of laughter.')).toBeInTheDocument()
    expect(screen.getByText('1 of 3 found')).toBeInTheDocument()
    await user.click(btn('Star 1 of 3')) // repeated tap never duplicates
    expect(screen.getAllByText('A year full of laughter.')).toHaveLength(1)
    await user.click(btn('Star 2 of 3'))
    await user.click(btn('Star 3 of 3'))
    expect(screen.getByText(T.wishesReward)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: T.revealAll })).not.toBeInTheDocument()
  })
  it('can be skipped with "Reveal all"', async () => {
    const user = await toHub()
    await user.click(document.querySelector('[data-path=wishes]')!)
    await user.click(btn(T.revealAll))
    expect(document.querySelectorAll('.wishlist li')).toHaveLength(3)
    expect(screen.getByText(T.wishesReward)).toBeInTheDocument()
  })
  it('stars work from the keyboard', async () => {
    const user = await toHub()
    await user.click(document.querySelector('[data-path=wishes]')!)
    btn('Star 2 of 3').focus()
    await user.keyboard('{Enter}')
    expect(screen.getByText('Dreams that find their way to you.')).toBeInTheDocument()
  })
})

describe('chapter 6 — letter', () => {
  it('shows selectable text and reveals it all on request', async () => {
    const user = await toHub()
    await user.click(document.querySelector('[data-path=letter]')!)
    await user.click(btn(T.unfold))
    expect(screen.getByTestId('paper')).toHaveClass('show', 'instant')
    expect(within(screen.getByTestId('paper')).getByText('Dear Layla,')).toBeInTheDocument()
  })
})

describe('chapter 7 — cake', () => {
  it('shows the wish only after every candle is out; relight resets; continue goes to the finale', async () => {
    const user = await toHub()
    await user.click(btn(T.toCake))
    const candles = screen.getAllByRole('button', { name: /^Candle \d$/ })
    expect(candles).toHaveLength(5)
    for (const c of candles.slice(0, 4)) await user.click(c)
    expect(document.getElementById('wish')).toBeEmptyDOMElement()
    await user.click(candles[4])
    expect(document.getElementById('wish')).toHaveTextContent('Happy birthday, Layla!')
    await user.click(btn(T.relight))
    expect(document.getElementById('wish')).toBeEmptyDOMElement()
    for (const c of candles) await user.click(c)
    await user.click(btn(T.toFinale))
    expect(heading(T.finTitle)).toBeInTheDocument()
  })
  it('candles work with the keyboard', async () => {
    const user = await toHub()
    await user.click(btn(T.toCake))
    const first = btn('Candle 1')
    first.focus()
    await user.keyboard('{Enter}')
    expect(first).toHaveAttribute('aria-pressed', 'true')
  })
  it('is skipped when the cake section is disabled', async () => {
    const user = await toHub({ ...en, sections: { ...en.sections, cake: false } })
    await user.click(btn(T.toCake))
    expect(heading(T.finTitle)).toBeInTheDocument()
  })
})

describe('chapter 8 — finale', () => {
  async function toFinale(cfg = en) {
    const user = await toHub(cfg)
    await user.click(btn(T.toCake))
    await user.click(btn(T.toFinale))
    return user
  }
  it('shows a monogram from the recipient (or the configured letter)', async () => {
    await toFinale()
    expect(document.querySelector('.monogram')).toHaveTextContent('L')
  })
  it('uses a configured monogram', async () => {
    await toFinale({ ...en, monogram: 'ℒ' })
    expect(document.querySelector('.monogram')).toHaveTextContent('ℒ')
  })
  it('copies the link and confirms', async () => {
    const user = await toFinale()
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    await user.click(btn(T.copy))
    expect(writeText).toHaveBeenCalledWith(window.location.href)
    expect(await screen.findByText(T.copied)).toBeInTheDocument()
  })
  it('shows a graceful message when copying is impossible', async () => {
    const user = await toFinale()
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denied'))
    document.execCommand = vi.fn().mockReturnValue(false)
    await user.click(btn(T.copy))
    expect(await screen.findByText(T.copyFail)).toBeInTheDocument()
  })
  it('opens WhatsApp with the real page URL, encoded', async () => {
    const user = await toFinale({ ...en, whatsapp: { enabled: true, number: '+20 100 123' } })
    const open = vi.spyOn(window, 'open').mockReturnValue({} as Window)
    await user.click(btn(T.share))
    const url = open.mock.calls[0][0] as string
    expect(url.startsWith('https://wa.me/20100123?text=')).toBe(true)
    expect(decodeURIComponent(url)).toContain(window.location.href)
  })
  it('hides WhatsApp when disabled', async () => {
    await toFinale({ ...en, whatsapp: { enabled: false, number: '' } })
    expect(screen.queryByRole('button', { name: T.share })).not.toBeInTheDocument()
  })
  it('replay returns to the sealed letter and resets progress', async () => {
    const user = await toFinale()
    await user.click(btn(T.replay))
    expect(btn(T.enter)).toBeInTheDocument()
    await user.click(btn(T.skip))
    expect(screen.queryByText(T.visited)).not.toBeInTheDocument()
  })
  it('back returns to the previous scene', async () => {
    const user = await toFinale()
    await user.click(screen.getAllByRole('button', { name: T.backToJourney })[0])
    expect(heading(T.cakeTitle)).toBeInTheDocument()
  })
})

describe('language and theme', () => {
  it('toggles RTL <-> LTR and translates the current scene', async () => {
    const user = await toHub({ ...birthdayConfig, defaultLang: 'ar' })
    expect(document.documentElement).toHaveAttribute('dir', 'rtl')
    expect(heading('اختاري رحلتك')).toBeInTheDocument()
    await user.click(btn('English'))
    expect(document.documentElement).toHaveAttribute('dir', 'ltr')
    expect(heading(T.chooseTitle)).toBeInTheDocument()
    await user.click(btn('العربية'))
    expect(document.documentElement).toHaveAttribute('dir', 'rtl')
  })
  it('applies theme colours as CSS variables', async () => {
    render(<App config={{ ...en, theme: { gold: '#123456' } }} />)
    expect(document.documentElement.style.getPropertyValue('--gold')).toBe('#123456')
  })
})

describe('music', () => {
  it('has no button without a file, and never autoplays when configured', async () => {
    const { unmount } = render(<App config={en} />)
    expect(screen.queryByRole('button', { name: /Music/ })).not.toBeInTheDocument()
    unmount()
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
    render(<App config={{ ...en, music: 'music/song.mp3' }} />)
    expect(play).not.toHaveBeenCalled()
    await userEvent.click(btn(/Music/))
    expect(play).toHaveBeenCalledTimes(1)
  })
})

describe('countdown states (hub)', () => {
  function renderCd(props: { birthday: string; utcOffset?: string }) {
    const ctx = { config: en, lang: 'en' as const, t: T, name: 'Layla', sender: 's', f: (s: string) => s, reduceMotion: true }
    return render(<AppContext.Provider value={ctx}><Countdown {...props} /></AppContext.Provider>)
  }
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T00:00:00Z')) })

  it('empty: setup notice, no numbers', () => {
    renderCd({ birthday: '' })
    expect(screen.getByText(T.cdNone)).toBeInTheDocument()
    expect(screen.queryByTestId('countdown')).not.toBeInTheDocument()
  })
  it('invalid: error notice', () => {
    renderCd({ birthday: '2027-02-31' })
    expect(screen.getByText(T.cdBad)).toBeInTheDocument()
  })
  it('future: numbers', () => {
    renderCd({ birthday: '2027-01-03T01:02:03', utcOffset: '+00:00' })
    expect(screen.getByTestId('countdown')).toHaveTextContent(T.cdUnits[3])
  })
  it('past: celebration, no numbers', () => {
    renderCd({ birthday: '2026-05-05' })
    expect(screen.getByText(T.cdPast)).toBeInTheDocument()
    expect(screen.queryByTestId('countdown')).not.toBeInTheDocument()
  })
  it('ticks every second', () => {
    renderCd({ birthday: '2027-01-01T00:00:59', utcOffset: '+00:00' })
    expect(screen.getByTestId('countdown')).toHaveTextContent('59')
    act(() => { vi.advanceTimersByTime(1000) })
    expect(screen.getByTestId('countdown')).toHaveTextContent('58')
  })
})
