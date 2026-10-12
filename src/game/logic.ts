/**
 * Lógica pura de Ratón Café: generación de pedidos, validación y puntuación.
 * Sin efectos secundarios: fácil de probar y de razonar.
 */

import { PUNTOS_BASE, MAX_BASES, MAX_REPETIDOS, multiplicadorCombo, type Dificultad } from "./balance";
import { BASES, LECHES, SIROPES, TOPPINGS, prng } from "./data";
import type { Accion, BaseId, Bebida, LecheId, Pedido, SiropeId, ToppingId } from "./types";

/** Nombres simpáticos de clientes para los tickets. */
const CLIENTES = [
  "Aiko", "Tomo", "Haru", "Yuki", "Sora", "Mika", "Ren", "Nora",
  "Kenji", "Emi", "Rin", "Itsuki", "Hana", "Kaito", "Momo", "Sota",
];

/** Bebida vacía: el punto de partida de cada cliente. */
export function bebidaVacia(): Bebida {
  return { bases: [], leche: null, siropes: [], toppings: [] };
}

/**
 * Aplica un ingrediente a la bebida. Devuelve una NUEVA bebida (inmutable)
 * o null si la acción no es válida (p. ej. más de 3 bases).
 * La leche se puede reemplazar: es más relajante corregir que deshacer.
 */
export function aplicarIngrediente(bebida: Bebida, accion: Accion): Bebida | null {
  switch (accion.categoria) {
    case "base": {
      if (bebida.bases.length >= MAX_BASES) return null;
      return { ...bebida, bases: [...bebida.bases, accion.id as BaseId] };
    }
    case "leche":
      return { ...bebida, leche: accion.id as LecheId };
    case "sirope": {
      if (bebida.siropes.length >= MAX_REPETIDOS) return null;
      return { ...bebida, siropes: [...bebida.siropes, accion.id as SiropeId] };
    }
    case "topping": {
      if (bebida.toppings.length >= MAX_REPETIDOS) return null;
      return { ...bebida, toppings: [...bebida.toppings, accion.id as ToppingId] };
    }
  }
}

/** Convierte las acciones deshechas en una bebida nueva, quitando la última. */
export function deshacerUltima(bebida: Bebida, historial: Accion[]): { bebida: Bebida; historial: Accion[] } {
  if (historial.length === 0) return { bebida, historial };
  const ultima = historial[historial.length - 1];
  const quitarUltimo = <T,>(arr: T[]): T[] => {
    const copia = [...arr];
    copia.pop();
    return copia;
  };
  switch (ultima.categoria) {
    case "base":
      return { bebida: { ...bebida, bases: quitarUltimo(bebida.bases) }, historial: historial.slice(0, -1) };
    case "leche":
      // Deshacer la leche elimina la actual (no restauramos leches anteriores: simple y claro)
      return { bebida: { ...bebida, leche: null }, historial: historial.slice(0, -1) };
    case "sirope":
      return { bebida: { ...bebida, siropes: quitarUltimo(bebida.siropes) }, historial: historial.slice(0, -1) };
    case "topping":
      return { bebida: { ...bebida, toppings: quitarUltimo(bebida.toppings) }, historial: historial.slice(0, -1) };
  }
}

/* ------------------------------------------------------------------ */
/* Validación (multiset exacto por categoría)                          */
/* ------------------------------------------------------------------ */

/** Cuenta apariciones de cada id en un array. */
function contar<T extends string>(arr: T[]): Map<T, number> {
  const mapa = new Map<T, number>();
  for (const item of arr) mapa.set(item, (mapa.get(item) ?? 0) + 1);
  return mapa;
}

/** Compara dos arrays como multiconjuntos (mismos elementos y cantidades). */
function mismoMultiset<T extends string>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  const ca = contar(a);
  const cb = contar(b);
  if (ca.size !== cb.size) return false;
  for (const [clave, n] of ca) if (cb.get(clave) !== n) return false;
  return true;
}

/**
 * ¿La bebida del jugador coincide EXACTAMENTE con el pedido?
 * Compara cada categoría como multiset (las capas no exigen orden exacto:
 * es un juego relajante, no un examen de memoria).
 */
export function coincidePedido(bebida: Bebida, objetivo: Bebida): boolean {
  return (
    mismoMultiset(bebida.bases, objetivo.bases) &&
    bebida.leche === objetivo.leche &&
    mismoMultiset(bebida.siropes, objetivo.siropes) &&
    mismoMultiset(bebida.toppings, objetivo.toppings)
  );
}

/* ------------------------------------------------------------------ */
/* Generación de pedidos (dificultad progresiva)                       */
/* ------------------------------------------------------------------ */

/** Elige `n` ids distintos de una lista, usando el PRNG dado. */
function elegirDistintos<T>(ids: T[], n: number, azar: () => number): T[] {
  const copia = [...ids];
  const elegidos: T[] = [];
  for (let i = 0; i < n && copia.length > 0; i++) {
    const idx = Math.floor(azar() * copia.length);
    elegidos.push(copia.splice(idx, 1)[0]);
  }
  return elegidos;
}

/**
 * Genera el siguiente pedido. `pedidosCompletados` alimenta la dificultad
 * y `idPedido` da variedad determinista por partida.
 */
export function generarPedido(idPedido: number, dif: Dificultad, semilla: number): Pedido {
  const azar = prng(semilla * 7919 + idPedido * 104729 + 17);
  const bebida = bebidaVacia();

  // 1) Bases: entre minBases y maxBases capas (pueden repetirse al azar)
  const baseIds = Object.keys(BASES) as BaseId[];
  const nBases = dif.minBases + Math.floor(azar() * (dif.maxBases - dif.minBases + 1));
  for (let i = 0; i < nBases; i++) bebida.bases.push(baseIds[Math.floor(azar() * baseIds.length)]);

  // 2) Leche opcional según probabilidad de dificultad
  if (azar() < dif.probLeche) {
    const lecheIds = Object.keys(LECHES) as LecheId[];
    bebida.leche = lecheIds[Math.floor(azar() * lecheIds.length)];
  }

  // 3) Siropes: 0..maxSiropes distintos + posible repetido ×2
  const siropeIds = Object.keys(SIROPES) as SiropeId[];
  const nSiropes = Math.floor(azar() * (dif.maxSiropes + 1));
  bebida.siropes = elegirDistintos(siropeIds, nSiropes, azar);
  if (bebida.siropes.length > 0 && azar() < dif.probSiropeDoble) {
    bebida.siropes.push(bebida.siropes[Math.floor(azar() * bebida.siropes.length)]);
  }

  // 4) Toppings: 1..maxToppings (espuma artística máx. 1) + posible ×2
  const toppingIds = Object.keys(TOPPINGS) as ToppingId[];
  const nToppings = 1 + Math.floor(azar() * dif.maxToppings);
  let candidatos = elegirDistintos(toppingIds, nToppings + 1, azar);
  // Garantía: como máximo `maxEspumas` artes latte (corazón/roseta)
  const espumas = candidatos.filter((t) => t === "arteCorazon" || t === "arteRoseta");
  if (espumas.length > dif.maxEspumas) {
    const sobrante = espumas[dif.maxEspumas];
    candidatos = candidatos.filter((t) => t !== sobrante);
  }
  bebida.toppings = candidatos.slice(0, nToppings);
  if (bebida.toppings.length > 0 && azar() < dif.probToppingDoble) {
    // Solo repetimos toppings "empotrables" (la espuma artística no se duplica)
    const repetibles = bebida.toppings.filter((t) => t !== "arteCorazon" && t !== "arteRoseta");
    if (repetibles.length > 0) {
      bebida.toppings.push(repetibles[Math.floor(azar() * repetibles.length)]);
    }
  }

  return {
    id: idPedido,
    cliente: CLIENTES[Math.floor(azar() * CLIENTES.length)],
    bebida,
  };
}

/* ------------------------------------------------------------------ */
/* Puntuación                                                           */
/* ------------------------------------------------------------------ */

/** Puntos (propinas) ganados por un pedido perfecto dada la racha actual. */
export function puntosPorAcierto(rachaDespues: number): number {
  return Math.round(PUNTOS_BASE * multiplicadorCombo(rachaDespues));
}
