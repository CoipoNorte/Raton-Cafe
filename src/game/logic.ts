/**
 * Lógica pura de Ratón Café: generación de pedidos, validación y puntuación.
 * Sin efectos secundarios: fácil de probar y de razonar.
 */

import { multiplicadorCombo } from "./balance";
import { RECETAS, cartaDisponible } from "./recipes";
import type { IngredienteId, Pedido, RecetaId } from "./types";

/** Nombres simpáticos de clientes. */
const CLIENTES = [
  "Aiko", "Tomo", "Haru", "Yuki", "Sora", "Mika", "Ren", "Nora",
  "Kenji", "Emi", "Rin", "Itsuki", "Hana", "Kaito", "Momo", "Sota",
];

/** Compara dos listas como multiconjuntos (mismos elementos y cantidades). */
function mismoMultiset(a: IngredienteId[], b: IngredienteId[]): boolean {
  if (a.length !== b.length) return false;
  const cuenta = new Map<IngredienteId, number>();
  for (const x of a) cuenta.set(x, (cuenta.get(x) ?? 0) + 1);
  for (const x of b) {
    const n = cuenta.get(x);
    if (!n) return false;
    cuenta.set(x, n - 1);
  }
  return true;
}

/** ¿La bandeja contiene exactamente lo que pide esta receta? */
export function bandejaCoincide(bandeja: IngredienteId[], receta: RecetaId): boolean {
  return mismoMultiset(bandeja, RECETAS[receta].pasos);
}

/** Primer pedido de la barra al que le sirve la bandeja actual (o null). */
export function pedidoQueCoincide(bandeja: IngredienteId[], pedidos: Pedido[]): Pedido | null {
  if (bandeja.length === 0) return null;
  return pedidos.find((p) => bandejaCoincide(bandeja, p.receta)) ?? null;
}

/**
 * ANALIZADOR DE BANDEJA
 * ------------------------------------------------------------------
 * El orden NUNCA importa (se compara como multiconjunto). Lo que sí
 * confundía era no ver POR QUÉ no cuadraba. Esto deduce qué plato estás
 * intentando montar y devuelve exactamente qué falta y qué sobra, para
 * pintarlo en la bandeja: cero adivinanzas.
 */
export interface AnalisisBandeja {
  receta: RecetaId | null; // plato objetivo más probable
  faltan: IngredienteId[]; // ingredientes que aún hay que añadir
  sobran: number[]; // índices de la bandeja que estorban
  completa: boolean; // listo para servir
}

/** Analiza la bandeja contra un conjunto de recetas candidatas. */
export function analizarBandeja(bandeja: IngredienteId[], candidatas: RecetaId[]): AnalisisBandeja {
  if (bandeja.length === 0) return { receta: null, faltan: [], sobran: [], completa: false };

  let mejor: AnalisisBandeja | null = null;

  for (const id of candidatas) {
    const pendientes = [...RECETAS[id].pasos];
    const sobran: number[] = [];
    bandeja.forEach((ing, i) => {
      const pos = pendientes.indexOf(ing);
      if (pos >= 0) pendientes.splice(pos, 1); // encaja: lo tachamos
      else sobran.push(i); // no pertenece a esta receta
    });
    const candidato: AnalisisBandeja = {
      receta: id,
      faltan: pendientes,
      sobran,
      completa: pendientes.length === 0 && sobran.length === 0,
    };
    // Mejor = menos estorbos; a igualdad, el que esté más cerca de acabar.
    if (
      !mejor ||
      candidato.sobran.length < mejor.sobran.length ||
      (candidato.sobran.length === mejor.sobran.length && candidato.faltan.length < mejor.faltan.length)
    ) {
      mejor = candidato;
    }
  }

  return mejor ?? { receta: null, faltan: [], sobran: [], completa: false };
}

/**
 * Genera un cliente nuevo.
 * En turno libre la carta se amplía según los pedidos servidos; en el modo
 * carrera se pasa la carta fija de ese turno con `recetasPermitidas`.
 */
export function generarPedido(
  id: number,
  servidos: number,
  paciencia: number,
  ahora: number,
  recetasPermitidas?: RecetaId[],
): Pedido {
  const carta = recetasPermitidas?.length
    ? recetasPermitidas
    : cartaDisponible(servidos).map((r) => r.id);
  const receta = carta[Math.floor(Math.random() * carta.length)];
  return {
    id,
    receta,
    cliente: CLIENTES[Math.floor(Math.random() * CLIENTES.length)],
    nacido: ahora,
    paciencia,
  };
}

/** Propinas ganadas al servir, aplicando el combo y un bonus por rapidez. */
export function puntosPorServir(receta: RecetaId, rachaDespues: number, fraccionPacienciaRestante: number): number {
  const base = RECETAS[receta].propina;
  const bonusRapidez = 1 + fraccionPacienciaRestante * 0.5; // servir pronto paga más
  return Math.round(base * multiplicadorCombo(rachaDespues) * bonusRapidez);
}
