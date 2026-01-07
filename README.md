# STATIC - Party Game Suite 🎮

**STATIC** es una colección de juegos sociales tipo "Pass-and-Play" diseñada para jugarse en grupo utilizando un único dispositivo móvil. Con una estética Cyberpunk/Minimalista, ofrece una experiencia fluida y rápida para reuniones.

## ✨ Características

*   📱 **Mobile First**: Diseñado específicamente para pantallas móviles (PWA Ready).
*   🎨 **Estética Cyberpunk**: Interfaz oscura con acentos neón y micro-interacciones.
*   ⚡ **Rendimiento**: Construido con Vite + React para máxima velocidad.
*   📴 **Offline First**: Lógica local, sin necesidad de backend complejo.

## 🕹️ Juegos Incluidos

| Juego | Estilo | Vibe |
|-------|--------|------|
| **Impostor** | Deducción Social | 🔴 Red Signal |
| **Basta** | Vocabulario / Stop | 🔵 Blue Spark |
| **Tabú** | Adivinanza | 🟣 Purple Haze |
| **Memoria** | Secuencia (Simón) | 🟢 Green Echo |

## 🛠️ Tecnologías

Este proyecto sigue una arquitectura estricta para mantenibilidad y escalabilidad:

*   **Core**: React 18 + Vite
*   **Estilos**: SCSS Modules (No inline styles, No Tailwind)
*   **Estado**: Zustand
*   **Animaciones**: Framer Motion
*   **Iconos**: Lucide React
*   **Estructura**: Feature-based Architecture (`src/features`)

## 🚀 Comenzar

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Correr servidor de desarrollo:**
    ```bash
    npm run dev
    ```

3.  **Construir para producción:**
    ```bash
    npm run build
    ```

## 📂 Estructura del Proyecto

```text
src/
├── feature/           # Módulos de juego independientes
├── shared/            # Componentes reutilizables (UI, Layouts)
├── styles/            # Configuración global de SCSS
└── app/               # Configuración de routing y providers
```

## 📝 Convenciones

*   **Alias (`@/`)**: Se utiliza `@/` para importar desde `src/`.
*   **CSS Modules**: Todo estilo debe estar en archivos `.module.scss`.
*   **Variables CSS**: Para estilos dinámicos, se usan variables CSS inyectadas vía `style` prop.

---
Desarrollado por Stiven.
