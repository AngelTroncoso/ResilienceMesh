"use client";

/**
 * Contextos de React para ResilienceMesh Chile
 * Gestión de estado global con simulador integrado
 */

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type {
  SimulationMode,
  SimulationSpeed,
  SystemEvent,
  EmergencyScenario,
  DroneTelemetry,
  Victim,
  EmergencyProtocol,
} from "@/types";
import { 
  initSimulation, 
  updateSimulation, 
  toggleSimulation, 
  setSpeed, 
  getState, 
  getTelemetry,
  getAllTelemetry,
  getActiveProtocol,
  getCurrentPhase,
  getPhaseProgress,
  manualAdvancePhase,
  SimulationEngineState 
} from "@/lib/simulation-engine";

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
  activeProtocol: EmergencyProtocol | null;
  currentPhaseIndex: number;
  phaseProgress: number;
  advanceToNextPhase: () => void;
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

  // Efecto: loop de actualización automática
  useEffect(() => {
    const updateLoop = setInterval(() => {
      const newState = getState();
      setState(newState);
      
      if (newState.running) {
        const newEvents = updateSimulation();
        
        if (newEvents.length > 0) {
          setEvents((prev) => {
            const allEvents = [...prev, ...newEvents].filter(
              (event, index, self) => self.findIndex((e) => e.id === event.id) === index
            );
            return allEvents.length > 100 ? allEvents.slice(-100) : allEvents;
          });
        }
      }
    }, 1000); // Actualización cada segundo

    return () => clearInterval(updateLoop);
  }, []);

  const contextValue: SimulationContextType = {
    state,
    init: (scenario: EmergencyScenario) => {
      initSimulation(scenario);
      setState(getState());
      setEvents([]);
    },
    toggle: () => {
      const result = toggleSimulation();
      setState(getState());
      return result;
    },
    setSpeed: (speed: SimulationSpeed) => {
      setSpeed(speed);
      setState(getState());
    },
    update: () => {
      const newEvents = updateSimulation();
      setState(getState());
      return newEvents;
    },
    getTelemetry: (droneId: string) => getTelemetry(droneId),
    getAllTelemetry: () => getAllTelemetry(),
    events,
    activeProtocol: getActiveProtocol(),
    currentPhaseIndex: state.currentPhaseIndex,
    phaseProgress: state.phaseProgress,
    advanceToNextPhase: () => {
      manualAdvancePhase();
      setState(getState());
    },
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