/**
 * Persistencia de Ratón Café (src/game/storage.ts)
 * ------------------------------------------------------------------
 * Módulo encapsulado de guardado local:
 *  - Sobrevive al modo incógnito / almacenamiento bloqueado (fallback en memoria).
 *  - Esquema versionado: si cambia el formato, se migra sin romper partidas.
 *  - El resto del juego SOLO usa las funciones exportadas. Para migrar a
 *    IndexedDB basta reescribir `leerDisco` / `escribirDisco` (misma firma
 *    lógica, convirtiéndolas en async con un pequeño caché en memoria).
 */

const CLAVE = "raton-cafe:v1";
const VERSION = 1;

/** Forma del estado persistente (versionado para futuras migraciones). */
export interface EstadoGuardado {
  version: number;
  recordPedidos: number; // récord histórico de pedidos perfectos
  recordPropinas: number; // récord histórico de propinas (puntos)
  silenciado: boolean; // preferencia de sonido
}

const ESTADO_INICIAL: EstadoGuardado = {
  version: VERSION,
  recordPedidos: 0,
  recordPropinas: 0,
  silenciado: false,
};

/* ------------------------------------------------------------------ */
/* Acceso seguro a localStorage                                        */
/* ------------------------------------------------------------------ */

/** Fallback en memoria para incógnito / iframes / storage deshabilitado. */
let respaldoMemoria: EstadoGuardado | null = null;

/** Devuelve true si localStorage está realmente disponible. */
function storageDisponible(): boolean {
  try {
    const prueba = `${CLAVE}:prueba`;
    window.localStorage.setItem(prueba, "1");
    window.localStorage.removeItem(prueba);
    return true;
  } catch {
    return false;
  }
}

/** Lee el estado desde disco (o del respaldo). Nunca lanza excepciones. */
function leerDisco(): EstadoGuardado {
  try {
    if (storageDisponible()) {
      const crudo = window.localStorage.getItem(CLAVE);
      if (!crudo) return { ...ESTADO_INICIAL };
      const parseado = JSON.parse(crudo) as Partial<EstadoGuardado>;
      // Migración perezosa: si la versión es distinta, conservamos lo válido.
      return {
        ...ESTADO_INICIAL,
        ...parseado,
        version: VERSION,
      };
    }
  } catch {
    /* JSON corrupto o acceso denegado: continuamos con valores seguros */
  }
  return respaldoMemoria ?? { ...ESTADO_INICIAL };
}

/** Escribe el estado en disco (o en el respaldo). Nunca lanza excepciones. */
function escribirDisco(estado: EstadoGuardado): void {
  try {
    if (storageDisponible()) {
      window.localStorage.setItem(CLAVE, JSON.stringify(estado));
      return;
    }
  } catch {
    /* sin cuota o modo incógnito: usamos el respaldo en memoria */
  }
  respaldoMemoria = estado;
}

/* ------------------------------------------------------------------ */
/* API pública del módulo                                              */
/* ------------------------------------------------------------------ */

/** Carga el estado guardado (seguro llamarlo en cada arranque). */
export function cargarGuardado(): EstadoGuardado {
  return leerDisco();
}

/** Guarda un nuevo récord si supera al histórico. Devuelve true si hubo récord. */
export function guardarRecord(pedidos: number, propinas: number): boolean {
  const estado = leerDisco();
  const esRecord = pedidos > estado.recordPedidos;
  if (esRecord) {
    escribirDisco({ ...estado, recordPedidos: pedidos, recordPropinas: propinas });
  }
  return esRecord;
}

/** Persiste la preferencia de silencio. */
export function guardarSilencio(silenciado: boolean): void {
  const estado = leerDisco();
  if (estado.silenciado !== silenciado) {
    escribirDisco({ ...estado, silenciado });
  }
}
