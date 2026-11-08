# 🎧 Claichy - Reproductor de Música Universal & Audiófilo

<p align="center">
  <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80" alt="Claichy Music Banner" width="100%" style="border-radius: 16px;" />
</p>

**Claichy** es una aplicación moderna de reproducción musical diseñada con una estética audiófila en tonos ámbar y oro (estilo estudio de sonido), que reproduce música de todos los artistas del mundo de forma 100% legal mediante la API oficial de YouTube (en segundo plano y sin ventanas molestas), permitiendo la creación de listas de reproducción personalizadas y un modo sin conexión (Offline).

---

## ✨ Características Principales

- 🎵 **Música de Todos los Artistas**: Búsqueda universal conectada en tiempo real a la API de YouTube. Encuentra cualquier canción, álbum o artista del mundo.
- 📀 **Estilo Audiófilo Único**: Interfaz inspirada en mesas de sonido profesionales, consolas analógicas y tornamesas con discos de vinilo giratorios interactivos.
- 🚫 **Cero Popups de YouTube**: La reproducción de audio se gestiona de forma legal y limpia en segundo plano, sin ventanas invasivas superpuestas.
- 📱 **100% Responsivo en Celulares y Laptops**:
  - Vista adaptada a pantallas móviles (360px a 430px) con barra de navegación inferior táctil (`BottomNav`) y mini-reproductor flotante.
  - Reproductor a pantalla completa deslizable en celulares.
  - Optimizado para laptops y escritorios a resolución 1920x1080.
- 💾 **Bóveda Sin Conexión (Offline)**: Guarda canciones en almacenamiento local seguro (IndexedDB) para escucharlas sin internet o en modo avión.
- 📂 **Listas de Reproducción Personalizadas**: Crea, edita, renombra y gestiona tus colecciones musicales y canciones favoritas.
- 🎤 **Letras Sincronizadas**: Visualizador de letras integrado en tiempo real.
- 🔗 **Compartir con Amigos**: Generador de código QR y enlaces rápidos para compartir por WhatsApp o Telegram.

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- `npm` o `pnpm` / `bun`

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/TU-USUARIO/claichy.git
   cd claichy
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en tu navegador:**
   Visita [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/), animaciones fluidas y diseño responsivo
- **Iconos**: [Lucide React](https://lucide.dev/)
- **Backend / Proxy**: [Express](https://expressjs.com/) para búsqueda en vivo y endpoints de API
- **Reproducción de Audio**: YouTube IFrame API legal & Web Audio API Synth Engine
- **Almacenamiento Local**: IndexedDB para caché de audio offline

---

## 📜 Licencia

Distribuido bajo la Licencia MIT. Consulta `LICENSE` para más detalles.
