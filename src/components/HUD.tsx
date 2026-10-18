/**
 * HUD — Interfaz flotante y mínima.
 * La barra de tiempo vive pegada al borde superior (5 px, de lado a lado)
 * y los contadores son pastillas translúcidas que flotan sobre la escena:
 * nunca roban altura al área jugable.
 */

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Coffee, Coins, Flame, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { multiplicadorCombo } from "../game/balance";

export interface HUDProps {
  fraccionTiempo: number; // 0..1
  tiempoBajo: boolean;
  puntos: number;
  racha: number;
  pedidos: number;
  silenciado: boolean;
  onAlternarSilencio: () => void;
  pausado: boolean;
  onAlternarPausa: () => void;
  /* --- modo carrera: la barra superior muestra el PROGRESO del turno --- */
  carrera?: boolean;
  objetivo?: number; // clientes que hay que servir
  vidas?: number; // clientes que puedes perder
  perdidos?: number;
  etiquetaTurno?: string; // p. ej. "Día 2 · Tarde"
}

/** Pastilla translúcida reutilizable. */
function Pastilla({ children }: { children: ReactNode }) {
  return (
    <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-white/60 px-2 py-0.5 font-display text-[10px] font-bold text-cafe-sombra shadow-sm backdrop-blur-md sm:gap-1.5 sm:px-3 sm:py-1 sm:text-xs">
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

export function HUD({
  fraccionTiempo, tiempoBajo, puntos, racha, pedidos, silenciado, onAlternarSilencio, pausado, onAlternarPausa,
  carrera = false, objetivo = 0, vidas = 0, perdidos = 0, etiquetaTurno,
}: HUDProps) {
  const mult = multiplicadorCombo(racha);
  /* En carrera la barra superior mide el avance del turno (no el tiempo). */
  const fraccion = carrera
    ? (objetivo > 0 ? Math.min(1, pedidos / objetivo) : 0)
    : fraccionTiempo;
  const alerta = carrera ? perdidos >= vidas && vidas > 0 : tiempoBajo;
  const corazonesRestantes = Math.max(0, vidas - perdidos);

  return (
    <>
      {/* Barra superior: 5 px de lado a lado.
          Turno libre → tiempo restante · Carrera → progreso del objetivo */}
      <div
        className="fixed inset-x-0 top-0 z-50 h-[5px] bg-black/10"
        role="progressbar"
        aria-label={carrera ? "Progreso del turno" : "Tiempo restante"}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(fraccion * 100)}
      >
        <motion.div
          className={`h-full origin-left ${
            alerta
              ? "bg-[#d64541]"
              : carrera
                ? "bg-gradient-to-r from-[#9caf88] to-[#6d8f54]"
                : "bg-gradient-to-r from-[#c98a4b] to-[#c96f4a]"
          }`}
          animate={{
            width: `${Math.min(100, Math.max(0, fraccion * 100))}%`,
            opacity: alerta ? [1, 0.55, 1] : 1,
          }}
          transition={{
            width: { type: "spring", stiffness: 220, damping: 28 },
            opacity: alerta ? { duration: 0.7, repeat: Infinity } : { duration: 0.2 },
          }}
        />
      </div>

      {/* Pastillas flotantes (no roban altura: van por encima de la escena) */}
      {/* Rótulo del turno (solo carrera): "Día 2 · Tarde" */}
      {etiquetaTurno && (
        <div className="pointer-events-none fixed inset-x-0 top-2 z-30 flex justify-center">
          <span className="rounded-full bg-white/55 px-3 py-0.5 font-display text-[10px] font-extrabold uppercase tracking-[0.15em] text-cafe-sombra/70 shadow-sm backdrop-blur-md">
            {etiquetaTurno}
          </span>
        </div>
      )}

      <div className="pointer-events-none fixed inset-x-2 top-2 z-40 flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Pastilla>
            <Coins size={13} className="shrink-0 text-[#c98a4b]" />
            <ValorPop valor={puntos} texto={puntos.toLocaleString("es")} />
            <span className="hidden sm:inline">propinas</span>
          </Pastilla>
          <Pastilla>
            <Coffee size={13} className="shrink-0 text-[#9caf88]" />
            {/* En carrera se ve "3/7"; en libre, el total servido */}
            <ValorPop valor={pedidos} texto={carrera ? `${pedidos}/${objetivo}` : `${pedidos}`} />
            <span className="hidden sm:inline">{carrera ? "servidos" : "pedidos"}</span>
          </Pastilla>
          {/* Vidas: corazones que se apagan al marcharse un cliente */}
          {carrera && vidas > 0 && (
            <Pastilla>
              {Array.from({ length: vidas }, (_, i) => (
                <motion.span
                  key={i}
                  animate={i < corazonesRestantes ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0.3 }}
                  className="text-[11px] leading-none"
                >
                  {i < corazonesRestantes ? "❤️" : "🤍"}
                </motion.span>
              ))}
            </Pastilla>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Pastilla>
            <Flame size={13} className={`shrink-0 ${mult > 1 ? "text-[#c96f4a]" : "text-[#b8a58c]"}`} />
            <ValorPop valor={puntos} texto={`×${mult.toFixed(2).replace(/\.?0+$/, "")}`} />
          </Pastilla>
          <button
            onClick={onAlternarPausa}
            className="pointer-events-auto flex h-6 w-6 items-center justify-center rounded-full bg-white/60 text-cafe-sombra shadow-sm backdrop-blur-md transition-transform hover:scale-110 active:scale-95 sm:h-7 sm:w-7"
            aria-label={pausado ? "Continuar" : "Pausar"}
          >
            {pausado ? <Play size={13} /> : <Pause size={13} />}
          </button>
          <button
            onClick={onAlternarSilencio}
            className="pointer-events-auto flex h-6 w-6 items-center justify-center rounded-full bg-white/60 text-cafe-sombra shadow-sm backdrop-blur-md transition-transform hover:scale-110 active:scale-95 sm:h-7 sm:w-7"
            aria-label={silenciado ? "Activar sonido" : "Silenciar"}
          >
            {silenciado ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>
        </div>
      </div>
    </>
  );
}
