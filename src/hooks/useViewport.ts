/**
 * useViewport — Medidas reales de la ventana para un responsive "de verdad".
 * ------------------------------------------------------------------
 * No basta con saber si es retrato: un móvil en horizontal tiene MUY poca
 * altura (~360 px) y una pantalla cuadrada (1000×1000) no se parece ni a
 * un 16:9 ni a un móvil. Por eso aquí se calcula la PROPORCIÓN y se elige
 * uno de tres layouts, en vez de mirar ancho y alto por separado.
 */

import { useEffect, useState } from "react";

/** Disposición de la mesa de trabajo. */
export type Layout =
  | "columnas" // apaisado: cocina | bandeja | clientes
  | "cuadrado" // proporción ~1:1: apilado pero ancho y generoso
  | "apilado"; // vertical / pantallas pequeñas

export interface Viewport {
  ancho: number;
  alto: number;
  /** proporción ancho/alto (1 = cuadrada, >1 apaisada, <1 vertical) */
  relacion: number;
  /** orientación vertical (retrato) */
  retrato: boolean;
  /** altura escasa: móvil en horizontal → UI ultracompacta */
  bajo: boolean;
  /** pantalla pequeña en general (móvil) */
  compacto: boolean;
  /** hay sitio para lucir paneles grandes (cuadrado o columnas) */
  amplio: boolean;
  /** disposición elegida */
  layout: Layout;
}

function medir(): Viewport {
  const ancho = typeof window === "undefined" ? 1024 : window.innerWidth;
  const alto = typeof window === "undefined" ? 768 : window.innerHeight;
  const relacion = ancho / alto;
  const bajo = alto < 520;

  /* Tres columnas solo si es REALMENTE apaisada: si no, el centro queda
     estrangulado. Cuadrada (0.8–1.25) usa el apilado ancho, que aprovecha
     mucho mejor la altura disponible. */
  let layout: Layout = "apilado";
  if (ancho >= 900 && relacion >= 1.25) layout = "columnas";
  else if (ancho >= 700 && alto >= 600 && relacion >= 0.8) layout = "cuadrado";

  return {
    ancho,
    alto,
    relacion,
    retrato: alto >= ancho,
    bajo,
    compacto: Math.min(ancho, alto) < 420,
    amplio: layout !== "apilado",
    layout,
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
