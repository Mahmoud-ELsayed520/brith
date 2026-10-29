import { birthdayConfig as c } from './birthday'

describe('default customer config', () => {
  it('keeps the birthday date empty (no fake countdown)', () => {
    expect(c.birthday).toBe('')
  })
  it('has no music or WhatsApp number by default', () => {
    expect(c.music).toBe('')
    expect(c.whatsapp.number).toBe('')
  })
  it('uses generated placeholders, not real photo paths', () => {
    expect(c.memories.length).toBeGreaterThan(0)
    expect(c.memories.every((m) => !m.image)).toBe(true)
  })
  it('has 3-6 memory cards and 1-5 hidden wishes', () => {
    expect(c.memories.length).toBeGreaterThanOrEqual(3)
    expect(c.memories.length).toBeLessThanOrEqual(6)
    expect(c.wishes.length).toBeGreaterThanOrEqual(1)
    expect(c.wishes.length).toBeLessThanOrEqual(5)
  })
  it('provides story passages in both languages', () => {
    expect(c.story.ar.length).toBeGreaterThan(0)
    expect(c.story.ar.length).toBe(c.story.en.length)
  })
  it('has matching Arabic and English message keys', () => {
    expect(Object.keys(c.text.ar).sort()).toEqual(Object.keys(c.text.en).sort())
    expect(c.text.ar.letter.length).toBe(c.text.en.letter.length)
  })
  it('enables all sections and story paths by default', () => {
    expect(Object.values(c.sections).every(Boolean)).toBe(true)
    expect(Object.values(c.paths).every(Boolean)).toBe(true)
  })
})
