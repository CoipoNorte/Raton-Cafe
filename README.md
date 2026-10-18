# [Ratón Café](https://coiponorte.github.io/Raton-Cafe/)

> Una acogedora cafetería artesanal en tu bolsillo: atiende la barra, prepara cafés y postres antes de que se quemen y sirve a cada cliente antes de que pierda la paciencia.

[![Jugar ahora](https://img.shields.io/badge/JUGAR%20AHORA-coiponorte.github.io%2FRaton--Cafe-c96f4a?style=for-the-badge)](https://coiponorte.github.io/Raton-Cafe/)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-a855f7?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-estricto-3178c6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-springs-ff5ca8?logo=framer&logoColor=white)
![Despliegue](https://img.shields.io/badge/GitHub%20Pages-gh--pages-222?logo=github&logoColor=white)

---

## Modos de juego

| Modo | En qué consiste |
| --- | --- |
| 📅 **Carrera** | **7 días × 3 turnos** (mañana, tarde y noche). Cada turno te pide servir a **N clientes** sin que se te marchen más de los permitidos (**corazones**). Ganas de 1 a 3 **estrellas** según cuántos pierdas, y el progreso queda guardado. Sin cronómetro: manda la cola. |
| ⏱️ **Turno libre** | Arcade de **100 segundos** con dificultad creciente, para batir tu récord de propinas. |

### La semana de la carrera

| Día | Nombre | Clientes por turno | Novedad |
| --- | --- | --- | --- |
| 1 | Primer día | 3 · 4 · 4 | Capuchino y pastel |
| 2 | Se corre la voz | 4 · 5 · 5 | + Sándwich |
| 3 | Nuevo postre | 5 · 6 · 6 | + Pie de limón |
| 4 | Carta completa | 6 · 7 · 7 | + Mokachino |
| 5 | Fin de semana | 7 · 8 · 8 | Hasta 4 clientes a la vez |
| 6 | Cola en la puerta | 8 · 9 · 9 | Paciencia muy justa |
| 7 | El gran día | 9 · 10 · 11 | Solo 1 corazón por la tarde y la noche |

Cada franja tiñe el cielo del fondo (🌅 mañana, 🌇 tarde, 🌙 noche) y, conforme avanzas, los clientes llegan **más seguido, en mayor número y con menos paciencia**.

## Cómo se juega (estilo Overcooked)

1. **Llegan clientes** a la barra, cada uno con su plato y una **barra de paciencia** que se agota.
2. **Usa las estaciones** para producir ingredientes; caen en tu **bandeja** (hasta 4 huecos):
   - Estaciones **instantáneas** (chocolate, crema, vitrina): un toque y listo.
   - Estaciones **con tiempo** (espresso 2,2 s · leche vaporizada 1,9 s · tostadora 2,6 s): el 1.º toque arranca el anillo de progreso, el 2.º recoge cuando marca **¡COGER!**.
   - ⚠️ Si te despistas, **se quema** 🔥: sale humo, suena la alarma y hay que tirarlo antes de volver a usar la estación.
3. En cuanto la bandeja forma un plato de la carta, **la tarjeta del cliente que lo pidió se ilumina en verde**: tócala (o **arrástrale el plato** desde la bandeja) para servir.
4. Servir rápido paga **más propinas** y encadenar aciertos sube el **combo (hasta ×2.5)**. Si un cliente se cansa y se va, **pierdes el combo** (y un corazón, en modo carrera).

Tu **récord histórico**, las **estrellas de la carrera** y la **preferencia de sonido** se guardan solos (localStorage, a prueba de modo incógnito).

### Controles — todo funciona de dos maneras

| Quieres… | Tocando | Arrastrando |
| --- | --- | --- |
| Preparar / recoger un ingrediente | Toca la estación | Arrástrala hasta la bandeja |
| Servir un plato | Toca la tarjeta verde del cliente | Arrastra el plato de la bandeja al cliente |
| Quitar algo de la bandeja | Toca su casilla | — |
| Tirar lo quemado | Toca la estación en rojo | — |

### Ayudas tácticas

- **El orden NUNCA importa**: los ingredientes se comparan como multiconjunto. Para que se vea, la bandeja deduce qué plato montas y pinta **huecos naranjas con lo que falta** y **marca en rojo lo que sobra** (tócalo para quitarlo).
- Cada estación muestra un **badge con las unidades que piden** los clientes en barra (descontando lo que ya llevas), y las que nadie necesita se atenúan.
- En cada tarjeta de cliente, los ingredientes que **ya tienes en la bandeja se marcan en verde**.
- Servir al cliente equivocado **no rompe el combo**: solo avisa. Solo se pierde si un cliente se cansa y se va.
- El turno **empieza cuando tú quieras** (botón «¡Abrir la caja!», con el reloj congelado) y puedes **pausar** desde el HUD en cualquier momento.

### La carta

| Plato | Se prepara con | Propina base | Disponible |
| --- | --- | --- | --- |
| ☕ **Capuchino** | Espresso + leche vaporizada | 100 | Desde el inicio |
| 🥪 **Sándwich** | Pan tostado + jamón y queso | 110 | Desde el inicio |
| 🍰 **Trozo de pastel** | Rebanada de pastel + crema batida | 90 | Desde el inicio |
| 🍋 **Pie de limón** | Rebanada de pie + merengue | 120 | Tras 3 pedidos |
| 🍫 **Mokachino** | Espresso + leche vaporizada + chocolate | 160 | Tras 6 pedidos |

Las 9 estaciones se agrupan en tres zonas con color propio: **Barra de café**, **Cocina** y **Vitrina**. Conforme sirves, llegan **más clientes a la vez, más seguido y con menos paciencia**, y se desbloquean los platos de más pasos.

## Características

- **Arte 100 % procedural en SVG**: los 5 platos y los 9 ingredientes se dibujan con código, sin una sola imagen externa. El plato del ticket y el que montas usan **el mismo motor de dibujo**, así la referencia siempre es fiel.
- **Mascota viva**: el ratoncito barista (SVG + springs) parpadea, celebra tus aciertos y se preocupa cuando el tiempo se agota o un cliente se marcha.
- **Sonido ASMR sintetizado con WebAudio** (sin archivos de audio): molinillo, vaporizador, chisporroteo de la tostadora, campana de «listo», alarma de quemado, campanilla de la puerta, arpegio de éxito y fanfarria de récord. Botón de silencio persistente.
- **Animaciones con spring physics** (Framer Motion): los ingredientes **vuelan** de la estación a la bandeja, los platos aparecen con *pop*, las tarjetas se sacuden al rechazar y el vapor sube en bucle.
- **Juega sin leer**: cada ingrediente tiene su **icono propio** reconocible (taza de espresso, jarra con vapor, tableta de chocolate, rebanada…), y el estado se comunica por color: ámbar = en proceso, verde = listo, rojo = quemado.
- **Guía inicial de 3 pasos** que **congela el reloj**: nada avanza ni se quema mientras lees, y el primer cliente entra justo al pulsar «¡Abrir la caja!».
- **Responsive de verdad** (el área jugable manda):
  - El layout se elige por **proporción de pantalla**, no por ancho y alto sueltos: así una pantalla **cuadrada** (1:1) no acaba con tres columnas estranguladas.
  - *Apaisado* (≥ 900 px y relación ≥ 1.25): **tres columnas** siguiendo el flujo de trabajo — **cocina → bandeja → clientes** —, de modo que los arrastres son cortos y naturales. Anchos con `clamp()` y `max-w-[1500px]` para no deformarse en 21:9.
  - *Cuadrado* (relación 0.8–1.25): apilado **ancho y generoso**, que aprovecha la altura (el fuerte de ese formato) con mascota y estaciones más grandes.
  - *Celular en vertical*: apilado — clientes arriba, mascota y bandeja al centro, cocina abajo.
  - *Celular en horizontal*: densidad reducida automática (fichas, botones y paneles encogen, la mascota se oculta) para que la zona de juego conserve la altura.
  - Girar el dispositivo a mitad de partida **no pierde el progreso**: ambos layouts comparten el mismo estado (`useViewport`).
- **HUD minimalista**: barra de tiempo de 5 px pegada al borde superior (roja en los últimos 10 s) y pastillas translúcidas flotantes que no roban altura.
- **Accesible y tolerante**: zonas de toque grandes, `aria-label`s descriptivos y todo jugable con arrastre o con un simple toque.

## Stack

**React 19 · TypeScript estricto · Vite 7 · Tailwind CSS 4 · Framer Motion · Lucide Icons · WebAudio API**

## Estructura de carpetas

```
Raton-Cafe/
├── index.html              # Splash "Preparando la cafetería…" + <noscript> + favicon
├── vite.config.ts          # base: '/Raton-Cafe/' (clave para GitHub Pages)
├── deploy.bat              # Commit, push y despliegue automáticos (Windows)
├── public/
│   ├── icon.svg            # Favicon: el ratoncito barista
│   └── .nojekyll           # Evita que GitHub procese el sitio con Jekyll
└── src/
    ├── main.tsx
    ├── App.tsx             # Máquina de pantallas (inicio / partida / fin)
    ├── index.css           # Tailwind 4 + fuentes redondeadas + paleta cálida
    ├── game/               # Cerebro del juego (sin React)
    │   ├── types.ts        # Tipos: estaciones, pedidos, recetas, misión…
    │   ├── recipes.ts      # La carta (5 platos) y las 9 estaciones
    │   ├── campaign.ts     # Modo carrera: 7 días × 3 turnos y sus franjas
    │   ├── balance.ts      # Ritmo del turno libre: paciencia y oleadas
    │   ├── logic.ts        # Pedidos, análisis de bandeja (multiset) y puntos
    │   ├── data.ts         # Utilidades de color y PRNG determinista
    │   ├── sound.ts        # Motor WebAudio 100 % sintetizado
    │   └── storage.ts      # Persistencia segura (a prueba de incógnito)
    ├── hooks/
    │   ├── useViewport.ts         # Medidas en vivo: retrato, altura escasa, amplio
    │   └── useTapSinArrastre.ts   # Evita la acción doble al soltar un arrastre
    ├── components/
    │   ├── Art.tsx         # Los 5 platos + iconos de ingrediente (SVG puro)
    │   ├── OrderQueue.tsx  # Clientes con barra de paciencia (fila o columna)
    │   ├── StationGrid.tsx # La cocina: progreso, listo y quemado
    │   ├── Tray.tsx        # Bandeja: qué falta, qué sobra y plato montado
    │   ├── Mascot.tsx      # Ratoncito barista con reacciones
    │   ├── Coach.tsx       # Guía inicial que pausa el turno
    │   ├── HUD.tsx         # Progreso/tiempo, propinas, combo, vidas y pausa
    │   └── Confetti.tsx · Fondo.tsx
    └── screens/            # StartScreen · MapScreen · GameScreen · EndScreen
```

## Desarrollo local

```bash
npm i           # instala dependencias
npm run dev     # servidor de desarrollo con recarga en caliente
npm run build   # compila a dist/
npm run preview # vista previa local de la build
```

## Despliegue en GitHub Pages

### Opción A — automática (Windows): `deploy.bat`

Doble clic en **`deploy.bat`** y listo: guarda el código en GitHub y publica el juego en una sola operación, con pasos numerados y manejo de errores.

1. Comprueba que `npm` existe.
2. Comprueba Git, el repositorio, el remoto `origin` y detecta la rama actual.
3. Añade los scripts `predeploy`/`deploy` a `package.json` **editándolo con `node -e`** (no rompe el JSON).
4. Verifica e inserta `base: '/Raton-Cafe/'` en `vite.config.ts` si faltara.
5. Ejecuta `npm i`.
6. Ejecuta `npm run build`; si la compilación falla, **no sube ni publica nada**.
7. Ejecuta `git add -A` y crea un commit automático **solo si hay cambios**.
8. Hace `git push` de la rama actual a `origin`.
9. Publica `dist/` con `npx gh-pages -d dist`.

La primera vez, Git puede pedir tu identidad. Configúrala una sola vez:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-correo@ejemplo.com"
```

Y **la primera vez**, activa Pages:

> **GitHub → tu repo → Settings → Pages → Build and deployment → Branch: `gh-pages` · Folder: `/ (root)`**

Tu juego quedará en: **https://coiponorte.github.io/Raton-Cafe/**

### Opción B — manual

```bash
npm i
npm run build
npx gh-pages -d dist          # crea/actualiza la rama gh-pages con dist/
# o, tras ejecutar deploy.bat una vez:
npm run deploy                # predeploy (build) + gh-pages -d dist
```

> **Nota técnica:** el `base: '/Raton-Cafe/'` debe coincidir exactamente con el nombre del repositorio. Si renombras el repo, actualiza `vite.config.ts` (o vuelve a ejecutar `deploy.bat`, que lo corrige).

## Solución de problemas

| Síntoma | Causa más probable | Solución |
| --- | --- | --- |
| **Página totalmente en blanco** al abrir la URL | **Pages está sirviendo la rama `main` en vez de `gh-pages`.** GitHub muestra el `index.html` de desarrollo, que pide `/src/main.tsx` y da 404. Es la causa del 99 % de los fallos. | Settings → Pages → Branch **`gh-pages`** · `/ (root)`. Guarda y espera 1-2 min. |
| Sigue en blanco tras corregir la rama | **Caché del navegador** (guardó el HTML viejo) | Recarga forzada con **Ctrl+F5** (o Cmd+Shift+R). Prueba también en una ventana de incógnito. |
| Pantalla *"Preparando la cafetería…"* congelada | **Error de JavaScript** al arrancar | F12 → Consola. Suele ser un deploy antiguo; vuelve a ejecutar `deploy.bat` y recarga con Ctrl+F5. |
| Carga el HTML pero el favicon o assets dan 404 | `base` de Vite distinto del nombre del repo | Debe ser exactamente `base: '/Raton-Cafe/'` en `vite.config.ts`. `deploy.bat` lo inserta/corrige solo. |
| `deploy.bat` falla con `No se esperaba ... en este momento` | Un `echo` con **paréntesis dentro de un bloque `if (...)`**: `cmd.exe` cierra el bloque antes de tiempo | Ya está resuelto en el script. Si lo editas, **no uses paréntesis** dentro de bloques `if`. |
| `git push` rechazado en el paso 8 | GitHub tiene commits que tú no tienes | Ejecuta `git pull --rebase origin main` y vuelve a lanzar `deploy.bat`. |
| `gh-pages` falla con error de permisos | Remoto sin credenciales | `git remote -v` debe apuntar a `https://github.com/coiponorte/Raton-Cafe.git`; inicia sesión con GitHub CLI (`gh auth login`) o credenciales de Git. |
| Carpetas con `_` no se publican | GitHub procesa el sitio con **Jekyll** | Ya está resuelto: `public/.nojekyll` se copia a `dist/` automáticamente. Verifica que exista en la rama `gh-pages`. |
| El récord no se guarda (modo incógnito) | El navegador bloquea localStorage | Es normal en incógnito: `src/game/storage.ts` usa un respaldo en memoria para esa sesión. |

### Notas de arquitectura

- **`src/game/`** no importa React: es lógica pura (recetas, validación, puntuación, ritmo). Se puede probar y ajustar sin tocar la interfaz; todo el equilibrio vive en `balance.ts`.
- **`src/game/storage.ts`** es el único punto que toca `localStorage` (esquema versionado + *fallback* en memoria). Para migrar a **IndexedDB** basta reescribir `leerDisco`/`escribirDisco`: el resto del juego no se entera.
- **`useTapSinArrastre`** resuelve un detalle fino de Framer Motion: un elemento con `drag` + `onTap` dispara **ambos** gestos al soltar (el puntero sigue encima), lo que duplicaba acciones. El hook marca una bandera en `onDragStart` y la limpia en un macrotask, de modo que el tap posterior se ignora.
- **Un solo bucle de juego** (`setInterval` de 100 ms) gobierna cocción, paciencia y oleadas usando *timestamps*; al pausar, todos los relojes se desplazan en bloque, así nada se quema «de fondo».
- El audio se genera con **WebAudio** en tiempo real; no hay archivos de sonido que descargar ni que fallen en la caché.

---

Hecho con cariño y mucho café. Si te gusta, dale una estrella al repositorio y sírvele una taza virtual a un amigo.
