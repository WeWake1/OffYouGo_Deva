import content from '../config/content';
import { fill } from '../lib/text';
import { Reveal } from './Reveal';

/**
 * Embedded playlist. If no provider/URL is set in the config, the entire
 * section renders nothing (hides gracefully) — no empty box, no broken frame.
 */
export function Music() {
  const { provider, embedUrl, title, note } = content.music;
  if (!provider || embedUrl.trim() === '') return null;

  const isSpotify = provider === 'spotify';

  return (
    <section id="music" className="relative px-6 py-24 sm:py-28" aria-labelledby="music-title">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h2
            id="music-title"
            className="font-display text-4xl font-semibold tracking-tight text-paper sm:text-5xl"
          >
            {fill(title, content)}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty font-body text-haze">{fill(note, content)}</p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-ember-500/15 bg-night-800/40 p-2 shadow-glow backdrop-blur-sm">
            {isSpotify ? (
              <iframe
                title="Playlist"
                src={embedUrl}
                width="100%"
                height={352}
                loading="lazy"
                style={{ border: 0 }}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="rounded-xl"
              />
            ) : (
              <div className="relative aspect-video w-full">
                <iframe
                  title="Playlist"
                  src={embedUrl}
                  loading="lazy"
                  style={{ border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full rounded-xl"
                />
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Music;
