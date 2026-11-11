import { ReactNode } from "react";
import type { SystemEvent, DroneSpec, MeshHealth, EmergencyScenario } from "@/types";
import { StatusIndicator } from "../ui/status-indicator";
import { EventsLog } from "../ui/events-log";
import { EmergencyButton } from "../ui/button";
import { droneFleet, scenarioConfigs } from "@/data/seed-data";

export function MeshHealthPanel({
  selectedScenario,
}: {
  selectedScenario: EmergencyScenario;
}): JSX.Element {
  const config = scenarioConfigs[selectedScenario];

  // Calcular salud de la malla basada en drones del escenario
  const activeDrones = (config?.drones || [])
    .map((id) => {
      const drone = [
        ...droneFleet.search,
        ...droneFleet.thermal,
        ...droneFleet.vocal,
        ...droneFleet.relay,
      ].find((d) => d.id === id);
      return drone;
    })
    .filter((drone): drone is DroneSpec => drone !== undefined);

  const activeCount = activeDrones.length;
  const lowBatteryCount = activeDrones.filter((d) => d.status === "low-battery")
    .length;
  const criticalCount = activeDrones.filter((d) => d.status === "critical-battery")
    .length;

  // Estado de la malla
  let meshState: "excellent" | "good" | "degraded" | "critical";
  if (criticalCount > 0) meshState = "critical";
  else if (lowBatteryCount > activeCount / 2) meshState = "degraded";
  else if (lowBatteryCount > 0) meshState = "good";
  else meshState = "excellent";

  return (
    <div className="space-y-6">
      {/* Tarjetas de estado de agentes */}
      <div className="grid grid-cols-2 gap-4">
        {activeDrones.map((drone) => (
          <div
            key={drone.id}
            className="rounded-lg border p-4 bg-slate-900 flex items-start gap-3"
          >
            <StatusIndicator
              status={drone.status}
              size="sm"
              className="flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">{drone.callSign}</p>
              <p className="text-xs text-slate-400">
                {drone.role}{" "}({drone.battery}% batería)
              </p>
            </div>
          </div>
        ))}

        {/* Mostrar todos los drones si hay menos de 4 */}
        {activeDrones.length < 4 && (
          <div
            key="remaining"
            className="rounded-lg border p-4 bg-slate-900/50"
          >
            <p className="text-xs text-slate-500">
              {activeDrones.length} de 4 drones mostrados
            </p>
          </div>
        )}
      </div>

      {/* Log de eventos de autogobernanza */}
      <EventsLog
        events={[]} // events would come from simulation state
        limit={8}
      />

      {/* Panel HITL - Human-in-the-Loop */}
      <div className="rounded-lg border border-border bg-slate-950 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Panel HITL (Human-in-the-Loop)
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          El Meta-Agente sugiere acciones críticas. Aprobación humana requerida.
        </p>
        <div className="space-y-3">
          {/* Botones de aprobación - se renderizarían dinámicamente */}
          <EmergencyButton
            variant="destructive"
            onClick={() => {}}
            className="w-full"
          >
            Cancele acción sugerida
          </EmergencyButton>
          <EmergencyButton
            variant="primary"
            onClick={() => {}}
            className="w-full"
          >
            Aprobar acción sugerida
          </EmergencyButton>
        </div>
      </div>
    </div>
  );
}