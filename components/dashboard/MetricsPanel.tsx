import { ReactNode } from "react";
import type { Victim, SystemEvent, DroneTelemetry } from "@types";
import { Recharts } from "recharts";
import { EmergencyButton } from "../ui/button";
import { StatusIndicator } from "../ui/status-indicator";

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
        {["critical", "moderate", "stable"].map((severity) => (
          <div
            key={severity}
            className="flex items-center gap-2"
          >
            <StatusIndicator
              status={severity as "active" | "low-battery" | "critical-battery" | "offline" | "returning"}
              size="sm"
            />
            <span className="text-sm text-slate-300">
              {severity}: {victims.filter((v) => v.severity === severity).length}
            </span>
          </div>
        ))}
      </div>

      {/* Gráfico de evolución (Recharts simple) */}
      <div className="rounded-lg border border-border bg-slate-950 p-6 h-[200px]">
        <div className="h-full flex items-end justify-between p-4">
          <span className="text-xs text-slate-400">00:00</span>
          <div>
            <Recharts.BarChart data={[]} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <Recharts.XAxis dataKey="name" strokeDasharray="5 5" />
              <Recharts.YAxis />
              <Recharts.Bar dataKey="uv" fill="url(#gradient)" />
              <Recharts.Tooltip />
              <Recharts.Legend />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#38bdf8" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </Recharts.BarChart>
          </div>
          <span className="text-xs text-slate-400">24:00</span>
        </div>
      </div>
    </div>
  );
}