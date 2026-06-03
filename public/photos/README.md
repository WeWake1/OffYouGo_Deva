# Photos go here

Drop the real photos into this folder, then point each memory at them in
`src/config/content.ts`.

## Steps

1. Copy an image in here, e.g. `nandi-sunrise.jpg`.
2. Open `src/config/content.ts`, find `memories.items`, and set the `src`:

   ```ts
   {
     src: '/photos/nandi-sunrise.jpg', // path is relative to /public
     title: 'Nandi Hills',
     when: 'Aug 2025',
     caption: 'the 4am drive that was 100% worth it',
     alt: 'The two of us at the top of Nandi Hills at sunrise',
   }
   ```

3. Any item whose `src` is left as `''` shows a tasteful "drop a photo here"
   slot instead, so the layout looks intentional before the photos land.

## Tips

- **Format:** `.jpg` / `.webp` for photos. WebP is smaller — nice to have, not required.
- **Size:** ~1200px on the long edge is plenty; the cards are shown at 4:5.
- **Orientation:** portrait crops best, but any aspect works (images are `object-cover`).
- **Filenames:** lowercase, no spaces (`first-trip.jpg`, not `First Trip.JPG`).

> This file just keeps the folder in version control — you can delete it once
> your photos are in.
