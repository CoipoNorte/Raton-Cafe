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

## Cómo se juega

1. **Mira el ticket**: cada cliente pide una bebida exacta (la referencia se dibuja con el mismo motor que tu taza, así que lo que ves es lo que hay).
2. **Prepara la bebida** arrastrando ingredientes a la taza… o simplemente tocándolos:
   | Categoría | Qué hace | Ingredientes |
   | --- | --- | --- |
   | **Base / espresso** | Capas apilables (máx. 3) | Ristretto, espresso, doble shot, descafeinado, cold brew |
   | **Leche / textura** | Cambia el color y el degradado | Entera, descremada, avena, almendra |
   | **Sirope / salsa** | Se vierte con animación de goteo | Vainilla, caramelo, chocolate, avellana, matcha |
   | **Toppings** | Rematan la bebida | Arte latte (corazón, roseta), crema batida, canela, cacao, malvaviscos, grano de café |
3. **SERVIR** (botón grande), **deshacer** y **limpiar** están siempre a un toque.
4. **Acierto exacto** → puntos + confetti + la taza vuela hacia el cliente + **+3 s** de tiempo.
5. **Fallo** → se rompe el combo y vibra la barra, pero **la bebida se conserva** para que la corrijas.
6. Los aciertos encadenados suben el **multiplicador de combo (hasta ×2.5)** y la dificultad crece: más capas, siropes y toppings repetidos (×2).
7. Tienes **~90 segundos** + bonificaciones. ¿Cuántos pedidos perfectos entregas?

Guarda tu **récord histórico** y la **preferencia de sonido** automáticamente (localStorage, a prueba de modo incógnito).

## Características

- **Bebidas 100 % procedurales en SVG**: capas, espuma, goteos de sirope y arte latte se dibujan al vuelo; el ticket y la taza usan el mismo motor.
- **Mascota viva**: el ratoncito barista (SVG + springs) parpadea, celebra tus aciertos y se preocupa cuando el tiempo se agota.
- **Sonido ASMR sintetizado con WebAudio** (sin archivos de audio): molinillo, vapor, chorrito, clinc de taza, arpegio de éxito y fanfarria de récord. Botón de silencio persistente.
- **Animaciones con spring physics** (Framer Motion): la taza baja con rebote, los toppings hacen *pop*, el vapor sube en bucle.
- **Responsive de verdad**:
  - *Horizontal / tablet / escritorio*: 3 columnas (ticket · taza protagonista · barra), centrado con ancho máximo.
  - *Celular en vertical*: ticket compacto arriba, taza al centro, barra inferior con una sola fila deslizable.
  - Girar el dispositivo a mitad de partida **no pierde ni la bebida ni el pedido** (`useIsPortrait`).
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
    │   ├── types.ts        # Tipos: bebida, pedido, acciones, resultado
    │   ├── balance.ts      # Constantes de equilibrio y dificultad progresiva
    │   ├── data.ts         # Ingredientes, paletas, mezcla de color, PRNG
    │   ├── logic.ts        # Pedidos, validación (multiset exacto) y puntos
    │   ├── sound.ts        # Motor WebAudio 100 % sintetizado
    │   └── storage.ts      # Persistencia segura (a prueba de incógnito)
    ├── hooks/
    │   └── useIsPortrait.ts# Orientación en vivo (reorganiza sin perder estado)
    ├── components/         # Piezas visuales
    │   ├── CupSVG.tsx      # Motor procedimental de bebidas (ticket y taza)
    │   ├── Mascot.tsx      # Ratoncito barista con reacciones
    │   ├── Ticket.tsx · IngredientBar.tsx · HUD.tsx
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

Doble clic en **`deploy.bat`** y listo. Pasos numerados con mensajes claros y manejo de errores:

1. Comprueba que `npm` existe (si no, avisa y sale).
2. Añade los scripts `predeploy`/`deploy` a `package.json` **editándolo con `node -e`** (no rompe el JSON).
3. Verifica e inserta `base: '/Raton-Cafe/'` en `vite.config.ts` si faltara.
4. Ejecuta `npm i`.
5. Ejecuta `npm run build`.
6. Publica `dist/` con `npx gh-pages -d dist`.

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
