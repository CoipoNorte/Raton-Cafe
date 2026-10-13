/**
 * OrderQueue — La barra de clientes esperando.
 * ------------------------------------------------------------------
 * Cada tarjeta muestra el plato pedido (dibujado grande), los
 * ingredientes que lleva y una barra de PACIENCIA que se agota.
 * Cuando tu bandeja coincide con un pedido, su tarjeta se ilumina en
 * verde y basta con tocarla para servir: ese es el gesto del juego.
 */

import { AnimatePresence, motion } from "framer-motion";
import { Hand } from "lucide-react";
import { ESTACIONES, RECETAS } from "../game/recipes";
import type { IngredienteId, Pedido } from "../game/types";
import { DishSVG, IngGlyph } from "./Art";

export interface OrderQueueProps {
  pedidos: Pedido[];
  ahora: number;
  /** id del pedido al que le sirve la bandeja actual (o null) */
  servibleId: number | null;
  /** id del pedido que acaba de rechazar la bandeja (para sacudirlo) */
  rechazadoId: number | null;
  onServir: (pedido: Pedido) => void;
  /** registra el nodo de cada tarjeta: permite soltar el plato encima */
  registrarTarjeta: (id: number, el: HTMLElement | null) => void;
  /** lo que llevas en la bandeja, para marcar qué pasos ya tienes */
  bandeja: IngredienteId[];
  /** true mientras arrastras el plato: las tarjetas invitan a soltar */
  sirviendo?: boolean;
  denso?: boolean;
}

export function OrderQueue({
  pedidos, ahora, servibleId, rechazadoId, onServir, registrarTarjeta, bandeja, sirviendo = false, denso = false,
}: OrderQueueProps) {
  return (
    <div className="flex w-full items-stretch justify-center gap-2" role="list" aria-label="Clientes esperando">
      <AnimatePresence mode="popLayout">
        {pedidos.map((p) => {
          const receta = RECETAS[p.receta];
          const restante = Math.max(0, 1 - (ahora - p.nacido) / p.paciencia);
          const urgente = restante < 0.3;
          const servible = servibleId === p.id;
          const rechazado = rechazadoId === p.id;

          return (
            <motion.button
              key={p.id}
              layout
              role="listitem"
              ref={(el) => registrarTarjeta(p.id, el)}
              onClick={() => onServir(p)}
              initial={{ opacity: 0, y: -40, scale: 0.8 }}
              animate={{
                opacity: 1, y: 0, scale: 1,
                x: rechazado ? [0, -8, 8, -5, 5, 0] : 0,
              }}
              exit={{ opacity: 0, scale: 0.7, y: -30, transition: { duration: 0.25 } }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              aria-label={`Pedido de ${p.cliente}: ${receta.nombre}${servible ? " — listo para servir" : ""}`}
              className={`relative flex ${denso ? "w-[86px]" : "w-[104px]"} shrink-0 flex-col items-center gap-0.5 rounded-2xl border-2 bg-[#fffdf6] p-1.5 shadow-md transition-colors ${
                servible
                  ? "border-[#6d8f54] bg-[#f3f8ed] shadow-[0_0_0_3px_rgba(109,143,84,0.25)]"
                  : sirviendo
                    ? "border-dashed border-[#c98a4b]"
                    : urgente
                      ? "border-[#d64541]"
                      : "border-[#ecdcbf]"
              }`}
            >
              {/* nombre del cliente */}
              <span className="w-full truncate text-center text-[9px] font-bold uppercase tracking-wide text-cafe-sombra/60">
                {p.cliente}
              </span>

              {/* el plato, protagonista */}
              <DishSVG receta={p.receta} className={denso ? "h-10 w-full" : "h-14 w-full"} />

              <span className={`font-display font-extrabold leading-none text-[#6b4a2f] ${denso ? "text-[9px]" : "text-[10px]"}`}>
                {receta.nombre}
              </span>

              {/* Pasos del pedido: los que YA tienes en la bandeja se
                  marcan en verde. Ves tu progreso sin pensar. */}
              <div className="flex items-center justify-center gap-0.5">
                {(() => {
                  const disponible = [...bandeja];
                  return receta.pasos.map((paso, i) => {
                    const pos = disponible.indexOf(paso);
                    const tengo = pos >= 0;
                    if (tengo) disponible.splice(pos, 1);
                    return (
                      <motion.span
                        key={`${paso}-${i}`}
                        title={ESTACIONES[paso].nombre}
                        animate={tengo ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                          tengo ? "border-[#6d8f54] bg-[#dff0d0]" : "border-transparent bg-[#f7eedd] opacity-70"
                        }`}
                      >
                        <IngGlyph id={paso} size={14} />
                      </motion.span>
                    );
                  });
                })()}
              </div>

              {/* barra de paciencia */}
              <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-[#eadcc2]">
                <motion.div
                  className={`h-full rounded-full ${urgente ? "bg-[#d64541]" : restante < 0.6 ? "bg-[#e0a03c]" : "bg-[#9caf88]"}`}
                  style={{ width: `${restante * 100}%` }}
                  animate={urgente ? { opacity: [1, 0.45, 1] } : { opacity: 1 }}
                  transition={urgente ? { duration: 0.6, repeat: Infinity } : undefined}
                />
              </div>

              {/* invitación a tocar cuando la bandeja encaja */}
              {servible && (
                <motion.span
                  className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#6d8f54] text-white shadow-lg"
                  animate={{ scale: [1, 1.18, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <Hand size={13} />
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </AnimatePresence>

      {pedidos.length === 0 && (
        <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-[#e0cdab] px-6 py-3 text-xs font-bold text-cafe-sombra/45">
          Sin clientes… ¡aprovecha y adelanta trabajo!
        </div>
      )}
    </div>
  );
}
