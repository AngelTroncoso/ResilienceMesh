"use client";

import { Play, Pause, SkipForward, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSimulationContext } from "@/contexts/SimulationContext";
import type { SimulationSpeed } from "@/types";

export function SimulationControlPanel() {
  const { state, toggle, setSpeed, advanceToNextPhase, activeProtocol, currentPhaseIndex, phaseProgress } = useSimulationContext();

  const handleSpeedChange = (speed: SimulationSpeed) => {
    setSpeed(speed);
  };

  const speedButtons: { value: SimulationSpeed; label: string; color: string }[] = [
    { value: "slow", label: "1x", color: "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30" },
    { value: "normal", label: "5x", color: "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30" },
    { value: "fast", label: "15x", color: "bg-orange-500/20 text-orange-300 hover:bg-orange-500/30" },
  ];

  const currentPhase = activeProtocol?.phases[currentPhaseIndex];
  const isLastPhase = activeProtocol ? currentPhaseIndex >= activeProtocol.phases.length - 1 : true;

  return (
    <Card className="bg-slate-900/40 backdrop-blur-sm border-slate-700/50 p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-emerald-400" />
            Control de Simulación
          </h3>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            state.running 
              ? "bg-emerald-500/20 text-emerald-300" 
              : "bg-slate-700/50 text-slate-400"
          }`}>
            {state.running ? "▶️ ACTIVA" : "⏸️ PAUSADA"}
          </div>
        </div>

        {/* Protocolo y Fase Actual */}
        {activeProtocol && (
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="text-sm text-slate-400 mb-1">Protocolo Activo</div>
            <div className="text-base font-semibold text-slate-100 mb-3">{activeProtocol.name}</div>
            
            <div className="text-sm text-slate-400 mb-2">
              Fase {currentPhaseIndex + 1} de {activeProtocol.phases.length}: {currentPhase?.name}
            </div>
            
            {/* Barra de Progreso */}
            <div className="relative w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 ease-out"
                style={{ width: `${phaseProgress}%` }}
              />
            </div>
            <div className="text-xs text-slate-500 mt-1 text-right">
              {Math.round(phaseProgress)}%
            </div>
          </div>
        )}

        {/* Controles Principales */}
        <div className="flex gap-3">
          <Button
            onClick={toggle}
            className={`flex-1 ${
              state.running
                ? "bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border-orange-500/50"
                : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/50"
            } border transition-all`}
          >
            {state.running ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pausar
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Iniciar
              </>
            )}
          </Button>

          <Button
            onClick={advanceToNextPhase}
            disabled={isLastPhase || state.running}
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Avanzar Fase
          </Button>
        </div>

        {/* Control de Velocidad */}
        <div>
          <div className="text-sm text-slate-400 mb-2 flex items-center gap-2">
            <Gauge className="w-4 h-4" />
            Velocidad de Simulación
          </div>
          <div className="flex gap-2">
            {speedButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => handleSpeedChange(btn.value)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  state.speed === btn.value
                    ? btn.color + " ring-2 ring-offset-2 ring-offset-slate-900"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Info Estado */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <div className="text-slate-500 mb-1">Modo</div>
            <div className="text-slate-200 font-medium uppercase">{state.mode}</div>
          </div>
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <div className="text-slate-500 mb-1">Escala Temporal</div>
            <div className="text-slate-200 font-medium">{state.timeScale}x Real</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
