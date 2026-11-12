import { ReactNode } from "react";
import "./globals.css";

import { SimulationProvider } from "@/contexts/SimulationContext";
import { ToastProvider } from "@/components/ui/toast";

export const metadata = {
  title: "ResilienceMesh Chile - Centro de Mando de Emergencias",
  description: "Sistema de respuesta ante desastres con malla agéntica de drones",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es" className="bg-slate-950 text-slate-100">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className="min-h-screen antialiased custom-scrollbar">
        <ToastProvider>
          <SimulationProvider>
            {children}
          </SimulationProvider>
        </ToastProvider>
      </body>
    </html>
  );
}