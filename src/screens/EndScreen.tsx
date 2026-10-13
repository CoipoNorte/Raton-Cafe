/**
 * Pantalla de fin de turno — Cierre de la cafetería.
 * Resumen de pedidos, propinas y mejor combo; fanfarria si hubo récord.
 */

import { motion } from "framer-motion";
import { Coins, Coffee, Flame, Home, RotateCcw, Trophy, UserX } from "lucide-react";
import { Fondo } from "../components/Fondo";
import { Mascot } from "../components/Mascot";
import type { ResultadoPartida } from "../game/types";

export interface EndScreenProps {
  resultado: ResultadoPartida;
  onReintentar: () => void;
  onMenu: () => void;
}

export function EndScreen({ resultado, onReintentar, onMenu }: EndScreenProps) {
  const estadisticas = [
    { Icono: Coffee, valor: `${resultado.pedidos}`, etiqueta: "pedidos servidos", color: "text-[#9caf88]" },
    { Icono: Coins, valor: `${resultado.propinas.toLocaleString("es")}`, etiqueta: "propinas ($)", color: "text-[#c98a4b]" },
    { Icono: Flame, valor: `${resultado.mejorCombo}`, etiqueta: "mejor racha", color: "text-[#c96f4a]" },
    { Icono: UserX, valor: `${resultado.perdidos}`, etiqueta: "se fueron", color: "text-[#c4473f]" },
  ];

  return (
    <div className="relative flex h-dvh flex-col items-center justify-center overflow-y-auto px-4 py-4 text-center">
      <Fondo />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 130, damping: 16 }}
        className="relative z-10 flex w-full max-w-md flex-col items-center gap-3 rounded-3xl border border-[#ecdcbf] bg-[#fffdf6]/92 p-5 shadow-xl backdrop-blur-sm sm:gap-4 sm:p-6"
      >
        <Mascot humor={resultado.pedidos > 0 ? "feliz" : "preocupado"} className="w-16 drop-shadow-lg sm:w-24" />

        <h2 className="font-display text-2xl font-extrabold text-[#6b4a2f] sm:text-3xl">
          {resultado.esRecord ? "¡Nuevo récord de la casa!" : "¡Cerramos por hoy!"}
        </h2>

        {resultado.esRecord && (
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 12 }}
            className="flex items-center gap-2 rounded-full border border-[#e8cf9f] bg-[#fff3d8] px-4 py-1.5 font-display text-sm font-bold text-[#a9722f] shadow"
          >
            <Trophy size={16} />
            La casa te invita al próximo turno
          </motion.div>
        )}

        <div className="grid w-full grid-cols-4 gap-1.5">
          {estadisticas.map(({ Icono, valor, etiqueta, color }, i) => (
            <motion.div
              key={etiqueta}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.1 }}
              className="flex flex-col items-center gap-1 rounded-2xl border border-[#ecdcbf] bg-white/80 p-3 shadow-sm"
            >
              <Icono size={18} className={color} />
              <span className="font-display text-xl font-extrabold text-[#6b4a2f]">{valor}</span>
              <span className="text-[10px] font-bold leading-tight text-cafe-sombra/70">{etiqueta}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
          <motion.button
            onClick={onReintentar}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-2 rounded-full bg-gradient-to-b from-[#d98a52] to-[#c96f4a] px-7 py-3 font-display text-lg font-extrabold text-white shadow-[0_8px_20px_rgba(201,111,74,0.4)]"
          >
            <RotateCcw size={18} />
            Otra ronda
          </motion.button>
          <motion.button
            onClick={onMenu}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-2 rounded-full border border-[#ecdcbf] bg-white/85 px-6 py-3 font-display text-base font-bold text-cafe-sombra shadow"
          >
            <Home size={17} />
            Menú
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
