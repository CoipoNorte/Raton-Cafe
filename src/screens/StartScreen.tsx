/**
 * Pantalla de inicio — La puerta de la cafetería.
 * Presenta la mascota, el récord histórico y un "cómo se juega" en 3 pasos.
 */

import { motion } from "framer-motion";
import { CalendarDays, Play, Star, Trophy, Volume2, VolumeX } from "lucide-react";
import { DishSVG } from "../components/Art";
import { Fondo } from "../components/Fondo";
import { Mascot } from "../components/Mascot";
import { RECETAS } from "../game/recipes";
import type { RecetaId } from "../game/types";
import { useViewport } from "../hooks/useViewport";

export interface StartScreenProps {
  recordPedidos: number;
  recordPropinas: number;
  /** turno libre (arcade de 100 s) */
  onJugar: () => void;
  /** modo carrera: 7 días × 3 turnos */
  onCarrera: () => void;
  /** estrellas conseguidas en la carrera */
  estrellasTotales: number;
  silenciado: boolean;
  onAlternarSilencio: () => void;
}

/** La carta que verá el jugador en el menú principal. */
const CARTA: RecetaId[] = ["capuchino", "mokachino", "sandwich", "pastel", "pieLimon"];

export function StartScreen({
  recordPedidos, recordPropinas, onJugar, onCarrera, estrellasTotales, silenciado, onAlternarSilencio,
}: StartScreenProps) {
  /* En móvil horizontal (poca altura) encogemos todo para que el botón
     "Abrir la cafetería" siempre quede visible sin hacer scroll. */
  const { bajo } = useViewport();

  return (
    <div className="relative flex h-dvh flex-col items-center justify-center overflow-y-auto px-4 py-4 text-center">
      <Fondo />

      <button
        onClick={onAlternarSilencio}
        className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/55 text-cafe-sombra shadow backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
        aria-label={silenciado ? "Activar sonido" : "Silenciar"}
      >
        {silenciado ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className={`relative z-10 flex w-full max-w-lg flex-col items-center ${bajo ? "gap-2" : "gap-4"}`}
      >
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Mascot humor="idle" className={`drop-shadow-xl ${bajo ? "w-20" : "w-32 sm:w-40"}`} />
        </motion.div>

        <h1 className={`font-display font-extrabold leading-none text-[#6b4a2f] ${bajo ? "text-4xl" : "text-6xl sm:text-7xl"}`}>
          Ratón <span className="text-[#c96f4a]">Café</span>
        </h1>
        <p className={`max-w-md font-semibold text-cafe-sombra/80 ${bajo ? "hidden" : "text-sm"}`}>
          Los clientes llegan con prisa. Usa las estaciones, monta los pedidos en
          la bandeja y sírvelos antes de que se cansen… ¡sin quemar nada!
        </p>

        {recordPedidos > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex items-center gap-2 rounded-full border border-[#e8cf9f] bg-[#fff3d8]/90 px-4 py-1.5 font-display text-xs font-bold text-[#a9722f] shadow"
          >
            <Trophy size={14} />
            Récord: {recordPedidos} pedidos · {recordPropinas.toLocaleString("es")} propinas
          </motion.div>
        )}

        {/* Dos modos: la carrera es la vía principal, el turno libre el arcade */}
        <div className={`flex w-full flex-col items-center gap-2 ${bajo ? "mt-0" : "mt-1"}`}>
          <motion.button
            onClick={onCarrera}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            className={`flex items-center gap-3 rounded-full bg-gradient-to-b from-[#d98a52] to-[#c96f4a] font-display font-extrabold tracking-wide text-white shadow-[0_10px_26px_rgba(201,111,74,0.45)] ${
              bajo ? "px-7 py-2.5 text-lg" : "px-11 py-4 text-2xl"
            }`}
          >
            <CalendarDays size={bajo ? 19 : 24} />
            Modo carrera
            {estrellasTotales > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-white/25 px-2 py-0.5 text-sm">
                <Star size={13} className="fill-white text-white" />
                {estrellasTotales}
              </span>
            )}
          </motion.button>

          <motion.button
            onClick={onJugar}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            className={`flex items-center gap-2 rounded-full border-2 border-[#d9b38a] bg-white/80 font-display font-bold text-[#8a5a33] shadow ${
              bajo ? "px-5 py-1.5 text-sm" : "px-7 py-2.5 text-base"
            }`}
          >
            <Play size={bajo ? 15 : 18} fill="currentColor" />
            Turno libre · 100 s
          </motion.button>
        </div>

        {/* La carta: lo que vas a aprender a preparar */}
        <div className={`w-full ${bajo ? "hidden" : "mt-1"}`}>
          <h2 className="mb-1.5 font-display text-xs font-extrabold uppercase tracking-[0.2em] text-[#a9722f]">
            La carta
          </h2>
          <ul className="grid grid-cols-5 gap-1.5">
            {CARTA.map((id, i) => (
              <motion.li
                key={id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.09 }}
                className="flex flex-col items-center gap-0.5 rounded-2xl border border-[#ecdcbf] bg-[#fffdf6]/90 p-1.5 shadow-sm"
              >
                <DishSVG receta={id} className="h-11 w-full" />
                <span className="text-center text-[9px] font-bold leading-tight text-cafe-sombra">
                  {RECETAS[id].nombre}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
