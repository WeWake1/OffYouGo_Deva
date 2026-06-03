import content from '../config/content';
import { fill, isPlaceholder } from '../lib/text';
import { cn } from '../lib/cn';
import { Reveal } from './Reveal';

/**
 * The letter — the part she'll reread. A warm sheet of parchment set down in the
 * night, tilted ever so slightly so it feels placed by hand rather than printed.
 * Body copy comes from content.letter.paragraphs; any unwritten [[placeholder]]
 * is shown dimmed + italic so it's obviously a draft and never ships as "real".
 *
 * React Bits seam: the parchment is a self-contained <article> — wrap it in a
 * SpotlightCard or reveal the lines with a Decrypt/Shiny text effect without
 * touching the copy.
 */
export function Letter() {
  const { title, greeting, paragraphs, signoff, signature, ps } = content.letter;

  const filledGreeting = fill(greeting, content);
  const filledSignature = fill(signature, content);

  return (
    <section id="letter" className="relative px-6 py-24 sm:py-32" aria-labelledby="letter-title">
      <div className="mx-auto max-w-2xl">
        <Reveal className="mb-10 text-center">
          <h2
            id="letter-title"
            className="font-display text-4xl font-semibold tracking-tight text-paper sm:text-5xl"
          >
            {fill(title, content)}
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative">
            {/* Warm light spilling out from behind the page. */}
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-ember-500/20 blur-2xl" />

            <article className="-rotate-[0.6deg] rounded-2xl border border-paper-dim/70 bg-gradient-to-b from-paper to-paper-dim px-7 py-10 text-night-900 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)] sm:px-12 sm:py-14">
              <p
                className={cn(
                  'font-display text-2xl italic sm:text-3xl',
                  isPlaceholder(filledGreeting) ? 'text-night-900/40' : 'text-night-800',
                )}
              >
                {filledGreeting}
              </p>

              <div className="mt-6 space-y-5">
                {paragraphs.map((para, i) => (
                  <p
                    key={i}
                    className={cn(
                      'font-body text-[15px] leading-relaxed sm:text-base',
                      isPlaceholder(para) ? 'italic text-night-900/45' : 'text-night-900/85',
                    )}
                  >
                    {fill(para, content)}
                  </p>
                ))}
              </div>

              <div className="mt-9">
                <p className="font-body text-night-900/70">{fill(signoff, content)}</p>
                <p
                  className={cn(
                    'mt-1 font-display text-3xl italic',
                    isPlaceholder(filledSignature) ? 'text-night-900/40' : 'text-night-900',
                  )}
                >
                  {filledSignature}
                </p>
              </div>

              {ps.trim() !== '' && (
                <p className="mt-8 border-t border-night-900/10 pt-5 font-mono text-xs leading-relaxed text-night-900/55">
                  {fill(ps, content)}
                </p>
              )}
            </article>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Letter;
