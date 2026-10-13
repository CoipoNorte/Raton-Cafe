/**
 * Art.tsx — Todo el arte del juego, dibujado en SVG (cero imágenes).
 * ------------------------------------------------------------------
 *  · DishSVG: los 5 productos de la carta, grandes y apetecibles.
 *  · IngGlyph: icono pequeño de cada ingrediente (estaciones y bandeja).
 * Mismo motor para el pedido del cliente y para lo que preparas: lo que
 * ves en el ticket es exactamente lo que vas a servir.
 */

import type { ReactNode } from "react";
import type { IngredienteId, RecetaId } from "../game/types";

/* ================================================================== */
/*  PLATOS (viewBox 0 0 100 100)                                       */
/* ================================================================== */

/* --- Taza reutilizable para capuchino y mokachino --- */
const CUERPO = "M26 40 L30 80 Q31 87 39 87 H61 Q69 87 70 80 L74 40 Z";

function Taza({ extras, conChocolate = false }: { extras?: ReactNode; conChocolate?: boolean }) {
  return (
    <>
      {/* platillo */}
      <ellipse cx={50} cy={90} rx={34} ry={6} fill="#e6d2b6" />
      <ellipse cx={50} cy={88} rx={34} ry={6} fill="#f6ead6" stroke="#dcc5a4" strokeWidth={1.5} />
      {/* asa */}
      <path d="M72 50 C86 50 88 68 74 70" fill="none" stroke="#e3d3bd" strokeWidth={6} strokeLinecap="round" />
      {/* cuerpo */}
      <path d={CUERPO} fill="#fffdf8" stroke="#e3d3bd" strokeWidth={2.5} strokeLinejoin="round" />
      {/* contenido recortado al interior */}
      <clipPath id={conChocolate ? "cl-moka" : "cl-capu"}>
        <path d={CUERPO} />
      </clipPath>
      <g clipPath={`url(#${conChocolate ? "cl-moka" : "cl-capu"})`}>
        {/* café */}
        <path d="M26 56 H74 L70 88 H30 Z" fill="#4a2c1a" />
        {/* leche */}
        <path d="M26 41 H74 L73 57 H27 Z" fill="#f0dcb8" />
        {conChocolate && <path d="M26 52 H74 L73 58 H27 Z" fill="#5b2e13" opacity={0.85} />}
        {/* espuma */}
        <ellipse cx={50} cy={42} rx={23} ry={5.5} fill="#fff8ec" />
      </g>
      {extras}
      {/* brillo del borde */}
      <path d="M28 44 L31 72" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" opacity={0.7} />
    </>
  );
}

function Capuchino() {
  return (
    <Taza
      extras={
        /* corazón de arte latte */
        <path
          d="M50 38 C48 34 42 33 40 36.5 C37.5 41 43 45.5 50 50 C57 45.5 62.5 41 60 36.5 C58 33 52 34 50 38 Z"
          fill="#c89a63"
          opacity={0.85}
        />
      }
    />
  );
}

function Mokachino() {
  return (
    <Taza
      conChocolate
      extras={
        <>
          {/* montaña de crema batida */}
          <g>
            <circle cx={40} cy={36} r={9} fill="#fffdf8" stroke="#ecdcc4" strokeWidth={1.4} />
            <circle cx={60} cy={36} r={9} fill="#fffdf8" stroke="#ecdcc4" strokeWidth={1.4} />
            <circle cx={50} cy={29} r={10} fill="#fffdf8" stroke="#ecdcc4" strokeWidth={1.4} />
            <circle cx={50} cy={20} r={6} fill="#fffdf8" stroke="#ecdcc4" strokeWidth={1.4} />
          </g>
          {/* hilo de chocolate */}
          <path d="M38 28 q 6 6 12 0 q 6 -6 12 2" fill="none" stroke="#4a2410" strokeWidth={2.6} strokeLinecap="round" />
          <circle cx={50} cy={14} r={2.6} fill="#4a2410" />
        </>
      }
    />
  );
}

function Sandwich() {
  return (
    <>
      <ellipse cx={50} cy={86} rx={36} ry={6} fill="#f6ead6" stroke="#dcc5a4" strokeWidth={1.5} />
      {/* mitad trasera */}
      <g transform="translate(-16 6) rotate(-8 50 60)" opacity={0.95}>
        <path d="M22 78 L50 30 L78 78 Z" fill="#e8bd7a" stroke="#c8954f" strokeWidth={2.5} strokeLinejoin="round" />
      </g>
      {/* mitad delantera, con relleno */}
      <clipPath id="cl-sand">
        <path d="M22 78 L50 28 L78 78 Z" />
      </clipPath>
      <path d="M22 78 L50 28 L78 78 Z" fill="#f0cc92" stroke="#c8954f" strokeWidth={2.5} strokeLinejoin="round" />
      <g clipPath="url(#cl-sand)">
        {/* queso */}
        <path d="M10 56 q 10 -5 20 0 t 20 0 t 20 0 t 20 0 V 64 H10 Z" fill="#f3c644" />
        {/* jamón */}
        <path d="M10 63 q 10 5 20 0 t 20 0 t 20 0 t 20 0 V 71 H10 Z" fill="#e8957f" />
        {/* lechuga */}
        <path d="M10 70 q 8 -4 16 1 t 16 -1 t 16 1 t 16 -1 V 76 H10 Z" fill="#8fb46a" />
        {/* miga tostada */}
        <path d="M50 28 L78 78 H22 Z" fill="none" stroke="#d9a85f" strokeWidth={1.2} opacity={0.5} />
      </g>
      {/* semillas del pan */}
      <circle cx={46} cy={44} r={1.6} fill="#c8954f" />
      <circle cx={56} cy={52} r={1.6} fill="#c8954f" />
      <circle cx={40} cy={56} r={1.6} fill="#c8954f" />
    </>
  );
}

function Pastel() {
  return (
    <>
      <ellipse cx={50} cy={86} rx={36} ry={6} fill="#f6ead6" stroke="#dcc5a4" strokeWidth={1.5} />
      <clipPath id="cl-cake">
        <path d="M20 82 L34 36 H80 V82 Z" />
      </clipPath>
      <path d="M20 82 L34 36 H80 V82 Z" fill="#edd0a0" stroke="#cda471" strokeWidth={2.5} strokeLinejoin="round" />
      <g clipPath="url(#cl-cake)">
        {/* capas de bizcocho y crema */}
        <rect x={10} y={46} width={90} height={9} fill="#fff4e2" />
        <rect x={10} y={62} width={90} height={9} fill="#f7d9dd" />
        <rect x={10} y={36} width={90} height={10} fill="#e8bd8a" />
      </g>
      {/* cobertura superior */}
      <path d="M34 36 H80 V30 Q57 24 34 30 Z" fill="#f2b8c3" stroke="#dc9aa8" strokeWidth={2} strokeLinejoin="round" />
      {/* dollop de crema + cereza */}
      <circle cx={62} cy={25} r={8} fill="#fffdf8" stroke="#ecdcc4" strokeWidth={1.4} />
      <circle cx={62} cy={16} r={5.5} fill="#d1495b" />
      <path d="M62 11 q 4 -5 8 -4" fill="none" stroke="#6d8f54" strokeWidth={2} strokeLinecap="round" />
    </>
  );
}

function PieLimon() {
  return (
    <>
      <ellipse cx={50} cy={86} rx={36} ry={6} fill="#f6ead6" stroke="#dcc5a4" strokeWidth={1.5} />
      <clipPath id="cl-pie">
        <path d="M20 82 L32 40 H80 V82 Z" />
      </clipPath>
      <path d="M20 82 L32 40 H80 V82 Z" fill="#f2d64a" stroke="#cfae2e" strokeWidth={2.5} strokeLinejoin="round" />
      <g clipPath="url(#cl-pie)">
        {/* base de galleta */}
        <rect x={10} y={70} width={90} height={14} fill="#c89050" />
        <rect x={10} y={67} width={90} height={4} fill="#b17c40" />
        {/* brillo del relleno */}
        <ellipse cx={46} cy={52} rx={12} ry={5} fill="#f8e68a" opacity={0.7} />
      </g>
      {/* merengue con picos tostados */}
      <path
        d="M30 42 q 5 -14 11 -2 q 5 -14 10 -1 q 6 -13 11 -1 q 6 -12 11 0 q 3 4 7 3 V 40 H30 Z"
        fill="#fffaf0"
        stroke="#ead9bd"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <path d="M41 32 q 1 3 2 5" stroke="#e0ab63" strokeWidth={2.4} strokeLinecap="round" fill="none" />
      <path d="M62 31 q 1 3 2 5" stroke="#e0ab63" strokeWidth={2.4} strokeLinecap="round" fill="none" />
      {/* rodajita de limón */}
      <circle cx={70} cy={60} r={7} fill="#fdf0a8" stroke="#dcb52f" strokeWidth={1.6} />
      <path d="M70 53.5 V66.5 M63.5 60 H76.5" stroke="#dcb52f" strokeWidth={1.2} />
    </>
  );
}

const PLATOS: Record<RecetaId, () => ReactNode> = {
  capuchino: Capuchino,
  mokachino: Mokachino,
  sandwich: Sandwich,
  pastel: Pastel,
  pieLimon: PieLimon,
};

export function DishSVG({ receta, className }: { receta: RecetaId; className?: string }) {
  const Plato = PLATOS[receta];
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <Plato />
    </svg>
  );
}

/* ================================================================== */
/*  ICONOS DE INGREDIENTE (viewBox 0 0 24 24)                          */
/* ================================================================== */

function Forma({ id }: { id: IngredienteId }) {
  switch (id) {
    case "espresso":
      return (
        <>
          <path d="M5 8 h12 l-1.6 10 a2 2 0 0 1 -2 1.6 H8.6 a2 2 0 0 1 -2-1.6 Z" fill="#fffdf8" stroke="#8a6a46" strokeWidth={1.4} />
          <path d="M5.9 11 h10.2 l-1.1 7 H7 Z" fill="#4a2c1a" />
          <path d="M17 10 c3 0 3.4 4 .6 4.6" fill="none" stroke="#8a6a46" strokeWidth={1.4} />
        </>
      );
    case "lecheVapor":
      return (
        <>
          <path d="M6 9 h9 v8 a3 3 0 0 1 -3 3 H9 a3 3 0 0 1 -3-3 Z" fill="#f3e2c2" stroke="#b89a6e" strokeWidth={1.4} />
          <path d="M15 11 l4 -2 v4 Z" fill="#d9c3a5" stroke="#b89a6e" strokeWidth={1.2} strokeLinejoin="round" />
          <ellipse cx={10.5} cy={9} rx={4.5} ry={1.6} fill="#fffaf0" />
          <path d="M8 5.5 q -1.6 -2 0 -3.5 M12.5 5.5 q -1.6 -2 0 -3.5" fill="none" stroke="#cbb79a" strokeWidth={1.4} strokeLinecap="round" />
        </>
      );
    case "chocolate":
      return (
        <>
          <rect x={4} y={5} width={16} height={14} rx={2} fill="#5b2e13" />
          <path d="M12 5 v14 M4 12 h16" stroke="#8a5330" strokeWidth={1.4} />
          <path d="M4 7 l16 -2 v3 L4 10 Z" fill="#7a4523" opacity={0.6} />
        </>
      );
    case "cremaBatida":
      return (
        <>
          <circle cx={8} cy={16} r={4.6} fill="#fffdf8" stroke="#ddc9ab" strokeWidth={1.2} />
          <circle cx={16} cy={16} r={4.6} fill="#fffdf8" stroke="#ddc9ab" strokeWidth={1.2} />
          <circle cx={12} cy={11} r={5} fill="#fffdf8" stroke="#ddc9ab" strokeWidth={1.2} />
          <circle cx={12} cy={5.5} r={3} fill="#fffdf8" stroke="#ddc9ab" strokeWidth={1.2} />
        </>
      );
    case "panTostado":
      return (
        <>
          <path d="M5 9 a3.5 3.5 0 0 1 3.5-4 h7 A3.5 3.5 0 0 1 19 9 v9 a2 2 0 0 1 -2 2 H7 a2 2 0 0 1 -2-2 Z" fill="#e8bd7a" stroke="#c8954f" strokeWidth={1.4} />
          <path d="M8 11 h8 v6 H8 Z" fill="#d9a05b" opacity={0.65} />
        </>
      );
    case "jamonQueso":
      return (
        <>
          <path d="M3 13 q 5 -3 9 0 t 9 0 v3 q -4 3 -9 0 t -9 0 Z" fill="#f3c644" stroke="#d6a81f" strokeWidth={1.1} />
          <path d="M3 16.5 q 5 3 9 0 t 9 0 v3 q -4 3 -9 0 t -9 0 Z" fill="#e8957f" stroke="#cf7060" strokeWidth={1.1} />
          <path d="M4 10.5 h16 l-1.5 -4 h-13 Z" fill="#e8bd7a" stroke="#c8954f" strokeWidth={1.2} strokeLinejoin="round" />
        </>
      );
    case "rebanadaPastel":
      return (
        <>
          <path d="M4 19 L8 8 h11 v11 Z" fill="#edd0a0" stroke="#cda471" strokeWidth={1.3} strokeLinejoin="round" />
          <path d="M6.6 13 h12.4 v3 H5.5 Z" fill="#f7d9dd" />
          <path d="M8 8 h11 v-2 q -6 -2 -11 0 Z" fill="#f2b8c3" stroke="#dc9aa8" strokeWidth={1.1} strokeLinejoin="round" />
          <circle cx={15} cy={4} r={2.4} fill="#d1495b" />
        </>
      );
    case "rebanadaPie":
      return (
        <>
          <path d="M4 19 L8 9 h11 v10 Z" fill="#f2d64a" stroke="#cfae2e" strokeWidth={1.3} strokeLinejoin="round" />
          <path d="M5.2 16 h13.8 v3 H4.4 Z" fill="#c89050" />
          <circle cx={15.5} cy={13} r={2.6} fill="#fdf0a8" stroke="#dcb52f" strokeWidth={1} />
        </>
      );
    case "merengue":
      return (
        <>
          <path d="M3 18 q 3 -11 6 -2 q 3 -11 6 -2 q 3 -10 6 -1 v5 H3 Z" fill="#fffaf0" stroke="#e0cdae" strokeWidth={1.3} strokeLinejoin="round" />
          <path d="M9 8 v2 M15 8 v2" stroke="#e0ab63" strokeWidth={1.6} strokeLinecap="round" />
        </>
      );
  }
}

export function IngGlyph({ id, size = 24, className }: { id: IngredienteId; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <Forma id={id} />
    </svg>
  );
}
