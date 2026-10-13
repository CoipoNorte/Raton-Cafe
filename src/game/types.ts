/**
 * Tipos centrales de Ratón Café (modo cafetería estilo Overcooked).
 * El juego va de ESTACIONES que producen ingredientes y PEDIDOS con
 * paciencia limitada que hay que servir a tiempo.
 */

/** Ingredientes/preparaciones que salen de cada estación. */
export type IngredienteId =
  | "espresso"       // máquina de espresso (tarda, se quema)
  | "lecheVapor"     // vaporizador (tarda, se quema)
  | "chocolate"      // dispensador (instantáneo)
  | "cremaBatida"    // sifón (instantáneo)
  | "panTostado"     // tostadora (tarda, se quema)
  | "jamonQueso"     // tabla de relleno (instantáneo)
  | "rebanadaPastel" // vitrina (instantáneo)
  | "rebanadaPie"    // vitrina (instantáneo)
  | "merengue";      // vitrina (instantáneo)

/** Los 5 productos de la carta. */
export type RecetaId = "capuchino" | "mokachino" | "sandwich" | "pastel" | "pieLimon";

/** Zonas de la cocina (agrupan las estaciones visualmente). */
export type Zona = "cafe" | "cocina" | "vitrina";

/** Estado en vivo de una estación. */
export type EstadoEstacion = "libre" | "trabajando" | "listo" | "quemado";

/** Estación con su reloj interno (desde = instante en que arrancó). */
export interface Estacion {
  estado: EstadoEstacion;
  desde: number; // timestamp ms
}

/** Un pedido en la barra, con su paciencia corriendo. */
export interface Pedido {
  id: number;
  receta: RecetaId;
  cliente: string;
  nacido: number; // timestamp ms
  paciencia: number; // ms totales de espera
}

/** Estado de ánimo de la mascota. */
export type HumorMascota = "idle" | "feliz" | "preocupado";

/** Estadísticas finales de una partida. */
export interface ResultadoPartida {
  pedidos: number; // pedidos servidos correctamente
  propinas: number; // puntuación total
  mejorCombo: number; // racha máxima
  esRecord: boolean;
  perdidos: number; // clientes que se fueron sin su pedido
}
