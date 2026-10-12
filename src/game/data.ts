/**
 * Datos de ingredientes y paletas de color de Ratón Café.
 * Toda la bebida se dibuja de forma procedimental con estos colores.
 */

import type { BaseId, Categoria, IngredienteId, LecheId, SiropeId, ToppingId } from "./types";

/** Defición pública de un ingrediente tal como se muestra en la UI. */
export interface IngredienteDef {
  id: IngredienteId;
  categoria: Categoria;
  nombre: string; // nombre corto para las fichas
  color: string; // color principal (muestra en la ficha)
  colorClaro: string; // variante clara (degradados / brillos)
}

/* ------------------------------------------------------------------ */
/* Bases de espresso (capas apilables)                                 */
/* ------------------------------------------------------------------ */

export const BASES: Record<BaseId, IngredienteDef> = {
  ristretto: { id: "ristretto", categoria: "base", nombre: "Ristretto", color: "#3a2317", colorClaro: "#5b3a26" },
  espresso: { id: "espresso", categoria: "base", nombre: "Espresso", color: "#4a2c1a", colorClaro: "#6b4226" },
  doble: { id: "doble", categoria: "base", nombre: "Doble shot", color: "#2c1a0f", colorClaro: "#4a2c1a" },
  descafeinado: { id: "descafeinado", categoria: "base", nombre: "Descafeinado", color: "#6f4a2c", colorClaro: "#8f643d" },
  coldbrew: { id: "coldbrew", categoria: "base", nombre: "Cold brew", color: "#33302e", colorClaro: "#4f4a45" },
};

/* ------------------------------------------------------------------ */
/* Leches / texturas                                                   */
/* ------------------------------------------------------------------ */

export const LECHES: Record<LecheId, IngredienteDef> = {
  entera: { id: "entera", categoria: "leche", nombre: "Entera", color: "#f3e6cf", colorClaro: "#fbf4e4" },
  descremada: { id: "descremada", categoria: "leche", nombre: "Descremada", color: "#f7efe0", colorClaro: "#fffaf0" },
  avena: { id: "avena", categoria: "leche", nombre: "Avena", color: "#e9dab9", colorClaro: "#f5ead0" },
  almendra: { id: "almendra", categoria: "leche", nombre: "Almendra", color: "#efe0c8", colorClaro: "#f9eeda" },
};

/* ------------------------------------------------------------------ */
/* Siropes y salsas (goteo sobre la bebida)                            */
/* ------------------------------------------------------------------ */

export const SIROPES: Record<SiropeId, IngredienteDef> = {
  vainilla: { id: "vainilla", categoria: "sirope", nombre: "Vainilla", color: "#e2c274", colorClaro: "#f1dc9e" },
  caramelo: { id: "caramelo", categoria: "sirope", nombre: "Caramelo", color: "#c07c2e", colorClaro: "#e0a052" },
  chocolate: { id: "chocolate", categoria: "sirope", nombre: "Chocolate", color: "#57331a", colorClaro: "#7a4c28" },
  avellana: { id: "avellana", categoria: "sirope", nombre: "Avellana", color: "#8a5a2b", colorClaro: "#ac7740" },
  matcha: { id: "matcha", categoria: "sirope", nombre: "Matcha", color: "#7c9a55", colorClaro: "#9ab874" },
};

/* ------------------------------------------------------------------ */
/* Toppings                                                            */
/* ------------------------------------------------------------------ */

export const TOPPINGS: Record<ToppingId, IngredienteDef> = {
  arteCorazon: { id: "arteCorazon", categoria: "topping", nombre: "Arte corazón", color: "#fff8ee", colorClaro: "#ffffff" },
  arteRoseta: { id: "arteRoseta", categoria: "topping", nombre: "Arte roseta", color: "#fff4e4", colorClaro: "#ffffff" },
  cremaBatida: { id: "cremaBatida", categoria: "topping", nombre: "Crema batida", color: "#fdf6ea", colorClaro: "#ffffff" },
  canela: { id: "canela", categoria: "topping", nombre: "Canela", color: "#8a5a33", colorClaro: "#a97748" },
  cacao: { id: "cacao", categoria: "topping", nombre: "Cacao", color: "#4a2c1a", colorClaro: "#6b4226" },
  malvaviscos: { id: "malvaviscos", categoria: "topping", nombre: "Malvaviscos", color: "#fdfaf3", colorClaro: "#ffffff" },
  granoCafe: { id: "granoCafe", categoria: "topping", nombre: "Grano de café", color: "#3a2317", colorClaro: "#5b3a26" },
};

/* ------------------------------------------------------------------ */
/* Accesores y utilidades                                              */
/* ------------------------------------------------------------------ */

/** Devuelve la definición de un ingrediente por id (lanza si no existe). */
export function defDe(id: IngredienteId): IngredienteDef {
  return (
    (BASES as Record<string, IngredienteDef>)[id] ??
    (LECHES as Record<string, IngredienteDef>)[id] ??
    (SIROPES as Record<string, IngredienteDef>)[id] ??
    (TOPPINGS as Record<string, IngredienteDef>)[id]
  );
}

/** Listas ordenadas por categoría para la barra de ingredientes. */
export const INGREDIENTES_POR_CATEGORIA: Record<Categoria, IngredienteDef[]> = {
  base: Object.values(BASES),
  leche: Object.values(LECHES),
  sirope: Object.values(SIROPES),
  topping: Object.values(TOPPINGS),
};

/**
 * Mezcla dos colores hex (#rrggbb) con un factor t ∈ [0,1].
 * Se usa para aclarar capas con leche y crear degradados suaves.
 */
export function mezclarHex(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t);
  const g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
  const bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
  return `#${((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1)}`;
}

/** PRNG determinista (mulberry32): las pizcas de canela siempre caen igual. */
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
