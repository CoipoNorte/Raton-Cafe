/**
 * Constantes de equilibrio de Ratón Café.
 * Todos los "números mágicos" del juego viven aquí para ajustarlos fácil.
 */

/** Duración base de una partida, en segundos (~90s: ciclo corto y rejugable). */
export const SEGUNDOS_PARTIDA = 90;

/** Segundos de bonificación por cada pedido perfecto. */
export const BONUS_SEGUNDOS = 3;

/** Umbral de "tiempo bajo": la barra se pone roja y suena el tic-tac. */
export const UMBRAL_TIEMPO_BAJO = 10;

/** Puntos base por pedido perfecto (antes del multiplicador de combo). */
export const PUNTOS_BASE = 100;

/** Incremento del multiplicador por cada acierto encadenado. */
export const COMBO_PASO = 0.25;

/** Multiplicador máximo de combo (×2.5). */
export const COMBO_MAX = 2.5;

/** Máximo de capas de base apilables en el vaso. */
export const MAX_BASES = 3;

/** Límite de seguridad para siropes/toppings repetidos en la taza real. */
export const MAX_REPETIDOS = 8;

/**
 * Multiplicador de combo dado el número de aciertos encadenados.
 * 1 acierto → ×1.0 · 2 → ×1.25 · … · 7+ → ×2.5
 */
export function multiplicadorCombo(racha: number): number {
  return Math.min(1 + Math.max(0, racha - 1) * COMBO_PASO, COMBO_MAX);
}

/** Parámetros de dificultad que crecen con los pedidos completados. */
export interface Dificultad {
  minBases: number;
  maxBases: number;
  probLeche: number; // probabilidad de que el pedido lleve leche
  maxSiropes: number; // nº máximo de siropes distintos
  probSiropeDoble: number; // probabilidad de un sirope ×2
  maxToppings: number; // nº máximo de toppings
  probToppingDoble: number; // probabilidad de un topping ×2
  maxEspumas: number; // máximo de artes latte permitidos en el mismo pedido
}

/**
 * Dificultad progresiva: cada 3 pedidos sube un "nivel".
 * Los pedidos piden más capas, siropes y toppings repetidos conforme avanzas.
 */
export function dificultadPara(pedidosCompletados: number): Dificultad {
  const nivel = Math.floor(pedidosCompletados / 3); // 0,1,2,3…
  return {
    minBases: nivel >= 4 ? 2 : 1,
    maxBases: Math.min(MAX_BASES, 1 + Math.floor((nivel + 1) / 2)), // 1,1,2,2,3…
    probLeche: Math.min(0.35 + nivel * 0.1, 0.8),
    maxSiropes: Math.min(2, 1 + Math.floor(nivel / 2)), // 1,1,2,2…
    probSiropeDoble: Math.min(0.1 + nivel * 0.08, 0.55),
    maxToppings: Math.min(3, 1 + Math.floor(nivel / 2)), // 1,1,2,2,3…
    probToppingDoble: Math.min(0.05 + nivel * 0.09, 0.6),
    maxEspumas: 1, // solo un arte latte a la vez (son mutuamente excluyentes a la vista)
  };
}
