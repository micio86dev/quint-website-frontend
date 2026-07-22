import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// Reads the design-system color tokens straight from the source of truth
// (@theme in app.css) and locks their WCAG 2.1 contrast ratios. Pure and
// backend-free: it guards against a future palette tweak silently dropping a
// text/background pair below AA — the exact regression that shipped before the
// stats band and eyebrows were fixed.
const css = readFileSync(
  fileURLToPath(new URL('../../src/styles/app.css', import.meta.url)),
  'utf-8',
);

const token = (name: string): string => {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`Missing design token --color-${name} in app.css`);
  return match[1];
};

// WCAG relative luminance + contrast ratio (white == #FFFFFF).
const channel = (c: number): number => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex: string): number => {
  const n = parseInt(hex.slice(1), 16);
  return (
    0.2126 * channel((n >> 16) & 0xff) +
    0.7152 * channel((n >> 8) & 0xff) +
    0.0722 * channel(n & 0xff)
  );
};

const ratio = (fg: string, bg: string): number => {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
};

const WHITE = '#FFFFFF';
const AA = 4.5; // WCAG AA for normal-size text
const COMFORTABLE = 5; // margin we hold so a small tweak can't cross the AA line

describe('design-system color contrast (WCAG AA)', () => {
  it('white text on the stats-band / button background clears a comfortable margin', () => {
    // Previously #C94A1F at 4.68:1 — passing but one tweak away from failing.
    expect(ratio(WHITE, token('orange-dark'))).toBeGreaterThanOrEqual(COMFORTABLE);
  });

  it('the accent orange used on dark surfaces is legible on ink', () => {
    // The capability "01/02/03" markers sit on bg-ink; brand orange was 4.57:1.
    expect(ratio(token('orange-bright'), token('ink'))).toBeGreaterThanOrEqual(COMFORTABLE);
  });

  it('orange-deep text stays accessible on the paper surface', () => {
    expect(ratio(token('orange-deep'), token('paper'))).toBeGreaterThanOrEqual(AA);
  });

  it('muted text stays accessible on the paper surface', () => {
    expect(ratio(token('muted'), token('paper'))).toBeGreaterThanOrEqual(AA);
  });

  it('white text stays accessible on the ink surface', () => {
    expect(ratio(WHITE, token('ink'))).toBeGreaterThanOrEqual(AA);
  });
});
