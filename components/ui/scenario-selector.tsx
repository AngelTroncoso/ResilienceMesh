import { ReactNode } from "react";
import type { EmergencyScenario } from "@/types";

export function ScenarioSelector<T extends string = string>({
  scenarios,
  selected,
  onSelect,
  className,
}: {
  scenarios: { label: string; value: T }[];
  selected: T;
  onSelect: (value: T) => void;
  className?: string;
}): JSX.Element {
  return (
    <div className={`flex flex-wrap gap-2 ${className || ""}`}>
      {scenarios.map((scenario) => {
        const isSelected = selected === scenario.value;
        return (
          <button
            key={scenario.value}
            type="button"
            className={`
              group relative inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium
              transition-all duration-200 ease-out
              ${
                isSelected
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25 scale-105"
                  : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/70 hover:text-white hover:shadow-md"
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900
              active:scale-95
            `}
            onClick={() => onSelect(scenario.value)}
            aria-pressed={isSelected}
          >
            {/* Indicador de selección */}
            {isSelected && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            )}
            
            <span className="relative z-10">{scenario.label}</span>
            
            {/* Efecto de brillo al hover */}
            <div className={`
              absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300
              bg-gradient-to-r from-transparent via-white/5 to-transparent
            `}></div>
          </button>
        );
      })}
    </div>
  );
}