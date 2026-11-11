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
    <div className={`space-x-2 ${className || ""}`}>
      {scenarios.map((scenario) => (
        <button
          key={scenario.value}
          type="button"
          className={`
            inline-flex items-center rounded-md border px-3 py-1.5 text-sm ${
              selected === scenario.value
                ? "bg-accent text-accent-foreground"
                : "text-foreground hover:bg-accent/20"
            }
          `}
          onClick={() => onSelect(scenario.value)}
        >
          <span>{scenario.label}</span>
        </button>
      ))}
    </div>
  );
}