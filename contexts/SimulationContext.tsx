/**
 * Contextos de React para ResilienceMesh Chile
 * Gestión de estado global con simulador integrado
 */

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type {
  SimulationEngineState,
  SimulationMode,
  SimulationSpeed,
  SystemEvent,
  EmergencyScenario,
  DroneTelemetry,
  Victim,
} from "@types";
import { initSimulation, updateSimulation, toggleSimulation, setSpeed, getState, getTelemetry } from "../lib/simulation-engine";

// --- Contextos ---

/** Contexto del motor de simulación */
type SimulationContextType = {
  state: SimulationEngineState;
  init: (scenario: EmergencyScenario) => void;
  toggle: () => { mode: SimulationMode; running: boolean };
  setSpeed: (speed: SimulationSpeed) => void;
  update: () => SystemEvent[];
  getTelemetry: (droneId: string) => DroneTelemetry | undefined;
  getAllTelemetry: () => Record<string, DroneTelemetry>;
  events: SystemEvent[];
};

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

/** Hook para consumir el contexto de simulación */
export function useSimulationContext() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error("useSimulationContext must be used within SimulationProvider");
  }
  return context;
}

/** Proveedor del contexto de simulación */
export function SimulationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SimulationEngineState>(getState());
  const [events, setEvents] = useState<SystemEvent[]>([]);

  // Efecto: inicializar simulación al montar
  useEffect(() => {
    // No inicializamos automáticamente - el usuario debe elegir escenario
    const updateLoop = setInterval(() => {
      const newEvents = updateSimulation();
      setEvents((prev) => {
        // Fusionar eventos, mantener máximo 50
        const allEvents = [...prev, ...newEvents].filter(
          (event, index, self) => self.findIndex((e) => e.id === event.id) === index
        );
        return allEvents.length > 50 ? allEvents.slice(-50) : allEvents;
      });
    }, state.timeScale || 1000);

    return () => clearInterval(updateLoop);
  }, []);

  // Efecto: sincronizar estado con el motor global
  useEffect(() => {
    setState(getState());
  }, []);
  useEffect(() => {
    setEvents(state.events);
  }, [state.events]);

  const contextValue = {
    state,
    init: (scenario: EmergencyScenario) => initSimulation(scenario),
    toggle: () => toggleSimulation(),
    setSpeed: (speed: SimulationSpeed) => setSpeed(speed),
    update: () => updateSimulation(),
    getTelemetry: (droneId: string) => getTelemetry(droneId),
    getAllTelemetry: () => getState().droneTelemetry,
    events,
  };

  return (
    <SimulationContext.Provider value={contextValue}>
      {children}
    </SimulationContext.Provider>
  );
}

/** Hook para obtener telemetría de drones */
export function useDroneTelemetry(droneId: string) {
  const { getTelemetry } = useSimulationContext();
  return getTelemetry(droneId);
}

/** Hook para obtener estado de simulación */
export function useSimulationState() {
  const { state } = useSimulationContext();
  return state;
}

/** Hook para obtener eventos */
export function useSimulationEvents() {
  const { events } = useSimulationContext();
  return events;
}

/** Hook para inicializar simulación */
export function useInitSimulation(scenario: EmergencyScenario) {
  const { init } = useSimulationContext();
  init(scenario);
}

/** Hook para toggle de simulación */
export function useToggleSimulation() {
  const { toggle } = useSimulationContext();
  return toggle();
}

/** Hook para cambiar velocidad */
export function useSetSpeed(speed: SimulationSpeed) {
  const { setSpeed } = useSimulationContext();
  setSpeed(speed);
}