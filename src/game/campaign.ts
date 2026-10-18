/**
 * Modo Carrera — 7 días, 3 turnos por día (mañana, tarde y noche).
 * ------------------------------------------------------------------
 * Cada turno es un "nivel": hay que servir a N clientes sin que se
 * marchen más de los permitidos. No hay cronómetro global: el reto es
 * la cola, la paciencia y las estaciones que se queman.
 *
 * La curva está escrita a mano (tabla explícita) en vez de generada,
 * para poder ajustar un día concreto sin desequilibrar el resto.
 */

import type { RecetaId } from "./types";

export type FranjaId = "manana" | "tarde" | "noche";

/** Presentación de cada franja horaria (afecta al cielo del fondo). */
export const FRANJAS: Record<FranjaId, {
  nombre: string;
  emoji: string;
  /** degradado del fondo: [arriba, medio, abajo] */
  cielo: [string, string, string];
  /** color de acento para la UI de esa franja */
  acento: string;
}> = {
  manana: {
    nombre: "Mañana", emoji: "🌅", acento: "#e0a03c",
    cielo: ["#fdf3e0", "#f7e3c4", "#efd2ac"],
  },
  tarde: {
    nombre: "Tarde", emoji: "🌇", acento: "#c96f4a",
    cielo: ["#fdeadd", "#f6cfae", "#e9b08c"],
  },
  noche: {
    nombre: "Noche", emoji: "🌙", acento: "#6b7fa8",
    cielo: ["#e4e3f0", "#cfd0e4", "#b9bdd6"],
  },
};

/** Definición de un turno concreto. */
export interface TurnoDef {
  franja: FranjaId;
  /** clientes que hay que servir para superarlo */
  clientes: number;
  /** paciencia de cada cliente, en ms */
  paciencia: number;
  /** ms entre llegadas */
  intervalo: number;
  /** cuántos clientes caben a la vez en la barra */
  maxSimultaneos: number;
  /** clientes que puedes perder antes de fallar el turno */
  vidas: number;
  /** carta disponible ese turno */
  recetas: RecetaId[];
}

export interface DiaDef {
  numero: number;
  nombre: string;
  turnos: [TurnoDef, TurnoDef, TurnoDef];
}

/* Cartas que se van ampliando día a día. */
const C1: RecetaId[] = ["capuchino", "pastel"];
const C2: RecetaId[] = ["capuchino", "pastel", "sandwich"];
const C3: RecetaId[] = ["capuchino", "pastel", "sandwich", "pieLimon"];
const C4: RecetaId[] = ["capuchino", "pastel", "sandwich", "pieLimon", "mokachino"];

/** Atajo para no repetir la forma completa en cada turno. */
const t = (
  franja: FranjaId, clientes: number, paciencia: number, intervalo: number,
  maxSimultaneos: number, vidas: number, recetas: RecetaId[],
): TurnoDef => ({ franja, clientes, paciencia, intervalo, maxSimultaneos, vidas, recetas });

/** Los 7 días de la cafetería, de más tranquilo a más frenético. */
export const DIAS: DiaDef[] = [
  {
    numero: 1, nombre: "Primer día",
    turnos: [
      t("manana", 3, 34000, 6000, 2, 3, C1),
      t("tarde", 4, 32000, 5600, 2, 3, C1),
      t("noche", 4, 30000, 5400, 2, 3, C1),
    ],
  },
  {
    numero: 2, nombre: "Se corre la voz",
    turnos: [
      t("manana", 4, 31000, 5400, 2, 3, C2),
      t("tarde", 5, 29000, 5000, 3, 3, C2),
      t("noche", 5, 28000, 4800, 3, 3, C2),
    ],
  },
  {
    numero: 3, nombre: "Nuevo postre",
    turnos: [
      t("manana", 5, 28000, 4800, 3, 3, C3),
      t("tarde", 6, 27000, 4500, 3, 3, C3),
      t("noche", 6, 26000, 4300, 3, 2, C3),
    ],
  },
  {
    numero: 4, nombre: "Carta completa",
    turnos: [
      t("manana", 6, 26000, 4300, 3, 3, C4),
      t("tarde", 7, 25000, 4000, 3, 2, C4),
      t("noche", 7, 24000, 3900, 3, 2, C4),
    ],
  },
  {
    numero: 5, nombre: "Fin de semana",
    turnos: [
      t("manana", 7, 24000, 3800, 3, 2, C4),
      t("tarde", 8, 23000, 3600, 4, 2, C4),
      t("noche", 8, 22000, 3400, 4, 2, C4),
    ],
  },
  {
    numero: 6, nombre: "Cola en la puerta",
    turnos: [
      t("manana", 8, 22000, 3300, 4, 2, C4),
      t("tarde", 9, 21000, 3100, 4, 2, C4),
      t("noche", 9, 20000, 3000, 4, 2, C4),
    ],
  },
  {
    numero: 7, nombre: "El gran día",
    turnos: [
      t("manana", 9, 20000, 2900, 4, 2, C4),
      t("tarde", 10, 19000, 2700, 4, 1, C4),
      t("noche", 11, 18000, 2600, 4, 1, C4),
    ],
  },
];

export const TOTAL_DIAS = DIAS.length;
export const TURNOS_POR_DIA = 3;
export const TOTAL_TURNOS = TOTAL_DIAS * TURNOS_POR_DIA;

/** Devuelve la definición de un turno (día 1-based, turno 0-based). */
export function turnoDe(dia: number, turnoIdx: number): TurnoDef {
  const d = DIAS[Math.min(Math.max(dia, 1), TOTAL_DIAS) - 1];
  return d.turnos[Math.min(Math.max(turnoIdx, 0), TURNOS_POR_DIA - 1)];
}

/** Índice lineal 0..20 de un turno, para comparar progreso. */
export function indiceTurno(dia: number, turnoIdx: number): number {
  return (dia - 1) * TURNOS_POR_DIA + turnoIdx;
}

/** Siguiente turno tras completar uno (null si acabó la carrera). */
export function siguienteTurno(dia: number, turnoIdx: number): { dia: number; turnoIdx: number } | null {
  if (turnoIdx < TURNOS_POR_DIA - 1) return { dia, turnoIdx: turnoIdx + 1 };
  if (dia < TOTAL_DIAS) return { dia: dia + 1, turnoIdx: 0 };
  return null;
}

/**
 * Estrellas conseguidas en un turno superado:
 * 3 = sin perder a nadie · 2 = un cliente perdido · 1 = superado a duras penas.
 */
export function estrellasDe(perdidos: number): number {
  if (perdidos === 0) return 3;
  if (perdidos === 1) return 2;
  return 1;
}
