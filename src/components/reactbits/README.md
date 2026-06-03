# `reactbits/` — drop-in upgrade components

This folder is the home for components copied in from **[React Bits](https://reactbits.dev)**
(use the **TypeScript + Tailwind** variant, via the jsrepo / shadcn CLI).

The site is **fully complete without anything here** — every animation in v1 is
hand-built with Tailwind + CSS keyframes. React Bits is an optional polish pass,
not a dependency. Add pieces one at a time and keep this folder self-contained.

## What's in here now

- **`Galaxy.tsx` + `Galaxy.css`** — the React Bits Galaxy (WebGL/`ogl` starfield),
  used as the page background via `Sky.tsx` (lazy-loaded, transparent, layered
  over `.sky-gradient`). Added with `npm install ogl`.

## How to add more (no shadcn set up here)

This repo has no `components.json`, so `npx shadcn@latest add @react-bits/<Name>-TS-CSS`
won't run as-is. Instead grab the registry item directly and drop the files in:

```bash
curl -s https://reactbits.dev/r/<Name>-TS-CSS.json   # or -TS-TW for the Tailwind variant
# write each files[].content into this folder, then install its "dependencies"
```

## Why the seam exists

So the swap point is obvious and the import path already exists. A pasted
component lands here as e.g. `reactbits/SplitText.tsx`, and you swap it in at one
of the marked spots below.

## Where each component is designed to slot in

Every section component has a `React Bits seam:` note in its file header. The
cleanest swaps:

| Section (`src/components/…`) | Seam | Good React Bits fits |
| --- | --- | --- |
| `Sky.tsx` | the fixed background, just below `.sky-gradient` | `Aurora`, `Particles`, `Threads`, `Hyperspeed` |
| `Hero.tsx` | the `<h1>` heading markup | `SplitText`, `BlurText`, `ShinyText` |
| `Countdown.tsx` | the big unit digits (`u.raw`) | `CountUp` / rolling-number |
| `Memories.tsx` | each photo card | `TiltedCard`, `SpotlightCard` |
| `OpenWhen.tsx` | each note card | `SpotlightCard`, `GlareCard` |
| `Letter.tsx` | the parchment `<article>` / body lines | `SpotlightCard`, `DecryptedText` |

## Rules of thumb when swapping

1. **Keep all copy in `src/config/content.ts`.** Pass text in as props; never
   hard-code words inside a React Bits component.
2. **Respect reduced motion.** The app exposes `useReducedMotion()`
   (`src/lib/useReducedMotion.ts`) and a global CSS safety-net that neutralizes
   animations. If a pasted component animates heavily, gate it on that hook.
3. **Wrap, don't rewrite.** Replace only the marked markup so layout, spacing,
   and accessibility (headings, alt text, aria) stay intact.
4. **Watch the bundle.** v1 ships with no animation libraries. Some React Bits
   pieces pull in GSAP / three.js — only add them if a component truly earns it.
