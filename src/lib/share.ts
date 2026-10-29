export function buildWhatsAppUrl(number: string, text: string): string {
  const digits = number.replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}

/** Open WhatsApp; if the popup is blocked, navigate the current tab instead. */
export function openWhatsApp(url: string): void {
  const w = window.open(url, '_blank', 'noopener')
  if (!w) window.location.href = url
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch { /* fall through to the legacy path */ }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.cssText = 'position:fixed;opacity:0'
    document.body.appendChild(ta)
    ta.select()
    const ok = typeof document.execCommand === 'function' && document.execCommand('copy')
    ta.remove()
    return ok
  } catch {
    return false
  }
}
