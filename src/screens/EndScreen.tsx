/**
 * EndScreen — Cierre de turno.
 * ------------------------------------------------------------------
 * Sirve para los dos modos:
 *  · CARRERA  → estrellas, turno superado o fallido y paso al siguiente.
 *  · LIBRE    → resumen arcade con récord histórico.
 */

import { motion } from "framer-motion";
import { Coins, Coffee, Flame, Home, Map, RotateCcw, Star, Trophy, UserX } from "lucide-react";
import { Fondo } from "../components/Fondo";
import { Mascot } from "../components/Mascot";
import { FRANJAS, turnoDe } from "../game/campaign";
import type { ResultadoPartida } from "../game/types";

export interface EndScreenProps {
  resultado: ResultadoPartida;
  onReintentar: () => void;
  onSiguiente: () => void;
  onMapa: () => void;
  onMenu: () => void;
}

export function EndScreen({ resultado, onReintentar, onSiguiente, onMapa, onMenu }: EndScreenProps) {
  const carrera = resultado.modo === "carrera";
  const superado = carrera && resultado.completado === true;
  const estrellas = resultado.estrellas ?? 0;
  const franja =
    carrera && resultado.dia && resultado.turnoIdx !== undefined
      ? turnoDe(resultado.dia, resultado.turnoIdx).franja
      : undefined;

  const estadisticas = [
    { Icono: Coffee, valor: `${resultado.pedidos}`, etiqueta: "pedidos servidos", color: "text-[#9caf88]" },
    { Icono: Coins, valor: `${resultado.propinas.toLocaleString("es")}`, etiqueta: "propinas ($)", color: "text-[#c98a4b]" },
    { Icono: Flame, valor: `${resultado.mejorCombo}`, etiqueta: "mejor racha", color: "text-[#c96f4a]" },
    { Icono: UserX, valor: `${resultado.perdidos}`, etiqueta: "se fueron", color: "text-[#c4473f]" },
  ];

  /* Título según lo ocurrido */
  const titulo = carrera
    ? superado
      ? resultado.finDeCarrera
        ? "¡Semana completada!"
        : "¡Turno superado!"
      : "Turno fallido"
    : resultado.esRecord
      ? "¡Nuevo récord de la casa!"
      : "¡Cerramos por hoy!";

  return (
    <div className="relative flex h-dvh flex-col items-center justify-center overflow-y-auto px-4 py-4 text-center">
      <Fondo franja={franja} />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 130, damping: 16 }}
        className="relative z-10 flex w-full max-w-md flex-col items-center gap-3 rounded-3xl border border-[#ecdcbf] bg-[#fffdf6]/92 p-5 shadow-xl backdrop-blur-sm sm:gap-4 sm:p-6"
      >
        <Mascot
          humor={carrera ? (superado ? "feliz" : "preocupado") : resultado.pedidos > 0 ? "feliz" : "preocupado"}
          className="w-16 drop-shadow-lg sm:w-24"
        />

        {/* Rótulo del turno jugado */}
        {carrera && resultado.dia && franja && (
          <span className="-mb-1 rounded-full bg-[#f3e7d1] px-3 py-0.5 font-display text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#a9722f]">
            Día {resultado.dia} · {FRANJAS[franja].emoji} {FRANJAS[franja].nombre}
          </span>
        )}

        <h2 className="font-display text-2xl font-extrabold text-[#6b4a2f] sm:text-3xl">{titulo}</h2>

        {/* Estrellas (carrera superada) */}
        {superado && (
          <div className="flex gap-1.5">
            {[1, 2, 3].map((n) => (
              <motion.span
                key={n}
                initial={{ scale: 0, rotate: -40 }}
                animate={{ scale: n <= estrellas ? 1 : 0.75, rotate: 0 }}
                transition={{ delay: 0.25 + n * 0.14, type: "spring", stiffness: 320, damping: 12 }}
              >
                <Star
                  size={38}
                  className={n <= estrellas ? "fill-[#e0a03c] text-[#e0a03c] drop-shadow" : "fill-[#efe4cd] text-[#dbcbab]"}
                />
              </motion.span>
            ))}
          </div>
        )}

        {/* Motivo del fallo */}
        {carrera && !superado && (
          <p className="text-xs font-bold text-cafe-sombra/70">
            Serviste {resultado.pedidos} de {resultado.objetivo} clientes.
            <br />
            Se marcharon demasiados… ¡inténtalo otra vez!
          </p>
        )}

        {resultado.esRecord && !carrera && (
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

        {/* Acciones */}
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2.5">
          {carrera && superado && !resultado.finDeCarrera && (
            <motion.button
              onClick={onSiguiente}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              className="flex items-center gap-2 rounded-full bg-gradient-to-b from-[#8fae72] to-[#6d8f54] px-7 py-3 font-display text-lg font-extrabold text-white shadow-[0_8px_20px_rgba(109,143,84,0.45)]"
            >
              Siguiente turno →
            </motion.button>
          )}

          {(!carrera || !superado) && (
            <motion.button
              onClick={onReintentar}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              className="flex items-center gap-2 rounded-full bg-gradient-to-b from-[#d98a52] to-[#c96f4a] px-7 py-3 font-display text-lg font-extrabold text-white shadow-[0_8px_20px_rgba(201,111,74,0.4)]"
            >
              <RotateCcw size={18} />
              {carrera ? "Reintentar" : "Otra ronda"}
            </motion.button>
          )}

          {carrera && (
            <motion.button
              onClick={onMapa}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              className="flex items-center gap-2 rounded-full border border-[#ecdcbf] bg-white/85 px-5 py-3 font-display text-base font-bold text-cafe-sombra shadow"
            >
              <Map size={17} />
              Calendario
            </motion.button>
          )}

          <motion.button
            onClick={onMenu}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-2 rounded-full border border-[#ecdcbf] bg-white/85 px-5 py-3 font-display text-base font-bold text-cafe-sombra shadow"
          >
            <Home size={17} />
            Menú
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
