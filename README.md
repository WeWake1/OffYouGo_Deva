# Under One Sky ✦

A single-page farewell site — a send-off written in sky lanterns, with a live
countdown ticking down every second until she's home.

Deep-indigo night sky, warm drifting lanterns, a countdown to her return, the
trips you already shared, "open when…" notes that light up on tap, an optional
playlist, and a long letter at the end. Built to feel like *one sky between two
cities*, not a template.

> **The whole point:** everything personal lives in **one file** —
> [`src/config/content.ts`](src/config/content.ts). You shouldn't need to touch
> any component. Open it, search for `[[`, and fill in the blanks.

---

## Quick start

```bash
npm install
npm run dev      # local dev server (Vite prints the URL, usually http://localhost:5173)
```

Then open the printed URL. Edit `src/config/content.ts` and the page hot-reloads.

```bash
npm run build    # type-checks (tsc) + builds to dist/
npm run preview  # serve the built dist/ locally to sanity-check the production build
```

---

## What to fill in (the only file that matters)

Open **`src/config/content.ts`** and search for `[[`. Every blank is wrapped in
`[[ double brackets ]]`, and the UI deliberately shows those as dimmed "to-do"
text — so nothing fake ever ships by accident.

| In the config | What it is |
| --- | --- |
| `herName`, `yourName` | The two names. Used everywhere via tokens (below). |
| `returnISO` | **The countdown target.** Set her real return date/time. |
| `departureISO` | When she leaves (pre-filled to the known send-off). |
| `to` / `timezones.to` / `distanceKm` | Destination city — change from Taipei if the lab's in Hsinchu/Tainan. |
| `memories.items[].src` | Point each photo at a file in `public/photos/` (see below). |
| `openWhen.notes[].message` | The note each lantern reveals when tapped. |
| `music.provider` + `music.embedUrl` | Spotify/YouTube embed — or leave empty to hide the section. |
| `letter.paragraphs` | The long letter. The part she'll reread. |

### Text tokens

Inside any string in the config you can write:

| Token | Becomes |
| --- | --- |
| `{her}` | her name |
| `{you}` | your name |
| `{from}` | departure city |
| `{to}` | destination city |

e.g. `"Off you go, {her}."` → `"Off you go, Maya."` once you set the name.

### Dates

Use full ISO strings **with the timezone offset** so the countdown is correct no
matter where the site is opened. India is `+05:30`:

```ts
returnISO: '2026-11-30T22:00:00+05:30',
```

---

## Adding photos

1. Drop images into **`public/photos/`** (e.g. `nandi-sunrise.jpg`).
2. Point a memory at it in `content.ts` (path is relative to `public/`):

   ```ts
   {
     src: '/photos/nandi-sunrise.jpg',
     title: 'Nandi Hills',
     when: 'Aug 2025',
     caption: 'the 4am drive that was 100% worth it',
     alt: 'The two of us at the top of Nandi Hills at sunrise',
   }
   ```

3. Any item left with `src: ''` shows a tasteful "drop a photo here" frame, so
   the layout looks intentional before the real photos land.

Tips: portrait crops best (cards are 4:5), ~1200px on the long edge is plenty,
lowercase filenames with no spaces. See [`public/photos/README.md`](public/photos/README.md).

---

## Adding the playlist

In `content.music`, set `provider` and paste the **embed** URL:

- **Spotify:** open a playlist → Share → *Embed playlist* → copy the `src` URL
  (looks like `https://open.spotify.com/embed/playlist/XXXX`), set `provider: 'spotify'`.
- **YouTube:** use `https://www.youtube.com/embed/XXXX` (video or playlist embed),
  set `provider: 'youtube'`.

Leave both empty and the whole music section disappears cleanly — no empty box.

---

## Deploying (host-agnostic)

`npm run build` outputs a static site to `dist/`. Vite is configured with
`base: './'` (see `vite.config.ts`), so the build uses **relative paths** and
works whether it's served from a domain root or a sub-folder.

Upload the contents of `dist/` anywhere static:

- **Netlify / Vercel / Cloudflare Pages:** build command `npm run build`,
  publish directory `dist`.
- **GitHub Pages / any sub-path:** the relative `base` means it just works —
  drop `dist/` in and go.
- **A USB stick / open the file directly:** because of `base: './'`, opening
  `dist/index.html` works too.

---

## Customizing the look

The aesthetic is centralized:

- **Colors, fonts, shadows, keyframes:** `tailwind.config.js`
- **Fonts loaded:** `index.html` (Fraunces · Hanken Grotesk · Space Mono)
- **Atmosphere (gradient mesh, grain, vignette, the CSS lantern):** `src/index.css`
- **The starfield + drifting lanterns:** `src/components/Sky.tsx`

---

## Accessibility & performance

- **Reduced motion:** everything animated respects `prefers-reduced-motion` —
  the page falls back to a calm, static night sky (no drifting, no twinkle).
- **Semantic + screen-reader friendly:** real landmarks/headings, alt text on
  photos, a non-live text summary of the countdown, proper disclosure buttons
  for the "open when…" notes.
- **Performant:** images lazy-load, no animation libraries in v1, fonts use
  `display=swap`.

---

## Optional upgrade: React Bits

The site is **complete on its own** — every animation is hand-built with Tailwind
+ CSS. If you later want extra polish, [React Bits](https://reactbits.dev)
components drop into `src/components/reactbits/` (use the TypeScript + Tailwind
variant). Each section has a documented "seam" showing exactly where a component
slots in. See [`src/components/reactbits/README.md`](src/components/reactbits/README.md).

---

## Project structure

```
src/
  config/content.ts     ← ✦ edit THIS (all copy, dates, photos, links)
  components/            one component per section (Hero, Countdown, Memories, …)
    reactbits/           optional React Bits drop-ins (empty by design)
  lib/                   small hooks + helpers (countdown, in-view, dates, tokens)
  index.css             base styles + atmosphere (gradient, grain, lantern)
public/photos/          ← drop images here
```

## Tech

Vite · React 18 · TypeScript (strict) · Tailwind CSS v3. Single page, no router,
one component per section.

---

*Made with late nights, way too much chai, and a few too many semicolons.*
