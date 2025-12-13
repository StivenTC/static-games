# PROYECTO: Arcade Fiesta (Mobile Web Suite)

## 1. RESUMEN DEL PROYECTO
Desarrollo de una "Suite de Juegos Sociales" (PWA) diseñada para jugarse en reuniones presenciales utilizando un **único dispositivo móvil** (mecánica "Pass-and-Play").
El objetivo es una UX premium, fluida ("Juicy") y visualmente atractiva con modo oscuro y acentos neón.

## 2. TECH STACK (ESTRICTO)
* **Core:** React 18+ (Vite con template \`react-swc\`).
* **Lenguaje:** JavaScript (ES6+).
* **Estilos:** SASS/SCSS Modules (\`.module.scss\`). **PROHIBIDO TAILWIND.**
* **Animaciones:** Framer Motion (para transiciones, gestos y micro-interacciones).
* **Estado Global:** Zustand.
* **Routing:** React Router DOM (v6+).
* **Utilidades:** \`classnames\` (para lógica CSS), \`lucide-react\` (iconos).
* **Empaquetado:** Vite PWA Plugin (futuro).

## 3. ARQUITECTURA DE CARPETAS (FEATURE-BASED)
No agrupar por tipo de archivo, sino por funcionalidad (Feature).

\`\`\`text
src/
├── app/                  # Configuración global
│   ├── router.jsx        # Definición de rutas
│   └── store.js          # Store global (si aplica)
│
├── assets/               # Assets estáticos globales (img, sounds, fonts)
│
├── features/             # MÓDULOS PRINCIPALES
│   ├── menu/             # Carrusel de selección de juegos
│   ├── game-impostor/    # Juego 1: Deducción social
│   ├── game-basta/       # Juego 2: Vocabulario (Stop/Tapple)
│   ├── game-tabu/        # Juego 3: Adivinanza con swipe
│   ├── game-memory/      # Juego 4: Secuencia auditiva (Simón)
│   └── legacy-web/       # Integración Iframe web antigua
│
├── shared/               # Componentes y Hooks reutilizables
│   ├── ui/               # Botones, Cards, Modales genéricos
│   ├── hooks/            # useVibration, useWakeLock, useSound
│   └── layouts/          # MainLayout (con botón Salir/Home)
│
└── styles/               # Configuración SASS Global
    ├── _variables.scss   # Colores, mixins, breakpoints
    └── main.scss         # Reset y estilos base
\`\`\`

## 4. CATÁLOGO DE JUEGOS (MVP)

### A. Impostor (The Spy)
* **Mecánica:** Roles ocultos. Se pasa el celular, se mantiene presionado para ver rol.
* **Estado:** Lista de jugadores, rol asignado, palabra secreta.
* **Vibe:** Misterio, Rojo/Negro.

### B. Basta / Stop (El Rosco)
* **Mecánica:** Categoría + Grilla de alfabeto. Tap para eliminar letra y reiniciar timer.
* **Estado:** Letras disponibles, Tiempo restante (10s), Turno actual.
* **Vibe:** Velocidad, Azul Eléctrico.

### C. Tabú
* **Mecánica:** Jugador describe palabra clave evitando las prohibidas. Gestos Swipe (Derecha=Acierto, Izquierda=Pass).
* **Vibe:** Fiesta, Amarillo/Violeta.

### D. Memoria Musical
* **Mecánica:** Secuencia de 4 botones con sonidos graciosos (no tonos puros). La secuencia crece cada turno.
* **Vibe:** Caos, Multicolor/Neón.

## 5. REGLAS DE UI/UX (MOBILE FIRST)
1.  **Cero Scroll:** Los juegos deben caber en el viewport (100vh). Evitar scrollbars.
2.  **Touch Targets:** Botones grandes (mínimo 48px).
3.  **Feedback:**
    * **Visual:** Usar \`whileTap={{ scale: 0.95 }}\` de Framer Motion en elementos interactivos.
    * **Háptico:** Usar \`navigator.vibrate\` para errores, aciertos y cambios de turno.
4.  **Estética:** Fondo oscuro (\`#1a1a2e\`). Tipografías Sans-Serif Bold para títulos.

## 6. CONVENCIONES DE CÓDIGO
* **Componentes:** Funcionales con Arrow Functions. \`export default function ComponentName() {}\`.
* **SASS Modules:** Usar \`camelCase\` para clases.
    * *Correcto:* \`.cardContainer\` -> \`styles.cardContainer\`
    * *Incorrecto:* \`.card-container\`
* **Imports:** Ordenar imports: React -> Librerías -> Componentes -> Estilos.
* **Zustand:** Crear un store independiente dentro de la carpeta de cada feature (\`features/game-impostor/logic/store.js\`).

## 7. COMANDOS ÚTILES
* \`npm run dev\`: Servidor desarrollo.
* \`npm run build\`: Producción.
`;