/**
 * StationGrid — La cocina: 9 estaciones agrupadas por zona.
 * ------------------------------------------------------------------
 * CONTROLES (todo funciona de las dos formas, elige la que te guste):
 *  · TOCAR  → acción directa (arrancar, recoger, tirar).
 *  · ARRASTRAR hasta la bandeja → suelta el ingrediente ahí.
 *
 * CAPA TÁCTICA: cada estación muestra un badge con cuántas unidades
 * piden los clientes que hay ahora mismo en la barra. Las que nadie
 * necesita se atenúan, así ves de un vistazo tu plan de trabajo.
 */

import type { RefObject } from "react";
import { motion, type PanInfo } from "framer-motion";
import { Flame, Trash2 } from "lucide-react";
import { COLOR_ZONA, ESTACIONES, ORDEN_ESTACIONES } from "../game/recipes";
import { useTapSinArrastre } from "../hooks/useTapSinArrastre";
import type { Estacion, IngredienteId, Zona } from "../game/types";
import { IngGlyph } from "./Art";

export interface StationGridProps {
  estaciones: Record<IngredienteId, Estacion>;
  ahora: number;
  /** acción de la estación; `rect` sirve para animar el vuelo del ingrediente */
  onTocar: (id: IngredienteId, rect: DOMRect) => void;
  /** cuántas unidades de cada ingrediente piden los clientes actuales */
  necesarios: Partial<Record<IngredienteId, number>>;
  /** zona de la bandeja, para soltar arrastrando */
  trayRef: RefObject<HTMLElement | null>;
  onArrastrando?: (activo: boolean) => void;
  denso?: boolean;
}

/** Anillo de progreso circular (0..1). */
function Anillo({ progreso, color, tam }: { progreso: number; color: string; tam: number }) {
  const r = tam / 2 - 3;
  const c = 2 * Math.PI * r;
  return (
    <svg width={tam} height={tam} className="absolute inset-0 m-auto -rotate-90" aria-hidden="true">
      <circle cx={tam / 2} cy={tam / 2} r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={4} />
      <circle
        cx={tam / 2} cy={tam / 2} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - progreso)}
      />
    </svg>
  );
}

export function StationGrid({
  estaciones, ahora, onTocar, necesarios, trayRef, onArrastrando, denso = false,
}: StationGridProps) {
  const zonas: Zona[] = ["cafe", "cocina", "vitrina"];
  /* Distingue "toque" de "arrastre": sin esto la acción se duplicaba. */
  const gesto = useTapSinArrastre();

  /** ¿El puntero acabó dentro de la bandeja? */
  const sobreBandeja = (info: PanInfo): boolean => {
    const r = trayRef.current?.getBoundingClientRect();
    if (!r) return false;
    const { x, y } = info.point;
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };

  return (
    <div className="flex w-full flex-col gap-1.5">
      {zonas.map((zona) => {
        const ids = ORDEN_ESTACIONES.filter((id) => ESTACIONES[id].zona === zona);
        const z = COLOR_ZONA[zona];
        return (
          <section
            key={zona}
            aria-label={z.nombre}
            className="rounded-2xl border-2 p-1.5 shadow-sm"
            style={{ borderColor: z.borde, backgroundColor: z.fondo }}
          >
            <h3 className="mb-1 px-1 text-[9px] font-extrabold uppercase tracking-widest" style={{ color: z.texto }}>
              {z.nombre}
            </h3>
            <div className="grid grid-cols-4 gap-1.5 min-[380px]:gap-2">
              {ids.map((id) => {
                const def = ESTACIONES[id];
                const st = estaciones[id];
                const transcurrido = ahora - st.desde;
                const progreso = st.estado === "trabajando" ? Math.min(1, transcurrido / def.tiempo) : 0;
                const margenUsado =
                  st.estado === "listo" && def.margen > 0
                    ? Math.min(1, (transcurrido - def.tiempo) / def.margen)
                    : 0;
                const porQuemarse = st.estado === "listo" && margenUsado > 0.6;
                const tam = denso ? 50 : 60;
                const pedidoPor = necesarios[id] ?? 0;
                /* Se puede arrastrar lo que ya es un ingrediente tangible */
                const arrastrable = def.tiempo === 0 || st.estado === "listo";
                /* Pista: nadie lo necesita ahora mismo → se atenúa */
                const ocioso = pedidoPor === 0 && st.estado === "libre";

                return (
                  <motion.button
                    key={id}
                    /* TOQUE: solo si NO hubo arrastre en este gesto.
                       (Framer Motion dispara onTap también al soltar un
                        arrastre, y eso duplicaba el ingrediente.) */
                    onTap={(e) => {
                      if (!gesto.esTapLimpio()) return;
                      const el = (e.target as HTMLElement)?.closest("button");
                      if (el) onTocar(id, el.getBoundingClientRect());
                    }}
                    /* --- ARRASTRE hacia la bandeja --- */
                    drag={arrastrable}
                    dragSnapToOrigin
                    dragElastic={0.12}
                    whileDrag={{ scale: 1.2, zIndex: 70, boxShadow: "0 16px 32px rgba(75,44,26,0.4)" }}
                    onDragStart={() => {
                      gesto.alIniciarArrastre();
                      onArrastrando?.(true);
                    }}
                    onDragEnd={(e, info) => {
                      onArrastrando?.(false);
                      if (sobreBandeja(info)) {
                        const el = (e.target as HTMLElement)?.closest("button");
                        onTocar(id, (el ?? (e.target as HTMLElement)).getBoundingClientRect());
                      }
                      gesto.alTerminarArrastre();
                    }}
                    whileTap={{ scale: 0.9 }}
                    animate={
                      st.estado === "listo"
                        ? { scale: [1, 1.06, 1], opacity: 1 }
                        : st.estado === "quemado"
                          ? { rotate: [-1.5, 1.5, -1.5], opacity: 1 }
                          : { scale: 1, rotate: 0, opacity: ocioso ? 0.55 : 1 }
                    }
                    transition={
                      st.estado === "listo"
                        ? { duration: 0.7, repeat: Infinity }
                        : st.estado === "quemado"
                          ? { duration: 0.25, repeat: Infinity }
                          : { type: "spring", stiffness: 300, damping: 20 }
                    }
                    aria-label={`${def.nombre}${st.estado === "listo" ? " listo para recoger" : st.estado === "quemado" ? " quemado, tirar" : ""}${pedidoPor > 0 ? `, piden ${pedidoPor}` : ""}`}
                    className={`relative flex touch-none flex-col items-center justify-center gap-0.5 rounded-xl border-2 bg-white/90 p-1 shadow-sm transition-colors ${
                      st.estado === "listo"
                        ? "border-[#6d8f54] bg-[#f2f8ec]"
                        : st.estado === "quemado"
                          ? "border-[#d64541] bg-[#fdeceb]"
                          : st.estado === "trabajando"
                            ? "border-[#e0a03c]"
                            : pedidoPor > 0
                              ? "border-[#d9b38a]"
                              : "border-transparent"
                    } ${arrastrable ? "cursor-grab active:cursor-grabbing" : ""}`}
                    style={{ height: tam + 22 }}
                  >
                    {/* badge táctico: cuántos piden los clientes de la barra */}
                    {pedidoPor > 0 && st.estado === "libre" && (
                      <motion.span
                        key={pedidoPor}
                        initial={{ scale: 0.4 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 18 }}
                        className="absolute -right-1 -top-1 z-10 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c96f4a] px-1 text-[9px] font-extrabold text-white shadow"
                      >
                        {pedidoPor}
                      </motion.span>
                    )}

                    <span className="relative flex items-center justify-center" style={{ width: tam, height: tam }}>
                      {st.estado === "trabajando" && <Anillo progreso={progreso} color="#e0a03c" tam={tam} />}
                      {porQuemarse && <Anillo progreso={1 - margenUsado} color="#d64541" tam={tam} />}

                      {st.estado === "quemado" ? (
                        <span className="flex flex-col items-center text-[#d64541]">
                          <Flame size={denso ? 19 : 23} />
                          <Trash2 size={denso ? 11 : 13} />
                        </span>
                      ) : (
                        <motion.span
                          animate={st.estado === "trabajando" ? { opacity: [1, 0.45, 1] } : { opacity: 1 }}
                          transition={st.estado === "trabajando" ? { duration: 0.9, repeat: Infinity } : undefined}
                        >
                          <IngGlyph id={id} size={denso ? 25 : 31} />
                        </motion.span>
                      )}

                      {porQuemarse && (
                        <motion.span
                          className="absolute -top-1 text-xs"
                          animate={{ y: [-1, -7], opacity: [0.8, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          💨
                        </motion.span>
                      )}
                    </span>

                    <span className={`text-center font-bold leading-none ${st.estado === "listo" ? "text-[#4e6b3b]" : st.estado === "quemado" ? "text-[#c4473f]" : "text-cafe-sombra"} ${denso ? "text-[8px]" : "text-[9px]"}`}>
                      {st.estado === "listo" ? "¡COGER!" : st.estado === "quemado" ? "TIRAR" : def.nombre}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
