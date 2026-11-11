import { ReactNode } from "react";
import type { DroneTelemetry, Victim, SystemEvent } from "@/types";
import { StatusIndicator } from "../ui/status-indicator";
import { EventsLog } from "../ui/events-log";

export function DroneFeed({
  selectedDroneId,
  selectedVictim,
  onVictimSelect,
}: {
  selectedDroneId: string | undefined;
  selectedVictim: Victim | undefined;
  onVictimSelect: (victim: Victim) => void;
}): JSX.Element {
  // Simulación de feed de cámara - usando texto con estilo táctico
  const cameraFeed = selectedDroneId
    ? (
      <div className="h-48 w-full rounded-md border bg-slate-800 overflow-hidden">
        <div className="h-full w-full bg-gradient-to-b from-slate-900 to-slate-800">
          <div className="absolute top-2 left-2 text-xs text-green-400">
            <span>🌡 TÉRMICO: 3 detectable</span>
          </div>
          <div className="absolute bottom-2 right-2 text-xs text-blue-400">
            <span>📡 MESH: Conectado</span>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/40 opacity-80">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-orange-500/30 animate-pulse"></div>
        </div>
      </div>
    )
    : "";

  // Feed de diálogo con víctima
  const dialogueFeed = selectedVictim ? (
    <div className="space-y-4">
      <div className="bg-slate-800 p-4 rounded-lg">
        <p className="text-sm text-slate-400">
          Dron:{" "}
          {"Hola, soy el dron de rescate ResilienceMesh. ¿Estás herido o atrapado?"}
        </p>
      </div>
      <div className="bg-slate-700 p-4 rounded-lg">
        <p className="text-sm">
          {selectedVictim.injuries ? (
            `Víctima: "${selectedVictim.description}"`
          ) : (
            "Víctima: "
          )}
        </p>
      </div>
      <div className="bg-slate-800 p-4 rounded-lg">
        <p className="text-sm text-emerald-400">
          Dron (Análisis Multimodal):{" "}
          {"Clasificación: "}
          {selectedVictim.severity === "critical" ? "Carga Roja" : selectedVictim.severity === "moderate" ? "Carga Amarilla" : "Carga Verde"}. Transmitiendo coordenadas a Bomberos. Proyectando luz guía azul.</p>
      </div>
    </div>
  ) : (
    <div className="bg-slate-800 p-4 rounded-lg">
      <p className="text-sm text-slate-400">
        Selecciona una víctima en el mapa para iniciar la conversación.
      </p>
    </div>
  );

  return (
    <div className="space-x-6">
      {/* Panel de feed de cámara */}
      <div className="w-1/2 rounded-lg border border-border bg-slate-950 h-64">
        <h4 className="text-sm font-medium text-foreground mb-2">Feed de Cámara Térmica/RGB</h4>
        {cameraFeed}
      </div>

      {/* Panel de diálogo con víctima */}
      <div className="w-1/2 rounded-lg border border-border bg-slate-950 flex flex-col h-full">
        <h4 className="text-sm font-medium text-foreground mb-2">Diálogo con Víctima</h4>
        {dialogueFeed}
      </div>
    </div>
  );
}