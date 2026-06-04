/**
 * Resolve a path to a file in `public/` so it loads no matter where the built
 * site is hosted.
 *
 * The image paths in content.ts are written as `/photos/photo-NN.jpg` — handy
 * to author, but a leading-slash URL is absolute to the *domain* root. On a
 * GitHub Pages project site the app lives under a subpath
 * (`username.github.io/<repo>/`), so `/photos/...` points at
 * `username.github.io/photos/...` and 404s. (It only "works" on the dev server
 * and `vite preview` because those serve from the root `/`.)
 *
 * Vite rewrites *imported* assets for the configured `base`, but never touches
 * runtime strings like these, so we resolve them ourselves against
 * `import.meta.env.BASE_URL` (which mirrors `base` — `'./'` in this project).
 * Works for a relative base (`'./'` → `'./photos/...'`, relative to the page),
 * a subpath base (`'/repo/'`), and a domain-root base (`'/'`) alike.
 */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL || './';
  return (base.endsWith('/') ? base : base + '/') + path.replace(/^\//, '');
}
