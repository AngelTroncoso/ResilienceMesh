import { ReactNode } from "react";
import "./tailwind.css";
import "./styles/globals.css";

import { SimulationProvider } from "@/contexts/SimulationContext";
import { ScenarioSelector } from "@/components/ui/scenario-selector";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { MapView } from "@/components/dashboard/MapView";
import { DroneFeed } from "@/components/dashboard/DroneFeed";
import { MeshHealthPanel } from "@/components/dashboard/MeshHealthPanel";
import { MetricsPanel } from "@/components/dashboard/MetricsPanel";
import type { EmergencyScenario } from "@/types";

export const metadata = {
  title: "ResilienceMesh Chile - Centro de Mando de Emergencias",
  description: "Sistema de respuesta ante desastres con malla agéntica de drones",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-950 text-slate-100">
      <body className="min-h-screen antialiased">
        <SimulationProvider>
          <div className="min-h-screen">
            {/* Header/EOC Header */}
            <header className="border-b border-border bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
              <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md bg-accent flex items-center justify-center">
                    <svg className="w-6 h-6 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 12 2"></polygon>
                      <circle cx="12" cy="7" r="4"></circle>
                      <path d="M2 7l2 6h20l2-6"></path>
                    </svg>
                  </div>
                  <h1 className="text-xl font-bold text-foreground">ResilienceMesh Chile</h1>
                </div>

                <ScenarioSelector
                  scenarios={[
                    { label: "Incendio Valparaíso", value: "incendio-valparaiso" },
                    { label: "Terremoto Santiago", value: "terremoto-santiago" },
                    { label: "Inundación Maule", value: "inundacion-maule" },
                    { label: "Erupción Araucanía", value: "errupcion-araucania" },
                  ]}
                  selected={"incendio-valparaiso"}
                  onSelect={(val) => {}}
                />

                <div className="flex items-center gap-3">
                  <StatusIndicator status="active" size="sm" />
                  <span className="text-xs text-slate-400">Modo en tiempo real</span>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="max-w-[1600px] mx-auto p-6">
              <div className="grid grid-cols-1 gap-6 mb-6">
                {/* Vista de Mapa y Control de Enjambre */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    <span className="iconify icon-name="mdi:map-marker-radius"" aria-hidden="true"></span>
                    Vista de Mapa y Control de Enjambre
                  </h2>
                  <MapView
                    selectedScenario="incendio-valparaiso"
                    onScenarioChange={(scenario) => {}}
                  />
                </div>

                {/* Panel de Transmisión Multimodal */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    <span className="iconify icon-name="mdi:account-multiple-plus"" aria-hidden="true"></span>
                    Panel de Transmisión Multimodal
                  </h2>
                  <DroneFeed
                    selectedDroneId="Malla-Alpha-1"
                    selectedVictim={undefined}
                    onVictimSelect={(victim) => {}}
                  />
                </div>
              </div>

              {/* Monitor de Gobernanza y Panel HITL */}
              <MeshHealthPanel selectedScenario="incendio-valparaiso" />

              {/* Tablero de Métricas e Impacto */}
              <MetricsPanel selectedScenario="incendio-valparaiso" />
            </main>
          </div>
        </SimulationProvider>
      </body>
    </html>
  );
}