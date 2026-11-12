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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      {/* KPI: Personas localizadas */}
      <div className="rounded-lg border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-sm p-4 hover:border-slate-700/50 transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="text-2xl font-bold text-emerald-400">{totalVictims}</div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <p className="text-xs text-slate-400 font-medium">Personas localizadas</p>
      </div>

      {/* KPI: Área mapeada */}
      <div className="rounded-lg border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-sm p-4 hover:border-slate-700/50 transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="text-2xl font-bold text-blue-400">{areaMapped}</div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
        </div>
        <p className="text-xs text-slate-400 font-medium">Área mapeada <span className="text-slate-500">km²</span></p>
      </div>

      {/* KPI: Tiempo medio respuesta */}
      <div className="rounded-lg border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-sm p-4 hover:border-slate-700/50 transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="text-2xl font-bold text-yellow-400">{averageResponseTime}</div>
          <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p className="text-xs text-slate-400 font-medium">Tiempo respuesta <span className="text-slate-500">min</span></p>
      </div>

      {/* KPI: Conectividad mesh */}
      <div className="rounded-lg border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-sm p-4 hover:border-slate-700/50 transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="text-2xl font-bold text-amber-400">{connectivityScore}</div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          </div>
        </div>
        <p className="text-xs text-slate-400 font-medium">Conectividad mesh <span className="text-slate-500">%</span></p>
      </div>

      {/* KPI: Nivel de severidad - Más compacto */}
      <div className="rounded-lg border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-sm p-4 hover:border-slate-700/50 transition-all">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-xs text-slate-400 mb-1">Severidad</div>
            <div className="flex gap-2 text-xs">
              <span className="text-red-400 font-semibold">{victims.filter(v => v.severity === "critical").length} C</span>
              <span className="text-yellow-400 font-semibold">{victims.filter(v => v.severity === "moderate").length} M</span>
              <span className="text-green-400 font-semibold">{victims.filter(v => v.severity === "stable").length} S</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de evolución - Más compacto y elegante */}
      <div className="rounded-lg border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-sm p-4 lg:col-span-2 hover:border-slate-700/50 transition-all">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Evolución temporal
          </h4>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-slate-400">crítico</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span className="text-slate-400">moderado</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-slate-400">estable</span>
            </div>
          </div>
        </div>
        <div className="h-16 flex items-end justify-between gap-1">
          {[65, 72, 80, 85, 90, 87, 92, 88].map((value, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full relative">
                <div 
                  className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t transition-all group-hover:from-cyan-500 group-hover:to-cyan-300"
                  style={{ height: `${value * 0.6}px` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 group-hover:text-slate-400 transition-colors">
                {idx * 3}h
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}