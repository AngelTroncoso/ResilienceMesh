/**
 * Protocolos de Respuesta ante Emergencias
 * Define procedimientos específicos para cada tipo de desastre
 */

import type { EmergencyProtocol } from "@/types";

export const emergencyProtocols: Record<string, EmergencyProtocol> = {
  "incendio": {
    scenarioType: "incendio-valparaiso",
    name: "Protocolo Incendio Forestal",
    description: "Respuesta coordinada para incendios forestales urbanos con múltiples focos",
    requiredDrones: {
      search: 3,
      thermal: 2,
      vocal: 2,
      relay: 1,
    },
    estimatedResponseTime: 45,
    successCriteria: [
      "Mapeo completo del perímetro de fuego",
      "Identificación de todas las víctimas en zona de riesgo",
      "Evacuación coordinada completada",
    ],
    phases: [
      {
        name: "Fase 1: Reconocimiento Aéreo",
        description: "Evaluación inicial del perímetro y detección de focos",
        estimatedDuration: 10,
        droneAssignments: [
          {
            droneId: "Malla-Alpha-1",
            role: "search",
            task: "Sobrevolar perímetro a 150m",
            priority: "critical",
            procedure: "Capturar imágenes RGB cada 5 seg, identificar rutas de evacuación viables",
            estimatedDuration: 10,
            status: "assigned",
          },
          {
            droneId: "Malla-Beta-1",
            role: "relay",
            task: "Nodo central mesh",
            priority: "high",
            procedure: "Mantener posición elevada (200m) como nodo central, retransmitir datos",
            estimatedDuration: 45,
            status: "assigned",
          },
        ],
      },
      {
        name: "Fase 2: Búsqueda y Localización",
        description: "Identificación de personas atrapadas o en peligro",
        estimatedDuration: 15,
        droneAssignments: [
          {
            droneId: "Malla-Alpha-2",
            role: "search",
            task: "Patrón de búsqueda en cuadrícula",
            priority: "critical",
            procedure: "Detectar movimiento humano, transmitir coordenadas GPS",
            estimatedDuration: 15,
            status: "assigned",
          },
          {
            droneId: "Malla-Gamma-1",
            role: "vocal",
            task: "Comunicación con víctimas",
            priority: "high",
            procedure: "Comunicar instrucciones de evacuación, guiar a puntos de encuentro",
            estimatedDuration: 15,
            status: "assigned",
          },
        ],
      },
      {
        name: "Fase 3: Coordinación de Evacuación",
        description: "Guiar a víctimas hacia zonas seguras",
        estimatedDuration: 20,
        droneAssignments: [
          {
            droneId: "Malla-Gamma-2",
            role: "vocal",
            task: "Guía de evacuación",
            priority: "critical",
            procedure: "Proyectar señales luminosas LED azules, transmitir rutas de escape seguras",
            estimatedDuration: 20,
            status: "assigned",
          },
        ],
      },
    ],
    phaseSequence: [], // Para compatibilidad
  },

  "terremoto": {
    scenarioType: "terremoto-santiago",
    name: "Protocolo Sismo Mayor",
    description: "Respuesta post-terremoto para búsqueda en edificios colapsados",
    requiredDrones: {
      search: 4,
      thermal: 3,
      vocal: 2,
      relay: 2,
    },
    estimatedResponseTime: 60,
    successCriteria: [
      "Inspección estructural completada",
      "Localización de víctimas atrapadas",
      "Red de comunicaciones establecida",
    ],
    phases: [
      {
        name: "Fase 1: Evaluación de Daños",
        description: "Inspección rápida de estructuras colapsadas",
        estimatedDuration: 15,
        droneAssignments: [
          {
            droneId: "Malla-Alpha-1",
            role: "search",
            task: "Inspección estructural",
            priority: "critical",
            procedure: "Fotografía 360° de edificios dañados, clasificar daños",
            estimatedDuration: 15,
            status: "assigned",
          },
        ],
      },
      {
        name: "Fase 2: Localización de Víctimas",
        description: "Detección de personas bajo escombros",
        estimatedDuration: 25,
        droneAssignments: [
          {
            droneId: "Malla-Gamma-1",
            role: "vocal",
            task: "Comunicación con atrapados",
            priority: "critical",
            procedure: "Transmitir mensajes de calma, solicitar respuesta verbal",
            estimatedDuration: 25,
            status: "assigned",
          },
        ],
      },
      {
        name: "Fase 3: Coordinación de Rescate",
        description: "Guiar equipos de rescate a ubicaciones prioritarias",
        estimatedDuration: 20,
        droneAssignments: [
          {
            droneId: "Malla-Beta-1",
            role: "relay",
            task: "Red de emergencia",
            priority: "critical",
            procedure: "Enlace con bomberos y SAMU, transmitir coordenadas GPS",
            estimatedDuration: 20,
            status: "assigned",
          },
        ],
      },
    ],
    phaseSequence: [],
  },

  "inundacion": {
    scenarioType: "inundacion-maule",
    name: "Protocolo Inundación",
    description: "Rescate acuático y evacuación de zonas inundadas",
    requiredDrones: {
      search: 3,
      thermal: 1,
      vocal: 3,
      relay: 1,
    },
    estimatedResponseTime: 50,
    successCriteria: [
      "Mapeo de zonas inundadas",
      "Localización de personas aisladas",
      "Evacuación completada",
    ],
    phases: [
      {
        name: "Fase 1: Mapeo de Inundación",
        description: "Delimitación de zonas afectadas por agua",
        estimatedDuration: 12,
        droneAssignments: [
          {
            droneId: "Malla-Alpha-1",
            role: "search",
            task: "Mapeo de extensión",
            priority: "critical",
            procedure: "Identificar puntos elevados con personas atrapadas",
            estimatedDuration: 12,
            status: "assigned",
          },
        ],
      },
      {
        name: "Fase 2: Priorización de Rescates",
        description: "Identificar casos más urgentes",
        estimatedDuration: 18,
        droneAssignments: [
          {
            droneId: "Malla-Gamma-1",
            role: "vocal",
            task: "Instrucciones de supervivencia",
            priority: "critical",
            procedure: "Comunicar tiempo estimado de rescate, mantener moral",
            estimatedDuration: 18,
            status: "assigned",
          },
        ],
      },
      {
        name: "Fase 3: Guía de Rescate",
        description: "Coordinar con botes y equipos terrestres",
        estimatedDuration: 20,
        droneAssignments: [
          {
            droneId: "Malla-Beta-1",
            role: "relay",
            task: "Comunicaciones de rescate",
            priority: "high",
            procedure: "Enlace entre botes, helicópteros y centro de comando",
            estimatedDuration: 20,
            status: "assigned",
          },
        ],
      },
    ],
    phaseSequence: [],
  },

  "errupcion": {
    scenarioType: "errupcion-araucania",
    name: "Protocolo Erupción Volcánica",
    description: "Evacuación masiva y monitoreo de flujos piroclásticos",
    requiredDrones: {
      search: 2,
      thermal: 3,
      vocal: 3,
      relay: 1,
    },
    estimatedResponseTime: 40,
    successCriteria: [
      "Monitoreo continuo de flujos de lava",
      "Evacuación de comunidades completada",
      "Red de emergencia activa",
    ],
    phases: [
      {
        name: "Fase 1: Monitoreo Volcánico",
        description: "Vigilancia de flujos piroclásticos",
        estimatedDuration: 15,
        droneAssignments: [
          {
            droneId: "Malla-Alpha-1",
            role: "search",
            task: "Mapeo de flujos",
            priority: "critical",
            procedure: "Delimitar zonas de exclusión, actualizar perímetro cada 5 min",
            estimatedDuration: 15,
            status: "assigned",
          },
        ],
      },
      {
        name: "Fase 2: Alerta y Evacuación",
        description: "Notificación a comunidades en riesgo",
        estimatedDuration: 15,
        droneAssignments: [
          {
            droneId: "Malla-Gamma-1",
            role: "vocal",
            task: "Alerta de evacuación",
            priority: "critical",
            procedure: "Transmitir alerta inmediata, indicar rutas de escape",
            estimatedDuration: 15,
            status: "assigned",
          },
        ],
      },
      {
        name: "Fase 3: Corredores Seguros",
        description: "Mantener rutas de evacuación despejadas",
        estimatedDuration: 10,
        droneAssignments: [
          {
            droneId: "Malla-Beta-1",
            role: "relay",
            task: "Coordinación con ONEMI",
            priority: "critical",
            procedure: "Enlace con autoridades, coordinar llegada de refuerzos",
            estimatedDuration: 10,
            status: "assigned",
          },
        ],
      },
    ],
    phaseSequence: [],
  },
};

// Sincronizar phaseSequence con phases para compatibilidad
Object.keys(emergencyProtocols).forEach((key) => {
  emergencyProtocols[key].phaseSequence = emergencyProtocols[key].phases;
});
