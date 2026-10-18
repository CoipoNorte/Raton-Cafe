/**
 * MapScreen — El calendario de la carrera: 7 días × 3 turnos.
 * ------------------------------------------------------------------
 * Cada día es una tarjeta con sus tres franjas (mañana, tarde y noche).
 * Un turno se desbloquea al superar el anterior; las estrellas ganadas
 * quedan guardadas y se muestran bajo cada franja.
 */

import { motion } from "framer-motion";
import { ArrowLeft, Lock, Star } from "lucide-react";
import { DIAS, FRANJAS, TOTAL_TURNOS, indiceTurno } from "../game/campaign";
import { claveTurno } from "../game/storage";
import { Fondo } from "../components/Fondo";

export interface MapScreenProps {
  /** estrellas por turno, clave "dia-turno" */
  estrellas: Record<string, number>;
  onJugarTurno: (dia: number, turnoIdx: number) => void;
  onVolver: () => void;
}

export function MapScreen({ estrellas, onJugarTurno, onVolver }: MapScreenProps) {
  /* El primer turno sin estrellas es el que toca jugar; todo lo anterior
     queda desbloqueado para repetir y mejorar la puntuación. */
  const superados = Object.keys(estrellas).length;
  const totalEstrellas = Object.values(estrellas).reduce((a, b) => a + b, 0);

  const desbloqueado = (dia: number, turnoIdx: number) => {
    const idx = indiceTurno(dia, turnoIdx);
    if (idx === 0) return true;
    // Está desbloqueado si el turno inmediatamente anterior ya tiene estrellas.
    const prevDia = turnoIdx === 0 ? dia - 1 : dia;
    const prevTurno = turnoIdx === 0 ? 2 : turnoIdx - 1;
    return (estrellas[claveTurno(prevDia, prevTurno)] ?? 0) > 0;
  };

  return (
    <div className="relative h-dvh overflow-y-auto">
      <Fondo />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-8 pt-4">
        {/* Cabecera */}
        <header className="mb-4 flex items-center justify-between gap-3">
          <button
            onClick={onVolver}
            className="flex h-9 items-center gap-1.5 rounded-full bg-white/70 px-3 font-display text-xs font-bold text-cafe-sombra shadow backdrop-blur transition-transform hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={15} />
            Menú
          </button>
          <h1 className="font-display text-2xl font-extrabold text-[#6b4a2f] sm:text-3xl">
            Modo carrera
          </h1>
          <span className="flex items-center gap-1 rounded-full bg-[#fff3d8] px-3 py-1 font-display text-xs font-extrabold text-[#a9722f] shadow">
            <Star size={13} className="fill-[#e0a03c] text-[#e0a03c]" />
            {totalEstrellas}/{TOTAL_TURNOS * 3}
          </span>
        </header>

        <p className="mb-4 text-center text-xs font-semibold text-cafe-sombra/70">
          Supera los tres turnos de cada día para avanzar. ¡Siete días, una cafetería que no para de crecer!
        </p>

        {/* Los 7 días */}
        <ol className="flex flex-col gap-2.5">
          {DIAS.map((dia, i) => {
            const turnosDelDia = dia.turnos.map((_, t) => estrellas[claveTurno(dia.numero, t)] ?? 0);
            const diaCompleto = turnosDelDia.every((e) => e > 0);
            const diaAbierto = desbloqueado(dia.numero, 0);

            return (
              <motion.li
                key={dia.numero}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 220, damping: 24 }}
                className={`rounded-3xl border-2 p-3 shadow-md transition-colors ${
                  diaCompleto
                    ? "border-[#9caf88] bg-[#f4f8ee]/95"
                    : diaAbierto
                      ? "border-[#e0cdab] bg-[#fffdf6]/95"
                      : "border-[#e4dccd] bg-[#f6f1e6]/80"
                }`}
              >
                <header className="mb-2 flex items-baseline gap-2">
                  <span className="font-display text-lg font-extrabold text-[#6b4a2f]">
                    Día {dia.numero}
                  </span>
                  <span className="truncate text-xs font-bold text-cafe-sombra/60">{dia.nombre}</span>
                  {diaCompleto && <span className="ml-auto text-sm">✅</span>}
                </header>

                {/* Las tres franjas del día */}
                <div className="grid grid-cols-3 gap-2">
                  {dia.turnos.map((turno, t) => {
                    const info = FRANJAS[turno.franja];
                    const ganadas = turnosDelDia[t];
                    const abierto = desbloqueado(dia.numero, t);

                    return (
                      <motion.button
                        key={t}
                        onClick={() => abierto && onJugarTurno(dia.numero, t)}
                        disabled={!abierto}
                        whileHover={abierto ? { scale: 1.04 } : undefined}
                        whileTap={abierto ? { scale: 0.95 } : undefined}
                        aria-label={`Día ${dia.numero}, ${info.nombre}: ${
                          abierto ? `${turno.clientes} clientes` : "bloqueado"
                        }`}
                        className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-2 transition-colors ${
                          !abierto
                            ? "cursor-not-allowed border-dashed border-[#ddd2bd] bg-white/40 opacity-60"
                            : ganadas > 0
                              ? "border-[#9caf88] bg-white shadow-sm"
                              : "border-[#c98a4b] bg-[#fff6e6] shadow-sm"
                        }`}
                      >
                        <span className="text-xl leading-none">{abierto ? info.emoji : "🔒"}</span>
                        <span className="font-display text-[11px] font-extrabold text-[#6b4a2f]">
                          {info.nombre}
                        </span>

                        {abierto ? (
                          <>
                            <span className="text-[9px] font-bold text-cafe-sombra/55">
                              {turno.clientes} clientes
                            </span>
                            <span className="flex gap-0.5">
                              {[1, 2, 3].map((n) => (
                                <Star
                                  key={n}
                                  size={11}
                                  className={
                                    n <= ganadas
                                      ? "fill-[#e0a03c] text-[#e0a03c]"
                                      : "fill-transparent text-[#d8c9ad]"
                                  }
                                />
                              ))}
                            </span>
                          </>
                        ) : (
                          <Lock size={12} className="text-cafe-sombra/40" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.li>
            );
          })}
        </ol>

        {superados >= TOTAL_TURNOS && (
          <p className="mt-4 text-center font-display text-sm font-extrabold text-[#6d8f54]">
            🏆 ¡Has completado la semana entera! Repite turnos para conseguir las 3 estrellas en todos.
          </p>
        )}
      </div>
    </div>
  );
}
