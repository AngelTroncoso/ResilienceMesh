"use client";

import { ReactNode, useEffect } from "react";
import type { EmergencyScenario } from "@/types";
import { useState } from "react";
import dynamic from "next/dynamic";
import { ScenarioSelector } from "@/components/ui/scenario-selector";
import { DroneFeed } from "@/components/dashboard/DroneFeed";
import { MeshHealthPanel } from "@/components/dashboard/MeshHealthPanel";
import { MetricsPanel } from "@/components/dashboard/MetricsPanel";
import { ProtocolPanel } from "@/components/dashboard/ProtocolPanel";
import { SimulationControlPanel } from "@/components/dashboard/SimulationControlPanel";
import { TelemetryPanel } from "@/components/dashboard/TelemetryPanel";
import { useSimulationContext } from "@/contexts/SimulationContext";

// Importación dinámica de MapView para evitar errores de SSR con Leaflet
const MapView = dynamic(
  () => import("@/components/dashboard/MapView").then((mod) => mod.MapView),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full rounded-lg border border-border bg-slate-900 animate-pulse flex items-center justify-center">
        <div className="text-slate-400 flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-sm">Cargando mapa táctico...</p>
        </div>
      </div>
    )
  }
);

export default function HomePage(): JSX.Element {
  const [selectedScenario, setSelectedScenario] = useState<EmergencyScenario>(
    "incendio-valparaiso"
  );
  const { init } = useSimulationContext();

  // Inicializar simulación cuando cambie el escenario
  useEffect(() => {
    init(selectedScenario);
  }, [selectedScenario, init]);

  const scenarios = [
    { label: "🔥 Incendio Valparaíso", value: "incendio-valparaiso" as EmergencyScenario },
    { label: "🏢 Terremoto Santiago", value: "terremoto-santiago" as EmergencyScenario },
    { label: "🌊 Inundación Maule", value: "inundacion-maule" as EmergencyScenario },
    { label: "🌋 Erupción Araucanía", value: "errupcion-araucania" as EmergencyScenario },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header Profesional - Más compacto */}
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-black/20">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo y Título - Más compacto */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25 transition-transform hover:scale-105">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 12 2"></polygon>
                  <circle cx="12" cy="7" r="4"></circle>
                  <path d="M2 7l2 6h20l2-6"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">ResilienceMesh Chile</h1>
                <p className="text-[10px] sm:text-xs text-slate-400">Centro de Comando de Emergencias</p>
              </div>
            </div>

            {/* Selector de Escenarios */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>Sistema Operativo</span>
              </div>
              <ScenarioSelector
                scenarios={scenarios}
                selected={selectedScenario}
                onSelect={(val) => {
                  setSelectedScenario(val);
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="max-w-[1800px] mx-auto p-4 sm:p-6 space-y-4">
        {/* KPIs Row - Más compacta */}
        <div className="animate-fadeIn">
          <MetricsPanel selectedScenario={selectedScenario} />
        </div>

        {/* Main Content Grid - 4 columnas en desktop */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Columna Izquierda - Controles y Telemetría */}
          <div className="space-y-4">
            {/* Control de Simulación */}
            <div className="animate-slideUp">
              <SimulationControlPanel />
            </div>

            {/* Telemetría de Drones */}
            <div className="animate-slideUp" style={{ animationDelay: "100ms" }}>
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-xl">
                <div className="bg-slate-900 border-b border-slate-800 px-4 py-3">
                  <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Telemetría
                  </h2>
                </div>
                <div className="max-h-[500px] overflow-y-auto">
                  <TelemetryPanel />
                </div>
              </div>
            </div>
          </div>

          {/* Mapa Principal - 2 columnas */}
          <div className="xl:col-span-2 space-y-6">
            <div className="animate-slideUp">
              <div className="rounded-xl overflow-hidden border border-slate-800 shadow-2xl shadow-black/40">
                <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 px-4 py-3">
                  <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Vista Táctica de Campo
                  </h2>
                </div>
                <MapView
                  selectedScenario={selectedScenario}
                  onScenarioChange={(scenario) => setSelectedScenario(scenario)}
                />
              </div>
            </div>

            {/* Panel de Salud de la Malla */}
            <div className="animate-slideUp" style={{ animationDelay: "200ms" }}>
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-xl">
                <div className="bg-slate-900 border-b border-slate-800 px-4 py-3">
                  <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Estado de la Red Mesh
                  </h2>
                </div>
                <div className="p-4">
                  <MeshHealthPanel selectedScenario={selectedScenario} />
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Protocolo y Feed */}
          <div className="space-y-6">
            {/* Protocolo de Emergencia Activo */}
            <div className="animate-slideUp" style={{ animationDelay: "100ms" }}>
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-xl">
                <div className="bg-slate-900 border-b border-slate-800 px-4 py-3">
                  <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Protocolo de Respuesta
                  </h2>
                </div>
                <div className="p-4 max-h-[700px] overflow-y-auto">
                  <ProtocolPanel />
                </div>
              </div>
            </div>

            {/* Panel de Drones */}
            <div className="animate-slideUp" style={{ animationDelay: "150ms" }}>
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-xl">
                <div className="bg-slate-900 border-b border-slate-800 px-4 py-3">
                  <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Transmisión en Vivo
                  </h2>
                </div>
                <div className="p-4">
                  <DroneFeed
                    selectedDroneId="Malla-Alpha-1"
                    selectedVictim={undefined}
                    onVictimSelect={(victim) => {}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Informativo */}
      <footer className="mt-12 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <p>© 2024 ResilienceMesh Chile - Sistema de Respuesta ante Desastres</p>
            <p>Última actualización: {new Date().toLocaleTimeString('es-CL')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}