/**
 * Ratón Café — Aplicación principal.
 * Máquina de pantallas: inicio → (mapa) → partida → fin.
 * Centraliza el récord histórico, las estrellas de la carrera y la
 * preferencia de sonido, sincronizados con src/game/storage.ts.
 */

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siguienteTurno } from "./game/campaign";
import { sonido } from "./game/sound";
import { cargarGuardado, cargarEstrellas, guardarSilencio } from "./game/storage";
import type { Mision, ResultadoPartida } from "./game/types";
import { EndScreen } from "./screens/EndScreen";
import { GameScreen } from "./screens/GameScreen";
import { MapScreen } from "./screens/MapScreen";
import { StartScreen } from "./screens/StartScreen";

type Fase = "inicio" | "mapa" | "jugando" | "fin";

export default function App() {
  /* Carga perezosa del guardado (una sola vez, tolerante a incógnito) */
  const [inicial] = useState(cargarGuardado);
  const [fase, setFase] = useState<Fase>("inicio");
  const [recordPedidos, setRecordPedidos] = useState(inicial.recordPedidos);
  const [recordPropinas, setRecordPropinas] = useState(inicial.recordPropinas);
  const [estrellas, setEstrellas] = useState<Record<string, number>>(inicial.estrellas);
  const [resultado, setResultado] = useState<ResultadoPartida | null>(null);
  const [silenciado, setSilenciado] = useState(inicial.silenciado);
  /* Misión en curso. `clave` fuerza el remontaje de GameScreen al
     reintentar o pasar de turno, reiniciando todo su estado interno. */
  const [mision, setMision] = useState<Mision>({ modo: "libre" });
  const [clave, setClave] = useState(0);

  /* Sincroniza silencio → motor de audio + disco */
  useEffect(() => {
    sonido.setSilenciado(silenciado);
    guardarSilencio(silenciado);
  }, [silenciado]);

  const alternarSilencio = useCallback(() => {
    sonido.clic();
    setSilenciado((s) => !s);
  }, []);

  /** Lanza una misión concreta (libre o turno de carrera). */
  const lanzar = useCallback((m: Mision) => {
    sonido.clic();
    setMision(m);
    setClave((k) => k + 1);
    setFase("jugando");
  }, []);

  const jugarLibre = useCallback(() => lanzar({ modo: "libre" }), [lanzar]);

  const abrirMapa = useCallback(() => {
    sonido.clic();
    setEstrellas(cargarEstrellas()); // refresca por si se superó un turno
    setFase("mapa");
  }, []);

  const terminar = useCallback((r: ResultadoPartida) => {
    setResultado(r);
    if (r.esRecord) {
      setRecordPedidos(r.pedidos);
      setRecordPropinas(r.propinas);
    }
    if (r.modo === "carrera") setEstrellas(cargarEstrellas());
    setFase("fin");
  }, []);

  /** Reintenta la misma misión que se acaba de jugar. */
  const reintentar = useCallback(() => lanzar(mision), [lanzar, mision]);

  /** Avanza al turno siguiente de la carrera (o vuelve al calendario). */
  const siguiente = useCallback(() => {
    if (resultado?.modo !== "carrera" || resultado.dia === undefined || resultado.turnoIdx === undefined) {
      return abrirMapa();
    }
    const sig = siguienteTurno(resultado.dia, resultado.turnoIdx);
    if (!sig) return abrirMapa();
    lanzar({ modo: "carrera", dia: sig.dia, turnoIdx: sig.turnoIdx });
  }, [resultado, lanzar, abrirMapa]);

  const totalEstrellas = Object.values(estrellas).reduce((a, b) => a + b, 0);

  const fundido = {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -14 },
    transition: { duration: 0.35, ease: "easeOut" as const },
  };

  return (
    <main className="font-body">
      <AnimatePresence mode="wait">
        {fase === "inicio" && (
          <motion.div key="inicio" {...fundido}>
            <StartScreen
              recordPedidos={recordPedidos}
              recordPropinas={recordPropinas}
              onJugar={jugarLibre}
              onCarrera={abrirMapa}
              estrellasTotales={totalEstrellas}
              silenciado={silenciado}
              onAlternarSilencio={alternarSilencio}
            />
          </motion.div>
        )}

        {fase === "mapa" && (
          <motion.div key="mapa" {...fundido}>
            <MapScreen
              estrellas={estrellas}
              onJugarTurno={(dia, turnoIdx) => lanzar({ modo: "carrera", dia, turnoIdx })}
              onVolver={() => setFase("inicio")}
            />
          </motion.div>
        )}

        {fase === "jugando" && (
          <motion.div key={`jugando-${clave}`} {...fundido}>
            <GameScreen
              mision={mision}
              onFin={terminar}
              silenciado={silenciado}
              onAlternarSilencio={alternarSilencio}
            />
          </motion.div>
        )}

        {fase === "fin" && resultado && (
          <motion.div key="fin" {...fundido}>
            <EndScreen
              resultado={resultado}
              onReintentar={reintentar}
              onSiguiente={siguiente}
              onMapa={abrirMapa}
              onMenu={() => setFase("inicio")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
