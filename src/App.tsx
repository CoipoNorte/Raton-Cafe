/**
 * Ratón Café — Aplicación principal.
 * Máquina de estados de pantallas: inicio → partida → fin.
 * También centraliza el récord histórico y la preferencia de sonido,
 * que se sincronizan con el módulo de persistencia (src/game/storage.ts).
 */

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sonido } from "./game/sound";
import { cargarGuardado, guardarSilencio } from "./game/storage";
import type { ResultadoPartida } from "./game/types";
import { EndScreen } from "./screens/EndScreen";
import { GameScreen } from "./screens/GameScreen";
import { StartScreen } from "./screens/StartScreen";

type Fase = "inicio" | "jugando" | "fin";

export default function App() {
  /* Carga perezosa del guardado (una sola vez, tolerante a incógnito) */
  const [inicial] = useState(cargarGuardado);
  const [fase, setFase] = useState<Fase>("inicio");
  const [recordPedidos, setRecordPedidos] = useState(inicial.recordPedidos);
  const [recordPropinas, setRecordPropinas] = useState(inicial.recordPropinas);
  const [resultado, setResultado] = useState<ResultadoPartida | null>(null);
  const [silenciado, setSilenciado] = useState(inicial.silenciado);

  /* Sincroniza silencio → motor de audio + disco */
  useEffect(() => {
    sonido.setSilenciado(silenciado);
    guardarSilencio(silenciado);
  }, [silenciado]);

  const alternarSilencio = useCallback(() => {
    sonido.clic();
    setSilenciado((s) => !s);
  }, []);

  const jugar = useCallback(() => {
    sonido.clic();
    setFase("jugando");
  }, []);

  const terminar = useCallback((r: ResultadoPartida) => {
    setResultado(r);
    if (r.esRecord) {
      setRecordPedidos(r.pedidos);
      setRecordPropinas(r.propinas);
    }
    setFase("fin");
  }, []);

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
              onJugar={jugar}
              silenciado={silenciado}
              onAlternarSilencio={alternarSilencio}
            />
          </motion.div>
        )}
        {fase === "jugando" && (
          <motion.div key="jugando" {...fundido}>
            <GameScreen onFin={terminar} silenciado={silenciado} onAlternarSilencio={alternarSilencio} />
          </motion.div>
        )}
        {fase === "fin" && resultado && (
          <motion.div key="fin" {...fundido}>
            <EndScreen resultado={resultado} onReintentar={jugar} onMenu={() => setFase("inicio")} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
