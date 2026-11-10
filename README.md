# ResilienceMesh Chile
**ResilienceMesh Chile: Malla Agéntica de Respuesta ante Emergencias con Drones**
## 📡 Descripción General
## 🛠️ Stack Tecnológico
## 📦 Instalación y Despliegue
## 🌍 Escenarios Críticos Configurables
## 🏗️ Arquitectura del Sistema
## 🛠️ Stack Tecnológico Detalle

| Categoría | Tecnologías |
|-----------|-------------|
| **Frontend** | React 18, TypeScript, Next.js 14 App Router |
| **Estilizado** | Tailwind CSS 3, Modo oscuro `slate-950`, Shadcn/UI |
| **Iconografía** | Lucide-react (iconos tácticos drones/emergencias) |
| **Mapas** | React-Leaflet + Leaflet, estilos custom dark/táctico |
| **Estado Global** | Zustand + React Context (simulador integrado) |
| **Gráficos** | Recharts (KPIs y indicadores) |
| **Simulación** | Motor propio simulation-engine.ts (telemetría, batería, consenso) |
| **Despliegue** | Vercel (configuración Next.js optimizada) |

### Tres Capas de la Malla Agéntica

| Capa | Descripción | Agentes |
|------|-------------|---------|
| **Capa 1: Edge Drones** | Agentes individuales con roles específicos | `NavAgent` (evasión y vuelo), `VisionAgent` (térmica/RGB), `VocalAgent` (voz/diálogo) |
| **Capa 2: Cuadrillas Especializadas** | Grupos de drones trabajando en coordinación | • **Búsqueda y Triaje** (3 drones)<br>• **Interacción y Suministros** (2 drones)<br>• **Relay Telecom** (2 drones Mesh) |
| **Capa 3: Meta-Agente Coordinador** | Gobernanza, balanceo y validación HITL | Orquestación zonal, balanceo de batería, validación cruzada, aprobación humana |

| Escenario | Región | Color UI | Drones Asignados |
|-----------|--------|----------|------------------|
| **Incendio Forestal** | Valparaíso / Viña del Mar | 🔴 Rojo Alerta | Malla-Alpha-1 (Búsqueda), Malla-Alpha-2 (Térmico), Malla-Beta-1 (Vocal) |
| **Terremoto y Colapso** | Santiago / Zona Central | 🟢 Verde Telemetría | Malla-Alpha-1, Malla-Beta-2, Malla-Beta-3 |
| **Inundación y Anegamiento** | Zona Sur / Maule | 🟡 Amarillo Riesgo | Malla-Alpha-1, Malla-Relay-1, Malla-Relay-2 |
| **Erupción Volcánica** | Araucanía / Los Ríos | 🟡 Amarillo Riesgo | Malla-Alpha-1, Malla-Alpha-2, Malla-Relay-1 |

### Requisitos Previos

- Node.js 18+ 
- npm/yarn/pnpm

### Pasos para Despliegue en Vercel

```bash
# 1. Clonar el repositorio
git clone https://github.com/AngelTroncoso/ResilienceMesh.git

# 2. Instalar dependencias
cd ResilienceMesh
npm install

# 3. Ejecutar en desarrollo
npm run dev

# 4. Construir para producción
npm run build

# 5. Desplegar en Vercel
vercel
# o conectar el repositorio directamente en vercel.com
```

### Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo con turbopack |
| `npm run build` | Genera la build de producción |
| `npm start` | Ejecuta la aplicación en producción |
| `npm run lint` | Ejecuta el linter de Next.js |

| Categoría | Tecnologías |
|-----------|-------------|
| **Framework** | Next.js 14+ con App Router, TypeScript |
| **Estilos y UI** | Tailwind CSS, Shadcn/UI, Lucide-react |
| **Visualización de Mapas** | React-Leaflet + Leaflet (estilo dark/táctico) |
| **Manejo de Estado** | React Context + Zustand (con simulador integrado) |
| **Modelos/APIs** | Simulación funcional de LLM Multimodal (mock) |
| **Gráficos y KPIs** | Recharts |
| **Build/Deploy** | Next.js Build → Vercel |

ResilienceMesh Chile es una aplicación web de tipo Centro de Mando de Emergencias (EOC) que prototipea la coordinación de una malla agéntica de drones para respuesta ante desastres en territorio chileno. La aplicación combina visualización de mapas interactivos, simulación de telemetría en tiempo real, y una interfaz táctica para la gestión de escenarios de emergencia.

> Prototipo web interactivo y totalmente funcional que simula un sistema de respuesta coordinada ante desastres utilizando una malla agéntica de drones, diseñado para operar como un Centro de Mando de Emergencias (EOC) con visualización en tiempo real, simulación de telemetría y interacción víctima-dron.
