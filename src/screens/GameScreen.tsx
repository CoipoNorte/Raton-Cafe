/**
 * GameScreen — El turno en la cafetería (estilo Overcooked).
 * ------------------------------------------------------------------
 * BUCLE DE JUEGO
 *  1. Llegan clientes con su pedido y una barra de paciencia.
 *  2. Tocas estaciones para producir ingredientes → caen en la bandeja.
 *     Las que llevan tiempo hay que recogerlas antes de que se quemen.
 *  3. Cuando la bandeja forma un plato, la tarjeta del cliente que lo
 *     pidió se ilumina en verde: la tocas y sirves (propinas + combo).
 *  4. Si un cliente se cansa, se va: pierdes el combo.
 *
 * Todo el reloj se calcula con timestamps (Date.now) y un único
 * intervalo de 100 ms: nada de temporizadores sueltos por componente.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Coach } from "../components/Coach";
import { Confetti } from "../components/Confetti";
import { Fondo } from "../components/Fondo";
import { HUD } from "../components/HUD";
import { Mascot } from "../components/Mascot";
import { OrderQueue } from "../components/OrderQueue";
import { StationGrid } from "../components/StationGrid";
import { Tray } from "../components/Tray";
import { useViewport } from "../hooks/useViewport";
import {
  BONUS_SEGUNDOS, MAX_BANDEJA, SEGUNDOS_PARTIDA, UMBRAL_TIEMPO_BAJO, dificultadPara,
} from "../game/balance";
import { ESTACIONES, ORDEN_ESTACIONES, RECETAS } from "../game/recipes";
import { analizarBandeja, bandejaCoincide, generarPedido, pedidoQueCoincide, puntosPorServir } from "../game/logic";
import { sonido } from "../game/sound";
import { guardarRecord } from "../game/storage";
import { IngGlyph } from "../components/Art";
import type { Estacion, HumorMascota, IngredienteId, Pedido, RecetaId, ResultadoPartida } from "../game/types";

export interface GameScreenProps {
  onFin: (resultado: ResultadoPartida) => void;
  silenciado: boolean;
  onAlternarSilencio: () => void;
}

/** Texto flotante de recompensa. */
interface Flotante {
  id: number;
  texto: string;
  bueno: boolean;
}

/** Ingrediente volando de la estación a la bandeja (puro gozo visual). */
interface Vuelo {
  id: number;
  ing: IngredienteId;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** Estado inicial de las 9 estaciones (todas libres). */
function estacionesIniciales(): Record<IngredienteId, Estacion> {
  const base = {} as Record<IngredienteId, Estacion>;
  for (const id of ORDEN_ESTACIONES) base[id] = { estado: "libre", desde: 0 };
  return base;
}

export function GameScreen({ onFin, silenciado, onAlternarSilencio }: GameScreenProps) {
  const vp = useViewport();
  const denso = vp.bajo || vp.compacto;

  /* ----------------------------- Estado ----------------------------- */
  const [ahora, setAhora] = useState(() => Date.now());
  const [tiempoMs, setTiempoMs] = useState(SEGUNDOS_PARTIDA * 1000);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [estaciones, setEstaciones] = useState<Record<IngredienteId, Estacion>>(estacionesIniciales);
  const [bandeja, setBandeja] = useState<IngredienteId[]>([]);
  const [puntos, setPuntos] = useState(0);
  const [racha, setRacha] = useState(0);
  const [mejorRacha, setMejorRacha] = useState(0);
  const [servidos, setServidos] = useState(0);
  const [perdidos, setPerdidos] = useState(0);
  /* --------------------------- Presentación ------------------------- */
  const [humor, setHumor] = useState<HumorMascota>("idle");
  const [sacudida, setSacudida] = useState(0);
  const [rechazadoId, setRechazadoId] = useState<number | null>(null);
  const [confettiId, setConfettiId] = useState(0);
  const [flotantes, setFlotantes] = useState<Flotante[]>([]);
  const [vuelos, setVuelos] = useState<Vuelo[]>([]);
  const [arrastrandoIng, setArrastrandoIng] = useState(false);
  /* Guía inicial: el turno NO empieza hasta que la cierras */
  const [coach, setCoach] = useState(true);
  /* Pausa manual (botón del HUD) */
  const [pausaManual, setPausaManual] = useState(false);

  /* Zonas de destino para arrastrar */
  const trayRef = useRef<HTMLElement | null>(null);
  const tarjetasRef = useRef<Map<number, HTMLElement>>(new Map());
  const registrarTarjeta = useCallback((id: number, el: HTMLElement | null) => {
    if (el) tarjetasRef.current.set(id, el);
    else tarjetasRef.current.delete(id);
  }, []);

  /* Refs espejo: el bucle los lee sin re-suscribirse en cada render */
  const pedidosRef = useRef(pedidos);
  pedidosRef.current = pedidos;
  const estacionesRef = useRef(estaciones);
  estacionesRef.current = estaciones;
  const servidosRef = useRef(servidos);
  servidosRef.current = servidos;

  const siguienteIdRef = useRef(1);
  const proximoSpawnRef = useRef(0);
  /* Espejo de la pausa para leerlo dentro del intervalo sin recrearlo */
  const pausadoRef = useRef(true);
  const finalizadoRef = useRef(false);
  const ultimoSegundoRef = useRef(SEGUNDOS_PARTIDA);
  const temporizadoresRef = useRef<number[]>([]);

  const despues = useCallback((ms: number, fn: () => void) => {
    temporizadoresRef.current.push(window.setTimeout(fn, ms));
  }, []);
  useEffect(() => {
    const lista = temporizadoresRef.current;
    return () => lista.forEach((id) => window.clearTimeout(id));
  }, []);

  /* Pausa efectiva = guía abierta o pausa manual. El primer cliente
     llega justo al reanudar (no mientras lees las instrucciones). */
  const pausado = coach || pausaManual;
  pausadoRef.current = pausado;

  const alternarPausa = useCallback(() => {
    sonido.clic();
    setCoach(false);
    setPausaManual((p) => !p);
  }, []);

  /** Cierra la guía y arranca el turno: el primer cliente entra ya. */
  const empezarTurno = useCallback(() => {
    sonido.clic();
    setCoach(false);
    proximoSpawnRef.current = Date.now() + 500;
  }, []);

  /** Añade un texto flotante efímero. */
  const flotar = useCallback((texto: string, bueno: boolean) => {
    const id = Date.now() + Math.random();
    setFlotantes((f) => [...f, { id, texto, bueno }]);
    despues(1000, () => setFlotantes((f) => f.filter((x) => x.id !== id)));
  }, [despues]);

  /* ------------------------- BUCLE PRINCIPAL -------------------------
     Con PAUSA real: mientras está pausado desplazamos todos los relojes
     (paciencia de clientes, cocción de estaciones y próxima llegada)
     100 ms hacia delante, así nada avanza ni se quema. El primer cliente
     entra justo cuando cierras la guía. */
  useEffect(() => {
    const intervalo = window.setInterval(() => {
      const t = Date.now();
      setAhora(t);

      if (pausadoRef.current) {
        // Congelamos el mundo: todo se mueve con nosotros.
        setPedidos((ps) => ps.map((p) => ({ ...p, nacido: p.nacido + 100 })));
        setEstaciones((es) => {
          const copia = { ...es };
          for (const id of ORDEN_ESTACIONES) {
            if (copia[id].estado === "trabajando" || copia[id].estado === "listo") {
              copia[id] = { ...copia[id], desde: copia[id].desde + 100 };
            }
          }
          return copia;
        });
        proximoSpawnRef.current += 100;
        return; // ni cronómetro, ni clientes, ni quemados
      }

      setTiempoMs((prev) => Math.max(0, prev - 100));

      /* --- 1. Estaciones: trabajando → listo → quemado --- */
      const est = estacionesRef.current;
      let cambio = false;
      const nuevas: Record<IngredienteId, Estacion> = { ...est };
      for (const id of ORDEN_ESTACIONES) {
        const def = ESTACIONES[id];
        const st = est[id];
        if (st.estado === "trabajando" && t - st.desde >= def.tiempo) {
          nuevas[id] = { ...st, estado: "listo" };
          cambio = true;
          sonido.campana();
        } else if (st.estado === "listo" && def.margen > 0 && t - st.desde >= def.tiempo + def.margen) {
          nuevas[id] = { ...st, estado: "quemado" };
          cambio = true;
          sonido.quemado();
        }
      }
      if (cambio) setEstaciones(nuevas);

      /* --- 2. Clientes que se cansan y se van --- */
      const vivos = pedidosRef.current.filter((p) => t - p.nacido < p.paciencia);
      if (vivos.length !== pedidosRef.current.length) {
        const idos = pedidosRef.current.length - vivos.length;
        setPedidos(vivos);
        setPerdidos((n) => n + idos);
        setRacha(0);
        setHumor("preocupado");
        sonido.clienteSeVa();
        flotar("¡Se fue! 😿", false);
        despues(1500, () => setHumor("idle"));
      }

      /* --- 3. Llegada de clientes nuevos --- */
      const dif = dificultadPara(servidosRef.current);
      if (vivos.length < dif.maxPedidos && t >= proximoSpawnRef.current) {
        const nuevo = generarPedido(siguienteIdRef.current++, servidosRef.current, dif.paciencia, t);
        setPedidos((prev) => [...prev, nuevo]);
        proximoSpawnRef.current = t + dif.intervalo;
        sonido.campanilla();
      }
    }, 100);
    return () => window.clearInterval(intervalo);
  }, [despues, flotar]);

  /* Tic-tac final y cierre del turno */
  useEffect(() => {
    const seg = Math.ceil(tiempoMs / 1000);
    if (seg !== ultimoSegundoRef.current) {
      ultimoSegundoRef.current = seg;
      if (seg > 0 && seg <= UMBRAL_TIEMPO_BAJO) sonido.tic();
    }
    if (tiempoMs <= 0 && !finalizadoRef.current) {
      finalizadoRef.current = true;
      const esRecord = guardarRecord(servidos, puntos);
      if (esRecord) sonido.fanfarria();
      onFin({ pedidos: servidos, propinas: puntos, mejorCombo: mejorRacha, esRecord, perdidos });
    }
  }, [tiempoMs, servidos, puntos, mejorRacha, perdidos, onFin]);

  /* --------------------------- Interacción --------------------------- */

  /** Lanza la animación del ingrediente volando hacia la bandeja. */
  const volar = useCallback((ing: IngredienteId, origen: DOMRect) => {
    const destino = trayRef.current?.getBoundingClientRect();
    if (!destino) return;
    const id = Date.now() + Math.random();
    setVuelos((v) => [
      ...v,
      {
        id, ing,
        x0: origen.left + origen.width / 2 - 18,
        y0: origen.top + origen.height / 2 - 18,
        x1: destino.left + destino.width / 2 - 18,
        y1: destino.top + destino.height / 2 - 18,
      },
    ]);
    despues(460, () => setVuelos((v) => v.filter((x) => x.id !== id)));
  }, [despues]);

  /** Mete un ingrediente en la bandeja (si cabe). */
  const aBandeja = useCallback((id: IngredienteId, origen?: DOMRect) => {
    if (bandeja.length >= MAX_BANDEJA) {
      setSacudida((s) => s + 1);
      sonido.error();
      flotar("¡Bandeja llena!", false);
      return;
    }
    if (origen) volar(id, origen);
    setBandeja((b) => [...b, id]);
    sonido.pop();
  }, [bandeja.length, flotar, volar]);

  /** Toque/suelta sobre una estación: arranca, recoge o tira lo quemado. */
  const tocarEstacion = (id: IngredienteId, rect: DOMRect) => {
    const def = ESTACIONES[id];
    const st = estaciones[id];

    if (def.tiempo === 0) {
      aBandeja(id, rect); // vitrina / dispensador: instantáneo
      return;
    }
    if (st.estado === "libre") {
      setEstaciones((e) => ({ ...e, [id]: { estado: "trabajando", desde: Date.now() } }));
      if (id === "espresso") sonido.molinillo();
      else if (id === "lecheVapor") sonido.vapor();
      else sonido.sarten();
      return;
    }
    if (st.estado === "listo") {
      setEstaciones((e) => ({ ...e, [id]: { estado: "libre", desde: 0 } }));
      aBandeja(id, rect);
      return;
    }
    if (st.estado === "quemado") {
      setEstaciones((e) => ({ ...e, [id]: { estado: "libre", desde: 0 } }));
      sonido.basura();
      flotar("A la basura", false);
      return;
    }
    sonido.taza(); // está trabajando: paciencia
  };

  /** Quita un ingrediente concreto de la bandeja (toque sobre su casilla). */
  const quitarDeBandeja = (indice: number) => {
    setBandeja((b) => b.filter((_, i) => i !== indice));
    sonido.taza();
  };

  /** Devuelve el pedido cuya tarjeta está bajo esas coordenadas. */
  const buscarPedidoEn = useCallback((x: number, y: number): Pedido | null => {
    for (const [id, el] of tarjetasRef.current) {
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        return pedidosRef.current.find((p) => p.id === id) ?? null;
      }
    }
    return null;
  }, []);

  /** Sirve la bandeja a un cliente concreto. */
  const servir = (pedido: Pedido) => {
    if (!bandejaCoincide(bandeja, pedido.receta)) {
      /* Entregar al cliente equivocado ya no rompe el combo: solo avisa.
         Castigar un error de puntería era frustrante, no divertido. */
      setRechazadoId(pedido.id);
      despues(450, () => setRechazadoId(null));
      setSacudida((s) => s + 1);
      flotar(`${RECETAS[pedido.receta].nombre}, no`, false);
      sonido.error();
      return;
    }

    /* ¡Pedido correcto! */
    const nuevaRacha = racha + 1;
    const restante = Math.max(0, 1 - (Date.now() - pedido.nacido) / pedido.paciencia);
    const pts = puntosPorServir(pedido.receta, nuevaRacha, restante);

    setPedidos((prev) => prev.filter((p) => p.id !== pedido.id));
    setBandeja([]);
    setRacha(nuevaRacha);
    setMejorRacha((m) => Math.max(m, nuevaRacha));
    setPuntos((p) => p + pts);
    setServidos((n) => n + 1);
    setTiempoMs((t) => t + BONUS_SEGUNDOS * 1000);
    setHumor("feliz");
    despues(1300, () => setHumor("idle"));
    setConfettiId(Date.now());
    despues(1200, () => setConfettiId(0));
    flotar(`+${pts} · +${BONUS_SEGUNDOS}s`, true);
    sonido.exito();
  };

  const limpiarBandeja = () => {
    if (bandeja.length === 0) return;
    setBandeja([]);
    sonido.basura();
  };

  /* --------------------------- Derivados ----------------------------- */
  const tiempoBajo = tiempoMs <= UMBRAL_TIEMPO_BAJO * 1000;
  /**
   * Análisis en vivo de la bandeja: qué plato estás montando, qué falta
   * y qué sobra. Prioriza las recetas que los clientes piden ahora mismo;
   * si no hay nadie, considera toda la carta.
   */
  const analisis = useMemo(() => {
    const deClientes = [...new Set(pedidos.map((p) => p.receta))];
    const candidatas = deClientes.length > 0 ? deClientes : (Object.keys(RECETAS) as RecetaId[]);
    return analizarBandeja(bandeja, candidatas);
  }, [bandeja, pedidos]);
  const recetaLista = analisis.completa ? analisis.receta : null;
  /** pedido al que le sirve la bandeja (se ilumina en verde) */
  const servible = useMemo(() => pedidoQueCoincide(bandeja, pedidos), [bandeja, pedidos]);

  /**
   * CAPA TÁCTICA: cuántas unidades de cada ingrediente hacen falta para
   * todos los clientes que esperan, descontando lo que ya tienes en la
   * bandeja. Alimenta los badges numéricos de las estaciones.
   */
  const necesarios = useMemo(() => {
    const cuenta: Partial<Record<IngredienteId, number>> = {};
    for (const p of pedidos) {
      for (const paso of RECETAS[p.receta].pasos) {
        cuenta[paso] = (cuenta[paso] ?? 0) + 1;
      }
    }
    for (const ing of bandeja) {
      if (cuenta[ing]) cuenta[ing] = cuenta[ing]! - 1;
    }
    return cuenta;
  }, [pedidos, bandeja]);
  const humorVisible: HumorMascota =
    humor !== "idle" ? humor : servible ? "feliz" : tiempoBajo ? "preocupado" : "idle";

  return (
    <div className="relative flex h-dvh w-full touch-manipulation select-none flex-col overflow-hidden">
      <Fondo />
      <HUD
        fraccionTiempo={tiempoMs / (SEGUNDOS_PARTIDA * 1000)}
        tiempoBajo={tiempoBajo}
        puntos={puntos}
        racha={racha}
        pedidos={servidos}
        silenciado={silenciado}
        onAlternarSilencio={onAlternarSilencio}
        pausado={pausado}
        onAlternarPausa={alternarPausa}
      />

      <div className={`relative z-10 mx-auto flex h-full w-full max-w-3xl flex-col gap-1.5 px-2 pb-2 ${denso ? "pt-7" : "pt-9"}`}>
        {/* 1 · Clientes esperando */}
        <div className="shrink-0 overflow-x-auto">
          <OrderQueue
            pedidos={pedidos}
            ahora={ahora}
            servibleId={servible?.id ?? null}
            rechazadoId={rechazadoId}
            onServir={servir}
            registrarTarjeta={registrarTarjeta}
            bandeja={bandeja}
            sirviendo={recetaLista !== null}
            denso={denso}
          />
        </div>

        {/* 2 · Bandeja + mascota (zona central, con confetti) */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center gap-2">
          <Mascot humor={humorVisible} className={`shrink-0 drop-shadow-lg ${denso ? "w-12" : "w-20"}`} />
          <div className="min-w-0 flex-1">
            <Tray
              bandeja={bandeja}
              analisis={analisis}
              onLimpiar={limpiarBandeja}
              onQuitar={quitarDeBandeja}
              buscarPedidoEn={buscarPedidoEn}
              onServir={servir}
              servible={servible}
              sacudida={sacudida}
              recibiendo={arrastrandoIng}
              trayRef={trayRef}
              denso={denso}
            />
          </div>

          <AnimatePresence>{confettiId > 0 && <Confetti key={confettiId} semilla={confettiId} />}</AnimatePresence>
          <AnimatePresence>{coach && <Coach onCerrar={empezarTurno} />}</AnimatePresence>

          {/* Velo de pausa manual */}
          <AnimatePresence>
            {pausaManual && !coach && (
              <motion.button
                onClick={alternarPausa}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-2 bg-[#f4e4cc]/80 backdrop-blur-sm"
              >
                <span className="font-display text-3xl font-extrabold text-[#6b4a2f]">Turno en pausa</span>
                <span className="rounded-full bg-[#c96f4a] px-5 py-2 font-display text-sm font-extrabold text-white shadow-lg">
                  Toca para continuar
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* textos flotantes de recompensa */}
          <div className="pointer-events-none absolute inset-x-0 -top-1 z-40 flex flex-col items-center">
            <AnimatePresence>
              {flotantes.map((f) => (
                <motion.span
                  key={f.id}
                  initial={{ opacity: 0, y: 12, scale: 0.8 }}
                  animate={{ opacity: 1, y: -14, scale: 1.05 }}
                  exit={{ opacity: 0 }}
                  className={`font-display text-base font-extrabold drop-shadow-[0_2px_6px_rgba(255,255,255,0.95)] ${
                    f.bueno ? "text-[#6d8f54]" : "text-[#c4473f]"
                  }`}
                >
                  {f.texto}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Capa de ingredientes VOLANDO de la estación a la bandeja */}
        <div className="pointer-events-none fixed inset-0 z-[60]">
          <AnimatePresence>
            {vuelos.map((v) => (
              <motion.div
                key={v.id}
                className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#ecdcbf] bg-white shadow-lg"
                initial={{ x: v.x0, y: v.y0, scale: 1.15, opacity: 1, rotate: -10 }}
                animate={{ x: v.x1, y: v.y1, scale: 0.55, opacity: 0.9, rotate: 12 }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.42, ease: [0.3, 0.8, 0.4, 1] }}
              >
                <IngGlyph id={v.ing} size={24} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 3 · La cocina */}
        <div className="shrink-0">
          <StationGrid
            estaciones={estaciones}
            ahora={ahora}
            onTocar={tocarEstacion}
            necesarios={necesarios}
            trayRef={trayRef}
            onArrastrando={setArrastrandoIng}
            denso={denso}
          />
        </div>
      </div>
    </div>
  );
}
