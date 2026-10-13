/**
 * La carta y las estaciones de Ratón Café.
 * ------------------------------------------------------------------
 * Cada estación produce UN ingrediente. Las que llevan tiempo muestran
 * un anillo de progreso y, si no recoges a tiempo, SE QUEMAN (hay que
 * tirarlo a la basura y repetir): es el nervio divertido de Overcooked.
 */

import type { IngredienteId, RecetaId, Zona } from "./types";

export interface EstacionDef {
  id: IngredienteId;
  nombre: string;
  zona: Zona;
  /** ms que tarda en preparar (0 = instantáneo, se coge directo) */
  tiempo: number;
  /** ms de margen antes de quemarse una vez listo (0 = nunca se quema) */
  margen: number;
  color: string;
  colorClaro: string;
}

/** Las 9 estaciones de la cafetería. */
export const ESTACIONES: Record<IngredienteId, EstacionDef> = {
  espresso:       { id: "espresso",       nombre: "Espresso",   zona: "cafe",    tiempo: 2200, margen: 5000, color: "#4a2c1a", colorClaro: "#7a4a28" },
  lecheVapor:     { id: "lecheVapor",     nombre: "Leche vapor",zona: "cafe",    tiempo: 1900, margen: 4500, color: "#d9b78a", colorClaro: "#f3e2c2" },
  chocolate:      { id: "chocolate",      nombre: "Chocolate",  zona: "cafe",    tiempo: 0,    margen: 0,    color: "#43200d", colorClaro: "#6b3a1c" },
  cremaBatida:    { id: "cremaBatida",    nombre: "Crema",      zona: "cafe",    tiempo: 0,    margen: 0,    color: "#e8d9bf", colorClaro: "#fffdf8" },
  panTostado:     { id: "panTostado",     nombre: "Pan tostado",zona: "cocina",  tiempo: 2600, margen: 5200, color: "#c8954f", colorClaro: "#e8bd7a" },
  jamonQueso:     { id: "jamonQueso",     nombre: "Jamón+queso",zona: "cocina",  tiempo: 0,    margen: 0,    color: "#e8957f", colorClaro: "#f3c644" },
  rebanadaPastel: { id: "rebanadaPastel", nombre: "Pastel",     zona: "vitrina", tiempo: 0,    margen: 0,    color: "#e8c48a", colorClaro: "#f2c0c9" },
  rebanadaPie:    { id: "rebanadaPie",    nombre: "Pie limón",  zona: "vitrina", tiempo: 0,    margen: 0,    color: "#e6c43a", colorClaro: "#f5d33f" },
  merengue:       { id: "merengue",       nombre: "Merengue",   zona: "vitrina", tiempo: 0,    margen: 0,    color: "#e9c9a0", colorClaro: "#fffaf0" },
};

/** Orden en que se dibujan las estaciones en la cocina. */
export const ORDEN_ESTACIONES: IngredienteId[] = [
  "espresso", "lecheVapor", "chocolate", "cremaBatida",
  "panTostado", "jamonQueso",
  "rebanadaPastel", "rebanadaPie", "merengue",
];

export interface RecetaDef {
  id: RecetaId;
  nombre: string;
  /** ingredientes necesarios (el orden no importa al servir) */
  pasos: IngredienteId[];
  /** propina base al servirla */
  propina: number;
  /** a partir de cuántos pedidos servidos aparece en la carta */
  desbloqueo: number;
}

/** La carta: 5 productos, de 2 a 3 pasos. Rápidos y reconocibles. */
export const RECETAS: Record<RecetaId, RecetaDef> = {
  capuchino: {
    id: "capuchino", nombre: "Capuchino", propina: 100, desbloqueo: 0,
    pasos: ["espresso", "lecheVapor"],
  },
  sandwich: {
    id: "sandwich", nombre: "Sándwich", propina: 110, desbloqueo: 0,
    pasos: ["panTostado", "jamonQueso"],
  },
  pastel: {
    id: "pastel", nombre: "Trozo de pastel", propina: 90, desbloqueo: 0,
    pasos: ["rebanadaPastel", "cremaBatida"],
  },
  pieLimon: {
    id: "pieLimon", nombre: "Pie de limón", propina: 120, desbloqueo: 3,
    pasos: ["rebanadaPie", "merengue"],
  },
  mokachino: {
    id: "mokachino", nombre: "Mokachino", propina: 160, desbloqueo: 6,
    pasos: ["espresso", "lecheVapor", "chocolate"],
  },
};

/** Recetas disponibles según cuántos pedidos llevas servidos. */
export function cartaDisponible(servidos: number): RecetaDef[] {
  return Object.values(RECETAS).filter((r) => servidos >= r.desbloqueo);
}

/** Colores de cada zona (bordes y etiquetas de la cocina). */
export const COLOR_ZONA: Record<Zona, { borde: string; fondo: string; texto: string; nombre: string }> = {
  cafe:    { borde: "#d9b38a", fondo: "#fbf1e0", texto: "#8a5a33", nombre: "Barra de café" },
  cocina:  { borde: "#e0a98c", fondo: "#fdeee6", texto: "#a9603f", nombre: "Cocina" },
  vitrina: { borde: "#b9cfa3", fondo: "#f1f6e9", texto: "#6d8f54", nombre: "Vitrina" },
};
