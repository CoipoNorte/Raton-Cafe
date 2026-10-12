/**
 * Ticket — El pedido del cliente.
 * Usa el MISMO motor de dibujo (CupSVG) que la taza real, con la variante
 * "ticket": encuadre recortado a la taza sobre una zona de exhibición clara
 * con sombra suave → la referencia se ve grande y nítida siempre.
 */

import { BASES, LECHES, SIROPES, TOPPINGS } from "../game/data";
import type { Pedido } from "../game/types";
import { CupSVG } from "./CupSVG";

export interface TicketProps {
  pedido: Pedido;
  /** compacto = barra horizontal para celular en vertical */
  compacto?: boolean;
}

interface LineaPedido {
  id: string;
  nombre: string;
  color: string;
  cantidad: number;
}

/** Resume la bebida objetivo en líneas "nombre × n" agrupadas por categoría. */
function resumir(pedido: Pedido): LineaPedido[] {
  const lineas: LineaPedido[] = [];
  const agregar = (id: string, nombre: string, color: string, n: number) => {
    if (n > 0) lineas.push({ id, nombre, color, cantidad: n });
  };
  (Object.keys(BASES) as Array<keyof typeof BASES>).forEach((id) =>
    agregar(id, BASES[id].nombre, BASES[id].color, pedido.bebida.bases.filter((b) => b === id).length),
  );
  if (pedido.bebida.leche) {
    const l = LECHES[pedido.bebida.leche];
    lineas.push({ id: l.id, nombre: `Leche ${l.nombre.toLowerCase()}`, color: l.color, cantidad: 1 });
  }
  (Object.keys(SIROPES) as Array<keyof typeof SIROPES>).forEach((id) =>
    agregar(id, SIROPES[id].nombre, SIROPES[id].color, pedido.bebida.siropes.filter((s) => s === id).length),
  );
  (Object.keys(TOPPINGS) as Array<keyof typeof TOPPINGS>).forEach((id) =>
    agregar(id, TOPPINGS[id].nombre, TOPPINGS[id].color, pedido.bebida.toppings.filter((t) => t === id).length),
  );
  return lineas;
}

function Chips({ lineas, mini = false }: { lineas: LineaPedido[]; mini?: boolean }) {
  return (
    <ul className={`flex flex-wrap gap-1 ${mini ? "text-[10px]" : "text-[11px]"}`}>
      {lineas.map((l) => (
        <li
          key={l.id}
          className={`flex items-center gap-1 rounded-full border border-[#ecdcbf] bg-white/80 font-semibold text-cafe-sombra ${mini ? "px-1.5 py-[1px]" : "px-2 py-0.5"}`}
        >
          <span className="h-2 w-2 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: l.color }} />
          {l.nombre}
          {l.cantidad > 1 && <b className="text-[#c96f4a]">×{l.cantidad}</b>}
        </li>
      ))}
    </ul>
  );
}

export function Ticket({ pedido, compacto = false }: TicketProps) {
  const lineas = resumir(pedido);

  if (compacto) {
    /* Barra horizontal compacta (celular en vertical) */
    return (
      <section aria-label="Pedido actual" className="mx-auto flex w-full max-w-xl items-center gap-3 rounded-2xl border border-[#ecdcbf] bg-[#fffdf6]/90 px-3 py-2 shadow-md backdrop-blur-sm">
        <div className="flex h-20 w-14 shrink-0 items-center justify-center rounded-xl bg-[#fff8ea] shadow-inner">
          <CupSVG bebida={pedido.bebida} variante="ticket" className="h-full w-full" />
        </div>
        <div className="min-w-0 flex-1">
          <header className="mb-1 flex items-baseline gap-2">
            <h2 className="font-display text-xs font-extrabold uppercase tracking-wide text-[#c96f4a]">Pedido</h2>
            <span className="truncate text-xs font-semibold text-cafe-sombra">
              de {pedido.cliente} · #{pedido.id}
            </span>
          </header>
          {/* Si el pedido crece mucho (dificultad alta), las fichas hacen
              scroll discreto sin robar altura a la taza */}
          <div className="max-h-[66px] overflow-y-auto">
            <Chips lineas={lineas} mini />
          </div>
        </div>
      </section>
    );
  }

  /* Tarjeta vertical (escritorio / tablet / horizontal) */
  return (
    <section aria-label="Pedido actual" className="flex h-full min-h-0 flex-col gap-3 rounded-3xl border border-[#ecdcbf] bg-[#fffdf6]/95 p-4 shadow-lg">
      <header className="flex items-baseline justify-between gap-2">
        <h2 className="font-display text-sm font-extrabold uppercase tracking-widest text-[#c96f4a]">Ticket de pedido</h2>
        <span className="text-xs font-semibold text-cafe-sombra/70">
          {pedido.cliente} · #{pedido.id}
        </span>
      </header>

      {/* Zona de exhibición: la referencia llena el marco y se recorta a la taza */}
      <div className="flex min-h-0 flex-1 items-center justify-center rounded-2xl bg-gradient-to-b from-[#fffaf0] to-[#fbeed7] p-2 shadow-inner">
        <CupSVG bebida={pedido.bebida} variante="ticket" className="h-full max-h-full w-auto drop-shadow-sm" />
      </div>

      <Chips lineas={lineas} />
    </section>
  );
}
