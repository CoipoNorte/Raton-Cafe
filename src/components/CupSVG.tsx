/**
 * CupSVG — Motor de dibujo procedimental de bebidas (100 % SVG, cero imágenes).
 * ------------------------------------------------------------------
 * MISMO motor para el ticket (referencia) y la taza real del jugador:
 * si coincide aquí, coincide allá. Dos variantes:
 *   - "escena": con plato, vapor animado y goteo de sirope al verter.
 *   - "ticket": encuadre recortado justo alrededor de la taza, sin decoración,
 *     para que la referencia se vea grande y nítida.
 */

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { BASES, LECHES, SIROPES, TOPPINGS, mezclarHex, prng } from "../game/data";
import type { Bebida } from "../game/types";

/* ------------------------------------------------------------------ */
/* Geometría del vaso (sistema de coordenadas de 240 × 300)            */
/* ------------------------------------------------------------------ */

const Y_TOP = 122; // boca interior del vaso
const Y_BOT = 246; // fondo interior
const XLT = 78, XLB = 84; // borde izquierdo: arriba / abajo
const XRT = 162, XRB = 156; // borde derecho: arriba / abajo
const H_BASE = 30; // alto de cada capa de espresso
const H_LECHE = 16; // alto de la capa de leche

/** Interpola el ancho del vaso (trapecio) para una altura dada. */
const tDe = (y: number) => Math.min(1, Math.max(0, (y - Y_TOP) / (Y_BOT - Y_TOP)));
const xIzq = (y: number) => XLT + tDe(y) * (XLB - XLT);
const xDer = (y: number) => XRT + tDe(y) * (XRB - XRT);

/** Trapecio redondeado entre dos alturas (una "capa" de líquido). */
function capaPath(y1: number, y2: number): string {
  return `M ${xIzq(y1)} ${y1} L ${xDer(y1)} ${y1} L ${xDer(y2)} ${y2} L ${xIzq(y2)} ${y2} Z`;
}

export interface CupSVGProps {
  bebida: Bebida;
  variante?: "escena" | "ticket";
  /** vapor animado en bucle (solo si la bebida está caliente) */
  vapor?: boolean;
  /** pulso de goteo al añadir un sirope: { clave única, color del sirope } */
  vertido?: { clave: number; color: string } | null;
  className?: string;
}

export function CupSVG({ bebida, variante = "escena", vapor = true, vertido = null, className }: CupSVGProps) {
  const enTicket = variante === "ticket";
  const hayBebida = bebida.bases.length > 0;

  /* ---------------- Capas de líquido (de abajo hacia arriba) ------- */
  const capas: ReactNode[] = [];
  let y = Y_BOT - 1;
  bebida.bases.forEach((baseId, i) => {
    const y1 = y - H_BASE;
    const def = BASES[baseId];
    // Si hay leche, las bases se aclaran ligeramente (el barista remueve).
    const relleno = bebida.leche ? mezclarHex(def.color, LECHES[bebida.leche].color, 0.18) : def.color;
    const brillo = mezclarHex(relleno, "#ffffff", 0.22);
    capas.push(
      <g key={`base-${i}`}>
        <path d={capaPath(y1, y)} fill={relleno} />
        {/* brillo superior de cada capa para leer el apilado */}
        <line x1={xIzq(y1) + 3} y1={y1 + 1.5} x2={xDer(y1) - 3} y2={y1 + 1.5} stroke={brillo} strokeWidth={2.5} strokeLinecap="round" opacity={0.7} />
      </g>,
    );
    y = y1;
  });
  if (bebida.leche) {
    const def = LECHES[bebida.leche];
    const y1 = y - H_LECHE;
    capas.push(
      <g key="leche">
        <path d={capaPath(y1, y)} fill={def.color} />
        <path d={capaPath(y1, y1 + 5)} fill={def.colorClaro} opacity={0.9} />
      </g>,
    );
    y = y1;
  }
  const ySup = y; // superficie del líquido (aquí vive el arte latte)
  const anchoSup = xDer(ySup) - xIzq(ySup);

  /* ---------------- Superficie: crema de espresso o espuma de leche - */
  let superficie: ReactNode = null;
  if (hayBebida) {
    if (bebida.leche) {
      superficie = (
        <>
          <ellipse cx={120} cy={ySup} rx={anchoSup / 2 - 2} ry={6.5} fill={mezclarHex(LECHES[bebida.leche].color, "#ffffff", 0.4)} />
          <ellipse cx={120} cy={ySup} rx={anchoSup / 2 - 8} ry={4} fill={mezclarHex(LECHES[bebida.leche].color, "#ffffff", 0.6)} opacity={0.8} />
        </>
      );
    } else {
      const ultima = BASES[bebida.bases[bebida.bases.length - 1]];
      superficie = (
        <ellipse cx={120} cy={ySup + 1} rx={anchoSup / 2 - 2} ry={4.5} fill={mezclarHex(ultima.colorClaro, "#e5b478", 0.5)} opacity={0.9} />
      );
    }
  }

  /* ---------------- Sirope: hilos ondulados con goteo descendiendo --- */
  const azarSirope = prng(bebida.siropes.length * 31 + 7);
  const siropes = bebida.siropes.map((s, i) => {
    const def = SIROPES[s];
    const x0 = xIzq(ySup) + 7;
    const x1 = xDer(ySup) - 7;
    const yo = ySup + 2 + i * 1.6;
    const goteos = [0.22, 0.52, 0.8].map((f, k) => {
      const gx = x0 + (x1 - x0) * (f + (azarSirope() - 0.5) * 0.12);
      const largo = 7 + azarSirope() * 9;
      return <line key={k} x1={gx} y1={yo} x2={gx} y2={yo + largo} stroke={def.color} strokeWidth={3} strokeLinecap="round" opacity={0.9} />;
    });
    return (
      <g key={`sirope-${i}`}>
        <path
          d={`M ${x0} ${yo} q 7 -5 14 0 t 14 0 t 14 0 t 14 0 t 14 0`}
          fill="none"
          stroke={def.color}
          strokeWidth={3.4}
          strokeLinecap="round"
        />
        {goteos}
        {x1 - x0 > 68 && <path d={`M ${x0 + 3} ${yo + 3.5} q 7 -4 14 0 t 14 0 t 14 0`} fill="none" stroke={def.colorClaro} strokeWidth={2} opacity={0.55} strokeLinecap="round" />}
      </g>
    );
  });

  /* ---------------- Toppings ------------------------------------------ */
  const toppings: ReactNode[] = [];
  const contarPrevio = (id: string, idx: number) => bebida.toppings.slice(0, idx).filter((t) => t === id).length;
  bebida.toppings.forEach((top, idx) => {
    const vez = contarPrevio(top, idx); // 0 = primera vez, 1 = segunda (×2)
    switch (top) {
      case "arteCorazon": {
        toppings.push(
          <g key={`t${idx}`} transform={`translate(120 ${ySup - 2}) scale(0.85)`}>
            <path d="M0,3 C-2,-3 -9,-5 -12,-1 C-16,4 -9,10 0,16 C9,10 16,4 12,-1 C9,-5 2,-3 0,3 Z"
              fill={TOPPINGS.arteCorazon.color} stroke={mezclarHex(LECHES[bebida.leche ?? "entera"].color, "#d9b98c", 0.5)} strokeWidth={1.4} />
          </g>,
        );
        break;
      }
      case "arteRoseta": {
        const chevrones = [0, 1, 2, 3, 4].map((k) => {
          const w = 15 - k * 2.6;
          const yy = ySup + 5 - k * 3.2;
          return <path key={k} d={`M ${120 - w} ${yy} L 120 ${yy + 7} L ${120 + w} ${yy}`} fill="none" stroke={TOPPINGS.arteRoseta.color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />;
        });
        toppings.push(
          <g key={`t${idx}`}>
            {chevrones}
            <line x1={120} y1={ySup - 12} x2={120} y2={ySup + 10} stroke={TOPPINGS.arteRoseta.color} strokeWidth={2.4} strokeLinecap="round" />
          </g>,
        );
        break;
      }
      case "cremaBatida": {
        const subir = vez * -11; // la segunda porción corona más alto
        const bolas: Array<[number, number, number]> = [
          [-16, -3, 12], [16, -3, 12], [-8, -15, 11], [9, -15, 11], [1, -26, 9], [1, -34, 5],
        ];
        toppings.push(
          <g key={`t${idx}`}>
            {bolas.map(([dx, dy, r], k) => (
              <circle key={k} cx={120 + dx} cy={ySup + dy + subir} r={r} fill={k % 2 ? TOPPINGS.cremaBatida.colorClaro : TOPPINGS.cremaBatida.color} stroke="#ead9c2" strokeWidth={1.4} />
            ))}
          </g>,
        );
        break;
      }
      case "canela": {
        const azar = prng(100 + vez * 17);
        const puntos = Array.from({ length: 9 }, (_, k) => {
          const a = azar() * Math.PI * 2;
          const rr = Math.sqrt(azar()) * 0.8;
          return (
            <circle key={k} cx={120 + Math.cos(a) * (anchoSup / 2 - 8) * rr} cy={ySup + Math.sin(a) * 5 * rr}
              r={1.7} fill={TOPPINGS.canela.color} opacity={0.85} />
          );
        });
        toppings.push(<g key={`t${idx}`}>{puntos}</g>);
        break;
      }
      case "cacao": {
        const azar = prng(500 + vez * 23);
        const puntos = Array.from({ length: 14 }, (_, k) => {
          const a = azar() * Math.PI * 2;
          const rr = Math.sqrt(azar()) * 0.85;
          return (
            <circle key={k} cx={120 + Math.cos(a) * (anchoSup / 2 - 7) * rr} cy={ySup + Math.sin(a) * 5.5 * rr}
              r={1.15} fill={TOPPINGS.cacao.color} opacity={0.8} />
          );
        });
        toppings.push(
          <g key={`t${idx}`}>
            <ellipse cx={120} cy={ySup} rx={anchoSup / 2 - 6} ry={5.5} fill={TOPPINGS.cacao.color} opacity={0.08} />
            {puntos}
          </g>,
        );
        break;
      }
      case "malvaviscos": {
        const posiciones: Array<[number, number, number]> = [
          [104, ySup - 20, -16], [126, ySup - 18, 12], [115, ySup - 30, 4], [96, ySup - 13, -4],
        ];
        const par = posiciones.slice(vez * 2, vez * 2 + 2);
        toppings.push(
          <g key={`t${idx}`}>
            {par.map(([px, py, rot], k) => (
              <rect key={k} x={px - 8} y={py - 6} width={16} height={12} rx={5} transform={`rotate(${rot} ${px} ${py})`}
                fill={TOPPINGS.malvaviscos.color} stroke="#e5d7c0" strokeWidth={1.4} />
            ))}
          </g>,
        );
        break;
      }
      case "granoCafe": {
        toppings.push(
          <g key={`t${idx}`} transform={`translate(${112 + vez * 16} ${ySup - 12 - vez * 6}) rotate(-18)`}>
            <ellipse rx={9} ry={6} fill={TOPPINGS.granoCafe.color} />
            <path d="M -7 -2.5 C -2 1 2 1 7 2.5" fill="none" stroke={TOPPINGS.granoCafe.colorClaro} strokeWidth={2} strokeLinecap="round" />
          </g>,
        );
        break;
      }
    }
  });

  /* ---------------- Vapor animado (solo escena, bebida caliente) ----- */
  const vaporAnimado = !enTicket && vapor && hayBebida && (
    <g stroke="#ffffff" strokeWidth={5} strokeLinecap="round" fill="none">
      {[86, 120, 154].map((sx, i) => (
        <motion.path
          key={sx}
          d={`M ${sx} 98 q -9 -13 0 -26 q 9 -13 0 -26`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: [0, 0.55, 0], y: [8, -12] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.8, ease: "easeInOut" }}
        />
      ))}
    </g>
  );

  /* ---------------- Goteo al verter un sirope (feedback inmediato) --- */
  const goteoVertido = vertido && (
    <g key={vertido.clave} fill={vertido.color}>
      {[108, 121, 134].map((gx, i) => (
        <motion.circle
          key={gx}
          cx={gx}
          r={3.2}
          initial={{ cy: 96, opacity: 1 }}
          animate={{ cy: ySup - 2, opacity: [1, 1, 0] }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: "easeIn" }}
        />
      ))}
    </g>
  );

  return (
    <svg
      viewBox={enTicket ? "54 74 160 202" : "0 0 240 300"}
      className={className}
      role="img"
      aria-label={enTicket ? "Bebida de referencia del pedido" : "Tu bebida"}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <clipPath id={enTicket ? "clip-ticket" : "clip-escena"}>
          <path d={capaPath(Y_TOP, Y_BOT)} />
        </clipPath>
      </defs>

      {/* Plato (solo en escena principal) */}
      {!enTicket && (
        <g>
          <ellipse cx={120} cy={268} rx={66} ry={10} fill="#e6d2b6" />
          <ellipse cx={120} cy={264} rx={66} ry={10} fill="#f2e5cf" stroke="#dcc5a4" strokeWidth={2} />
        </g>
      )}
      {vaporAnimado}

      {/* Contenido del vaso (recortado al interior) */}
      <g clipPath={`url(#${enTicket ? "clip-ticket" : "clip-escena"})`}>
        {capas}
        {superficie}
        {siropes}
      </g>
      {/* Toppings pueden sobresalir del borde (crema batida, malvaviscos…) */}
      {toppings}
      {goteoVertido}

      {/* Asa y cristal por encima de todo */}
      <path
        d="M 166 138 C 196 140 202 160 198 180 C 194 200 178 208 163 203"
        fill="none"
        stroke="#d9c3a5"
        strokeWidth={11}
        strokeLinecap="round"
      />
      <path
        d="M 72 112 L 80 240 Q 82 254 96 254 H 144 Q 158 254 160 240 L 168 112"
        fill="rgba(255,253,248,0.16)"
        stroke="#e3d3bd"
        strokeWidth={5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Reflejo del cristal */}
      <line x1={85} y1={128} x2={90} y2={228} stroke="#ffffff" strokeWidth={4} strokeLinecap="round" opacity={0.55} />
    </svg>
  );
}
