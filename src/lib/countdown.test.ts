import { getCountdown, parseBirthday } from './countdown'

const NOW = Date.UTC(2027, 0, 1, 0, 0, 0)

describe('getCountdown', () => {
  it('is empty for an empty or blank birthday (default config)', () => {
    expect(getCountdown('', '+02:00', NOW)).toEqual({ status: 'empty' })
    expect(getCountdown('   ', '+02:00', NOW)).toEqual({ status: 'empty' })
  })

  it.each(['not a date', '2027-13-01', '2027-02-31', '2027-03-14T25:00:00', '14/03/2027'])('flags %s as invalid', (v) => {
    expect(getCountdown(v, '+02:00', NOW)).toEqual({ status: 'invalid' })
  })

  it('flags a malformed offset as invalid', () => {
    expect(getCountdown('2027-03-14', 'Cairo', NOW)).toEqual({ status: 'invalid' })
    expect(getCountdown('2027-03-14', '+99:00', NOW)).toEqual({ status: 'invalid' })
  })

  it('counts down to a future date', () => {
    // 2027-01-03T01:02:03 at +02:00 === 2027-01-02T23:02:03Z -> 2d 23h 2m 3s after NOW
    expect(getCountdown('2027-01-03T01:02:03', '+02:00', NOW)).toEqual({ status: 'future', days: 1, hours: 23, minutes: 2, seconds: 3 })
  })

  it('applies the timezone offset', () => {
    const a = parseBirthday('2027-06-01T00:00:00', '+00:00')!
    const b = parseBirthday('2027-06-01T00:00:00', '+02:00')!
    const c = parseBirthday('2027-06-01T00:00:00', '-05:00')!
    expect(a - b).toBe(2 * 3600_000)
    expect(c - a).toBe(5 * 3600_000)
  })

  it('accepts a date without a time (midnight)', () => {
    expect(parseBirthday('2027-03-14', '+00:00')).toBe(Date.UTC(2027, 2, 14))
  })

  it('reports past (never negative numbers) at and after the date', () => {
    expect(getCountdown('2026-12-31T00:00:00', '+00:00', NOW)).toEqual({ status: 'past' })
    expect(getCountdown('2027-01-01T00:00:00', '+00:00', NOW)).toEqual({ status: 'past' })
  })
})
