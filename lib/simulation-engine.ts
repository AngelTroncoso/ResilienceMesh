/**
 * Motor de Simulación para ResilienceMesh Chile
 * Simulador integrado de telemetría en tiempo real via interval/WebSockets simulados
 */

import type { 
  ChileanCoordinate, 
  DroneSpec, 
  SystemEvent, 
  EmergencyScenario, 
  SimulationMode, 
  SimulationSpeed,
  DroneTelemetry,
  Victim,
  MeshHealth
} from "@/types";
import { scenarioConfigs, victimsByScenario, droneFleet } from "@/data/seed-data";

// Estado interno
export interface SimulationEngineState {
  mode: SimulationMode;
  speed: SimulationSpeed;
  running: boolean;
  lastUpdate: number;
  droneTelemetry: Record<string, DroneTelemetry>;
  victims: Victim[];
  events: SystemEvent[];
  meshHealth: MeshHealth;
  scenario: EmergencyScenario;
  timeScale: number;
}

const simState: SimulationEngineState = {
  mode: "manual",
  speed: "normal",
  running: false,
  lastUpdate: Date.now(),
  droneTelemetry: {},
  victims: [],
  events: [],
  meshHealth: {
    state: "excellent",
    nodes: [],
    totalBandwidth: 1000,
    availableBandwidth: 800,
  },
  scenario: "incendio-valparaiso",
  timeScale: 5,
};
/** Actualiza telemetría (llamar cada intervalo) */
export function updateSimulation(): SystemEvent[] {
  if (!simState.running) return [];

  const now = Date.now();
  const timePassed = now - simState.lastUpdate;
  const effectivePassed = timePassed * simState.timeScale / 1000;

  // Actualizar batería y posición de cada drone
  Object.keys(simState.droneTelemetry).forEach((droneId) => {
    const drone = findDrone(droneId);
    if (!drone) return;

    // Drenaje de batería proporcional a la velocidad
    const batteryDrain = Math.random() * 0.3 * (simState.speed === "fast" ? 2 : 1);
    let newBattery = Math.max(0, simState.droneTelemetry[droneId].battery - batteryDrain);

    // Auto-reasignación por batería baja
    if (newBattery <= 20 && drone.role === "relay") {
      simulateBatteryTransfer(droneId);
    }

    newBattery = Math.min(100, newBattery);

    // Actualizar posición
    const telemetry = simState.droneTelemetry[droneId];
    const moveFactor = (drone.speed || 10) * effectivePassed;
    const newCoords: ChileanCoordinate = {
      lat: telemetry.coordinates.lat + (Math.random() - 0.5) * moveFactor / 111e3,
      lng: telemetry.coordinates.lng + (Math.random() - 0.5) * moveFactor / (111e3 * Math.cos(Math.max(-85, Math.min(85, telemetry.coordinates.lat)) * Math.PI / 180)),
      city: telemetry.coordinates.city,
      region: telemetry.coordinates.region,
    };
    telemetry.coordinates = newCoords;

    // Actualizar estado
    telemetry.battery = newBattery;
    telemetry.timestamp = now;
    telemetry.status = newBattery <= 20 ? "critical-battery" : newBattery <= 40 ? "low-battery" : "active";
  });

  simState.lastUpdate = now;

  // Generar eventos mesh
  generateMeshEvents();

  // Retornar últimos eventos
  const recentEvents = simState.events.slice(-3);
  return recentEvents;
}

/** Transferencia de rol por batería baja */
function simulateBatteryTransfer(failingDroneId: string): void {
  const relays = droneFleet.relay.filter(d => d.id !== failingDroneId && d.battery > 30);

  if (relays.length > 0) {
    const newRelay = relays[0];
    const event: SystemEvent = {
      id: `EVT-BAT-${newRelay.id}`,
      timestamp: Date.now(),
      type: "battery-low",
      severity: "warning",
      message: `Batería crítica en ${failingDroneId} -> Transferencia a ${newRelay.id}`,
      source: "meta-agent",
    };

    addEvent(event);

    // Actualizar estados
    if (simState.droneTelemetry[failingDroneId]) {
      simState.droneTelemetry[failingDroneId].status = "returning";
      simState.droneTelemetry[failingDroneId].battery = 0;
    }
    if (simState.droneTelemetry[newRelay.id]) {
      simState.droneTelemetry[newRelay.id].status = "active";
    }
  }
}

/** Añade evento al log */
function addEvent(event: SystemEvent): void {
  event.id = `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  simState.events!.push(event);
  if (simState.events!.length > 50) simState.events!.shift();
}

/** Genera eventos de la red mesh */
function generateMeshEvents(): void {
  const types: Array<"node-offline" | "consensus-reached" | "decision-made"> = ["node-offline", "consensus-reached", "decision-made"];
  const type = types[Math.floor(Math.random() * types.length)] as "node-offline" | "consensus-reached" | "decision-made";
  const severityMap: Record<string, "info" | "warning" | "critical"> = {
    "node-offline": "warning",
    "consensus-reached": "info",
    "decision-made": "info",
  };

  const event: SystemEvent = {
    id: `EVT-MESH-${Date.now()}`,
    timestamp: Date.now(),
    type,
    severity: severityMap[type] || "info",
    message: `Mesh: ${type.replace(/-/g, " ")}`,
    source: "mesh-network",
  };
  addEvent(event);
}

/** Toggle play/pause */
export function toggleSimulation() {
  simState.running = !simState.running;
  const mode = simState.running ? "running" : "paused";

  addEvent({
    id: `EVT-START-${Date.now()}`,
    timestamp: Date.now(),
    type: "decision-made",
    severity: "info",
    message: `Simulación ${simState.running ? "INICIADA" : "PAUSADA"}`,
    source: "human-commander",
  });

  return { mode, running: simState.running };
}

/** Configura velocidad */
export function setSpeed(speed: SimulationSpeed) {
  simState.speed = speed;
  const speeds: Record<SimulationSpeed, number> = { slow: 1, normal: 5, fast: 15 };
  simState.timeScale = speeds[speed] || 5;

  addEvent({
    id: `EVT-SPEED-${Date.now()}`,
    timestamp: Date.now(),
    type: "decision-made",
    severity: "info",
    message: `Velocidad cambiado a ${speed}`,
    source: "human-commander",
  });
}

/** Obtiene estado actual */
export function getState(): SimulationEngineState {
  return { ...simState };
}

/** Obtiene telemetría de drone */
export function getTelemetry(droneId: string): DroneTelemetry | undefined {
  return simState.droneTelemetry[droneId];
}
/** Inicializa el motor con un escenario */
export function initSimulation(scenario: EmergencyScenario): void {
  simState.scenario = scenario;
  simState.running = false;
  simState.lastUpdate = Date.now();
  simState.victims = victimsByScenario[scenario] || [];
  simState.droneTelemetry = {};

  // Inicializar telemetría de drones del escenario
  const config = scenarioConfigs[scenario];
  if (config) {
    config.drones.forEach((droneId: string) => {
      const drone = findDrone(droneId);
      if (drone) {
        initDroneTelemetry(drone);
      }
    });
  }

  // Limpiar eventos previos
  simState.events = [];

  addEvent({
    id: "EVT-INIT",
    timestamp: Date.now(),
    type: "decision-made",
    severity: "info",
    message: `Simulación ${scenarioConfigs[scenario]?.name || scenario} inicializada`,
    source: "meta-agent",
  });
}

/** Busca drone por ID entre todas las roles */
function findDrone(droneId: string): DroneSpec | undefined {
  const allDrones = [
    ...droneFleet.search,
    ...droneFleet.vocal,
    ...droneFleet.relay,
  ];
  return allDrones.find(d => d.id === droneId);
}

/** Inicializa telemetría para un drone */
function initDroneTelemetry(drone: DroneSpec): void {
  const coords: ChileanCoordinate = {
    lat: drone.coordinates.lat + (Math.random() - 0.5) * 0.01,
    lng: drone.coordinates.lng + (Math.random() - 0.5) * 0.01,
    city: drone.coordinates.city,
    region: drone.coordinates.region,
  };

  simState.droneTelemetry[drone.id] = {
    droneId: drone.id,
    timestamp: Date.now(),
    battery: drone.battery,
    coordinates: coords,
    altitude: drone.altitude,
    heading: Math.random() * 360,
    velocity: drone.speed,
    meshRssi: 80 + Math.random() * 15,
    status: drone.battery <= 20 ? "critical-battery" : drone.battery <= 40 ? "low-battery" : "active",
  };
}