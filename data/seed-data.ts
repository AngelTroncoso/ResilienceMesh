/**
 * Datos de semilla para la simulación de ResilienceMesh Chile
 */

import type { DroneSpec, Victim, ScenarioConfig, EmergencyScenario } from "@/types";

// Configuraciones de escenarios
export const scenarioConfigs: Record<EmergencyScenario, ScenarioConfig> = {
  "incendio-valparaiso": {
    id: "incendio-valparaiso",
    name: "Incendio Forestal Valparaíso",
    description: "Incendio forestal activo en Valparaíso con múltiples focos",
    center: {
      lat: -33.0472,
      lng: -71.6127,
      city: "Valparaíso",
      region: "Valparaíso"
    },
    zoom: 13,
    color: "#ef4444",
    drones: ["drone-search-1", "drone-thermal-1", "drone-vocal-1", "drone-relay-1"]
  },
  "terremoto-santiago": {
    id: "terremoto-santiago",
    name: "Terremoto Santiago",
    description: "Sismo 7.5 grados con múltiples edificios colapsados",
    center: {
      lat: -33.4489,
      lng: -70.6693,
      city: "Santiago",
      region: "Metropolitana"
    },
    zoom: 12,
    color: "#f59e0b",
    drones: ["drone-search-2", "drone-thermal-2", "drone-vocal-2", "drone-relay-2"]
  },
  "inundacion-maule": {
    id: "inundacion-maule",
    name: "Inundación Maule",
    description: "Desborde del río Maule afectando zonas urbanas",
    center: {
      lat: -35.4264,
      lng: -71.6554,
      city: "Talca",
      region: "Maule"
    },
    zoom: 12,
    color: "#3b82f6",
    drones: ["drone-search-3", "drone-thermal-3", "drone-vocal-3", "drone-relay-3"]
  },
  "errupcion-araucania": {
    id: "errupcion-araucania",
    name: "Erupción Volcánica Araucanía",
    description: "Actividad volcánica con evacuación de comunidades cercanas",
    center: {
      lat: -38.7359,
      lng: -72.6002,
      city: "Temuco",
      region: "Araucanía"
    },
    zoom: 11,
    color: "#dc2626",
    drones: ["drone-search-4", "drone-thermal-4", "drone-vocal-4", "drone-relay-4"]
  }
};

// Flota de drones
export const droneFleet = {
  search: [
    {
      id: "drone-search-1",
      callSign: "Malla-Alpha-1",
      role: "search" as const,
      status: "active" as const,
      battery: 87,
      coordinates: {
        lat: -33.0472,
        lng: -71.6127,
        city: "Valparaíso",
        region: "Valparaíso"
      },
      altitude: 120,
      speed: 8.5,
      meshRange: 800,
      payload: ["RGB Camera", "GPS", "LoRa Radio"]
    },
    {
      id: "drone-search-2",
      callSign: "Malla-Alpha-2",
      role: "search" as const,
      status: "active" as const,
      battery: 92,
      coordinates: {
        lat: -33.4489,
        lng: -70.6693,
        city: "Santiago",
        region: "Metropolitana"
      },
      altitude: 100,
      speed: 7.2,
      meshRange: 800,
      payload: ["RGB Camera", "GPS", "LoRa Radio"]
    }
  ] as DroneSpec[],
  
  thermal: [
    {
      id: "drone-thermal-1",
      callSign: "Malla-Bravo-1",
      role: "thermal" as const,
      status: "active" as const,
      battery: 73,
      coordinates: {
        lat: -33.0482,
        lng: -71.6137,
        city: "Valparaíso",
        region: "Valparaíso"
      },
      altitude: 150,
      speed: 6.8,
      meshRange: 800,
      payload: ["Thermal Camera", "GPS", "LoRa Radio"]
    }
  ] as DroneSpec[],
  
  vocal: [
    {
      id: "drone-vocal-1",
      callSign: "Malla-Charlie-1",
      role: "vocal" as const,
      status: "low-battery" as const,
      battery: 34,
      coordinates: {
        lat: -33.0462,
        lng: -71.6117,
        city: "Valparaíso",
        region: "Valparaíso"
      },
      altitude: 80,
      speed: 5.5,
      meshRange: 600,
      payload: ["Speaker", "Microphone", "GPS", "LoRa Radio"]
    }
  ] as DroneSpec[],
  
  relay: [
    {
      id: "drone-relay-1",
      callSign: "Malla-Delta-1",
      role: "relay" as const,
      status: "active" as const,
      battery: 95,
      coordinates: {
        lat: -33.0492,
        lng: -71.6147,
        city: "Valparaíso",
        region: "Valparaíso"
      },
      altitude: 200,
      speed: 3.0,
      meshRange: 1200,
      payload: ["LoRa Gateway", "Satellite Uplink", "GPS"]
    }
  ] as DroneSpec[]
};

// Víctimas por escenario
export const victimsByScenario: Record<EmergencyScenario, Victim[]> = {
  "incendio-valparaiso": [
    {
      id: "victim-1",
      coordinates: {
        lat: -33.0475,
        lng: -71.6130,
        city: "Valparaíso",
        region: "Valparaíso"
      },
      severity: "critical" as const,
      status: "trapped" as const,
      name: "María González",
      age: 45,
      injuries: "Quemaduras, dificultad respiratoria",
      lastSeen: Date.now() - 300000,
      description: "Persona atrapada en segundo piso de vivienda"
    },
    {
      id: "victim-2",
      coordinates: {
        lat: -33.0480,
        lng: -71.6125,
        city: "Valparaíso",
        region: "Valparaíso"
      },
      severity: "moderate" as const,
      status: "injured" as const,
      name: "Juan Silva",
      age: 32,
      injuries: "Cortes menores, inhalación de humo",
      lastSeen: Date.now() - 600000,
      description: "Persona en la calle necesitando atención médica"
    },
    {
      id: "victim-3",
      coordinates: {
        lat: -33.0468,
        lng: -71.6135,
        city: "Valparaíso",
        region: "Valparaíso"
      },
      severity: "stable" as const,
      status: "safe" as const,
      name: "Ana Rodríguez",
      age: 67,
      lastSeen: Date.now() - 180000,
      description: "Adulto mayor evacuado, condición estable"
    }
  ],
  "terremoto-santiago": [
    {
      id: "victim-4",
      coordinates: {
        lat: -33.4495,
        lng: -70.6700,
        city: "Santiago",
        region: "Metropolitana"
      },
      severity: "critical" as const,
      status: "trapped" as const,
      name: "Pedro Morales",
      age: 28,
      injuries: "Fractura de pierna, trauma craneal",
      lastSeen: Date.now() - 900000,
      description: "Persona atrapada bajo escombros en edificio colapsado"
    }
  ],
  "inundacion-maule": [
    {
      id: "victim-5",
      coordinates: {
        lat: -35.4270,
        lng: -71.6560,
        city: "Talca",
        region: "Maule"
      },
      severity: "moderate" as const,
      status: "trapped" as const,
      name: "Carmen López",
      age: 54,
      injuries: "Hipotermia leve",
      lastSeen: Date.now() - 450000,
      description: "Persona aislada en techo de vivienda"
    }
  ],
  "errupcion-araucania": [
    {
      id: "victim-6",
      coordinates: {
        lat: -38.7365,
        lng: -72.6010,
        city: "Temuco",
        region: "Araucanía"
      },
      severity: "stable" as const,
      status: "evacuated" as const,
      name: "Luis Parra",
      age: 42,
      lastSeen: Date.now() - 120000,
      description: "Familia evacuada, sin lesiones aparentes"
    }
  ]
};
