import { ReactNode } from "react";

export function StatusIndicator({
  status,
  size = "md",
  className = "",
  showPulse = true,
  ...props
}: {
  status: "active" | "low-battery" | "critical-battery" | "offline" | "returning";
  size?: "sm" | "md" | "lg";
  className?: string;
  showPulse?: boolean;
  [key: string]: any;
}): JSX.Element {
  const sizeMap = { 
    sm: "h-2.5 w-2.5", 
    md: "h-3 w-3", 
    lg: "h-4 w-4" 
  };
  
  const statusConfig = {
    active: {
      color: "bg-emerald-500",
      ring: "ring-emerald-500/30",
      glow: "shadow-emerald-500/50"
    },
    "low-battery": {
      color: "bg-amber-500",
      ring: "ring-amber-500/30",
      glow: "shadow-amber-500/50"
    },
    "critical-battery": {
      color: "bg-red-500",
      ring: "ring-red-500/30",
      glow: "shadow-red-500/50"
    },
    offline: {
      color: "bg-slate-500",
      ring: "ring-slate-500/30",
      glow: "shadow-slate-500/50"
    },
    returning: {
      color: "bg-blue-500",
      ring: "ring-blue-500/30",
      glow: "shadow-blue-500/50"
    }
  };

  const config = statusConfig[status];
  const shouldPulse = showPulse && (status === "active" || status === "critical-battery");

  return (
    <span className={`relative inline-flex ${className}`} {...props}>
      {/* Anillo de pulso animado */}
      {shouldPulse && (
        <span className={`
          animate-ping absolute inline-flex h-full w-full rounded-full 
          ${config.color} opacity-75
        `}></span>
      )}
      
      {/* Indicador principal */}
      <span className={`
        relative inline-flex rounded-full 
        ${sizeMap[size]} 
        ${config.color}
        ${config.ring}
        ${config.glow}
        ring-2
        shadow-lg
      `}></span>
    </span>
  );
}