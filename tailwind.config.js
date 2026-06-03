/** @type {import('tailwindcss').Config} */
// Tailwind v3 config. Everything visual that the concept leans on — the
// night-sky palette, the three typefaces, and the lantern/star keyframes —
// lives here so it's tweakable in one place. React Bits (TS + Tailwind)
// components drop straight into this setup; see src/components/reactbits/.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Characterful display serif (headlines, the letter greeting).
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        // Warm, readable humanist sans for body copy.
        body: ['"Hanken Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Monospace for the "coder" labels: coordinates, dates, countdown.
        mono: ['"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // Deep night base.
        ink: { DEFAULT: '#080712', deep: '#050409' },
        // Indigo/navy night-sky steps (cool side of the palette).
        night: {
          900: '#0a0a1a',
          800: '#101129',
          700: '#1a1c3c',
          600: '#262a54',
        },
        dusk: '#352c54', // transitional blue-violet, used sparingly in the mesh
        // Warm lantern light (the emotional, glowing side of the palette).
        ember: {
          300: '#ffe0ad',
          400: '#ffc878',
          500: '#f7ab4d',
          600: '#ef8f3c',
        },
        flame: '#ff7a3c',
        gold: '#f3c987',
        // Warm paper for the letter.
        paper: { DEFAULT: '#f4ead6', dim: '#e6d6ba' },
        // Muted lavender-grey for secondary text on the night sky.
        haze: '#b7b1cb',
        coral: '#e07a5f',
        // The boarding pass — warm paper laid on the night sky.
        ticket: {
          paper: '#f6ecd6', // main cream
          edge: '#eaddc0', // the slightly darker stub
          ink: '#2a2118', // warm near-black text on cream
          label: '#9c8b6c', // muted mono labels
          stamp: '#c0473b', // rubber-stamp red
        },
      },
      letterSpacing: {
        widest: '0.28em',
      },
      maxWidth: {
        prose: '68ch',
      },
      boxShadow: {
        // Reusable warm glow for lanterns and lit elements.
        glow: '0 0 40px -8px rgba(247,171,77,0.55), 0 0 80px -20px rgba(255,122,60,0.35)',
        'glow-sm': '0 0 24px -6px rgba(247,171,77,0.5)',
        lantern:
          '0 18px 60px -20px rgba(0,0,0,0.7), inset 0 0 50px -10px rgba(255,200,120,0.45)',
      },
      keyframes: {
        // Drifting sky lanterns slowly rising and fading at the top.
        rise: {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: '0' },
          '10%': { opacity: 'var(--rise-opacity, 0.85)' },
          '85%': { opacity: 'var(--rise-opacity, 0.85)' },
          '100%': {
            transform: 'translateY(-115vh) translateX(var(--rise-drift, 4vw))',
            opacity: '0',
          },
        },
        // Gentle left-right sway layered on top of the rise.
        sway: {
          '0%, 100%': { transform: 'translateX(-6px) rotate(-1.5deg)' },
          '50%': { transform: 'translateX(6px) rotate(1.5deg)' },
        },
        // Star twinkle.
        twinkle: {
          '0%, 100%': { opacity: '0.25', transform: 'scale(0.9)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
        // Soft pulse of lantern glow.
        glow: {
          '0%, 100%': { opacity: '0.7', filter: 'brightness(1)' },
          '50%': { opacity: '1', filter: 'brightness(1.18)' },
        },
        // Flame flicker.
        flicker: {
          '0%, 100%': { opacity: '0.85', transform: 'scaleY(1)' },
          '25%': { opacity: '1', transform: 'scaleY(1.08)' },
          '60%': { opacity: '0.7', transform: 'scaleY(0.94)' },
        },
        // Gentle bob for hero lantern.
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        // Entrance reveal.
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // Subtle scroll cue.
        'nudge': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.5' },
          '50%': { transform: 'translateY(8px)', opacity: '1' },
        },
      },
      animation: {
        sway: 'sway 6s ease-in-out infinite',
        twinkle: 'twinkle var(--twinkle-dur, 4s) ease-in-out infinite',
        glow: 'glow 4.5s ease-in-out infinite',
        flicker: 'flicker 2.2s ease-in-out infinite',
        float: 'float 7s ease-in-out infinite',
        'fade-up': 'fade-up 0.9s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in 1.2s ease both',
        nudge: 'nudge 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
