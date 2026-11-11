/**
 * Motor de Simulación para ResilienceMesh Chile
 * Sistema Autónomo: avance de fases, reasignación dinámica, telemetría en tiempo real
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
  MeshHealth,
  EmergencyProtocol,
  ProtocolPhase,
  DroneAssignment,
  DroneRole
} from "@/types";
import { scenarioConfigs, victimsByScenario, droneFleet } from "@/data/seed-data";
import { emergencyProtocols } from "@/data/emergency-protocols";

// Estado interno del motor
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
  
  // Protocolo activo
  activeProtocol: EmergencyProtocol | null;
  currentPhaseIndex: number;
  phaseStartTime: number;
  phaseProgress: number; // 0-100
  
  // Asignaciones activas
  droneAssignments: Record<string, DroneAssignment>;
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
  activeProtocol: null,
  currentPhaseIndex: 0,
  phaseStartTime: Date.now(),
  phaseProgress: 0,
  droneAssignments: {},
};

/**
 * MOTOR PRINCIPAL: Actualiza telemetría, avanza fases, reasigna drones
 * Llamar cada intervalo (ej: cada 1 segundo)
 */
export function updateSimulation(): SystemEvent[] {
  if (!simState.running) return [];

  const now = Date.now();
  const timePassed = now - simState.lastUpdate;
  const effectivePassed = timePassed * simState.timeScale / 1000;

  // 1. Actualizar telemetría de drones
  updateDroneTelemetry(effectivePassed, now);

  // 2. Actualizar progreso de fase
  updatePhaseProgress(now);

  // 3. Auto-avanzar fase si completada
  autoAdvancePhase(now);

  // 4. Generar eventos mesh
  generateMeshEvents();

  simState.lastUpdate = now;

  // Retornar últimos eventos
  return simState.events.slice(-5);
}

/**
 * Actualiza telemetría de todos los drones activos
 */
function updateDroneTelemetry(effectivePassed: number, now: number): void {
  Object.keys(simState.droneTelemetry).forEach((droneId) => {
    const drone = findDrone(droneId);
    if (!drone) return;

    const telemetry = simState.droneTelemetry[droneId];
    const assignment = simState.droneAssignments[droneId];

    // Drenaje de batería proporcional a velocidad y carga de trabajo
    const baseDrain = 0.2; // % por tick
    const speedMultiplier = simState.speed === "fast" ? 2 : simState.speed === "slow" ? 0.5 : 1;
    const workloadMultiplier = assignment ? 1.5 : 1; // Más consumo si tiene tarea asignada
    const batteryDrain = baseDrain * speedMultiplier * workloadMultiplier * effectivePassed;
    
    let newBattery = Math.max(0, telemetry.battery - batteryDrain);

    // Auto-reasignación por batería crítica
    if (newBattery <= 15 && telemetry.status !== "returning" && assignment) {
      reassignDroneDueToBattery(droneId, assignment);
    }

    // Recarga si está returning y llegó a base
    if (telemetry.status === "returning" && newBattery < 100) {
      newBattery = Math.min(100, newBattery + 1.5); // Recarga rápida
      if (newBattery >= 95) {
        telemetry.status = "idle";
        addEvent({
          id: `EVT-RECHARGED-${droneId}`,
          timestamp: now,
          type: "decision-made",
          severity: "info",
          message: `✅ ${droneId} recargado y disponible`,
          source: "meta-agent",
        });
      }
    }

    telemetry.battery = newBattery;

    // Actualizar posición (simulación de movimiento)
    const moveFactor = (drone.speed || 10) * effectivePassed / 111000; // metros a grados
    telemetry.coordinates = {
      lat: telemetry.coordinates.lat + (Math.random() - 0.5) * moveFactor,
      lng: telemetry.coordinates.lng + (Math.random() - 0.5) * moveFactor / Math.cos(telemetry.coordinates.lat * Math.PI / 180),
      city: telemetry.coordinates.city,
      region: telemetry.coordinates.region,
    };

    // Actualizar estado según batería
    if (newBattery <= 15 && telemetry.status !== "returning") {
      telemetry.status = "critical-battery";
    } else if (newBattery <= 30) {
      telemetry.status = "low-battery";
    } else if (telemetry.status !== "returning" && telemetry.status !== "idle") {
      telemetry.status = "active";
    }

    telemetry.timestamp = now;
    telemetry.heading = (telemetry.heading + (Math.random() - 0.5) * 15) % 360;
    telemetry.meshRssi = Math.max(50, Math.min(95, telemetry.meshRssi + (Math.random() - 0.5) * 5));
  });
}

/**
 * Actualiza progreso de fase actual (0-100%)
 */
function updatePhaseProgress(now: number): void {
  if (!simState.activeProtocol || !simState.running) return;

  const currentPhase = simState.activeProtocol.phases[simState.currentPhaseIndex];
  if (!currentPhase) return;

  const elapsed = (now - simState.phaseStartTime) / 1000; // segundos
  const duration = currentPhase.estimatedDuration; // minutos
  const progress = Math.min(100, (elapsed / (duration * 60)) * 100);

  simState.phaseProgress = progress;
}

/**
 * Auto-avanza a siguiente fase cuando progreso >= 100%
 */
function autoAdvancePhase(now: number): void {
  if (!simState.activeProtocol || simState.mode !== "auto") return;

  if (simState.phaseProgress >= 100) {
    const nextPhaseIndex = simState.currentPhaseIndex + 1;
    
    if (nextPhaseIndex < simState.activeProtocol.phases.length) {
      advanceToPhase(nextPhaseIndex, now);
    } else {
      // Protocolo completado
      completeProtocol(now);
    }
  }
}

/**
 * Avanza a fase específica
 */
export function advanceToPhase(phaseIndex: number, timestamp?: number): void {
  const now = timestamp || Date.now();
  
  if (!simState.activeProtocol) return;
  if (phaseIndex < 0 || phaseIndex >= simState.activeProtocol.phases.length) return;

  const newPhase = simState.activeProtocol.phases[phaseIndex];
  simState.currentPhaseIndex = phaseIndex;
  simState.phaseStartTime = now;
  simState.phaseProgress = 0;

  // Asignar drones según nueva fase
  assignDronesForPhase(newPhase, now);

  addEvent({
    id: `EVT-PHASE-${phaseIndex}`,
    timestamp: now,
    type: "decision-made",
    severity: "info",
    message: `📋 Fase ${phaseIndex + 1}/${simState.activeProtocol.phases.length}: ${newPhase.name}`,
    source: "meta-agent",
  });
}

/**
 * Asigna drones para una fase específica
 */
function assignDronesForPhase(phase: ProtocolPhase, now: number): void {
  // Limpiar asignaciones previas
  simState.droneAssignments = {};

  phase.droneAssignments.forEach((assignment) => {
    const drone = findDrone(assignment.droneId);
    if (!drone) return;

    // Verificar disponibilidad
    const telemetry = simState.droneTelemetry[assignment.droneId];
    if (telemetry && telemetry.battery < 20) {
      // Buscar reemplazo
      const replacement = findReplacementDrone(drone.role, assignment.droneId);
      if (replacement) {
        simState.droneAssignments[replacement.id] = { ...assignment, droneId: replacement.id };
        addEvent({
          id: `EVT-REPLACE-${assignment.droneId}`,
          timestamp: now,
          type: "decision-made",
          severity: "warning",
          message: `🔄 ${assignment.droneId} (batería baja) → ${replacement.id}`,
          source: "meta-agent",
        });
        return;
      }
    }

    simState.droneAssignments[assignment.droneId] = assignment;
  });
}

/**
 * Reasigna drone debido a batería crítica
 */
function reassignDroneDueToBattery(failingDroneId: string, assignment: DroneAssignment): void {
  const drone = findDrone(failingDroneId);
  if (!drone) return;

  const replacement = findReplacementDrone(drone.role, failingDroneId);
  
  if (replacement) {
    // Transferir asignación
    delete simState.droneAssignments[failingDroneId];
    simState.droneAssignments[replacement.id] = { ...assignment, droneId: replacement.id };

    // Marcar drone fallido como returning
    const failingTelemetry = simState.droneTelemetry[failingDroneId];
    if (failingTelemetry) {
      failingTelemetry.status = "returning";
    }

    // Activar reemplazo
    const replacementTelemetry = simState.droneTelemetry[replacement.id];
    if (replacementTelemetry) {
      replacementTelemetry.status = "active";
    }

    addEvent({
      id: `EVT-BATTERY-REASSIGN-${failingDroneId}`,
      timestamp: Date.now(),
      type: "battery-low",
      severity: "warning",
      message: `⚠️ Batería crítica ${failingDroneId} (${Math.round(failingTelemetry?.battery || 0)}%) → Reasignado a ${replacement.id}`,
      source: "meta-agent",
    });
  } else {
    addEvent({
      id: `EVT-NO-REPLACEMENT-${failingDroneId}`,
      timestamp: Date.now(),
      type: "battery-low",
      severity: "critical",
      message: `🚨 ${failingDroneId} batería crítica - NO HAY REEMPLAZO DISPONIBLE`,
      source: "meta-agent",
    });
  }
}

/**
 * Busca drone de reemplazo del mismo rol
 */
function findReplacementDrone(role: DroneRole, excludeId: string): DroneSpec | undefined {
  // Solo buscar en roles disponibles en el fleet
  const fleetRole = role === "thermal" ? "search" : role; // thermal no está en fleet, usar search
  const validRoles: Array<"search" | "vocal" | "relay"> = ["search", "vocal", "relay"];
  
  if (!validRoles.includes(fleetRole as any)) {
    return undefined;
  }

  const candidates = droneFleet[fleetRole as "search" | "vocal" | "relay"].filter((d) => {
    if (d.id === excludeId) return false;
    const telemetry = simState.droneTelemetry[d.id];
    return telemetry && telemetry.battery > 40 && (telemetry.status === "idle" || telemetry.status === "active");
  });

  // Ordenar por batería (mayor primero)
  candidates.sort((a, b) => {
    const batteryA = simState.droneTelemetry[a.id]?.battery || 0;
    const batteryB = simState.droneTelemetry[b.id]?.battery || 0;
    return batteryB - batteryA;
  });

  return candidates[0];
}

/**
 * Completa protocolo actual
 */
function completeProtocol(now: number): void {
  simState.running = false;
  simState.mode = "paused";

  addEvent({
    id: `EVT-PROTOCOL-COMPLETE`,
    timestamp: now,
    type: "consensus-reached",
    severity: "info",
    message: `✅ Protocolo "${simState.activeProtocol?.name}" COMPLETADO`,
    source: "meta-agent",
  });
}

/**
 * Genera eventos de la red mesh
 */
function generateMeshEvents(): void {
  if (Math.random() > 0.7) return; // Solo 30% del tiempo

  const eventTypes: Array<{ type: SystemEvent["type"]; severity: SystemEvent["severity"]; message: string }> = [
    { type: "consensus-reached", severity: "info", message: "Consenso mesh: Ruta óptima recalculada" },
    { type: "decision-made", severity: "info", message: "Mesh adaptativo: Nodo relay reubicado" },
    { type: "node-offline", severity: "warning", message: "Nodo mesh temporalmente fuera de línea" },
  ];

  const event = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  addEvent({
    id: `EVT-MESH-${Date.now()}`,
    timestamp: Date.now(),
    ...event,
    source: "mesh-network",
  });
}

/**
 * Añade evento al log
 */
function addEvent(event: SystemEvent): void {
  if (!event.id) {
    event.id = `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  }
  simState.events.push(event);
  if (simState.events.length > 100) simState.events.shift();
}

/**
 * Toggle play/pause
 */
export function toggleSimulation(): { mode: SimulationMode; running: boolean } {
  simState.running = !simState.running;
  simState.mode = simState.running ? "auto" : "paused";

  addEvent({
    id: `EVT-TOGGLE-${Date.now()}`,
    timestamp: Date.now(),
    type: "decision-made",
    severity: "info",
    message: `${simState.running ? "▶️ Simulación INICIADA" : "⏸️ Simulación PAUSADA"}`,
    source: "human-commander",
  });

  return { mode: simState.mode, running: simState.running };
}

/**
 * Configura velocidad de simulación
 */
export function setSpeed(speed: SimulationSpeed): void {
  simState.speed = speed;
  const speeds: Record<SimulationSpeed, number> = { slow: 1, normal: 5, fast: 15 };
  simState.timeScale = speeds[speed] || 5;

  addEvent({
    id: `EVT-SPEED-${Date.now()}`,
    timestamp: Date.now(),
    type: "decision-made",
    severity: "info",
    message: `⚡ Velocidad: ${speed.toUpperCase()}`,
    source: "human-commander",
  });
}

/**
 * Avance manual de fase (HITL)
 */
export function manualAdvancePhase(): void {
  if (!simState.activeProtocol) return;

  const nextIndex = simState.currentPhaseIndex + 1;
  if (nextIndex < simState.activeProtocol.phases.length) {
    advanceToPhase(nextIndex);
  }
}

/**
 * Inicializa simulación con escenario y protocolo
 */
export function initSimulation(scenario: EmergencyScenario): void {
  simState.scenario = scenario;
  simState.running = false;
  simState.lastUpdate = Date.now();
  simState.victims = victimsByScenario[scenario] || [];
  simState.droneTelemetry = {};
  simState.droneAssignments = {};
  simState.currentPhaseIndex = 0;
  simState.phaseProgress = 0;
  simState.phaseStartTime = Date.now();

  // Cargar protocolo del escenario (extraer prefijo antes del guión)
  const protocolKey = scenario.split("-")[0]; // "incendio", "terremoto", etc.
  simState.activeProtocol = emergencyProtocols[protocolKey] || null;

  // Inicializar telemetría de drones
  const config = scenarioConfigs[scenario];
  if (config) {
    config.drones.forEach((droneId: string) => {
      const drone = findDrone(droneId);
      if (drone) {
        initDroneTelemetry(drone);
      }
    });
  }

  // Asignar drones a primera fase
  if (simState.activeProtocol && simState.activeProtocol.phases.length > 0) {
    assignDronesForPhase(simState.activeProtocol.phases[0], Date.now());
  }

  simState.events = [];
  addEvent({
    id: "EVT-INIT",
    timestamp: Date.now(),
    type: "decision-made",
    severity: "info",
    message: `🚀 Simulación "${scenarioConfigs[scenario]?.name || scenario}" inicializada`,
    source: "meta-agent",
  });
}

/**
 * Busca drone por ID
 */
function findDrone(droneId: string): DroneSpec | undefined {
  const allDrones = [
    ...droneFleet.search,
    ...droneFleet.vocal,
    ...droneFleet.relay,
  ];
  return allDrones.find((d) => d.id === droneId);
}

/**
 * Inicializa telemetría para un drone
 */
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
    status: drone.battery <= 15 ? "critical-battery" : drone.battery <= 30 ? "low-battery" : "idle",
  };
}

/**
 * Getters del estado
 */
export function getState(): SimulationEngineState {
  return { ...simState };
}

export function getTelemetry(droneId: string): DroneTelemetry | undefined {
  return simState.droneTelemetry[droneId];
}

export function getAllTelemetry(): Record<string, DroneTelemetry> {
  return { ...simState.droneTelemetry };
}

export function getActiveProtocol(): EmergencyProtocol | null {
  return simState.activeProtocol;
}

export function getCurrentPhase(): ProtocolPhase | null {
  if (!simState.activeProtocol) return null;
  return simState.activeProtocol.phases[simState.currentPhaseIndex] || null;
}

export function getPhaseProgress(): { index: number; progress: number; total: number } {
  return {
    index: simState.currentPhaseIndex,
    progress: simState.phaseProgress,
    total: simState.activeProtocol?.phases.length || 0,
  };
}

export function getDroneAssignments(): Record<string, DroneAssignment> {
  return { ...simState.droneAssignments };
}

export function getEvents(): SystemEvent[] {
  return [...simState.events];
}
