/**
 * Tray — La bandeja de preparación (y zona de destino al arrastrar).
 * ------------------------------------------------------------------
 * EL ORDEN NUNCA IMPORTA. Para que eso se vea, la bandeja muestra en vivo:
 *  · El plato que estás montando (deducido automáticamente).
 *  · Huecos FANTASMA con el icono de lo que todavía falta.
 *  · Marcado en rojo lo que SOBRA (tócalo para quitarlo).
 *
 * DISTRIBUCIÓN (tres zonas de ancho estable, legibles en cualquier móvil):
 *   [ PLATO ]   [ · casillas centradas · ]   [ papelera ]
 * La etiqueta de estado FLOTA sobre el borde superior, así nunca roba
 * ancho a las casillas ni obliga a encoger los iconos.
 */

import type { RefObject } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { Trash2 } from "lucide-react";
import { MAX_BANDEJA } from "../game/balance";
import { ESTACIONES, RECETAS } from "../game/recipes";
import { useTapSinArrastre } from "../hooks/useTapSinArrastre";
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
  const { receta, faltan, sobran, completa } = analisis;
  /* Igual que en la cocina: el plato se puede tocar O arrastrar, pero
     nunca ambas cosas en el mismo gesto (si no, se servía dos veces). */
  const gesto = useTapSinArrastre();
  /* huecos realmente vacíos (ni llenos ni fantasma) */
  const vacios = Math.max(0, MAX_BANDEJA - bandeja.length - faltan.length);

  /* Medidas fluidas: las casillas crecen con la pantalla pero tienen
     topes, así nunca se desbordan en un móvil estrecho. */
  const casilla = denso
    ? "h-[clamp(34px,10vw,44px)] w-[clamp(34px,10vw,44px)]"
    : "h-[clamp(40px,11vw,56px)] w-[clamp(40px,11vw,56px)]";
  const tamIcono = denso ? 22 : 30;
  const plato = denso ? "h-[52px] w-[52px]" : "h-[clamp(60px,16vw,76px)] w-[clamp(60px,16vw,76px)]";

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
        sacudida > 0 ? { x: [0, -10, 10, -6, 6, 0] } : recibiendo ? { scale: 1.02 } : { scale: 1 }
      }
      key={sacudida}
      transition={{ duration: 0.4 }}
      className={`relative flex w-full shrink-0 items-center gap-2 rounded-2xl border-2 bg-[#fffdf6]/95 shadow-lg backdrop-blur-md transition-colors sm:gap-3 ${
        denso ? "px-2 py-1.5" : "px-2.5 py-2.5"
      } ${
        recibiendo
          ? "border-[#c98a4b] bg-[#fff6e6] shadow-[0_0_0_4px_rgba(201,138,75,0.25)]"
          : completa
            ? "border-[#6d8f54]"
            : "border-[#e0cdab]"
      }`}
    >
      {/* ESTADO: flota sobre el borde superior, no consume ancho */}
      <AnimatePresence>
        {receta && (
          <motion.span
            key={`${receta}-${completa}-${sobran.length}`}
            initial={{ opacity: 0, y: 6, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 450, damping: 24 }}
            className={`absolute -top-2.5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-0.5 font-display text-[10px] font-extrabold text-white shadow-md ${
              completa ? "bg-[#6d8f54]" : sobran.length > 0 ? "bg-[#d64541]" : "bg-[#c98a4b]"
            }`}
          >
            {completa
              ? `¡${RECETAS[receta].nombre} listo!`
              : sobran.length > 0
                ? "Quita lo marcado en rojo"
                : `${RECETAS[receta].nombre}: falta ${faltan.length}`}
          </motion.span>
        )}
      </AnimatePresence>

      {/* ZONA 1 · PLATO: tócalo o arrástralo al cliente cuando esté completo */}
      <div className={`relative flex ${plato} shrink-0 items-center justify-center rounded-xl bg-[#f7eedd]`}>
        <AnimatePresence mode="wait">
          {receta ? (
            <motion.div
              key={receta}
              drag={completa}
              dragSnapToOrigin
              dragElastic={0.1}
              whileDrag={{ scale: 1.35, zIndex: 80 }}
              onDragStart={gesto.alIniciarArrastre}
              onDragEnd={(_, info) => {
                soltarPlato(info);
                gesto.alTerminarArrastre();
              }}
              onTap={() => {
                if (!gesto.esTapLimpio()) return; // venía de un arrastre
                if (completa && servible) onServir(servible);
              }}
              initial={{ scale: 0.5, opacity: 0, rotate: -12 }}
              animate={{ scale: 1, opacity: completa ? 1 : 0.45, rotate: 0 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className={`h-full w-full touch-none ${completa ? "cursor-grab active:cursor-grabbing" : ""}`}
              aria-label={
                completa
                  ? `${RECETAS[receta].nombre} listo: tócalo o arrástralo al cliente`
                  : `Montando ${RECETAS[receta].nombre}`
              }
            >
              <DishSVG receta={receta} className="h-full w-full drop-shadow" />
            </motion.div>
          ) : (
            <motion.span
              key="vacio"
              className="px-1 text-center text-[9px] font-bold leading-tight text-cafe-sombra/40"
            >
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

      {/* ZONA 2 · CASILLAS: centradas y flexibles */}
      <div className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-1.5">
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
                className={`relative flex ${casilla} shrink-0 items-center justify-center rounded-xl border-2 shadow-sm ${
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
              className={`flex ${casilla} shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-[#c98a4b] bg-[#fff6e6]`}
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
            className={`${casilla} shrink-0 rounded-xl border-2 border-dashed`}
          />
        ))}
      </div>

      {/* ZONA 3 · ACCIONES */}
      <motion.button
        onClick={onLimpiar}
        whileTap={{ scale: 0.85 }}
        disabled={bandeja.length === 0}
        aria-label="Tirar la bandeja"
        className={`flex ${denso ? "h-9 w-9" : "h-11 w-11"} shrink-0 items-center justify-center rounded-full border border-[#ecdcbf] bg-white text-cafe-sombra shadow transition-opacity disabled:opacity-30`}
      >
        <Trash2 size={denso ? 15 : 18} />
      </motion.button>
    </motion.section>
  );
}
