"use client";

import { ReactNode } from "react";
import type { EmergencyScenario } from "@/types";
import { useState } from "react";
import dynamic from "next/dynamic";
import { ScenarioSelector } from "@/components/ui/scenario-selector";
import { DroneFeed } from "@/components/dashboard/DroneFeed";
import { MeshHealthPanel } from "@/components/dashboard/MeshHealthPanel";
import { MetricsPanel } from "@/components/dashboard/MetricsPanel";

// Importación dinámica de MapView para evitar errores de SSR con Leaflet
const MapView = dynamic(
  () => import("@/components/dashboard/MapView").then((mod) => mod.MapView),
  { ssr: false }
);

export default function HomePage(): JSX.Element {
  const [selectedScenario, setSelectedScenario] = useState<EmergencyScenario>(
    "incendio-valparaiso"
  );

  const scenarios = [
    { label: "Incendio Valparaíso", value: "incendio-valparaiso" as EmergencyScenario },
    { label: "Terremoto Santiago", value: "terremoto-santiago" as EmergencyScenario },
    { label: "Inundación Maule", value: "inundacion-maule" as EmergencyScenario },
    { label: "Erupción Araucanía", value: "errupcion-araucania" as EmergencyScenario },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-border bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-md bg-accent flex items-center justify-center">
              <svg
                className="w-6 h-6 text-slate-950"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 12 2"></polygon>
                <circle cx="12" cy="7" r="4"></circle>
                <path d="M2 7l2 6h20l2-6"></path>
              </svg>
            </div>
            <h1 className="text-xl font-bold text-foreground">ResilienceMesh Chile</h1>
          </div>

          <ScenarioSelector
            scenarios={scenarios}
            selected={selectedScenario}
            onSelect={(val) => setSelectedScenario(val)}
          />
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6">
        <div className="grid grid-cols-1 gap-6 mb-6">
          <MapView
            selectedScenario={selectedScenario}
            onScenarioChange={(scenario) => setSelectedScenario(scenario)}
          />

          <DroneFeed
            selectedDroneId="Malla-Alpha-1"
            selectedVictim={undefined}
            onVictimSelect={(victim) => {}}
          />

          <MeshHealthPanel selectedScenario={selectedScenario} />

          <MetricsPanel selectedScenario={selectedScenario} />
        </div>
      </main>
    </div>
  );
}