"use client";

import { useState, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CollapsibleSidebarProps {
  children: ReactNode;
  side?: "left" | "right";
  defaultCollapsed?: boolean;
  className?: string;
}

export function CollapsibleSidebar({
  children,
  side = "left",
  defaultCollapsed = false,
  className = "",
}: CollapsibleSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const Icon = side === "left" ? 
    (isCollapsed ? ChevronRight : ChevronLeft) :
    (isCollapsed ? ChevronLeft : ChevronRight);

  return (
    <div
      className={`
        relative transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"}
        ${className}
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleCollapse}
        className={`
          absolute ${side === "left" ? "-right-3" : "-left-3"} top-4 z-50
          w-6 h-6 rounded-full bg-slate-800 border border-slate-700
          flex items-center justify-center
          text-slate-400 hover:text-slate-200 hover:bg-slate-700
          shadow-lg transition-all hover:scale-110
          focus:outline-none focus:ring-2 focus:ring-blue-500
        `}
        aria-label={isCollapsed ? "Expandir panel" : "Contraer panel"}
        title={isCollapsed ? "Expandir panel" : "Contraer panel"}
      >
        <Icon className="w-4 h-4" />
      </button>

      {/* Content */}
      <div className={`overflow-hidden ${isCollapsed ? "hidden" : "block"}`}>
        {children}
      </div>
    </div>
  );
}
