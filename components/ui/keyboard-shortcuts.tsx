"use client";

import { useEffect, useState } from "react";
import { X, Keyboard } from "lucide-react";

interface Shortcut {
  keys: string[];
  description: string;
  action: () => void;
}

export function KeyboardShortcuts({ shortcuts }: { shortcuts: Shortcut[] }) {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Mostrar ayuda con Shift + ?
      if (e.key === "?" && e.shiftKey) {
        e.preventDefault();
        setShowHelp((prev) => !prev);
        return;
      }

      // Ejecutar atajos
      shortcuts.forEach((shortcut) => {
        const keys = shortcut.keys.map((k) => k.toLowerCase());
        const pressed = [
          e.ctrlKey && "ctrl",
          e.shiftKey && "shift",
          e.altKey && "alt",
          e.metaKey && "meta",
          e.key.toLowerCase(),
        ].filter(Boolean);

        const matches = keys.every((key) => pressed.includes(key)) &&
                       keys.length === pressed.length;

        if (matches) {
          e.preventDefault();
          shortcut.action();
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);

  if (!showHelp) {
    return (
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-slate-800 hover:bg-slate-700 
                   text-slate-300 shadow-lg border border-slate-700 transition-all hover:scale-110"
        aria-label="Mostrar atajos de teclado"
        title="Atajos de teclado (Shift + ?)"
      >
        <Keyboard className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700 max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Keyboard className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-slate-100">Atajos de Teclado</h2>
          </div>
          <button
            onClick={() => setShowHelp(false)}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <span className="text-slate-300 text-sm">{shortcut.description}</span>
                <div className="flex gap-1">
                  {shortcut.keys.map((key, i) => (
                    <kbd
                      key={i}
                      className="px-3 py-1.5 text-xs font-mono font-semibold bg-slate-700 text-slate-200 
                               border border-slate-600 rounded shadow-sm uppercase"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-300">
              💡 <strong>Tip:</strong> Presiona <kbd className="px-2 py-1 text-xs bg-slate-700 rounded">Shift</kbd> + <kbd className="px-2 py-1 text-xs bg-slate-700 rounded">?</kbd> en cualquier momento para ver esta ayuda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
