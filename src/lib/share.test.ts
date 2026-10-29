import { buildWhatsAppUrl, copyText, openWhatsApp } from './share'

describe('share helpers', () => {
  it('encodes the WhatsApp message and strips non-digits from the number', () => {
    const url = buildWhatsAppUrl('+20 100-123', 'hi & bye 🎂 https://x.test/?a=1')
    expect(url).toBe(`https://wa.me/20100123?text=${encodeURIComponent('hi & bye 🎂 https://x.test/?a=1')}`)
  })
  it('works without a number (user picks a contact)', () => {
    expect(buildWhatsAppUrl('', 'x')).toBe('https://wa.me/?text=x')
  })
  it('falls back to same-tab navigation when the popup is blocked', () => {
    vi.spyOn(window, 'open').mockReturnValue(null)
    const loc = { href: '' }
    vi.stubGlobal('location', loc)
    openWhatsApp('https://wa.me/?text=x')
    expect(loc.href).toBe('https://wa.me/?text=x')
    vi.unstubAllGlobals()
  })
  it('copies with the Clipboard API', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    expect(await copyText('abc')).toBe(true)
    expect(writeText).toHaveBeenCalledWith('abc')
  })
  it('falls back to execCommand when the Clipboard API fails', async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } })
    document.execCommand = vi.fn().mockReturnValue(true)
    expect(await copyText('abc')).toBe(true)
    expect(document.execCommand).toHaveBeenCalledWith('copy')
  })
  it('reports failure when every path fails', async () => {
    Object.assign(navigator, { clipboard: undefined })
    document.execCommand = vi.fn().mockReturnValue(false)
    expect(await copyText('abc')).toBe(false)
  })
})
