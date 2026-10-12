/**
 * Confetti — Estallido de celebración en la paleta cálida de la cafetería.
 * Determinista por semilla para que cada aclamación se sienta artesanal.
 */

import { useMemo } from "react";
import { motion } from "framer-motion";
import { PALETA_CALIDA, prng } from "../game/data";

export function Confetti({ semilla }: { semilla: number }) {
  const piezas = useMemo(() => {
    const azar = prng(semilla * 97 + 13);
    return Array.from({ length: 30 }, (_, i) => {
      const angulo = azar() * Math.PI * 2;
      return {
        id: i,
        x: Math.cos(angulo) * (55 + azar() * 120),
        y: Math.sin(angulo) * (45 + azar() * 100) - 50,
        girar: azar() * 560 - 280,
        tam: 6 + azar() * 7,
        color: PALETA_CALIDA[Math.floor(azar() * PALETA_CALIDA.length)],
        dur: 0.85 + azar() * 0.5,
        redonda: azar() > 0.5,
      };
    });
  }, [semilla]);

  return (
    <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
      {piezas.map((p) => (
        <motion.span
          key={p.id}
          className={p.redonda ? "absolute rounded-full" : "absolute rounded-[2px]"}
          style={{ width: p.tam, height: p.redonda ? p.tam : p.tam * 0.55, backgroundColor: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.55, rotate: p.girar }}
          transition={{ duration: p.dur, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
