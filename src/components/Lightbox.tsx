import { useEffect, useRef } from 'react';
import type { Memory } from '../config/content';
import { fill, isPlaceholder } from '../lib/text';
import content from '../config/content';
import { asset } from '../lib/asset';

interface LightboxProps {
  /** The photo to show, or null when closed. */
  photo: Memory | null;
  onClose: () => void;
}

/**
 * A focused, full-screen view of one memory. Opens over a dark scrim with a
 * close button pinned top-right; Esc, the backdrop, or that button all dismiss
 * it. Scroll is locked while open and focus is moved to the close button so it's
 * keyboard-friendly. Rendering is gated on `photo` so the DOM stays empty when
 * nothing is open.
 */
export function Lightbox({ photo, onClose }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  // Esc to close + lock background scroll while a photo is open.
  useEffect(() => {
    if (!photo) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [photo, onClose]);

  if (!photo) return null;

  const hasTitle = photo.title.trim() !== '' && !isPlaceholder(photo.title);
  const hasWhen = photo.when.trim() !== '' && !isPlaceholder(photo.when);
  const hasCaption = photo.caption.trim() !== '' && !isPlaceholder(photo.caption);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isPlaceholder(photo.alt) ? 'Photo' : photo.alt}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-sm animate-fade-in"
    >
      {/* Top bar — holds the close button. */}
      <div className="relative z-10 flex shrink-0 items-center justify-end px-5 py-4 sm:px-8 sm:py-5">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close full-screen photo"
          className="group flex items-center gap-2 rounded-full border border-paper/25 bg-night-800/60 px-4 py-2 font-mono text-xs uppercase tracking-widest text-paper/85 transition hover:border-ember-400/70 hover:bg-night-700/70 hover:text-paper hover:shadow-glow-sm"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 transition group-hover:rotate-90"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
          close
        </button>
      </div>

      {/* The photo — click the image itself does not close (stopPropagation). */}
      <div className="flex min-h-0 flex-1 items-center justify-center px-4 pb-8 sm:px-8">
        <figure
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-full max-w-5xl flex-col items-center"
        >
          <img
            src={asset(photo.src)}
            alt={isPlaceholder(photo.alt) ? '' : photo.alt}
            className="max-h-[78vh] w-auto max-w-full rounded-md object-contain shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
          />
          {(hasTitle || hasWhen || hasCaption) && (
            <figcaption className="mt-4 max-w-prose text-center">
              {hasTitle && (
                <p className="font-display text-lg italic text-paper">{fill(photo.title, content)}</p>
              )}
              {hasWhen && (
                <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-haze/70">
                  {fill(photo.when, content)}
                </p>
              )}
              {hasCaption && (
                <p className="mt-2 font-body text-sm text-haze">{fill(photo.caption, content)}</p>
              )}
            </figcaption>
          )}
        </figure>
      </div>
    </div>
  );
}

export default Lightbox;
