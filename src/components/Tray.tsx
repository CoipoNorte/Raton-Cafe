/**
 * Tray — La bandeja de preparación (y zona de destino al arrastrar).
 * ------------------------------------------------------------------
 * EL ORDEN NUNCA IMPORTA. Para que eso se vea, la bandeja muestra en vivo:
 *  · El plato que estás montando (deducido automáticamente).
 *  · Huecos FANTASMA con el icono de lo que todavía falta.
 *  · Marcado en rojo lo que SOBRA (tócalo para quitarlo).
 * Cuando está completo, el plato se puede tocar o arrastrar al cliente.
 */

import type { RefObject } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { Trash2 } from "lucide-react";
import { MAX_BANDEJA } from "../game/balance";
import { ESTACIONES, RECETAS } from "../game/recipes";
import type { AnalisisBandeja } from "../game/logic";
import type { IngredienteId, Pedido } from "../game/types";
import { DishSVG, IngGlyph } from "./Art";

export interface TrayProps {
  bandeja: IngredienteId[];
  /** análisis en vivo: qué plato montas, qué falta y qué sobra */
  analisis: AnalisisBandeja;
  onLimpiar: () => void;
  /** quitar un ingrediente concreto (toque sobre su casilla) */
  onQuitar: (indice: number) => void;
  /** devuelve el pedido que haya bajo esas coordenadas de pantalla */
  buscarPedidoEn: (x: number, y: number) => Pedido | null;
  onServir: (pedido: Pedido) => void;
  /** pedido al que le encaja la bandeja (para servir con un toque) */
  servible: Pedido | null;
  /** contador que sube al fallar: sacude la bandeja */
  sacudida: number;
  /** true mientras arrastras algo desde la cocina: la bandeja se ilumina */
  recibiendo?: boolean;
  trayRef: RefObject<HTMLElement | null>;
  denso?: boolean;
}

export function Tray({
  bandeja, analisis, onLimpiar, onQuitar, buscarPedidoEn, onServir, servible,
  sacudida, recibiendo = false, trayRef, denso = false,
}: TrayProps) {
  const casilla = denso ? "h-10 w-10" : "h-13 w-13";
  const tamIcono = denso ? 23 : 30;
  const { receta, faltan, sobran, completa } = analisis;
  /* huecos realmente vacíos (ni llenos ni fantasma) */
  const vacios = Math.max(0, MAX_BANDEJA - bandeja.length - faltan.length);

  /** Al soltar el plato: ¿cayó sobre algún cliente? */
  const soltarPlato = (info: PanInfo) => {
    const pedido = buscarPedidoEn(info.point.x, info.point.y);
    if (pedido) onServir(pedido);
  };

  return (
    <motion.section
      ref={trayRef as RefObject<HTMLElement> & ((el: HTMLElement | null) => void)}
      aria-label="Bandeja de preparación"
      animate={
        sacudida > 0 ? { x: [0, -10, 10, -6, 6, 0] } : recibiendo ? { scale: 1.03 } : { scale: 1 }
      }
      key={sacudida}
      transition={{ duration: 0.4 }}
      className={`flex items-center gap-2 rounded-2xl border-2 bg-[#fffdf6]/95 px-2.5 shadow-lg backdrop-blur-md transition-colors ${denso ? "py-1.5" : "py-2"} ${
        recibiendo
          ? "border-[#c98a4b] bg-[#fff6e6] shadow-[0_0_0_4px_rgba(201,138,75,0.25)]"
          : completa
            ? "border-[#6d8f54]"
            : "border-[#e0cdab]"
      }`}
    >
      {/* PLATO: tócalo o arrástralo al cliente cuando esté completo */}
      <div className={`relative flex ${denso ? "h-12 w-12" : "h-16 w-16"} shrink-0 items-center justify-center rounded-xl bg-[#f7eedd]`}>
        <AnimatePresence mode="wait">
          {receta ? (
            <motion.div
              key={receta}
              drag={completa}
              dragSnapToOrigin
              dragElastic={0.1}
              whileDrag={{ scale: 1.35, zIndex: 80 }}
              onDragEnd={(_, info) => soltarPlato(info)}
              onTap={() => {
                if (completa && servible) onServir(servible);
              }}
              initial={{ scale: 0.5, opacity: 0, rotate: -12 }}
              animate={{ scale: 1, opacity: completa ? 1 : 0.45, rotate: 0 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className={`h-full w-full touch-none ${completa ? "cursor-grab" : ""}`}
              aria-label={
                completa
                  ? `${RECETAS[receta].nombre} listo: tócalo o arrástralo al cliente`
                  : `Montando ${RECETAS[receta].nombre}`
              }
            >
              <DishSVG receta={receta} className="h-full w-full drop-shadow" />
            </motion.div>
          ) : (
            <motion.span key="vacio" className="px-1 text-center text-[9px] font-bold leading-tight text-cafe-sombra/40">
              suelta aquí
            </motion.span>
          )}
        </AnimatePresence>
        {completa && (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-xl border-2 border-[#6d8f54]"
            animate={{ opacity: [0.85, 0.15, 0.85], scale: [1, 1.08, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}
      </div>

      {/* Casillas: lo que llevas · lo que falta (fantasma) · huecos */}
      <div className="flex flex-1 flex-wrap items-center gap-1.5">
        <AnimatePresence mode="popLayout">
          {bandeja.map((ing, i) => {
            const estorba = sobran.includes(i);
            return (
              <motion.button
                key={`${ing}-${i}`}
                layout
                onClick={() => onQuitar(i)}
                initial={{ scale: 0.3, opacity: 0, y: -16 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.4, opacity: 0, y: 10 }}
                whileTap={{ scale: 0.85 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                title={`${ESTACIONES[ing].nombre}${estorba ? " (sobra: toca para quitar)" : ""}`}
                aria-label={`${ESTACIONES[ing].nombre}${estorba ? ", sobra. " : ". "}Toca para quitar`}
                className={`relative flex ${casilla} items-center justify-center rounded-xl border-2 shadow-sm ${
                  estorba ? "border-[#d64541] bg-[#fdeceb]" : "border-[#9caf88] bg-white"
                }`}
              >
                <IngGlyph id={ing} size={tamIcono} />
                {estorba && (
                  <motion.span
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#d64541] text-[10px] font-extrabold leading-none text-white"
                  >
                    ×
                  </motion.span>
                )}
              </motion.button>
            );
          })}

          {/* FANTASMAS: lo que falta para completar el plato */}
          {faltan.map((ing, i) => (
            <motion.span
              key={`falta-${ing}-${i}`}
              layout
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              title={`Falta: ${ESTACIONES[ing].nombre}`}
              aria-label={`Falta ${ESTACIONES[ing].nombre}`}
              className={`flex ${casilla} items-center justify-center rounded-xl border-2 border-dashed border-[#c98a4b] bg-[#fff6e6]`}
            >
              <motion.span
                animate={{ opacity: [0.35, 0.85, 0.35] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
              >
                <IngGlyph id={ing} size={tamIcono} />
              </motion.span>
            </motion.span>
          ))}
        </AnimatePresence>

        {Array.from({ length: vacios }, (_, i) => (
          <motion.span
            key={`hueco-${i}`}
            animate={recibiendo ? { borderColor: "#c98a4b", scale: 1.06 } : { borderColor: "#e4d4b8", scale: 1 }}
            className={`${casilla} rounded-xl border-2 border-dashed`}
          />
        ))}
      </div>

      {/* Nombre del plato / aviso + botón tirar */}
      <div className="flex shrink-0 flex-col items-center gap-1">
        {receta && (
          <motion.span
            key={`${receta}-${completa}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`whitespace-nowrap rounded-full px-2 py-0.5 font-display text-[10px] font-extrabold text-white ${
              completa ? "bg-[#6d8f54]" : sobran.length > 0 ? "bg-[#d64541]" : "bg-[#c98a4b]"
            }`}
          >
            {completa
              ? `¡${RECETAS[receta].nombre}!`
              : sobran.length > 0
                ? "Quita lo rojo"
                : `Falta ${faltan.length}`}
          </motion.span>
        )}
        <motion.button
          onClick={onLimpiar}
          whileTap={{ scale: 0.85 }}
          disabled={bandeja.length === 0}
          aria-label="Tirar la bandeja"
          className={`flex ${denso ? "h-8 w-8" : "h-9 w-9"} items-center justify-center rounded-full border border-[#ecdcbf] bg-white text-cafe-sombra shadow transition-opacity disabled:opacity-30`}
        >
          <Trash2 size={15} />
        </motion.button>
      </div>
    </motion.section>
  );
}
