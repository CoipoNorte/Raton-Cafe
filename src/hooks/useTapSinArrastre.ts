/**
 * useTapSinArrastre — Evita la temida "acción doble" al arrastrar.
 * ------------------------------------------------------------------
 * EL PROBLEMA
 * En Framer Motion, un elemento con `drag` + `onTap` dispara AMBOS
 * gestos al soltar: el puntero sigue sobre el elemento (que viaja con
 * él), así que tras `onDragEnd` también llega `onTap`. Resultado: el
 * ingrediente se añadía dos veces.
 *
 * LA SOLUCIÓN
 * Marcamos una bandera en `onDragStart` (que solo ocurre tras superar
 * el umbral de arrastre real, nunca en un toque limpio) y la
 * consultamos en el tap. La bandera se limpia en un macrotask
 * (`setTimeout 0`), que siempre corre DESPUÉS de todos los manejadores
 * síncronos del `pointerup`, sea cual sea su orden de registro.
 */

import { useCallback, useEffect, useRef } from "react";

export interface GestoArrastre {
  /** Engánchalo a `onDragStart` del elemento arrastrable. */
  alIniciarArrastre: () => void;
  /** Engánchalo a `onDragEnd` (después de tu lógica de soltar). */
  alTerminarArrastre: () => void;
  /** `true` si el gesto actual fue un toque limpio (sin arrastre). */
  esTapLimpio: () => boolean;
}

export function useTapSinArrastre(): GestoArrastre {
  const huboArrastre = useRef(false);
  const temporizador = useRef<number | null>(null);

  // Limpieza defensiva si el componente se desmonta a mitad de gesto.
  useEffect(() => {
    return () => {
      if (temporizador.current !== null) window.clearTimeout(temporizador.current);
    };
  }, []);

  const alIniciarArrastre = useCallback(() => {
    if (temporizador.current !== null) {
      window.clearTimeout(temporizador.current);
      temporizador.current = null;
    }
    huboArrastre.current = true;
  }, []);

  const alTerminarArrastre = useCallback(() => {
    // Macrotask: se ejecuta tras TODOS los handlers del pointerup actual,
    // así el tap que venga en este mismo gesto todavía ve la bandera.
    if (temporizador.current !== null) window.clearTimeout(temporizador.current);
    temporizador.current = window.setTimeout(() => {
      huboArrastre.current = false;
      temporizador.current = null;
    }, 0);
  }, []);

  const esTapLimpio = useCallback(() => !huboArrastre.current, []);

  return { alIniciarArrastre, alTerminarArrastre, esTapLimpio };
}
