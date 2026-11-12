"use client";

import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "./button";

interface TourStep {
  target: string;
  title: string;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

interface OnboardingTourProps {
  steps: TourStep[];
  onComplete: () => void;
  showOnFirstVisit?: boolean;
}

export function OnboardingTour({
  steps,
  onComplete,
  showOnFirstVisit = true,
}: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [elementRect, setElementRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (showOnFirstVisit) {
      const hasCompletedTour = localStorage.getItem("onboarding-completed");
      if (!hasCompletedTour) {
        setTimeout(() => setIsActive(true), 1000);
      }
    }
  }, [showOnFirstVisit]);

  useEffect(() => {
    if (isActive && steps[currentStep]) {
      const element = document.querySelector(steps[currentStep].target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setElementRect(rect);
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentStep, isActive, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("onboarding-completed", "true");
    setIsActive(false);
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem("onboarding-completed", "true");
    setIsActive(false);
  };

  if (!isActive || !steps[currentStep] || !elementRect) return null;

  const step = steps[currentStep];
  const position = step.position || "bottom";

  const tooltipPosition = {
    top: {
      top: elementRect.top - 20,
      left: elementRect.left + elementRect.width / 2,
      transform: "translate(-50%, -100%)",
    },
    bottom: {
      top: elementRect.bottom + 20,
      left: elementRect.left + elementRect.width / 2,
      transform: "translate(-50%, 0)",
    },
    left: {
      top: elementRect.top + elementRect.height / 2,
      left: elementRect.left - 20,
      transform: "translate(-100%, -50%)",
    },
    right: {
      top: elementRect.top + elementRect.height / 2,
      left: elementRect.right + 20,
      transform: "translate(0, -50%)",
    },
  }[position];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm animate-fadeIn" />

      {/* Spotlight */}
      <div
        className="fixed z-[9999] pointer-events-none"
        style={{
          top: elementRect.top - 8,
          left: elementRect.left - 8,
          width: elementRect.width + 16,
          height: elementRect.height + 16,
          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.7)",
          borderRadius: "8px",
          border: "3px solid #3b82f6",
          animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        }}
      />

      {/* Tooltip */}
      <div
        className="fixed z-[10000] animate-slideUp"
        style={tooltipPosition}
      >
        <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700 p-6 max-w-sm">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-blue-400">
                  Paso {currentStep + 1} de {steps.length}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-100">{step.title}</h3>
            </div>
            <button
              onClick={handleSkip}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Cerrar tour"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <p className="text-sm text-slate-300 mb-6">{step.content}</p>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-slate-800 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleSkip}
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              Saltar tour
            </button>
            
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button
                  onClick={handlePrev}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {currentStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
                {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function resetOnboarding() {
  localStorage.removeItem("onboarding-completed");
}
