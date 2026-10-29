export type CountdownState =
  | { status: 'empty' }
  | { status: 'invalid' }
  | { status: 'past' }
  | { status: 'future'; days: number; hours: number; minutes: number; seconds: number }

const LOCAL = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?$/
const OFFSET = /^([+-])(\d{2}):(\d{2})$/

/** Resolve a zone-less birthday + UTC offset to a timestamp, or null when invalid. */
export function parseBirthday(birthday: string, utcOffset: string): number | null {
  const m = LOCAL.exec(birthday.trim())
  const o = OFFSET.exec(utcOffset.trim())
  if (!m || !o) return null
  const [y, mo, d, h = 0, mi = 0, s = 0] = m.slice(1).map((v) => (v === undefined ? 0 : Number(v)))
  if (mo < 1 || mo > 12 || h > 23 || mi > 59 || s > 59) return null
  const probe = new Date(Date.UTC(y, mo - 1, d, h, mi, s))
  if (probe.getUTCMonth() !== mo - 1 || probe.getUTCDate() !== d) return null // e.g. Feb 31
  const offsetH = Number(o[2]), offsetM = Number(o[3])
  if (offsetH > 14 || offsetM > 59) return null
  const offsetMs = (offsetH * 60 + offsetM) * 60_000 * (o[1] === '-' ? -1 : 1)
  return probe.getTime() - offsetMs
}

export function getCountdown(birthday: string, utcOffset: string, now: number = Date.now()): CountdownState {
  if (!birthday.trim()) return { status: 'empty' }
  const target = parseBirthday(birthday, utcOffset)
  if (target === null) return { status: 'invalid' }
  const diff = target - now
  if (diff <= 0) return { status: 'past' }
  return {
    status: 'future',
    days: Math.floor(diff / 864e5),
    hours: Math.floor((diff % 864e5) / 36e5),
    minutes: Math.floor((diff % 36e5) / 6e4),
    seconds: Math.floor((diff % 6e4) / 1e3),
  }
}
