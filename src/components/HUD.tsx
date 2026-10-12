/**
 * HUD — Interfaz flotante y mínima.
 * La barra de tiempo vive pegada al borde superior (5 px, de lado a lado)
 * y los contadores son pastillas translúcidas que flotan sobre la escena:
 * nunca roban altura al área jugable.
 */

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Coffee, Coins, Flame, Volume2, VolumeX } from "lucide-react";
import { multiplicadorCombo } from "../game/balance";

export interface HUDProps {
  fraccionTiempo: number; // 0..1
  tiempoBajo: boolean;
  puntos: number;
  racha: number;
  pedidos: number;
  silenciado: boolean;
  onAlternarSilencio: () => void;
}

/** Pastilla translúcida reutilizable. */
function Pastilla({ children }: { children: ReactNode }) {
  return (
    <div className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-white/55 px-3 py-1 font-display text-xs font-bold text-cafe-sombra shadow-sm backdrop-blur-md">
      {children}
    </div>
  );
}

/** Valor que hace "pop" con un muelle cada vez que cambia. */
function ValorPop({ valor, texto }: { valor: number; texto: string }) {
  return (
    <motion.span
      key={valor}
      initial={{ scale: 1.45, opacity: 0.4 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
    >
      {texto}
    </motion.span>
  );
}

export function HUD({ fraccionTiempo, tiempoBajo, puntos, racha, pedidos, silenciado, onAlternarSilencio }: HUDProps) {
  const mult = multiplicadorCombo(racha);
  return (
    <>
      {/* Barra de tiempo: 5 px de lado a lado, roja en los últimos segundos */}
      <div className="fixed inset-x-0 top-0 z-50 h-[5px] bg-black/10" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(fraccionTiempo * 100)}>
        <motion.div
          className={`h-full origin-left ${tiempoBajo ? "bg-[#d64541]" : "bg-gradient-to-r from-[#c98a4b] to-[#c96f4a]"}`}
          style={{ width: `${Math.min(100, Math.max(0, fraccionTiempo * 100))}%` }}
          animate={tiempoBajo ? { opacity: [1, 0.55, 1] } : { opacity: 1 }}
          transition={tiempoBajo ? { duration: 0.7, repeat: Infinity } : { duration: 0.2 }}
        />
      </div>

      {/* Pastillas flotantes (no roban altura: van por encima de la escena) */}
      <div className="pointer-events-none fixed inset-x-3 top-3 z-40 flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Pastilla>
            <Coins size={14} className="text-[#c98a4b]" />
            <ValorPop valor={puntos} texto={`${puntos.toLocaleString("es")} propinas`} />
          </Pastilla>
          <Pastilla>
            <Coffee size={14} className="text-[#9caf88]" />
            <ValorPop valor={pedidos} texto={`${pedidos} pedidos`} />
          </Pastilla>
        </div>
        <div className="flex items-center gap-2">
          <Pastilla>
            <Flame size={14} className={mult > 1 ? "text-[#c96f4a]" : "text-[#b8a58c]"} />
            <ValorPop valor={puntos} texto={`×${mult.toFixed(2).replace(/\.?0+$/, "")}`} />
          </Pastilla>
          <button
            onClick={onAlternarSilencio}
            className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full bg-white/55 text-cafe-sombra shadow-sm backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
            aria-label={silenciado ? "Activar sonido" : "Silenciar"}
          >
            {silenciado ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
      </div>
    </>
  );
}
