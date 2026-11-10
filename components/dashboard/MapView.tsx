import { ReactNode } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { DroneSpec, DroneTelemetry, ChileanCoordinate } from "@types";
import { StatusIndicator } from "../ui/status-indicator";
import { ScenarioSelector } from "../ui/scenario-selector";
import { scenarioConfigs, victimsByScenario, droneFleet } from "../data/seed-data";

const attribution =
  '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';

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

  return (
    <div className="h-[500px] w-full rounded-lg border border-border bg-card overflow-hidden">
      <MapContainer
        center={[config.center.lat, config.center.lng]}
        zoom={config.zoom}
        className="h-full w-full"
        whenCreated={(_map) => {
          _map.attributionControl.setPrefix(false);
        }}
      >
        <TileLayer
          attribution={attribution}
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Cobertura Mesh Wi-Fi/LoRa */}
        <Circle
          center={[config.center.lat, config.center.lng]}
          radius={800}
          className="opacity-20 bg-blue-500/30"
        />

        {/* Marcadores de drones */}
        {droneFleet.search.map((drone) => (
          <Marker
            key={drone.id}
            position={[drone.coordinates.lat, drone.coordinates.lng]}
            className="text-blue-400"
          >
            <div className="flex flex-col items-center text-xs">
              <StatusIndicator status={drone.status} size="sm" />
              <span className="mt-1 text-caption">{drone.callSign}</span>
            </div>
          </Marker>
        ))}

        {droneFleet.thermal.map((drone) => (
          <Marker
            key={drone.id}
            position={[drone.coordinates.lat, drone.coordinates.lng]}
            className="text-red-400"
          >
            <div className="flex flex-col items-center text-xs">
              <span className="mt-1 text-caption">{drone.callSign}</span>
            </div>
          </Marker>
        ))}

        {droneFleet.vocal.map((drone) => (
          <Marker
            key={drone.id}
            position={[drone.coordinates.lat, drone.coordinates.lng]}
            className="text-emerald-400"
          >
            <div className="flex flex-col items-center text-xs">
              <span className="mt-1 text-caption">{drone.callSign}</span>
            </div>
          </Marker>
        ))}

        {droneFleet.relay.map((drone) => (
          <Marker
            key={drone.id}
            position={[drone.coordinates.lat, drone.coordinates.lng]}
            className="text-amber-400"
          >
            <div className="flex flex-col items-center text-xs">
              <span className="mt-1 text-caption">{drone.callSign}</span>
            </div>
          </Marker>
        ))}

        {/* Víctimas (si activado) */}
        {showVictims && config && victimsByScenario[selectedScenario]?.map(
          (victim) => (
            <Marker
              key={victim.id}
              position={[victim.coordinates.lat, victim.coordinates.lng]}
              className="pulse-red-500"
            >
              <Popup>
                <div className="p-4">
                  <h4 className="font-bold">{victim.description}</h4>
                  <p className="text-xs text-slate-400">{victim.severity} severity</p>
                </div>
              </Popup>
            </Marker>
          )
        )}
      </MapContainer>
    </div>
  );
}