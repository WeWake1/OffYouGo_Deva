# Build Brief — "A Send-Off Site" (personal farewell webpage)

You are an exceptional creative front-end engineer and designer. I'm giving you a real, personal project with real emotional weight. Read the whole brief before writing any code. **Treat this as a portfolio-grade build, not a template fill-in.**

---

## 1. The story (this is the *why* — internalize it)

A close friend of mine is leaving tomorrow night for a **six-month research internship in Taiwan**. We're both BTech students in Computer Science with an AI/ML specialization, in the same batch — we just finished our 6th semester, so we only have about a year (two semesters) of college left together, and she'll be gone for half of it. We've taken a bunch of small trips and outings together, and I have photos from them.

I want to give her something that no one else could give her: a **single, beautiful webpage made just for her** as a surprise send-off gift. It should feel personal, a little playful, and genuinely moving — the kind of thing she keeps open in a browser tab while she's far from home. The fact that we're both coders is part of the charm: small, tasteful technical/AI-ML in-jokes are welcome, but the *heart* of it is the friendship and the distance.

The emotional arc to capture: **she's leaving → here's everything we already shared → I'll be counting the days → come back to us.**

---

## 2. What to build

A polished, responsive, **single-page** website (one scrollable experience, no multi-page routing) that works beautifully on both mobile and desktop. It is a static site — no backend, no database, no auth.

---

## 3. Creative freedom — go big, then make it tight

**You have full creative license to invent the concept.** Do NOT default to a generic "memories + countdown" landing page. I prototyped a departure-board / boarding-pass idea earlier, but **you are free to ignore it entirely** and design something better. Surprise me.

Before coding:
- Explore 2–3 distinct conceptual directions in your head (e.g., a journey/transit metaphor, a starfield/constellation of memories, a "training run paused for 182 days" ML metaphor, an analog scrapbook, a postcard exchange across timezones, whatever you invent).
- Commit to the single strongest one.
- In a few sentences, tell me the concept you chose and *why* it fits the story — then build it end-to-end. (I'll course-correct after seeing it; don't wait for my approval to start.)

Aesthetic standards (non-negotiable):
- **Commit to one bold, cohesive aesthetic direction** executed with precision. Intentionality over intensity.
- **Distinctive typography.** Pair a characterful display font with a refined body font. Avoid the generic defaults (Inter, Roboto, Arial, system stacks, and please not the over-used Space Grotesk).
- **Atmosphere, not flat color.** Use depth — gradient meshes, grain/noise, subtle starfields, layered shadows, textures — appropriate to the concept.
- **One well-orchestrated page-load reveal** (staggered entrances) plus a few surprising hover/scroll micro-interactions. High-impact moments over scattered fidget animations.
- Avoid AI-slop clichés: purple-on-white gradients, predictable card grids, cookie-cutter hero + three-feature-columns. Make it feel *designed for her*.

---

## 4. Content the page must hold

The concept is yours, but the page should make room for all of these (style them however the concept demands):

1. **A hero / opening moment** — sets the tone and names the occasion (leaving for Taiwan, six months).
2. **A live countdown** to the day she returns — ticking down (days/hours/min/sec), updating every second. This is the emotional centerpiece; make it feel like it matters.
3. **A memories gallery** — her trip photos with, per photo: a place/title, a date or vague timeframe, and a one-line memory or inside joke. Make the photos feel like treasured objects, not a stock grid.
4. **An "Open when…" section** — a set of notes ("open when you're homesick", "when you ace something", "when you miss home food", etc.) that reveal their message on interaction (click/tap to open).
5. **A music slot** — an embeddable playlist (Spotify/YouTube). If no link is provided, hide this section gracefully.
6. **A letter** — a longer, heartfelt closing message from me, signed off.

All of the *actual words and media* come from a config file (see §6) — you write the structure and the placeholders, I fill in the real content.

---

## 5. Tech constraints

- **Stack:** Vite + React + **TypeScript**, styled with **Tailwind CSS**. (Tailwind is required so the React Bits components I add later drop in cleanly — see §7.)
- **Single page**, no router. Components organized modularly (one component per section).
- **Deploy-agnostic / decide-host-later:** set Vite `base: './'` so relative asset paths work whether it's served from a domain root (Vercel/Netlify) or a project subpath (GitHub Pages). No host-specific hardcoding.
- **Responsive & mobile-first.** It must look intentional on a phone — she'll likely open it on her phone first.
- **Accessible & polite motion:** respect `prefers-reduced-motion` (provide reduced/again static fallbacks for heavy animations). Semantic HTML, alt text on images, sensible color contrast.
- **Performant:** lazy-load images, keep the bundle reasonable, no unnecessary heavy libraries for effects you can do in CSS.
- Clean, readable, commented code. A `README.md` with: how to run (`npm install && npm run dev`), how to add photos, where to edit content, and how to build/deploy.

---

## 6. Personal content lives in ONE config file

Put **every** personal/editable thing — names, cities, dates, photo paths, memory captions, "open when" notes, playlist URL, the letter text, the sign-off — into a single typed config file, e.g. `src/config/content.ts`, with a clear interface and inline comments. The UI reads from it; I should be able to personalize the whole site by editing only that file plus dropping images into `public/photos/` (or `src/assets/photos/`).

**Important:** I have NOT given you her real name, the real return date, the real letter, or the photos yet. Do **not** invent fake personal facts and present them as real. Use clearly-labeled placeholders (e.g. `herName: "[[HER NAME]]"`, a `returnDate` set ~6 months out with a `// TODO: set real date` comment, placeholder image slots that show a tasteful "drop a photo here" state when empty, and `[[write the homesick note here]]`-style strings). Make the placeholders obvious so I know exactly what to replace.

Known facts you *can* bake in: departure is tomorrow night ~22:00 IST from Bengaluru (BLR); destination is Taiwan (assume Taipei/TPE but expose the city as config in case it's Hsinchu/Tainan); she returns in ~6 months; we're both CSE / AI-ML students in the same batch.

---

## 7. Prepare the ground for React Bits (I'll add components later)

I'll be bringing in several components from **React Bits** (reactbits.dev) after the first build — animated text, backgrounds, and interactive bits. Set things up so they integrate without friction:

- I'll use the **TypeScript + Tailwind** variant of React Bits. Components are **copied into the codebase** (not a black-box npm package) via the jsrepo or shadcn CLI — e.g. `npx jsrepo add https://reactbits.dev/ts/tailwind/<Category>/<Component>` or `npx shadcn@latest add @react-bits/<Component>-TS-TW`. Each component may pull its own dependency (commonly `framer-motion`/`motion`, `gsap`, `react-spring`, or `ogl`/`three` for backgrounds), installed per its docs page.
- So: configure Tailwind properly now, keep a sensible folder for them (e.g. `src/components/reactbits/`), and **design each section as a self-contained component with a clean seam** so a React Bits piece can later replace or wrap a hand-built element (e.g. swap my custom heading for a React Bits animated-text component, or drop a React Bits background behind a section) by changing one component, not rewiring the app.
- For now: **build the whole thing complete and great using your own CSS/Tailwind animations** (don't leave empty holes waiting on me). The React Bits pieces are an upgrade pass, not a dependency for v1.
- When I later paste specific React Bits components or links, integrate them tastefully into the existing design rather than bolting them on.

---

## 8. How to work

1. Briefly state your chosen concept and a short build plan.
2. Scaffold the Vite + React + TS + Tailwind project and build all sections end-to-end against the config placeholders.
3. Make it run cleanly with `npm install && npm run dev`, with no console errors.
4. Write the README.
5. Tell me clearly what I need to fill in (the config fields + where photos go), and what the React Bits upgrade pass could enhance.
6. Ask me if anything is genuinely blocking — otherwise, make tasteful decisions and keep moving.

## 9. Definition of done (v1)

- Runs with `npm install && npm run dev`, no errors.
- Bold, cohesive, non-generic design that fits the story; looks intentional on mobile and desktop.
- Working live countdown to the return date.
- All six content areas present and reading from `src/config/content.ts`.
- Obvious, well-labeled placeholders for everything personal; empty photo slots degrade gracefully.
- Tailwind configured and architecture ready for React Bits (TS + Tailwind) drop-ins.
- `base: './'` set; static build (`npm run build`) works and is host-agnostic.
- README explains run, customize, add photos, and deploy.

Now: pick your concept, tell me what it is in a few sentences, and build it.
