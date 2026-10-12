/**
 * IngredientBar — Barra de trabajo con 4 pestañas (base, leche, sirope, topping).
 * Las fichas se ARRASTRAN hasta la taza… o se tocan directamente (el mismo
 * gesto relajado funciona en celular, tablet y escritorio).
 * En vertical las fichas se muestran en una sola fila deslizable.
 */

import { useState, type RefObject } from "react";
import { motion, type PanInfo } from "framer-motion";
import { Coffee, Droplets, Milk, Sparkles } from "lucide-react";
import { INGREDIENTES_POR_CATEGORIA } from "../game/data";
import type { Accion, Categoria } from "../game/types";

export interface IngredientBarProps {
  onAgregar: (accion: Accion) => void;
  /** zona de la taza para soltar (hit-test con el punto del puntero) */
  dropRef: RefObject<HTMLDivElement | null>;
  /** true cuando ya hay 3 bases: las fichas de base se desactivan */
  basesLlenas: boolean;
  /** vertical (true): fila única · false: rejilla en columna lateral */
  horizontal: boolean;
  /** contador que aumenta al fallar: vibra la barra */
  sacudida: number;
  /** avisa mientras se arrastra (la taza se ilumina como invitación) */
  onArrastrando?: (arrastrando: boolean) => void;
}

const PESTANAS: Array<{ id: Categoria; nombre: string; Icono: typeof Coffee }> = [
  { id: "base", nombre: "Base", Icono: Coffee },
  { id: "leche", nombre: "Leche", Icono: Milk },
  { id: "sirope", nombre: "Sirope", Icono: Droplets },
  { id: "topping", nombre: "Toppings", Icono: Sparkles },
];

export function IngredientBar({ onAgregar, dropRef, basesLlenas, horizontal, sacudida, onArrastrando }: IngredientBarProps) {
  const [categoria, setCategoria] = useState<Categoria>("base");
  const ingredientes = INGREDIENTES_POR_CATEGORIA[categoria];

  /** ¿El puntero terminó dentro de la zona de la taza? */
  const cayoEnLaTaza = (info: PanInfo): boolean => {
    const r = dropRef.current?.getBoundingClientRect();
    if (!r) return false;
    return info.point.x >= r.left && info.point.x <= r.right && info.point.y >= r.top && info.point.y <= r.bottom;
  };

  return (
    <motion.section
      aria-label="Barra de ingredientes"
      /* La barra vibra cuando se rompe el combo (la bebida se conserva) */
      key={sacudida}
      animate={sacudida > 0 ? { x: [0, -9, 9, -6, 6, -2, 0] } : undefined}
      transition={{ duration: 0.42 }}
      className={`flex gap-2 rounded-3xl border border-[#ecdcbf] bg-[#fffdf6]/90 p-3 shadow-lg backdrop-blur-sm ${horizontal ? "w-full max-w-xl flex-col" : "h-full min-h-0 flex-col"}`}
    >
      {/* Pestañas */}
      <div role="tablist" aria-label="Categorías" className={`grid shrink-0 grid-cols-4 gap-1 rounded-2xl bg-[#f1e4cd] p-1 ${horizontal ? "" : ""}`}>
        {PESTANAS.map(({ id, nombre, Icono }) => {
          const activa = categoria === id;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={activa}
              onClick={() => setCategoria(id)}
              className={`flex items-center justify-center gap-1 rounded-xl px-2 py-1.5 font-display text-[11px] font-bold transition-all ${
                activa ? "bg-[#fffdf6] text-[#c96f4a] shadow-sm" : "text-cafe-sombra/60 hover:text-cafe-sombra"
              }`}
            >
              <Icono size={13} />
              <span className={horizontal ? "hidden min-[420px]:inline" : "hidden xl:inline"}>{nombre}</span>
            </button>
          );
        })}
      </div>

      {/* Fichas arrastrables (o tocables) */}
      <div
        className={
          horizontal
            ? "chip-row flex touch-pan-x gap-2 overflow-x-auto pb-1 pt-1"
            : "grid min-h-0 flex-1 auto-rows-min grid-cols-2 content-start gap-2 overflow-y-auto pt-1"
        }
      >
        {ingredientes.map((def) => {
          const deshabilitado = categoria === "base" && basesLlenas;
          return (
            <motion.button
              key={def.id}
              type="button"
              /* Arrastre con retorno elástico + toque directo (onTap no se
                 dispara tras un arrastre real: framer-motion los distingue) */
              drag={!deshabilitado}
              dragSnapToOrigin
              dragElastic={0.15}
              dragDirectionLock
              whileDrag={{ scale: 1.16, zIndex: 60, boxShadow: "0 14px 30px rgba(75,44,26,0.35)" }}
              whileTap={deshabilitado ? undefined : { scale: 0.9 }}
              onDragStart={() => onArrastrando?.(true)}
              onDragEnd={(_, info) => {
                onArrastrando?.(false);
                if (!deshabilitado && cayoEnLaTaza(info)) onAgregar({ categoria, id: def.id });
              }}
              onTap={() => {
                if (!deshabilitado) onAgregar({ categoria, id: def.id });
              }}
              disabled={deshabilitado}
              aria-label={`Añadir ${def.nombre}`}
              className={`flex shrink-0 select-none flex-col items-center justify-center gap-1 rounded-2xl border border-[#ecdcbf] bg-white/85 p-2 shadow-sm transition-colors ${
                horizontal ? "h-[74px] w-[76px]" : "min-h-[74px]"
              } ${deshabilitado ? "cursor-not-allowed opacity-35" : "cursor-grab hover:border-[#c98a4b]/60 active:cursor-grabbing"}`}
            >
              <span
                className="h-6 w-6 rounded-full border-2 border-white shadow"
                style={{ background: `linear-gradient(135deg, ${def.colorClaro}, ${def.color})` }}
              />
              <span className="text-center text-[10px] font-bold leading-tight text-cafe-sombra">{def.nombre}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
}
