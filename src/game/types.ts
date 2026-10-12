/**
 * Tipos centrales de Ratón Café.
 * Representan el estado de la bebida, los pedidos y la partida.
 */

/** Categorías de ingredientes disponibles en la barra de trabajo. */
export type Categoria = "base" | "leche" | "sirope" | "topping";

/** Identificadores de bases de espresso (capas apilables, máx. 3). */
export type BaseId = "ristretto" | "espresso" | "doble" | "descafeinado" | "coldbrew";

/** Identificadores de leches / texturas. */
export type LecheId = "entera" | "descremada" | "avena" | "almendra";

/** Identificadores de siropes y salsas (se pueden repetir ×2). */
export type SiropeId = "vainilla" | "caramelo" | "chocolate" | "avellana" | "matcha";

/** Identificadores de toppings (algunos se pueden repetir ×2). */
export type ToppingId =
  | "arteCorazon"
  | "arteRoseta"
  | "cremaBatida"
  | "canela"
  | "cacao"
  | "malvaviscos"
  | "granoCafe";

/** Un identificador de ingrediente genérico (unión de todos). */
export type IngredienteId = BaseId | LecheId | SiropeId | ToppingId;

/**
 * Estado completo de una bebida (tanto la real del jugador como la del ticket).
 * Es un "multiset" por categoría: los arrays pueden contener repetidos.
 */
export interface Bebida {
  bases: BaseId[]; // capas apiladas, máx. MAX_BASES
  leche: LecheId | null; // una sola leche (reemplazable)
  siropes: SiropeId[]; // puede haber repetidos
  toppings: ToppingId[]; // puede haber repetidos
}

/** Un pedido es simplemente la bebida objetivo + metadatos de presentación. */
export interface Pedido {
  id: number; // correlativo para animaciones y depuración
  cliente: string; // nombre simpático del cliente
  bebida: Bebida;
}

/** Acción del jugador sobre la taza (sirve para deshacer y para sonidos). */
export interface Accion {
  categoria: Categoria;
  id: IngredienteId;
}

/** Estado de ánimo de la mascota (reacciona en vivo a la partida). */
export type HumorMascota = "idle" | "feliz" | "preocupado";

/** Estadísticas finales de una partida. */
export interface ResultadoPartida {
  pedidos: number; // pedidos perfectos entregados
  propinas: number; // puntuación total (propinas acumuladas)
  mejorCombo: number; // racha máxima alcanzada
  esRecord: boolean; // si rompió el récord histórico
}
