/**
 * Hook de orientación: true si el dispositivo está en vertical (retrato).
 * Escucha cambios en vivo, así al girar el móvil a mitad de partida
 * el layout se reorganiza sin perder ni la bebida ni el pedido.
 */

import { useEffect, useState } from "react";

export function useIsPortrait(): boolean {
  const [esRetrato, setEsRetrato] = useState<boolean>(() => {
    if (typeof window !== "undefined" && "matchMedia" in window) {
      return window.matchMedia("(orientation: portrait)").matches;
    }
    return false;
  });

  useEffect(() => {
    const mq = window.matchMedia("(orientation: portrait)");
    const alCambiar = (e: MediaQueryListEvent) => setEsRetrato(e.matches);
    // addEventListener es lo moderno; Safari antiguo usa addListener.
    mq.addEventListener("change", alCambiar);
    return () => mq.removeEventListener("change", alCambiar);
  }, []);

  return esRetrato;
}
