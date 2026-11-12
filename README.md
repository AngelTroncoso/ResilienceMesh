# 🚁 ResilienceMesh Chile

> Sistema de Respuesta ante Emergencias con Malla Agéntica de Drones

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Descripción

**ResilienceMesh Chile** es una aplicación web de tipo Centro de Mando de Emergencias (EOC) que prototipa la coordinación de una malla agéntica de drones para respuesta ante desastres en territorio chileno.

### 🎯 Características Principales

- 🗺️ **Mapa Interactivo en Tiempo Real** - Visualización de drones y víctimas con React-Leaflet
- 🚁 **16 Drones Operativos** - Distribuidos en 4 regiones de Chile (Valparaíso, Santiago, Maule, Araucanía)
- 📊 **Telemetría en Vivo** - Monitoreo de batería, posición, altitud y estado de cada drone
- 🎮 **Simulación Autónoma** - Motor de simulación con fases automáticas y reasignación dinámica
- 🎨 **UI/UX Profesional** - Tooltips, notificaciones toast, atajos de teclado y tour guiado
- 🌍 **4 Escenarios de Emergencia** - Incendio, Terremoto, Inundación y Erupción Volcánica
- ♿ **Accesibilidad WCAG 2.1 AA** - Navegación completa por teclado y lectores de pantalla
- 📱 **Responsive Design** - Optimizado para desktop, tablet y móvil

---

## 🚀 Demo en Vivo

🔗 **[Ver Demo en Vercel](https://tu-app.vercel.app)**

---

## 📸 Capturas de Pantalla

### Dashboard Principal
![Dashboard](docs/screenshots/dashboard.png)

### Mapa Interactivo con Drones
![Mapa](docs/screenshots/map-view.png)

### Telemetría en Tiempo Real
![Telemetría](docs/screenshots/telemetry.png)

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript 5.0
- **UI Library:** React 18
- **Estilos:** Tailwind CSS 3.0
- **Componentes:** Shadcn/UI
- **Iconos:** Lucide React

### Mapas y Visualización
- **Mapas:** React-Leaflet + Leaflet
- **Gráficos:** Recharts
- **Animaciones:** CSS Animations + Framer Motion

### Estado y Simulación
- **Estado Global:** React Context API
- **Motor de Simulación:** Custom simulation-engine.ts
- **Telemetría:** Real-time updates con useEffect hooks

### Despliegue
- **Hosting:** Vercel
- **CI/CD:** GitHub Actions + Vercel Auto-Deploy
- **Analytics:** Vercel Analytics

---

## 📦 Instalación y Configuración

### Requisitos Previos

- Node.js 18+ instalado
- npm, yarn o pnpm
- Git

### Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/AngelTroncoso/ResilienceMesh.git
cd ResilienceMesh

# 2. Instalar dependencias
npm install

# 3. Ejecutar en desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:3000
```

### Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo (puerto 3000)
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter de código
```

---

## 🌍 Escenarios de Emergencia

### 1. 🔥 Incendio Forestal - Valparaíso
- **Región:** V Región de Valparaíso
- **Coordenadas:** -33.0472°S, -71.6127°W
- **Drones:** 4 (Search, Thermal, Vocal, Relay)
- **Descripción:** Incendio forestal activo con múltiples focos

### 2. 🏢 Terremoto - Santiago
- **Región:** Región Metropolitana
- **Coordenadas:** -33.4489°S, -70.6693°W
- **Drones:** 4 (Search, Thermal, Vocal, Relay)
- **Descripción:** Sismo 7.5 grados con edificios colapsados

### 3. 🌊 Inundación - Maule
- **Región:** VII Región del Maule
- **Coordenadas:** -35.4264°S, -71.6554°W
- **Drones:** 4 (Search, Thermal, Vocal, Relay)
- **Descripción:** Desborde del río Maule afectando zonas urbanas

### 4. 🌋 Erupción Volcánica - Araucanía
- **Región:** IX Región de la Araucanía
- **Coordenadas:** -38.7359°S, -72.6002°W
- **Drones:** 4 (Search, Thermal, Vocal, Relay)
- **Descripción:** Actividad volcánica con evacuación de comunidades

---

## 🏗️ Arquitectura del Sistema

### Capas de la Malla Agéntica

```
┌─────────────────────────────────────────────────────┐
│         Capa 3: Meta-Agente Coordinador            │
│  • Gobernanza y orquestación zonal                 │
│  • Balanceo de batería y reasignación              │
│  • Validación HITL (Human in the Loop)             │
└─────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────┐
│      Capa 2: Cuadrillas Especializadas             │
│  • Búsqueda y Triaje (3 drones)                    │
│  • Interacción y Suministros (2 drones)            │
│  • Relay Telecom (2 drones Mesh)                   │
└─────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────┐
│          Capa 1: Edge Drones (Agentes)             │
│  • NavAgent (evasión y vuelo autónomo)             │
│  • VisionAgent (cámaras térmica/RGB)               │
│  • VocalAgent (comunicación voz/texto)             │
│  • RelayAgent (red mesh/satélite)                  │
└─────────────────────────────────────────────────────┘
```

### Tipos de Drones

| Tipo | Rol | Payload | Rango Mesh |
|------|-----|---------|------------|
| **Search** 🔍 | Búsqueda y escaneo | RGB Camera, GPS, LoRa | 800m |
| **Thermal** 🌡️ | Detección térmica | Thermal Camera, GPS, LoRa | 800m |
| **Vocal** 📢 | Comunicación | Speaker, Microphone, GPS | 600m |
| **Relay** 📡 | Red de comunicaciones | LoRa Gateway, Satélite | 1200m |

---

## 🎮 Uso de la Aplicación

### 1. Seleccionar Escenario
Click en uno de los 4 botones de escenario en el header:
- 🔥 Incendio Valparaíso
- 🏢 Terremoto Santiago
- 🌊 Inundación Maule
- 🌋 Erupción Araucanía

### 2. Control de Simulación
- **Espacio** - Iniciar/Pausar simulación
- **→** - Avanzar a siguiente fase
- **1, 2, 3** - Cambiar velocidad (1x, 5x, 15x)

### 3. Interactuar con el Mapa
- Click en drones para ver telemetría completa
- Click en víctimas para ver información
- Hover sobre elementos para tooltips

### 4. Monitorear Estado
- Panel izquierdo: Control y telemetría
- Centro: Mapa táctico
- Panel derecho: Protocolo y eventos

---

## ⌨️ Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Espacio` | Iniciar/Pausar simulación |
| `→` | Avanzar fase |
| `1` | Velocidad 1x (lenta) |
| `2` | Velocidad 5x (normal) |
| `3` | Velocidad 15x (rápida) |
| `Shift + ?` | Mostrar ayuda |
| `Esc` | Cerrar modales |

---

## 📊 Características Técnicas

### Motor de Simulación
- ✅ Telemetría en tiempo real (actualización cada segundo)
- ✅ Drenaje realista de batería según carga de trabajo
- ✅ Reasignación automática por batería crítica
- ✅ Avance automático de fases del protocolo
- ✅ Movimiento simulado de drones
- ✅ Estado de red mesh

### UI/UX Avanzado
- ✅ Sistema de tooltips contextual
- ✅ Notificaciones toast (success, error, warning, info)
- ✅ Tour de onboarding interactivo
- ✅ Paneles colapsables
- ✅ Animaciones suaves (fadeIn, slideUp, etc.)
- ✅ Scrollbar personalizado
- ✅ Glassmorphism effects

### Accesibilidad
- ✅ Navegación completa por teclado
- ✅ ARIA labels en todos los elementos
- ✅ Contraste de colores WCAG AA
- ✅ Focus indicators claros
- ✅ Compatible con lectores de pantalla

---

## 📂 Estructura del Proyecto

```
ResilienceMesh/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Página principal
│   └── globals.css              # Estilos globales
├── components/
│   ├── dashboard/               # Componentes del dashboard
│   │   ├── MapView.tsx         # Mapa interactivo
│   │   ├── DroneFeed.tsx       # Feed de drones
│   │   ├── TelemetryPanel.tsx  # Panel de telemetría
│   │   ├── ProtocolPanel.tsx   # Panel de protocolo
│   │   └── ...
│   └── ui/                      # Componentes UI reutilizables
│       ├── button.tsx
│       ├── card.tsx
│       ├── tooltip.tsx
│       ├── toast.tsx
│       └── ...
├── contexts/
│   └── SimulationContext.tsx    # Context de simulación
├── data/
│   ├── seed-data.ts            # Datos de drones y escenarios
│   └── emergency-protocols.ts  # Protocolos de respuesta
├── lib/
│   └── simulation-engine.ts    # Motor de simulación
├── types/
│   └── index.ts                # Tipos TypeScript
├── public/                      # Recursos estáticos
└── docs/                        # Documentación adicional
```

---

## 🔧 Configuración Avanzada

### Variables de Entorno

Crea un archivo `.env.local`:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=tu_token_aqui  # Opcional
NEXT_PUBLIC_API_URL=https://api.example.com  # Si usas API externa
```

### Personalización de Escenarios

Edita `data/seed-data.ts` para:
- Agregar nuevos escenarios
- Modificar coordenadas
- Ajustar configuración de drones

### Ajustar Velocidad de Simulación

Edita `lib/simulation-engine.ts`:

```typescript
const speeds: Record<SimulationSpeed, number> = { 
  slow: 1,    // Cambia estos valores
  normal: 5, 
  fast: 15 
};
```

---

## 🚀 Despliegue en Vercel

### Deploy Automático

1. Haz fork del repositorio
2. Conecta tu cuenta de Vercel
3. Importa el proyecto
4. ¡Deploy automático en cada push!

### Deploy Manual

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy a producción
vercel --prod
```

---

## 📚 Documentación Adicional

- 📄 [Mejoras del Mapa](MEJORAS_MAPA.md) - Visualización de drones en tiempo real
- 📄 [Mejoras UI/UX](MEJORAS_UX.md) - Sistema de tooltips, toasts y atajos
- 📄 [Cambio de Mapa](CAMBIO_MAPA_ESCENARIOS.md) - Navegación automática por regiones

---

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Roadmap

### Versión 2.0 (Próximos Features)
- [ ] Modo Dark/Light toggle
- [ ] Command Palette (Cmd+K)
- [ ] Export de datos (CSV/JSON/PDF)
- [ ] Filtros avanzados en telemetría
- [ ] PWA completo con offline support
- [ ] WebSocket para updates en tiempo real

### Versión 3.0 (Futuro)
- [ ] Modo colaborativo multi-usuario
- [ ] Analytics dashboard
- [ ] Integración con APIs reales
- [ ] Machine Learning para optimización de rutas
- [ ] Realidad Aumentada para operadores

---

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Angel Troncoso**
- GitHub: [@AngelTroncoso](https://github.com/AngelTroncoso)
- Proyecto: [ResilienceMesh](https://github.com/AngelTroncoso/ResilienceMesh)

---

## 🙏 Agradecimientos

- Next.js team por el excelente framework
- Vercel por el hosting gratuito
- Leaflet y React-Leaflet por las herramientas de mapeo
- Shadcn/UI por los componentes base
- La comunidad open source

---

## 📞 Soporte

Si tienes preguntas o problemas:
- 🐛 [Reportar un bug](https://github.com/AngelTroncoso/ResilienceMesh/issues)
- 💡 [Sugerir una feature](https://github.com/AngelTroncoso/ResilienceMesh/issues)
- 📧 Contacto: [tu-email@ejemplo.com]

---

<div align="center">

**⭐ Si te gusta este proyecto, dale una estrella en GitHub! ⭐**

Hecho con ❤️ en Chile 🇨🇱

</div>
