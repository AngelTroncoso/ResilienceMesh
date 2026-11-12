"use client";

import { Play, Pause, SkipForward, Gauge, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";
import { useSimulationContext } from "@/contexts/SimulationContext";
import type { SimulationSpeed } from "@/types";

export function SimulationControlPanel() {
  const { state, toggle, setSpeed, advanceToNextPhase, activeProtocol, currentPhaseIndex, phaseProgress } = useSimulationContext();

  const handleSpeedChange = (speed: SimulationSpeed) => {
    setSpeed(speed);
  };

  const speedButtons: { value: SimulationSpeed; label: string; color: string; description: string }[] = [
    { value: "slow", label: "1x", color: "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30", description: "Velocidad lenta (ideal para observación detallada)" },
    { value: "normal", label: "5x", color: "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30", description: "Velocidad normal (recomendada)" },
    { value: "fast", label: "15x", color: "bg-orange-500/20 text-orange-300 hover:bg-orange-500/30", description: "Velocidad rápida (pruebas rápidas)" },
  ];

  const currentPhase = activeProtocol?.phases[currentPhaseIndex];
  const isLastPhase = activeProtocol ? currentPhaseIndex >= activeProtocol.phases.length - 1 : true;

  return (
    <Card className="bg-slate-900/40 backdrop-blur-sm border-slate-700/50 p-6 animate-slideUp">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-slate-100">Control de Simulación</h3>
            <Tooltip content="Controla el flujo de la simulación en tiempo real">
              <Info className="w-4 h-4 text-slate-500 hover:text-slate-400 cursor-help" />
            </Tooltip>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            state.running 
              ? "bg-emerald-500/20 text-emerald-300 animate-pulse" 
              : "bg-slate-700/50 text-slate-400"
          }`}>
            {state.running ? "▶️ ACTIVA" : "⏸️ PAUSADA"}
          </div>
        </div>

        {/* Protocolo y Fase Actual */}
        {activeProtocol && (
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-400">Protocolo Activo</div>
              <Tooltip content={activeProtocol.description}>
                <Info className="w-4 h-4 text-slate-500 hover:text-slate-400 cursor-help" />
              </Tooltip>
            </div>
            <div className="text-base font-semibold text-slate-100 mb-3">{activeProtocol.name}</div>
            
            <div className="text-sm text-slate-400 mb-2 flex items-center justify-between">
              <span>Fase {currentPhaseIndex + 1} de {activeProtocol.phases.length}: {currentPhase?.name}</span>
              {currentPhase && (
                <Tooltip content={currentPhase.description}>
                  <span className="text-xs text-blue-400 cursor-help hover:text-blue-300">
                    {currentPhase.estimatedDuration} min
                  </span>
                </Tooltip>
              )}
            </div>
            
            {/* Barra de Progreso Mejorada */}
            <div className="relative w-full h-3 bg-slate-700/50 rounded-full overflow-hidden group">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 ease-out group-hover:from-emerald-400 group-hover:to-cyan-400"
                style={{ width: `${phaseProgress}%` }}
              >
                {/* Animación de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
            </div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-slate-500">
                {phaseProgress < 100 ? "En progreso..." : "Completada"}
              </div>
              <div className="text-xs font-semibold text-slate-400">
                {Math.round(phaseProgress)}%
              </div>
            </div>
          </div>
        )}

        {/* Controles Principales */}
        <div className="flex gap-3">
          <Tooltip content={state.running ? "Pausar simulación (Espacio)" : "Iniciar simulación (Espacio)"}>
            <Button
              onClick={toggle}
              className={`flex-1 ${
                state.running
                  ? "bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border-orange-500/50"
                  : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/50"
              } border transition-all hover:scale-105`}
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
          </Tooltip>

          <Tooltip content={isLastPhase ? "Ya estás en la última fase" : state.running ? "Pausa la simulación primero" : "Avanzar a la siguiente fase (→)"}>
            <Button
              onClick={advanceToNextPhase}
              disabled={isLastPhase || state.running}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Avanzar Fase
            </Button>
          </Tooltip>
        </div>

        {/* Control de Velocidad */}
        <div>
          <div className="text-sm text-slate-400 mb-2 flex items-center gap-2">
            <Gauge className="w-4 h-4" />
            Velocidad de Simulación
          </div>
          <div className="flex gap-2">
            {speedButtons.map((btn) => (
              <Tooltip key={btn.value} content={btn.description}>
                <button
                  onClick={() => handleSpeedChange(btn.value)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                    state.speed === btn.value
                      ? btn.color + " ring-2 ring-offset-2 ring-offset-slate-900 scale-105"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
                  }`}
                  aria-pressed={state.speed === btn.value}
                  aria-label={`Establecer velocidad a ${btn.label}`}
                >
                  {btn.label}
                </button>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Info Estado con mejor visualización */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <Tooltip content="Modo de operación actual de la simulación">
            <div className="p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors cursor-help">
              <div className="text-slate-500 mb-1">Modo</div>
              <div className="text-slate-200 font-medium uppercase flex items-center gap-2">
                {state.mode}
                {state.mode === "auto" && <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
              </div>
            </div>
          </Tooltip>
          <Tooltip content="Velocidad de simulación relativa al tiempo real">
            <div className="p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors cursor-help">
              <div className="text-slate-500 mb-1">Escala Temporal</div>
              <div className="text-slate-200 font-medium">{state.timeScale}x Real</div>
            </div>
          </Tooltip>
        </div>

        {/* Indicador de ayuda */}
        <div className="pt-3 border-t border-slate-800/50">
          <p className="text-xs text-slate-500 flex items-center gap-2">
            <Info className="w-3 h-3" />
            Usa <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">Espacio</kbd> para iniciar/pausar
          </p>
        </div>
      </div>
    </Card>
  );
}
