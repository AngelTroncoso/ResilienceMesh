/**
 * Tipos centrales para ResilienceMesh Chile
 * Definición de drones, víctimas, escenarios, estados de la malla
 */

// --- Direcciones y Geolocalización ---
export type Coordinate = [number, number]; // [lat, lng]

export interface ChileanCoordinate {
  lat: number;
  lng: number;
  city: string;
  region: string;
}

// --- Escenarios de Emergencia ---
export type EmergencyScenario =
  | "incendio-valparaiso"
  | "terremoto-santiago"
  | "inundacion-maule"
  | "errupcion-araucania";

export interface ScenarioConfig {
  id: EmergencyScenario;
  name: string;
  description: string;
  center: ChileanCoordinate;
  zoom: number;
  color: string; // Para UI accent color
  drones: string[]; // Drone IDs assigned to this scenario
}

// --- Tipos de Drones ---
export type DroneRole = "search" | "thermal" | "vocal" | "relay" | "delivery";
export type DroneStatus = "active" | "low-battery" | "critical-battery" | "offline" | "returning";

export interface DroneSpec {
  id: string;
  callSign: string;
  role: DroneRole;
  status: DroneStatus;
  battery: number; // percentage 0-100
  coordinates: ChileanCoordinate;
  altitude: number; // meters
  speed: number; // m/s
  meshRange: number; // meters
  payload: string[];
}

// --- Flota de Drones (Seed Data) ---
export interface DroneFleet {
  search: DroneSpec[];
  thermal: DroneSpec[];
  vocal: DroneSpec[];
  relay: DroneSpec[];
}

// --- Víctimas y Alertas ---
export type VictimSeverity = "critical" | "moderate" | "stable";
export type VictimStatus = "trapped" | "injured" | "evacuated" | "safe";

export interface Victim {
  id: string;
  coordinates: ChileanCoordinate;
  severity: VictimSeverity;
  status: VictimStatus;
  name?: string;
  age?: number;
  injuries?: string;
  lastSeen: number; // timestamp
  description: string;
}

// --- Estados de la Malla Agéntica ---
export type MeshNetworkState = "excellent" | "good" | "degraded" | "critical";

export interface MeshNode {
  droneId: string;
  connectedNodes: string[];
  signalStrength: number; // 0-100
  latency: number; // ms
}

export interface MeshHealth {
  state: MeshNetworkState;
  nodes: MeshNode[];
  totalBandwidth: number;
  availableBandwidth: number;
}

// --- Consenso y Gobernanza ---
export type DecisionImpact = "low" | "medium" | "high" | "critical";

export interface GovernanceDecision {
  id: string;
  type: "reassign" | "redirect" | "alert" | "evacuate";
  suggestedBy: "meta-agent" | "human-commander";
  description: string;
  affectedDrones: string[];
  impactLevel: DecisionImpact;
  humanApproval: boolean; // true = approved, false = pending, null = not requested
  timestamp: number;
  executed: boolean;
}

// --- Telemetría en Tiempo Real ---
export interface DroneTelemetry {
  droneId: string;
  timestamp: number;
  battery: number;
  coordinates: ChileanCoordinate;
  altitude: number;
  heading: number; // degrees
  velocity: number;
  meshRssi: number; // signal strength
  status: DroneStatus;
}

// --- Eventos del Sistema ---
export type SystemEvent = {
  id: string;
  timestamp: number;
  type: "battery-low" | "node-offline" | "consensus-reached" | "decision-made" | "victim-updated";
  severity: "info" | "warning" | "critical";
  message: string;
  source: string;
};

// --- Configuración del Motor de Simulación ---
export type SimulationMode = "manual" | "auto" | "paused";
export type SimulationSpeed = "slow" | "normal" | "fast";

export interface SimulationConfig {
  mode: SimulationMode;
  speed: SimulationSpeed;
  intervalMs: number;
  autoReassignBattery: boolean;
  autoConsensus: boolean;
}

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