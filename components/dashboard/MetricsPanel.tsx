import { ReactNode } from "react";
import type { Victim, SystemEvent, DroneTelemetry, EmergencyScenario } from "@/types";
import { EmergencyButton } from "../ui/button";
import { StatusIndicator } from "../ui/status-indicator";
import { scenarioConfigs, victimsByScenario } from "@/data/seed-data";

export function MetricsPanel({
  selectedScenario,
}: {
  selectedScenario: EmergencyScenario;
}): JSX.Element {
  const config = scenarioConfigs[selectedScenario];
  const victims = victimsByScenario[selectedScenario] || [];

  // KPIs calculados
  const totalVictims = victims.length;
  const criticalVictims = victims.filter((v) => v.severity === "critical").length;
  const evacuatedVictims = victims.filter((v) => v.status === "evacuated").length;
  const averageResponseTime = 12.5; // minutos simulados
  const areaMapped = config ? Math.round(Math.random() * 50 + 10) : 0; // km²
  const connectivityScore = 87; // porcentaje

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* KPI: Personas localizadas */}
      <div className="rounded-lg border border-border bg-slate-950 p-6 flex flex-col items-start">
        <div className="text-3xl font-bold text-emerald-400">{totalVictims}</div>
        <p className="text-sm text-slate-500 mt-1">Personas localizadas</p>
        <EmergencyButton
          variant="secondary"
          size="sm"
          onClick={() => {}}
          className="mt-2 self-end px-2 text-xs"
        >
          Actualizar
        </EmergencyButton>
      </div>

      {/* KPI: Área mapeada */}
      <div className="rounded-lg border border-border bg-slate-950 p-6 flex flex-col items-start">
        <div className="text-3xl font-bold text-blue-400">{areaMapped}</div>
        <p className="text-sm text-slate-500 mt-1">Área mapeada</p>
        <p className="text-xs text-slate-400 mt-1">km²</p>
      </div>

      {/* KPI: Tiempo medio respuesta */}
      <div className="rounded-lg border border-border bg-slate-950 p-6 flex flex-col items-start">
        <div className="text-3xl font-bold text-yellow-400">{averageResponseTime}</div>
        <p className="text-sm text-slate-500 mt-1">Tiempo respuesta</p>
        <p className="text-xs text-slate-400 mt-1">minutos</p>
      </div>

      {/* KPI: Conectividad mesh */}
      <div className="rounded-lg border border-border bg-slate-950 p-6 flex flex-col items-start">
        <div className="text-3xl font-bold text-amber-400">{connectivityScore}</div>
        <p className="text-sm text-slate-500 mt-1">Conectividad mesh</p>
        <p className="text-xs text-slate-400 mt-1">%</p>
      </div>

      {/* KPI: Nivel de severidad */}
      <div className="rounded-lg border border-border bg-slate-950 p-6 grid grid-cols-3 gap-2">
        {["critical", "moderate", "stable"].map((severity) => {
          // Mapear severidad de víctimas a status de indicador
          const statusMap: Record<string, "critical-battery" | "low-battery" | "active"> = {
            critical: "critical-battery",
            moderate: "low-battery",
            stable: "active"
          };
          
          return (
            <div
              key={severity}
              className="flex items-center gap-2"
            >
              <StatusIndicator
                status={statusMap[severity]}
                size="sm"
              />
              <span className="text-sm text-slate-300">
                {severity}: {victims.filter((v) => v.severity === severity).length}
              </span>
            </div>
          );
        })}
      </div>

      {/* Gráfico de evolución simple */}
      <div className="rounded-lg border border-border bg-slate-950 p-6 col-span-2">
        <h4 className="text-sm font-medium text-foreground mb-4">Evolución temporal</h4>
        <div className="h-[150px] flex items-end justify-between gap-2 p-4">
          {[65, 72, 80, 85, 90, 87, 92, 88].map((value, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t"
                style={{ height: `${value}%` }}
              />
              <span className="text-xs text-slate-400">
                {idx * 3}h
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}