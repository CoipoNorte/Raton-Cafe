/**
 * Fondo — Ambiente de cafetería acogedora.
 * Degradado cálido + motas flotantes de vapor y granos de café
 * que suben en bucle infinito, lento y zen.
 */

import { useMemo } from "react";
import { motion } from "framer-motion";
import { prng } from "../game/data";
import { FRANJAS, type FranjaId } from "../game/campaign";

/**
 * El cielo cambia con la franja horaria del turno (mañana, tarde, noche).
 * Sin franja (turno libre / menús) usa la paleta cálida de siempre.
 */
export function Fondo({ franja }: { franja?: FranjaId }) {
  const cielo = franja ? FRANJAS[franja].cielo : (["#f9f1e4", "#f4e4cc", "#ecd8ba"] as const);
  const motas = useMemo(() => {
    const azar = prng(20240601);
    return Array.from({ length: 16 }, (_, i) => ({
      id: i,
      izquierda: azar() * 100, // %
      tam: 5 + azar() * 9,
      dur: 16 + azar() * 18,
      retardo: -azar() * 24, // arranque desfasado para un bucle ya vivo
      grano: azar() > 0.62, // algunas motas son granitos de café
      giro: azar() * 90 - 45,
      opacidad: 0.25 + azar() * 0.4,
    }));
  }, []);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      animate={{ background: `linear-gradient(to bottom, ${cielo[0]}, ${cielo[1]}, ${cielo[2]})` }}
      transition={{ duration: 0.8 }}
    >
      {/* halo cálido superior */}
      <div className="absolute -top-24 left-1/2 h-72 w-[130%] -translate-x-1/2 rounded-[100%] bg-[#fff8ea]/70 blur-2xl" />
      {motas.map((m) => (
        <motion.div
          key={m.id}
          className="absolute"
          style={{ left: `${m.izquierda}%`, top: "108%" }}
          animate={{ y: ["0vh", "-118vh"], x: [0, m.id % 2 ? 26 : -26, 0], rotate: m.grano ? [m.giro, m.giro + 40] : 0 }}
          transition={{ duration: m.dur, repeat: Infinity, delay: m.retardo, ease: "linear" }}
        >
          {m.grano ? (
            /* granito de café flotante */
            <div
              className="relative rounded-[50%] border border-[#8a5a33]/40 bg-[#b07a4a]/50"
              style={{ width: m.tam * 1.5, height: m.tam, opacity: m.opacidad, transform: `rotate(${m.giro}deg)` }}
            >
              <div className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 rounded bg-[#6e4525]/50" />
            </div>
          ) : (
            /* mota de vapor difusa */
            <div className="rounded-full bg-white/80 blur-[3px]" style={{ width: m.tam * 2.2, height: m.tam * 2.2, opacity: m.opacidad }} />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
