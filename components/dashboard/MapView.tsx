"use client";

import { ReactNode, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle, Polyline, useMap } from "react-leaflet";
import { divIcon, LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapView.css";
import type { DroneSpec, DroneTelemetry, ChileanCoordinate, EmergencyScenario, DroneStatus } from "@/types";
import { StatusIndicator } from "../ui/status-indicator";
import { ScenarioSelector } from "../ui/scenario-selector";
import { scenarioConfigs, victimsByScenario, droneFleet } from "@/data/seed-data";
import { useSimulationContext } from "@/contexts/SimulationContext";

const attribution =
  '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';

// Componente para actualizar la vista del mapa cuando cambia el escenario
function MapViewController({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom, {
      animate: true,
      duration: 1.5,
    });
  }, [center, zoom, map]);
  
  return null;
}

// Iconos personalizados para drones según su estado y actividad
function createDroneIcon(status: DroneStatus, role: string, battery: number, hasTask: boolean) {
  const baseColors = {
    search: "#3b82f6", // blue
    thermal: "#ef4444", // red
    vocal: "#10b981", // green
    relay: "#8b5cf6", // purple
    delivery: "#f59e0b", // amber
  };

  const statusColors = {
    active: baseColors[role as keyof typeof baseColors] || "#3b82f6",
    idle: "#94a3b8", // gray
    "low-battery": "#f59e0b", // amber
    "critical-battery": "#ef4444", // red
    returning: "#06b6d4", // cyan
    offline: "#64748b", // dark gray
  };

  const color = statusColors[status] || statusColors.active;
  const pulseClass = hasTask && status === "active" ? "animate-pulse" : "";
  
  return divIcon({
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 rounded-full ${pulseClass}" style="background-color: ${color}; opacity: 0.3;"></div>
        <div class="relative w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold" style="background-color: ${color};">
          ${hasTask ? "📍" : "🔵"}
        </div>
        ${battery < 30 ? `<div class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border border-white"></div>` : ""}
      </div>
    `,
    className: "drone-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

// Componente para mostrar un drone individual con telemetría
function DroneLiveMarker({ droneId, role }: { droneId: string; role: string }) {
  const { getTelemetry, state } = useSimulationContext();
  const telemetry = getTelemetry(droneId);
  const assignment = state.droneAssignments?.[droneId];

  if (!telemetry) return null;

  const icon = createDroneIcon(
    telemetry.status,
    role,
    telemetry.battery,
    !!assignment
  );

  return (
    <Marker
      key={`${droneId}-${telemetry.timestamp}`}
      position={[telemetry.coordinates.lat, telemetry.coordinates.lng]}
      icon={icon}
    >
      <Popup>
        <div className="p-3 min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-lg">{droneId}</h4>
            <StatusIndicator status={telemetry.status} size="sm" />
          </div>
          
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Rol:</span>
              <span className="font-medium">{role}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-500">Batería:</span>
              <span className={`font-medium ${
                telemetry.battery < 20 ? "text-red-500" : 
                telemetry.battery < 40 ? "text-yellow-500" : 
                "text-green-500"
              }`}>
                {Math.round(telemetry.battery)}%
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-500">Altitud:</span>
              <span className="font-medium">{Math.round(telemetry.altitude)}m</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-500">Velocidad:</span>
              <span className="font-medium">{telemetry.velocity.toFixed(1)} m/s</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-500">Señal Mesh:</span>
              <span className="font-medium">{Math.round(telemetry.meshRssi)}%</span>
            </div>

            {assignment && (
              <>
                <div className="border-t border-slate-200 my-2"></div>
                <div className="bg-blue-50 p-2 rounded">
                  <div className="font-semibold text-blue-900 mb-1">
                    🎯 Tarea Activa
                  </div>
                  <div className="text-slate-700">
                    <div><strong>Rol:</strong> {assignment.role}</div>
                    <div><strong>Tarea:</strong> {assignment.task}</div>
                    <div><strong>Prioridad:</strong> {assignment.priority}</div>
                    <div className="mt-1 text-xs text-slate-600">
                      {assignment.procedure}
                    </div>
                  </div>
                </div>
              </>
            )}

            {telemetry.status === "returning" && (
              <div className="bg-cyan-50 p-2 rounded mt-2 text-center">
                <span className="text-cyan-700 font-medium">
                  🔋 Regresando a base
                </span>
              </div>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export function MapView({
  selectedScenario,
  onScenarioChange,
  showVictims = true,
}: {
  selectedScenario: EmergencyScenario;
  onScenarioChange: (scenario: EmergencyScenario) => void;
  showVictims?: boolean;
}): JSX.Element {
  const config = scenarioConfigs[selectedScenario];
  const { getAllTelemetry } = useSimulationContext();
  const allTelemetry = getAllTelemetry();

  // Obtener todos los drones del escenario actual
  const activeDrones = useMemo(() => {
    if (!config) return [];
    
    const allDrones = [
      ...droneFleet.search.map(d => ({ ...d, role: "search" })),
      ...droneFleet.thermal.map(d => ({ ...d, role: "thermal" })),
      ...droneFleet.vocal.map(d => ({ ...d, role: "vocal" })),
      ...droneFleet.relay.map(d => ({ ...d, role: "relay" })),
    ];

    return allDrones.filter(drone => config.drones.includes(drone.id));
  }, [config]);

  return (
    <div className="h-[500px] w-full rounded-lg border border-border bg-card overflow-hidden relative">
      {/* Indicador de escenario actual */}
      <div className="absolute top-4 left-4 z-[1000] bg-slate-900/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-700 shadow-xl">
        <div className="flex items-center gap-3">
          <div 
            className="w-3 h-3 rounded-full animate-pulse" 
            style={{ backgroundColor: config.color }}
          />
          <div>
            <div className="text-xs text-slate-400">Zona de Operación</div>
            <div className="text-sm font-semibold text-slate-100">{config.center.city}, {config.center.region}</div>
          </div>
        </div>
      </div>

      {/* Contador de drones activos */}
      <div className="absolute top-4 right-4 z-[1000] bg-slate-900/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-700 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="text-blue-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-sm">
            <span className="font-bold text-slate-100">{activeDrones.length}</span>
            <span className="text-slate-400 ml-1">drones activos</span>
          </div>
        </div>
      </div>

      <MapContainer
        center={[config.center.lat, config.center.lng]}
        zoom={config.zoom}
        className="h-full w-full"
      >
        {/* Componente para actualizar vista cuando cambia el escenario */}
        <MapViewController 
          center={[config.center.lat, config.center.lng]} 
          zoom={config.zoom} 
        />
        
        <TileLayer
          attribution={attribution}
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Cobertura Mesh Wi-Fi/LoRa */}
        <Circle
          center={[config.center.lat, config.center.lng]}
          radius={800}
          pathOptions={{ 
            fillColor: "#3b82f6", 
            fillOpacity: 0.1, 
            color: "#3b82f6", 
            weight: 2,
            opacity: 0.5 
          }}
        />

        {/* Drones activos con telemetría en tiempo real */}
        {activeDrones.map((drone) => (
          <DroneLiveMarker 
            key={drone.id} 
            droneId={drone.id} 
            role={drone.role}
          />
        ))}

        {/* Víctimas (si activado) */}
        {showVictims && config && victimsByScenario[selectedScenario]?.map(
          (victim) => {
            const victimIcon = divIcon({
              html: `
                <div class="relative flex items-center justify-center">
                  <div class="absolute w-6 h-6 rounded-full animate-ping bg-red-500 opacity-75"></div>
                  <div class="relative text-2xl">🆘</div>
                </div>
              `,
              className: "victim-marker",
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            });

            return (
              <Marker
                key={victim.id}
                position={[victim.coordinates.lat, victim.coordinates.lng]}
                icon={victimIcon}
              >
                <Popup>
                  <div className="p-3">
                    <h4 className="font-bold text-red-600 mb-2">🆘 Víctima Detectada</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Descripción:</strong> {victim.description}</p>
                      <p>
                        <strong>Severidad:</strong>{" "}
                        <span className={`font-semibold ${
                          victim.severity === "critical" ? "text-red-600" :
                          victim.severity === "moderate" ? "text-yellow-600" :
                          "text-green-600"
                        }`}>
                          {victim.severity}
                        </span>
                      </p>
                      <p><strong>Estado:</strong> {victim.status}</p>
                      {victim.injuries && <p><strong>Lesiones:</strong> {victim.injuries}</p>}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          }
        )}
      </MapContainer>
    </div>
  );
}