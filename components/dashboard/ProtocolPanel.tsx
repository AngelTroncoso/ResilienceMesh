"use client";

import { ReactNode } from "react";
import type { EmergencyProtocol, EmergencyScenario, ProtocolPhase } from "@/types";
import { getProtocolForScenario } from "@/data/emergency-protocols";
import { StatusIndicator } from "../ui/status-indicator";

export function ProtocolPanel({
  selectedScenario,
  currentPhaseId,
}: {
  selectedScenario: EmergencyScenario;
  currentPhaseId?: string;
}): JSX.Element {
  const protocol = getProtocolForScenario(selectedScenario);
  const currentPhaseIndex = protocol.phaseSequence.findIndex(p => p.id === currentPhaseId);
  const progress = currentPhaseId 
    ? ((currentPhaseIndex + 1) / protocol.phaseSequence.length) * 100 
    : 0;

  return (
    <div className="space-y-4">
      {/* Header del Protocolo */}
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-white">{protocol.name}</h3>
            <p className="text-sm text-slate-300 mt-1">{protocol.description}</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-500/20 rounded-full px-3 py-1">
            <StatusIndicator status="active" size="sm" />
            <span className="text-xs font-medium text-blue-300">ACTIVO</span>
          </div>
        </div>

        {/* Requerimientos de Drones */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          <div className="bg-slate-900/50 rounded px-3 py-2 text-center">
            <div className="text-lg font-bold text-blue-400">{protocol.requiredDrones.search}</div>
            <div className="text-xs text-slate-400">Búsqueda</div>
          </div>
          <div className="bg-slate-900/50 rounded px-3 py-2 text-center">
            <div className="text-lg font-bold text-red-400">{protocol.requiredDrones.thermal}</div>
            <div className="text-xs text-slate-400">Térmicos</div>
          </div>
          <div className="bg-slate-900/50 rounded px-3 py-2 text-center">
            <div className="text-lg font-bold text-emerald-400">{protocol.requiredDrones.vocal}</div>
            <div className="text-xs text-slate-400">Vocales</div>
          </div>
          <div className="bg-slate-900/50 rounded px-3 py-2 text-center">
            <div className="text-lg font-bold text-amber-400">{protocol.requiredDrones.relay}</div>
            <div className="text-xs text-slate-400">Relay</div>
          </div>
        </div>

        {/* Barra de Progreso */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Progreso del Protocolo</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Fases del Protocolo */}
      <div className="space-y-3">
        {protocol.phaseSequence.map((phase, index) => {
          const isActive = phase.id === currentPhaseId;
          const isCompleted = currentPhaseIndex > index;
          const isPending = currentPhaseIndex < index;

          return (
            <div 
              key={phase.id}
              className={`
                rounded-lg border transition-all duration-300
                ${isActive ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20' : ''}
                ${isCompleted ? 'border-green-500/50 bg-green-500/5' : ''}
                ${isPending ? 'border-slate-700 bg-slate-900/30' : ''}
              `}
            >
              <div className="p-4">
                {/* Header de Fase */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    {/* Número de Fase */}
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                      ${isActive ? 'bg-blue-500 text-white animate-pulse' : ''}
                      ${isCompleted ? 'bg-green-500 text-white' : ''}
                      ${isPending ? 'bg-slate-700 text-slate-400' : ''}
                    `}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white">{phase.name}</h4>
                      <p className="text-sm text-slate-400 mt-1">{phase.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        <span>⏱️ {phase.duration} min</span>
                        <span>📋 {phase.assignments.length} tareas</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Asignaciones (solo si está activa) */}
                {isActive && (
                  <div className="mt-4 space-y-2 border-t border-blue-500/20 pt-3">
                    {phase.assignments.map((assignment) => (
                      <div 
                        key={assignment.droneId}
                        className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-cyan-400">
                              {assignment.droneId}
                            </span>
                            <span className={`
                              text-xs px-2 py-0.5 rounded-full
                              ${assignment.priority === 'critical' ? 'bg-red-500/20 text-red-300' : ''}
                              ${assignment.priority === 'high' ? 'bg-amber-500/20 text-amber-300' : ''}
                              ${assignment.priority === 'medium' ? 'bg-blue-500/20 text-blue-300' : ''}
                              ${assignment.priority === 'low' ? 'bg-slate-500/20 text-slate-300' : ''}
                            `}>
                              {assignment.priority.toUpperCase()}
                            </span>
                          </div>
                          <StatusIndicator 
                            status={assignment.status === 'completed' ? 'active' : 'low-battery'} 
                            size="sm" 
                          />
                        </div>
                        
                        <div className="text-xs text-slate-300 mb-2">
                          <span className="font-semibold text-white">Tarea:</span> {assignment.task}
                        </div>
                        
                        <div className="text-xs text-slate-400 leading-relaxed">
                          {assignment.procedure}
                        </div>
                        
                        <div className="text-xs text-slate-500 mt-2">
                          ⏱️ Duración estimada: {assignment.estimatedDuration} min
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Criterios de Éxito */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Criterios de Éxito
        </h4>
        <ul className="space-y-2">
          {protocol.successCriteria.map((criterion, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="text-emerald-400 mt-0.5">▸</span>
              <span>{criterion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
