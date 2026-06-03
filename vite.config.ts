import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: './' keeps every asset path relative, so the same `npm run build`
  // output works whether it's served from a domain root (Vercel/Netlify)
  // or a project subpath (GitHub Pages: username.github.io/repo/). No
  // host-specific hardcoding — decide where to deploy later. See README.
  base: './',
});
