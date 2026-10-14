# [Ratón Café](https://coiponorte.github.io/Raton-Cafe/)

> Una acogedora cafetería artesanal en tu bolsillo: prepara bebidas por capas, sirve pedidos perfectos y bate tu récord antes de que acabe el turno.

[![Jugar ahora](https://img.shields.io/badge/JUGAR%20AHORA-coiponorte.github.io%2FRaton--Cafe-c96f4a?style=for-the-badge)](https://coiponorte.github.io/Raton-Cafe/)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-a855f7?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-estricto-3178c6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-springs-ff5ca8?logo=framer&logoColor=white)
![Despliegue](https://img.shields.io/badge/GitHub%20Pages-gh--pages-222?logo=github&logoColor=white)

---

## Cómo se juega (estilo Overcooked)

1. **Llegan clientes** a la barra, cada uno con su plato y una **barra de paciencia** que se agota.
2. **Toca las estaciones** para producir ingredientes; caen en tu **bandeja**:
   - Estaciones **instantáneas** (chocolate, crema, vitrina): un toque y listo.
   - Estaciones **con tiempo** (espresso, leche vaporizada, tostadora): el 1.º toque arranca el anillo de progreso, el 2.º recoge cuando marca **¡LISTO!**.
   - ⚠️ Si te despistas, **se quema** 🔥: sale humo, suena la alarma y hay que tirarlo antes de volver a usar la estación.
3. En cuanto la bandeja forma un plato de la carta, **la tarjeta del cliente que lo pidió se ilumina en verde**: tócala (o **arrástrale el plato** desde la bandeja) para servir.

### Controles — todo funciona de dos maneras

| Quieres… | Tocando | Arrastrando |
| --- | --- | --- |
| Preparar / recoger un ingrediente | Toca la estación | Arrástrala hasta la bandeja |
| Servir un plato | Toca la tarjeta verde del cliente | Arrastra el plato de la bandeja al cliente |
| Quitar algo de la bandeja | Toca su casilla | — |
| Tirar lo quemado | Toca la estación en rojo | — |

**Ayudas tácticas:**
- **El orden NUNCA importa**: los ingredientes se comparan como multiconjunto. Para que se vea, la bandeja deduce qué plato montas y pinta **huecos naranjas con lo que falta** y **marca en rojo lo que sobra** (tócalo para quitarlo).
- Cada estación muestra un **badge con las unidades que piden** los clientes en barra (descontando lo que ya llevas), y las que nadie necesita se atenúan.
- En cada tarjeta de cliente, los ingredientes que **ya tienes en la bandeja se marcan en verde**.
- Servir al cliente equivocado **no rompe el combo**: solo avisa. Solo se pierde si un cliente se cansa y se va.
- El turno **empieza cuando tú quieras** (botón «¡Abrir la caja!») y puedes **pausar** desde el HUD en cualquier momento.
4. Servir rápido paga **más propinas**; encadenar aciertos sube el **combo (hasta ×2.5)**; si un cliente se cansa y se va, **pierdes el combo**.

### La carta

| Plato | Se prepara con |
| --- | --- |
| ☕ **Capuchino** | Espresso + leche vaporizada |
| 🍫 **Mokachino** | Espresso + leche vaporizada + chocolate |
| 🥪 **Sándwich** | Pan tostado + jamón y queso |
| 🍰 **Trozo de pastel** | Rebanada de pastel + crema batida |
| 🍋 **Pie de limón** | Rebanada de pie + merengue |

Conforme sirves, llegan **más clientes a la vez, más seguido y con menos paciencia**, y se desbloquean los platos de más pasos.

<details>
<summary>Modo anterior (preparar bebidas por capas)</summary>

## Cómo se juega

1. **Mira el ticket**: cada cliente pide una bebida exacta (la referencia se dibuja con el mismo motor que tu taza, así que lo que ves es lo que hay).
2. **Prepara la bebida** arrastrando ingredientes a la taza… o simplemente tocándolos:
   | Categoría | Qué hace | Ingredientes |
   | --- | --- | --- |
   | **Base / espresso** | Capas apilables (máx. 2) que **llenan el vaso entero** | Ristretto, espresso, doble shot, descafeinado, cold brew |
   | **Leche / textura** | Cambia el color y el degradado | Entera, descremada, avena, almendra |
   | **Sirope / salsa** | Se vierte con animación de goteo | Vainilla, caramelo, chocolate, avellana, matcha |
   | **Toppings** | Rematan la bebida | Arte latte (corazón, roseta), crema batida, canela, cacao, malvaviscos, grano de café |
3. **SERVIR** (botón grande), **deshacer** y **limpiar** están siempre a un toque.
4. **Acierto exacto** → puntos + confetti + la taza vuela hacia el cliente + **+3 s** de tiempo.
5. **Fallo** → se rompe el combo y vibra la barra, pero **la bebida se conserva** para que la corrijas.
6. Los aciertos encadenados suben el **multiplicador de combo (hasta ×2.5)** y la dificultad crece con suavidad: primero una capa, luego dos, más siropes y toppings. **Nunca hay ingredientes repetidos**: no tienes que contar nada, solo reconocer y combinar.
7. Tienes **~90 segundos** + bonificaciones. ¿Cuántos pedidos perfectos entregas?

Guarda tu **récord histórico** y la **preferencia de sonido** automáticamente (localStorage, a prueba de modo incógnito).

</details>

## Características

- **Bebidas 100 % procedurales en SVG**: capas, espuma, goteos de sirope y arte latte se dibujan al vuelo; el ticket y la taza usan el mismo motor.
- **Mascota viva**: el ratoncito barista (SVG + springs) parpadea, celebra tus aciertos y se preocupa cuando el tiempo se agota.
- **Sonido ASMR sintetizado con WebAudio** (sin archivos de audio): molinillo, vapor, chorrito, clinc de taza, arpegio de éxito y fanfarria de récord. Botón de silencio persistente.
- **Animaciones con spring physics** (Framer Motion): la taza baja con rebote, los toppings hacen *pop*, el vapor sube en bucle.
- **Juega sin leer**: cada ingrediente tiene un **glifo icónico** propio (rayo, copo, botellita, grano…) que aparece en la ficha, en el chip del pedido y **grabado como sello en la capa del vaso**. El color también distingue: matices separados en bases, motitas doradas de avena, semillitas de vainilla, rayitas de canela frente a puntos de cacao.
- **Los menús se mueven solos**: al completar una sección, la barra **salta automáticamente** a la siguiente (base → leche → sirope → toppings) con un *ding*, y el indicador de pestaña se desliza con un muelle.
- **Stepper de progreso** en el ticket: un check verde por sección correcta y un pulso en la que toca ahora. Cuando la bebida es perfecta, **el botón SERVIR late en verde** y el ratón sonríe: sabes que vas a acertar antes de pulsar.
- **Responsive de verdad** (el área jugable manda):
  - *Horizontal / tablet / escritorio*: 3 columnas (ticket · taza protagonista · barra) con anchos `clamp()`, centradas con ancho máximo para no deformarse en 21:9.
  - *Celular en vertical*: ticket compacto arriba, taza dominante al centro, barra inferior con una sola fila deslizable.
  - *Celular en horizontal*: densidad reducida automática (fichas, botones y paneles encogen) para que la taza conserve la altura.
  - El SVG de la taza usa un **encuadre ajustado a la tinta** y se estira a todo el contenedor: siempre es la pieza más grande de la pantalla.
  - Girar el dispositivo a mitad de partida **no pierde ni la bebida ni el pedido** (`useViewport`).
- **HUD minimalista**: barra de tiempo de 5 px pegada al borde superior (roja en los últimos 10 s) y pastillas translúcidas flotantes.
- **Accesible y tolerante**: zonas de toque grandes, `aria-label`s, y funciona con arrastre o con un simple toque.

## Stack

**React 19 · TypeScript estricto · Vite 7 · Tailwind CSS 4 · Framer Motion · Lucide Icons · WebAudio API**

## Estructura de carpetas

```
Raton-Cafe/
├── index.html              # Splash "Preparando la cafetería…" + <noscript> + favicon
├── vite.config.ts          # base: '/Raton-Cafe/' (clave para GitHub Pages)
├── deploy.bat              # Despliegue automático a GitHub Pages (Windows)
├── public/
│   ├── icon.svg            # Favicon: el ratoncito barista
│   └── .nojekyll           # Evita que GitHub procese el sitio con Jekyll
└── src/
    ├── main.tsx
    ├── App.tsx             # Máquina de pantallas (inicio / partida / fin)
    ├── index.css           # Tailwind 4 + fuentes redondeadas + paleta cálida
    ├── game/               # Cerebro del juego (sin React)
    │   ├── types.ts        # Tipos: estaciones, pedidos, recetas, resultado
    │   ├── recipes.ts      # La carta (5 platos) y las 9 estaciones
    │   ├── balance.ts      # Ritmo: paciencia, oleadas y dificultad
    │   ├── data.ts         # Utilidades de color y PRNG
    │   ├── logic.ts        # Pedidos, validación (multiset exacto) y puntos
    │   ├── sound.ts        # Motor WebAudio 100 % sintetizado
    │   └── storage.ts      # Persistencia segura (a prueba de incógnito)
    ├── hooks/
    │   ├── useViewport.ts  # Medidas en vivo: retrato, altura escasa, amplio
    │   └── useIsPortrait.ts# Orientación simple (reorganiza sin perder estado)
    ├── components/         # Piezas visuales
    │   ├── Art.tsx         # Los 5 platos + iconos de ingrediente (SVG puro)
    │   ├── OrderQueue.tsx  # Clientes con barra de paciencia
    │   ├── StationGrid.tsx # La cocina: progreso, listo y quemado
    │   ├── Tray.tsx        # Bandeja de preparación
    │   ├── Mascot.tsx      # Ratoncito barista con reacciones
    │   ├── HUD.tsx
    │   └── Confetti.tsx · Fondo.tsx
    └── screens/            # StartScreen · GameScreen · EndScreen
```

---

Hecho con cariño y mucho café. Si te gusta, dale una estrella al repositorio y sírvele una taza virtual a un amigo.
