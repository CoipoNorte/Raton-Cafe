/**
 * GameScreen — La barra de la cafetería en pleno turno.
 * ------------------------------------------------------------------
 * Orquesta: pedido actual, bebida del jugador, cronómetro con bonificación,
 * combo multiplicador, confetti, vuelo de la taza y las reacciones del ratón.
 *
 * Responsive: con `useIsPortrait` reorganiza la mesa sin desmontar el estado
 * (girar el móvil a mitad de partida NO pierde ni la bebida ni el pedido).
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Trash2, Undo2 } from "lucide-react";
import { Confetti } from "../components/Confetti";
import { CupSVG } from "../components/CupSVG";
import { Fondo } from "../components/Fondo";
import { HUD } from "../components/HUD";
import { IngredientBar } from "../components/IngredientBar";
import { Mascot } from "../components/Mascot";
import { Ticket } from "../components/Ticket";
import { useIsPortrait } from "../hooks/useIsPortrait";
import { BONUS_SEGUNDOS, MAX_BASES, SEGUNDOS_PARTIDA, UMBRAL_TIEMPO_BAJO, dificultadPara } from "../game/balance";
import { SIROPES } from "../game/data";
import { aplicarIngrediente, bebidaVacia, coincidePedido, deshacerUltima, generarPedido, puntosPorAcierto } from "../game/logic";
import { sonido } from "../game/sound";
import { guardarRecord } from "../game/storage";
import type { Accion, Bebida, HumorMascota, Pedido, ResultadoPartida, SiropeId } from "../game/types";

export interface GameScreenProps {
  onFin: (resultado: ResultadoPartida) => void;
  silenciado: boolean;
  onAlternarSilencio: () => void;
}

/** Texto flotante "+puntos · +Ns" que sube tras un pedido perfecto. */
interface Flotante {
  id: number;
  texto: string;
}

export function GameScreen({ onFin, silenciado, onAlternarSilencio }: GameScreenProps) {
  const retrato = useIsPortrait();

  /* ------------------------- Estado de la partida ------------------------- */
  const semilla = useMemo(() => Date.now() % 100000, []);
  const [pedidoId, setPedidoId] = useState(1);
  const [pedido, setPedido] = useState<Pedido>(() => generarPedido(1, dificultadPara(0), semilla));
  const [bebida, setBebida] = useState<Bebida>(bebidaVacia);
  const [historial, setHistorial] = useState<Accion[]>([]);
  const [tiempoMs, setTiempoMs] = useState(SEGUNDOS_PARTIDA * 1000);
  const [racha, setRacha] = useState(0);
  const [mejorRacha, setMejorRacha] = useState(0);
  const [puntos, setPuntos] = useState(0);
  const [pedidosOk, setPedidosOk] = useState(0);
  /* ------------------------- Efectos y presentación ----------------------- */
  const [humor, setHumor] = useState<HumorMascota>("idle");
  const [sacudida, setSacudida] = useState(0);
  const [confettiId, setConfettiId] = useState(0);
  const [flotantes, setFlotantes] = useState<Flotante[]>([]);
  const [vertido, setVertido] = useState<{ clave: number; color: string } | null>(null);
  const [arrastrando, setArrastrando] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);

  const dropRef = useRef<HTMLDivElement | null>(null);
  const finalizadoRef = useRef(false);
  const ultimoSegundoRef = useRef(SEGUNDOS_PARTIDA);
  const temporizadoresRef = useRef<number[]>([]);

  /** setTimeout con registro para limpiar TODO al desmontar. */
  const despues = (ms: number, fn: () => void) => {
    temporizadoresRef.current.push(window.setTimeout(fn, ms));
  };
  useEffect(() => {
    const lista = temporizadoresRef.current;
    return () => lista.forEach((id) => window.clearTimeout(id));
  }, []);

  /* ------------------------------ Cronómetro ------------------------------ */
  useEffect(() => {
    const id = window.setInterval(() => setTiempoMs((t) => Math.max(0, t - 100)), 100);
    return () => window.clearInterval(id);
  }, []);

  /* Tic-tac de los últimos segundos + cierre del turno */
  useEffect(() => {
    const segundos = Math.ceil(tiempoMs / 1000);
    if (segundos !== ultimoSegundoRef.current) {
      ultimoSegundoRef.current = segundos;
      if (segundos > 0 && segundos <= UMBRAL_TIEMPO_BAJO) sonido.tic();
    }
    if (tiempoMs <= 0 && !finalizadoRef.current) {
      finalizadoRef.current = true;
      const esRecord = guardarRecord(pedidosOk, puntos);
      if (esRecord) sonido.fanfarria();
      onFin({ pedidos: pedidosOk, propinas: puntos, mejorCombo: mejorRacha, esRecord });
    }
  }, [tiempoMs, pedidosOk, puntos, mejorRacha, onFin]);

  /* ------------------------------ Acciones -------------------------------- */
  const agregar = (accion: Accion) => {
    if (bloqueado) return;
    const nueva = aplicarIngrediente(bebida, accion);
    if (!nueva) {
      sonido.taza(); // p. ej. 4ª base: la taza dice "basta" con un clinc
      return;
    }
    setBebida(nueva);
    setHistorial((h) => [...h, accion]);
    switch (accion.categoria) {
      case "base":
        sonido.molinillo();
        break;
      case "leche":
        sonido.vapor();
        break;
      case "sirope":
        sonido.vertido();
        setVertido({ clave: Date.now(), color: SIROPES[accion.id as SiropeId].color });
        break;
      case "topping":
        sonido.pop();
        break;
    }
  };

  const deshacer = () => {
    if (bloqueado || historial.length === 0) return;
    const resultado = deshacerUltima(bebida, historial);
    setBebida(resultado.bebida);
    setHistorial(resultado.historial);
    sonido.taza();
  };

  const limpiar = () => {
    if (bloqueado || historial.length === 0) return;
    setBebida(bebidaVacia());
    setHistorial([]);
    sonido.taza();
  };

  const servir = () => {
    if (bloqueado) return;
    // Servir una taza vacía no rompe el combo: solo un aviso amable.
    if (bebida.bases.length === 0 && !bebida.leche && bebida.siropes.length === 0 && bebida.toppings.length === 0) {
      setSacudida((s) => s + 1);
      sonido.taza();
      return;
    }

    if (coincidePedido(bebida, pedido.bebida)) {
      /* ------------------------- ¡PEDIDO PERFECTO! ------------------------- */
      const nuevaRacha = racha + 1;
      const pts = puntosPorAcierto(nuevaRacha);
      sonido.exito();
      setRacha(nuevaRacha);
      setMejorRacha((m) => Math.max(m, nuevaRacha));
      setPuntos((p) => p + pts);
      setPedidosOk((n) => n + 1);
      setTiempoMs((t) => t + BONUS_SEGUNDOS * 1000); // bonificación de tiempo
      setHumor("feliz");
      despues(1400, () => setHumor("idle"));
      setConfettiId(Date.now());
      despues(1200, () => setConfettiId(0));
      const idFlotante = Date.now();
      setFlotantes((f) => [...f, { id: idFlotante, texto: `+${pts} · +${BONUS_SEGUNDOS}s` }]);
      despues(950, () => setFlotantes((f) => f.filter((x) => x.id !== idFlotante)));

      /* La taza sale volando hacia el cliente: cambia la key, la nueva entra
         con rebote y la anterior (con su bebida) se anima de salida. */
      setBloqueado(true);
      const siguiente = pedidoId + 1;
      setPedidoId(siguiente);
      setBebida(bebidaVacia());
      setHistorial([]);
      setVertido(null);
      setPedido(generarPedido(siguiente, dificultadPara(pedidosOk + 1), semilla));
      despues(600, () => setBloqueado(false));
    } else {
      /* --------- Fallo: combo roto, vibra la barra, la bebida queda -------- */
      sonido.error();
      setRacha(0);
      setSacudida((s) => s + 1);
      setHumor("preocupado");
      despues(1600, () => setHumor("idle"));
    }
  };

  /* -------------------------- Derivados visuales -------------------------- */
  const tiempoBajo = tiempoMs <= UMBRAL_TIEMPO_BAJO * 1000;
  const humorVisible: HumorMascota = humor !== "idle" ? humor : tiempoBajo ? "preocupado" : "idle";
  const tazaVacia = bebida.bases.length === 0 && !bebida.leche && bebida.siropes.length === 0 && bebida.toppings.length === 0;

  /** Zona central: la taza protagonista + botones de acción. */
  const zonaTaza = (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-2">
      <div
        ref={dropRef}
        className={`relative flex min-h-0 w-full flex-1 items-center justify-center rounded-3xl transition-all duration-300 ${
          arrastrando ? "bg-white/25 shadow-[inset_0_0_0_4px_rgba(201,138,75,0.55)]" : ""
        }`}
      >
        <AnimatePresence>
          <motion.div
            key={pedidoId} // cada pedido nuevo = taza nueva que baja con rebote
            /* absolute: la taza saliente (volando) y la entrante (rebotando)
               se solapan centradas sin empujar el layout */
            className="absolute inset-0 flex items-center justify-center"
            initial={{ y: -160, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ x: 320, y: -180, rotate: 26, opacity: 0 }}
            transition={
              /* entrada con physics de muelle (rebote); salida volando */
              { type: "spring", stiffness: 250, damping: 17 }
            }
          >
            <CupSVG bebida={bebida} vertido={vertido} className="h-full w-auto max-w-[46vw] drop-shadow-xl" />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>{confettiId > 0 && <Confetti key={confettiId} semilla={confettiId} />}</AnimatePresence>

        {/* Flotantes de puntos */}
        <div className="pointer-events-none absolute inset-x-0 top-3 z-40 flex flex-col items-center">
          <AnimatePresence>
            {flotantes.map((f) => (
              <motion.span
                key={f.id}
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: -16, scale: 1.05 }}
                exit={{ opacity: 0 }}
                className="font-display text-lg font-extrabold text-[#7f9c67] drop-shadow-[0_2px_6px_rgba(255,255,255,0.9)]"
              >
                {f.texto}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {tazaVacia && (
          <p className="pointer-events-none absolute bottom-1 text-[11px] font-semibold text-cafe-sombra/50">
            Arrastra o toca ingredientes para llenar la taza
          </p>
        )}
      </div>

      {/* El ratoncito barista vigila el turno desde la esquina de la barra.
          Integrado en la zona de la taza: reacciona sin tapar los botones. */}
      <Mascot
        humor={humorVisible}
        className="pointer-events-none absolute bottom-16 left-0 z-20 w-14 drop-shadow-lg sm:w-16 lg:bottom-10 lg:left-2 lg:w-24"
      />

      {/* Botones de acción: siempre a un toque */}
      <div className="flex shrink-0 items-center gap-3 pb-1">
        <motion.button
          onClick={deshacer}
          whileTap={{ scale: 0.86 }}
          disabled={historial.length === 0}
          aria-label="Deshacer último ingrediente"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ecdcbf] bg-white/85 text-cafe-sombra shadow-md transition-opacity disabled:opacity-35"
        >
          <Undo2 size={17} />
        </motion.button>

        <motion.button
          onClick={servir}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          className="flex h-13 items-center gap-2 rounded-full bg-gradient-to-b from-[#d98a52] to-[#c96f4a] px-9 py-3 font-display text-lg font-extrabold tracking-[0.12em] text-white shadow-[0_8px_22px_rgba(201,111,74,0.45)]"
        >
          <Check size={20} strokeWidth={3} />
          SERVIR
        </motion.button>

        <motion.button
          onClick={limpiar}
          whileTap={{ scale: 0.86 }}
          disabled={historial.length === 0}
          aria-label="Limpiar la taza"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ecdcbf] bg-white/85 text-cafe-sombra shadow-md transition-opacity disabled:opacity-35"
        >
          <Trash2 size={17} />
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className="relative flex h-dvh w-full touch-manipulation select-none flex-col overflow-hidden">
      <Fondo />
      <HUD
        fraccionTiempo={tiempoMs / (SEGUNDOS_PARTIDA * 1000)}
        tiempoBajo={tiempoBajo}
        puntos={puntos}
        racha={racha}
        pedidos={pedidosOk}
        silenciado={silenciado}
        onAlternarSilencio={onAlternarSilencio}
      />

      {retrato ? (
        /* ===== Celular en vertical: layout apilado ===== */
        <div className="relative z-10 mx-auto flex h-full w-full max-w-xl flex-col gap-2 px-3 pb-3 pt-12">
          <Ticket pedido={pedido} compacto />
          {zonaTaza}
          <IngredientBar
            onAgregar={agregar}
            dropRef={dropRef}
            basesLlenas={bebida.bases.length >= MAX_BASES}
            horizontal
            sacudida={sacudida}
            onArrastrando={setArrastrando}
          />
        </div>
      ) : (
        /* ===== Horizontal / tablet / escritorio: tres columnas ===== */
        <div className="relative z-10 mx-auto grid h-full w-full max-w-6xl grid-cols-[minmax(230px,300px)_minmax(0,1fr)_minmax(240px,300px)] gap-4 px-5 pb-5 pt-12">
          <Ticket pedido={pedido} />
          {zonaTaza}
          <IngredientBar
            onAgregar={agregar}
            dropRef={dropRef}
            basesLlenas={bebida.bases.length >= MAX_BASES}
            horizontal={false}
            sacudida={sacudida}
            onArrastrando={setArrastrando}
          />
        </div>
      )}
    </div>
  );
}
