/**
 * Constantes de equilibrio de Ratón Café (modo cafetería).
 * Todos los "números mágicos" viven aquí para ajustar el ritmo.
 */

/** Duración de un turno, en segundos. */
export const SEGUNDOS_PARTIDA = 100;

/** Segundos de bonificación por cada pedido servido. */
export const BONUS_SEGUNDOS = 2;

/** Umbral de "tiempo bajo": barra roja + tic-tac. */
export const UMBRAL_TIEMPO_BAJO = 10;

/** Incremento del multiplicador por acierto encadenado. */
export const COMBO_PASO = 0.25;

/** Multiplicador máximo de combo. */
export const COMBO_MAX = 2.5;

/** Capacidad de la bandeja de preparación. */
export const MAX_BANDEJA = 4;

/** Multiplicador de combo dada la racha de aciertos. */
export function multiplicadorCombo(racha: number): number {
  return Math.min(1 + Math.max(0, racha - 1) * COMBO_PASO, COMBO_MAX);
}

/** Parámetros de ritmo que se endurecen conforme sirves pedidos. */
export interface Dificultad {
  /** clientes a la vez en la barra */
  maxPedidos: number;
  /** ms de paciencia de cada cliente nuevo */
  paciencia: number;
  /** ms entre la llegada de un cliente y el siguiente */
  intervalo: number;
}

/**
 * Dificultad progresiva: cada 4 pedidos servidos sube un "nivel".
 * Llegan más clientes, más seguido y con menos paciencia.
 */
export function dificultadPara(servidos: number): Dificultad {
  const nivel = Math.floor(servidos / 4); // 0,1,2,3…
  return {
    maxPedidos: Math.min(4, 2 + Math.floor(nivel / 2)), // 2,2,3,3,4…
    paciencia: Math.max(15000, 30000 - nivel * 1800),
    intervalo: Math.max(2600, 5200 - nivel * 350),
  };
}
