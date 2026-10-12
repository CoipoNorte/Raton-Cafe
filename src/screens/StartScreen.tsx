/**
 * Pantalla de inicio — La puerta de la cafetería.
 * Presenta la mascota, el récord histórico y un "cómo se juega" en 3 pasos.
 */

import { motion } from "framer-motion";
import { Coffee, Eye, MousePointerClick, Play, Trophy, Volume2, VolumeX } from "lucide-react";
import { Fondo } from "../components/Fondo";
import { Mascot } from "../components/Mascot";

export interface StartScreenProps {
  recordPedidos: number;
  recordPropinas: number;
  onJugar: () => void;
  silenciado: boolean;
  onAlternarSilencio: () => void;
}

const PASOS = [
  { Icono: Eye, texto: "Mira el ticket del cliente" },
  { Icono: MousePointerClick, texto: "Arrastra (o toca) ingredientes a la taza" },
  { Icono: Coffee, texto: "Sirve, acierta y encadena combos" },
];

export function StartScreen({ recordPedidos, recordPropinas, onJugar, silenciado, onAlternarSilencio }: StartScreenProps) {
  return (
    <div className="relative flex h-dvh flex-col items-center justify-center overflow-hidden px-4 text-center">
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
        className="relative z-10 flex w-full max-w-lg flex-col items-center gap-4"
      >
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Mascot humor="idle" className="w-32 drop-shadow-xl sm:w-40" />
        </motion.div>

        <h1 className="font-display text-6xl font-extrabold leading-none text-[#6b4a2f] sm:text-7xl">
          Ratón <span className="text-[#c96f4a]">Café</span>
        </h1>
        <p className="max-w-sm text-sm font-semibold text-cafe-sombra/80">
          Una cafetería acogedora donde preparas bebidas por capas. Sirve pedidos
          perfectos, encadena combos y bate tu récord antes de que acabe el turno.
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

        <motion.button
          onClick={onJugar}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="mt-1 flex items-center gap-3 rounded-full bg-gradient-to-b from-[#d98a52] to-[#c96f4a] px-12 py-4 font-display text-2xl font-extrabold tracking-wide text-white shadow-[0_10px_26px_rgba(201,111,74,0.45)]"
        >
          <Play size={24} fill="currentColor" />
          Abrir la cafetería
        </motion.button>

        <ol className="mt-2 grid w-full max-w-md grid-cols-3 gap-2">
          {PASOS.map(({ Icono, texto }, i) => (
            <motion.li
              key={texto}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.12 }}
              className="flex flex-col items-center gap-1.5 rounded-2xl border border-[#ecdcbf] bg-[#fffdf6]/85 p-3 text-[11px] font-bold leading-tight text-cafe-sombra shadow-sm"
            >
              <Icono size={18} className="text-[#c98a4b]" />
              {texto}
            </motion.li>
          ))}
        </ol>
      </motion.div>
    </div>
  );
}
