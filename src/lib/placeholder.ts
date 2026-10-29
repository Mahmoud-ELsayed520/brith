/** Generated PLACEHOLDER image (SVG data URI). Never a real photo. */
export function placeholderImage(hue = 330): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue},70%,88%)"/><stop offset="1" stop-color="hsl(${(hue + 50) % 360},55%,78%)"/></linearGradient></defs><rect width="400" height="500" fill="url(#g)"/><circle cx="200" cy="210" r="70" fill="rgba(255,255,255,.55)"/><text x="200" y="400" text-anchor="middle" font-family="serif" font-size="24" fill="rgba(58,36,71,.6)">placeholder</text></svg>`
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}

/** Resolve a configured path against Vite's base URL. */
export function resolveAsset(path: string): string {
  if (/^(https?:|data:|\/)/.test(path)) return path
  return import.meta.env.BASE_URL + path
}
