import type { SiteContent } from '../config/content';

/**
 * Replaces the {her} / {you} / {from} / {to} tokens in any config string with
 * the real values, so personal copy can be written naturally in content.ts.
 * Unknown tokens are left untouched.
 */
export function fill(template: string, c: SiteContent): string {
  const map: Record<string, string> = {
    '{her}': c.herName,
    '{you}': c.yourName,
    '{from}': c.from.city,
    '{to}': c.to.city,
  };
  return template.replace(/\{(?:her|you|from|to)\}/g, (m) => map[m] ?? m);
}

/** True when a string is still an unfilled [[placeholder]] from the config. */
export function isPlaceholder(value: string): boolean {
  return /\[\[.*\]\]/.test(value);
}
