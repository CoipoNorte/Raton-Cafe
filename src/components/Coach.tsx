/**
 * Coach — Guía rápida de 3 pasos al empezar el turno.
 * Se muestra unos segundos y desaparece sola (o al tocarla).
 * Enseña el gesto clave del juego sin cortar el ritmo.
 */

import { motion } from "framer-motion";
import { Hand, MousePointerClick, Move } from "lucide-react";

const PASOS = [
  { Icono: MousePointerClick, texto: "Toca una estación para preparar" },
  { Icono: Move, texto: "Arrastra el ingrediente a la bandeja" },
  { Icono: Hand, texto: "Lleva el plato al cliente en verde" },
];

export function Coach({ onCerrar }: { onCerrar: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#f4e4cc]/75 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className="flex w-[min(92vw,420px)] flex-col gap-2.5 rounded-3xl border-2 border-[#e0cdab] bg-[#fffdf6] p-4 shadow-2xl"
      >
        <span className="font-display text-sm font-extrabold uppercase tracking-widest text-[#c96f4a]">
          Cómo trabajar
        </span>
        <ol className="flex flex-col gap-1.5">
          {PASOS.map(({ Icono, texto }, i) => (
            <motion.li
              key={texto}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 + i * 0.12 }}
              className="flex items-center gap-2 text-left text-xs font-bold text-cafe-sombra"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f3e7d1] text-[#a9722f]">
                <Icono size={15} />
              </span>
              <span className="flex-1">{texto}</span>
              <span className="font-display text-base text-[#d8c4a4]">{i + 1}</span>
            </motion.li>
          ))}
        </ol>

        <p className="rounded-xl bg-[#fdf3e3] p-2 text-left text-[10px] font-semibold leading-relaxed text-cafe-sombra/75">
          🔢 <b>El orden da igual</b>: la bandeja te marca en naranja lo que falta
          y en rojo lo que sobra.<br />
          🔥 Lo que tarda <b>se quema</b>: recógelo en cuanto diga «¡COGER!».
        </p>

        <motion.button
          onClick={onCerrar}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="mt-0.5 rounded-full bg-gradient-to-b from-[#d98a52] to-[#c96f4a] py-2.5 font-display text-lg font-extrabold tracking-wide text-white shadow-[0_8px_20px_rgba(201,111,74,0.4)]"
        >
          ¡Abrir la caja!
        </motion.button>
        <span className="text-[10px] font-semibold text-cafe-sombra/45">
          El reloj está parado: empieza cuando tú digas
        </span>
      </motion.div>
    </motion.div>
  );
}
