/**
 * useViewport — Medidas reales de la ventana para un responsive "de verdad".
 * ------------------------------------------------------------------
 * No basta con saber si es retrato: un móvil en horizontal tiene MUY poca
 * altura (~360 px) y necesita una barra más compacta que una tablet.
 * Este hook expone las dimensiones y unos cuantos booleanos derivados
 * para que cada pantalla decida cuánto espacio dar al área jugable.
 */

import { useEffect, useState } from "react";

export interface Viewport {
  ancho: number;
  alto: number;
  /** orientación vertical (retrato) */
  retrato: boolean;
  /** altura escasa: móvil en horizontal → UI ultracompacta */
  bajo: boolean;
  /** pantalla pequeña en general (móvil) */
  compacto: boolean;
  /** tablet o escritorio: podemos lucirnos con los paneles */
  amplio: boolean;
}

function medir(): Viewport {
  const ancho = typeof window === "undefined" ? 1024 : window.innerWidth;
  const alto = typeof window === "undefined" ? 768 : window.innerHeight;
  return {
    ancho,
    alto,
    retrato: alto >= ancho,
    bajo: alto < 520,
    compacto: Math.min(ancho, alto) < 420,
    amplio: ancho >= 900 && alto >= 560,
  };
}

export function useViewport(): Viewport {
  const [vp, setVp] = useState<Viewport>(medir);

  useEffect(() => {
    let frame = 0;
    const alCambiar = () => {
      // Agrupamos en un rAF: el resize dispara decenas de eventos al girar.
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setVp(medir()));
    };
    window.addEventListener("resize", alCambiar);
    window.addEventListener("orientationchange", alCambiar);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", alCambiar);
      window.removeEventListener("orientationchange", alCambiar);
    };
  }, []);

  return vp;
}
