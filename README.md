# Ratón Café

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

## Desarrollo local

```bash
npm i          # instala dependencias
npm run dev    # servidor de desarrollo con recarga en caliente
npm run build  # compila a dist/
npm run preview# vista previa local de la build
```

## Despliegue en GitHub Pages

### Opción A — automática (Windows): `deploy.bat`

Doble clic en **`deploy.bat`** y listo. Ahora guarda el código fuente en GitHub y publica el juego en una sola operación:

1. Comprueba que `npm` existe (si no, avisa y sale).
2. Comprueba Git, el repositorio, el remoto `origin` y detecta la rama actual.
3. Añade los scripts `predeploy`/`deploy` a `package.json` **editándolo con `node -e`** (no rompe el JSON).
4. Verifica e inserta `base: '/Raton-Cafe/'` en `vite.config.ts` si faltara.
5. Ejecuta `npm i`.
6. Ejecuta `npm run build`; si la compilación falla, no sube ni publica nada.
7. Ejecuta `git add -A` y crea un commit automático **solo si hay cambios**.
8. Hace `git push` de la rama actual a `origin` (normalmente `main`).
9. Publica `dist/` con `npx gh-pages -d dist`.

El mensaje usado para cada commit automático es `Actualizacion automatica de Raton Cafe`. Si no hay cambios pendientes, el paso de commit se omite sin producir un error, pero el script verifica igualmente el `push` y despliega la versión compilada.

La primera vez, Git puede pedir tu identidad. Configúrala una sola vez:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-correo@ejemplo.com"
```

Al terminar, **la primera vez**, activa Pages:

> **GitHub → tu repo → Settings → Pages → Build and deployment → Branch: `gh-pages` · Folder: `/ (root)`**

Tu juego quedará en: **https://coiponorte.github.io/Raton-Cafe/**

### Opción B — manual

```bash
npm i
npm run build
npx gh-pages -d dist          # crea/actualiza la rama gh-pages con dist/
# o, tras ejecutar deploy.bat una vez:
npm run deploy                # hace predeploy (build) + gh-pages -d dist
```

> **Nota técnica:** el `base: '/Raton-Cafe/'` debe coincidir exactamente con el nombre del repositorio. Si renombras el repo, actualiza `vite.config.ts` (o vuelve a ejecutar `deploy.bat`, que lo corrige).

## Solución de problemas

| Síntoma | Causa más probable | Solución |
| --- | --- | --- |
| **Página totalmente en blanco** al abrir la URL | **Pages está sirviendo la rama `main` en vez de `gh-pages`.** GitHub muestra el `index.html` de desarrollo, que pide `/src/main.tsx` y da 404. Es la causa del 99 % de los fallos. | Settings → Pages → Branch **`gh-pages`** · `/ (root)`. Guarda y espera 1-2 min. |
| Sigue en blanco tras corregir la rama | **Caché del navegador** (guardó el HTML viejo) | Recarga forzada con **Ctrl+F5** (o Cmd+Shift+R). Abre también una ventana de incógnito para comprobar. |
| Pantalla *"Preparando la cafetería…"* congelada | **Error de JavaScript** al arrancar | F12 → Consola. Suele ser un deploy antiguo; vuelve a ejecutar `deploy.bat` y recarga con Ctrl+F5. |
| Carga el HTML pero el favicon o assets dan 404 | `base` de Vite distinto del nombre del repo | Debe ser exactamente `base: '/Raton-Cafe/'` en `vite.config.ts`. `deploy.bat` lo inserta/corrige solo. |
| Carpetas de `_` no se publican | GitHub procesa el sitio con **Jekyll** | Ya está resuelto: `public/.nojekyll` se copia a `dist/` automáticamente. Verifica que exista en la rama `gh-pages`. |
| `gh-pages` falla con error de permisos | Remoto sin credenciales | `git remote -v` debe apuntar a `https://github.com/coiponorte/Raton-Cafe.git`; inicia sesión con GitHub CLI (`gh auth login`) o credenciales de Git. |
| `deploy.bat` falla en el paso 2 | `package.json` corrupto o bloqueado | Cierra editores con el archivo abierto y restaura `package.json` (`git checkout -- package.json`) antes de reintentar. |
| El récord no se guarda (modo incógnito) | El navegador bloquea localStorage | Es normal en incógnito: `src/game/storage.ts` usa un respaldo en memoria para esa sesión. |

### Notas de arquitectura

- **`src/game/storage.ts`** es el único punto que toca `localStorage` (esquema versionado + *fallback* en memoria). Para migrar a **IndexedDB** basta reescribir `leerDisco`/`escribirDisco` con la misma forma de datos: el resto del juego no se entera.
- El audio se genera con **WebAudio** en tiempo real; no hay archivos de sonido que descargar ni que fallen en la caché.

---

Hecho con cariño y mucho café. Si te gusta, dale una estrella al repositorio y sírvele una taza virtual a un amigo.
