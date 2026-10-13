/**
 * Utilidades compartidas de color y azar.
 * (Los datos de juego viven ahora en recipes.ts)
 */

/**
 * Mezcla dos colores hex (#rrggbb) con un factor t ∈ [0,1].
 */
export function mezclarHex(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t);
  const g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
  const bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
  return `#${((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1)}`;
}

/** PRNG determinista (mulberry32) para decoraciones estables. */
export function prng(semilla: number): () => number {
  let s = semilla >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Colores cálidos de la cafetería (confetti, motas, UI). */
export const PALETA_CALIDA = ["#c98a4b", "#c96f4a", "#9caf88", "#e9dab9", "#e2c274", "#a97748"];
