/**
 * Mascot — El ratoncito barista de Ratón Café (SVG puro, con delantal y gorrito).
 * Reacciona en vivo: parpadea siempre, celebra los aciertos y se preocupa
 * cuando algo sale mal o el tiempo se agota.
 */

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import type { HumorMascota } from "../game/types";

export interface MascotProps {
  humor: HumorMascota;
  className?: string;
  /** permite acotar el tamaño desde el layout (p. ej. maxHeight) */
  style?: CSSProperties;
}

const PIEL = "#c9b8a5";
const PIEL_OSC = "#a08b73";
const ROSA = "#ecc3b8";
const TINTA = "#3a2c22";
const SALVIA = "#a7b995";
const CREMA = "#f6ead6";

export function Mascot({ humor, className, style }: MascotProps) {
  const feliz = humor === "feliz";
  const preocupado = humor === "preocupado";

  return (
    <motion.svg
      viewBox="0 0 220 232"
      className={className}
      style={style}
      role="img"
      aria-label="Ratoncito barista"
      /* Celebración y preocupación se transmiten con el cuerpo entero */
      animate={
        feliz
          ? { y: [0, -10, 0], rotate: [0, -2, 2, 0] }
          : preocupado
            ? { rotate: [-1.6, 1.6, -1.6] }
            : { y: 0, rotate: 0 }
      }
      transition={feliz ? { duration: 0.55, repeat: 2 } : preocupado ? { duration: 0.4, repeat: Infinity } : { type: "spring", stiffness: 220, damping: 16 }}
    >
      {/* Respiración suave del conjunto */}
      <motion.g
        style={{ transformOrigin: "110px 226px" }}
        animate={{ scale: [1, 1.012, 1] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Orejas grandes de ratón */}
        <circle cx={62} cy={62} r={33} fill={PIEL} stroke={PIEL_OSC} strokeWidth={4} />
        <circle cx={62} cy={62} r={19} fill={ROSA} opacity={0.9} />
        <circle cx={158} cy={62} r={33} fill={PIEL} stroke={PIEL_OSC} strokeWidth={4} />
        <circle cx={158} cy={62} r={19} fill={ROSA} opacity={0.9} />

        {/* Cuerpo con delantal verde salvia */}
        <rect x={72} y={170} width={76} height={58} rx={24} fill={SALVIA} stroke={PIEL_OSC} strokeWidth={4} />
        <line x1={92} y1={186} x2={110} y2={176} stroke={CREMA} strokeWidth={5} strokeLinecap="round" />
        <line x1={128} y1={186} x2={110} y2={176} stroke={CREMA} strokeWidth={5} strokeLinecap="round" />
        <rect x={99} y={200} width={22} height={15} rx={5} fill="none" stroke={CREMA} strokeWidth={3} />
        {/* Brazos */}
        <ellipse cx={66} cy={198} rx={11} ry={18} fill={PIEL} stroke={PIEL_OSC} strokeWidth={3.5} />
        <ellipse cx={154} cy={198} rx={11} ry={18} fill={PIEL} stroke={PIEL_OSC} strokeWidth={3.5} />

        {/* Cabeza */}
        <circle cx={110} cy={122} r={58} fill={PIEL} stroke={PIEL_OSC} strokeWidth={4} />

        {/* Gorrito de barista inclinado */}
        <g transform="rotate(-12 110 66)">
          <rect x={83} y={40} width={54} height={24} rx={9} fill={CREMA} stroke={PIEL_OSC} strokeWidth={3.5} />
          <rect x={83} y={54} width={54} height={10} rx={5} fill="#c96f4a" />
          <circle cx={110} cy={38} r={5} fill={CREMA} stroke={PIEL_OSC} strokeWidth={3} />
        </g>

        {/* Coloretes */}
        <ellipse cx={74} cy={142} rx={9.5} ry={6} fill={ROSA} opacity={0.75} />
        <ellipse cx={146} cy={142} rx={9.5} ry={6} fill={ROSA} opacity={0.75} />

        {/* Ojos (parpadean en bucle salvo que celebre) */}
        {feliz ? (
          <g stroke={TINTA} strokeWidth={4.5} strokeLinecap="round" fill="none">
            <path d="M 78 120 q 10 -10 20 0" />
            <path d="M 122 120 q 10 -10 20 0" />
          </g>
        ) : (
          <motion.g
            style={{ transformOrigin: "110px 118px" }}
            animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
            transition={{ duration: 3.8, repeat: Infinity, times: [0, 0.9, 0.94, 0.98, 1] }}
          >
            <circle cx={88} cy={118} r={preocupado ? 6.8 : 6} fill={TINTA} />
            <circle cx={132} cy={118} r={preocupado ? 6.8 : 6} fill={TINTA} />
            <circle cx={90} cy={116} r={2} fill="#ffffff" opacity={0.9} />
            <circle cx={134} cy={116} r={2} fill="#ffffff" opacity={0.9} />
          </motion.g>
        )}

        {/* Cejas de preocupación */}
        {preocupado && (
          <g stroke={TINTA} strokeWidth={3.5} strokeLinecap="round">
            <line x1={78} y1={103} x2={96} y2={108} />
            <line x1={142} y1={103} x2={124} y2={108} />
          </g>
        )}

        {/* Nariz y bigotes */}
        <ellipse cx={110} cy={136} rx={6} ry={4.6} fill="#d98f8a" />
        <g stroke={PIEL_OSC} strokeWidth={2} strokeLinecap="round" opacity={0.9}>
          <line x1={58} y1={134} x2={86} y2={138} />
          <line x1={58} y1={144} x2={86} y2={141} />
          <line x1={162} y1={134} x2={134} y2={138} />
          <line x1={162} y1={144} x2={134} y2={141} />
        </g>

        {/* Boca según el humor */}
        {feliz ? (
          <g>
            <path d="M 95 146 Q 110 164 125 146 Z" fill="#8f4a3a" />
            <ellipse cx={110} cy={153.5} rx={6} ry={3.4} fill="#e28574" />
          </g>
        ) : preocupado ? (
          <path d="M 98 152 q 5 -4.5 10 0 q 6 4.5 14 0" fill="none" stroke={TINTA} strokeWidth={3.5} strokeLinecap="round" />
        ) : (
          <path d="M 99 147 q 11 8 22 0" fill="none" stroke={TINTA} strokeWidth={3.5} strokeLinecap="round" />
        )}
      </motion.g>
    </motion.svg>
  );
}
