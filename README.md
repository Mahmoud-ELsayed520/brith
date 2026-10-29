# A Little World of Us — a story made just for you

A cinematic, mobile-first, bilingual (Arabic RTL / English LTR) interactive birthday story built with **React + TypeScript + Vite**. No backend, no analytics, no external services; nothing a visitor does is stored or sent anywhere.

**The journey:** sealed letter → story passages → *choose your journey* (memories · letter · wishing stars) → cake ceremony → finale. Every scene has Back / Skip, and a progress indicator.

```bash
npm install
npm run dev         # local dev server
npm run typecheck   # TypeScript
npm test            # Vitest + Testing Library (57 tests)
npm run build       # typecheck + production build into dist/
npm run preview     # serve dist/ locally
```

`dist/` is static files with relative paths. Nothing here deploys it.

## Customise — edit only `src/config/birthday.ts`

| What | Field |
|---|---|
| Names | `recipient`, `sender` (`ar` + `en`) |
| Start language | `defaultLang` |
| Birthday date / timezone | `birthday` (`"2027-03-14"` or `"2027-03-14T18:30:00"`, no zone suffix), `utcOffset` (`"+02:00"`). Empty = notice, never a fake countdown |
| Chapter 2 story passages | `story.ar` / `story.en` — short lines, `{name}` is replaced |
| All button/scene copy | `text.ar` / `text.en` |
| Which story paths appear | `paths.memories / letter / wishes` |
| Optional scenes | `sections.countdown / cake` |
| Memory cards (chapter 4) | `memories` — title, text, optional `date`, optional `image` (file in `public/photos/`), both languages. No `image` = generated **placeholder** |
| Hidden wishes (chapter 5) | `wishes` — 1–5 `{ar, en}` items, one glowing star each |
| Letter (chapter 6) | `text.ar.letter` / `text.en.letter` (one item per paragraph) |
| Final message & signature | `text.*.finTitle`, `finMsg`; `sender`; `monogram` (empty = first letter of the name) |
| Colours | `theme`: `midnight`, `violet`, `blush`, `ivory`, `gold` |
| Music | `music: "music/song.mp3"` (file in `public/music/`). Empty hides the button. Never autoplays |
| WhatsApp | `whatsapp.enabled`, `whatsapp.number` (digits + country code, or empty) |

Everything marked **SAMPLE** (name "Layla", story, letter, memories, wishes, placeholder images) must be replaced. **Upgrading from v1:** the old `gallery` and `sections.letter/memories/gallery` fields are gone; gallery photos are now `memories[].image`.

## Layout

```
src/config/birthday.ts   customer content
src/App.tsx              scene manager (gate → story → hub → paths → cake → finale)
src/components/          Gate, Story, Hub, MemoryUniverse, Wishes, Letter, Cake, Finale, StoryNav, Sky, Reveal, Confetti, TopBar, Countdown
src/story.css            cinematic layer (palette, parallax, scenes, motion)
src/styles.css           v1 base styles (cake, envelope, paper); some rules are now unused
reference/               original single-file HTML and the v1 React preview, untouched
```

## Behaviour notes

- **Motion:** transforms/opacity only, three static star layers (parallax on scene change, no scroll hijacking), one short light bloom per scene, one confetti burst for the cake and one for the finale. `prefers-reduced-motion` turns off animations, bloom and confetti, and shows all text at once.
- **Accessibility:** the heading of each scene receives focus; dialogs close with ✕, Escape or backdrop and return focus; every interaction is a real button; stars need no precision or speed and can be skipped with "Reveal all".
- **Sharing:** WhatsApp and copy-link use the page's actual URL (clipboard API → `execCommand` → message).
- **Browser back** is never intercepted: scenes are in-page state, not history entries.

## Known limitations

- Automated tests run in jsdom, not a real browser. Layout at 320/360/390/430 px, touch, animation feel and Arabic typography must be checked on real devices.
- Fonts come from Google Fonts with system fallbacks.
- Progress is in memory only; reloading restarts the story (by design: no storage).
