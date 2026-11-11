"use client";

import { Activity, Battery, Radio, Navigation } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useSimulationContext } from "@/contexts/SimulationContext";
import { StatusIndicator } from "@/components/ui/status-indicator";
import type { DroneStatus } from "@/types";

export function TelemetryPanel() {
  const { getAllTelemetry, state } = useSimulationContext();
  const telemetryData = getAllTelemetry();
  const assignments = state.droneAssignments || {};

  const activeDrones = Object.values(telemetryData)
    .filter((t) => t.status !== "idle")
    .sort((a, b) => a.droneId.localeCompare(b.droneId));

  const getBatteryColor = (battery: number): string => {
    if (battery > 60) return "text-emerald-400";
    if (battery > 30) return "text-yellow-400";
    return "text-red-400";
  };

  const getRssiColor = (rssi: number): string => {
    if (rssi > 80) return "text-emerald-400";
    if (rssi > 60) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <Card className="bg-slate-900/40 backdrop-blur-sm border-slate-700/50 p-6 h-full overflow-auto">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between sticky top-0 bg-slate-900/40 backdrop-blur-sm pb-3 border-b border-slate-700/50">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Telemetría en Tiempo Real
          </h3>
          <div className="text-sm text-slate-400">
            {activeDrones.length} drones activos
          </div>
        </div>

        {/* Lista de Drones */}
        {activeDrones.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No hay drones activos</p>
            <p className="text-xs mt-1">Inicia la simulación para ver telemetría</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeDrones.map((telemetry) => {
              const assignment = assignments[telemetry.droneId];
              
              return (
                <div
                  key={telemetry.droneId}
                  className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-all"
                >
                  {/* Drone Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-mono text-sm font-semibold text-slate-100 mb-1">
                        {telemetry.droneId}
                      </div>
                      {assignment && (
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                          <span className="text-emerald-400">●</span>
                          {assignment.task}
                        </div>
                      )}
                    </div>
                    <StatusIndicator status={telemetry.status as DroneStatus} />
                  </div>

                  {/* Métricas Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {/* Batería */}
                    <div className="flex items-center gap-2">
                      <Battery className={`w-4 h-4 ${getBatteryColor(telemetry.battery)}`} />
                      <div>
                        <div className="text-slate-500">Batería</div>
                        <div className={`font-semibold ${getBatteryColor(telemetry.battery)}`}>
                          {Math.round(telemetry.battery)}%
                        </div>
                      </div>
                    </div>

                    {/* Señal Mesh */}
                    <div className="flex items-center gap-2">
                      <Radio className={`w-4 h-4 ${getRssiColor(telemetry.meshRssi)}`} />
                      <div>
                        <div className="text-slate-500">RSSI</div>
                        <div className={`font-semibold ${getRssiColor(telemetry.meshRssi)}`}>
                          {Math.round(telemetry.meshRssi)} dBm
                        </div>
                      </div>
                    </div>

                    {/* Velocidad */}
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="text-slate-500">Velocidad</div>
                        <div className="font-semibold text-slate-300">
                          {telemetry.velocity?.toFixed(1) || 0} m/s
                        </div>
                      </div>
                    </div>

                    {/* Altitud */}
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 flex items-center justify-center text-purple-400 font-bold">
                        ▲
                      </div>
                      <div>
                        <div className="text-slate-500">Altitud</div>
                        <div className="font-semibold text-slate-300">
                          {telemetry.altitude} m
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coordenadas */}
                  <div className="mt-3 pt-3 border-t border-slate-700/50 text-xs text-slate-500 font-mono">
                    {telemetry.coordinates.lat.toFixed(5)}, {telemetry.coordinates.lng.toFixed(5)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
