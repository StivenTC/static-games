# PROYECTO: STATIC (Party Game Suite)

## 1. RESUMEN DEL PROYECTO
Desarrollo de una "Suite de Juegos Sociales" (PWA) llamada **STATIC**. Diseñada para jugarse en reuniones presenciales utilizando un **único dispositivo móvil** (mecánica "Pass-and-Play").
La estética es "Cyberpunk Minimalista": Fondo oscuro, efectos de ruido/glitch, y acentos neón para diferenciar los juegos.

## 2. TECH STACK (ESTRICTO)
* **Core:** React 18+ (Vite con template `react-swc`).
* **Lenguaje:** JavaScript (ES6+).
* **Estilos:** SASS/SCSS Modules (`.module.scss`).
    *   **⛔ PROHIBIDO:** TailwindCSS.
    *   **⛔ PROHIBIDO:** Estilos en línea (`style={{ color: 'red' }}`). Usar variables CSS (`style={{ '--color': 'red' }}`) si es dinámico.
* **Animaciones:** Framer Motion (para transiciones, gestos y micro-interacciones).
* **Estado Global:** Zustand.
* **Routing:** React Router DOM (v6+).
* **Utilidades:** `classnames`, `lucide-react`.
* **Imports:** **OBLIGATORIO** usar Alias `@/` para referencias a `src/`.
    *   ✅ `import Component from '@/shared/ui/Component'`
    *   ❌ `import Component from '../../../../shared/ui/Component'`

## 3. ARQUITECTURA DE CARPETAS (FEATURE-BASED)
No agrupar por tipo de archivo, sino por funcionalidad (Feature).

```text
src/
├── app/                  # Configuración global (router, providers)
├── assets/               # Assets estáticos globales
├── features/             # MÓDULOS PRINCIPALES (Juegos)
│   ├── menu/             # Menú principal
│   ├── game-impostor/    # "Red Signal"
│   ├── game-basta/       # "Blue Spark"
│   ├── game-tabu/        # "Purple Haze"
│   └── game-memory/      # "Green Echo"
│
├── shared/               # Reutilizables
│   ├── ui/               # Button, Input, Timer, GameSetup
│   ├── hooks/            # useGameFeedback, useWakeLock
│   ├── layouts/          # MainLayout
│   ├── stores/           # Stores compartidos (usePlayerStore)
│   └── utils/            # Helpers
│
└── styles/               # Configuración Global
    ├── _variables.scss   # Variables SASS ($neon-red, etc.)
    ├── theme.module.scss # Exportación de variables a JS
    └── main.scss         # Reset y bases
```

### REGLA DE ORGANIZACIÓN DE PANTALLAS
Cada pantalla debe tener su propia carpeta:
*   ✅ `src/features/game-tabu/screens/TabuPlay/TabuPlay.jsx`
*   ✅ `src/features/game-tabu/screens/TabuPlay/TabuPlay.module.scss`

## 4. DESIGN SYSTEM: "STATIC AESTHETIC"
* **Fuente de Verdad:**
    *   SASS: `src/styles/_variables.scss`
    *   JS: `import theme from '@/styles/theme.module.scss'`
* **Colores:**
    *   Fondo: `$bg-dark` (#121212)
    *   Acentos: `$neon-red`, `$neon-blue`, `$neon-purple`, `$neon-green`.
* **Dinámismo:**
    *   Para colores dinámicos (ej. avatares de jugadores), inyectar variables CSS en el componente y consumirlas en SCSS:
    *   JSX: `style={{ '--player-color': player.color }}`
    *   SCSS: `background-color: var(--player-color);`

## 5. CATÁLOGO DE JUEGOS

### A. Impostor (Red Signal)
*   **Mecánica:** Roles ocultos, votación.
*   **Color:** Neon Red.

### B. Basta / Stop (Blue Spark)
*   **Mecánica:** Vocabulario veloz.
*   **Color:** Neon Blue.

### C. Tabú (Purple Haze)
*   **Mecánica:** Descripción de palabras.
*   **Color:** Neon Purple.

### D. Memoria (Green Echo)
*   **Mecánica:** Secuencia auditiva/visual (Simon).
*   **Color:** Neon Green.

## 6. REGLAS DE UI/UX
1.  **Cero Scroll:** Viewport fijo (100vh).
2.  **Touch Targets:** Mínimo 48px.
3.  **Feedback Háptico:** `navigator.vibrate` en interacciones clave.

## 7. COMANDOS
* `npm run dev`: Servidor desarrollo.
* `npm run build`: Producción.