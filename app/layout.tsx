import { ReactNode } from "react";
import "./globals.css";

import { SimulationProvider } from "@/contexts/SimulationContext";

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
    <html lang="en" className="bg-slate-950 text-slate-100">
      <body className="min-h-screen antialiased">
        <SimulationProvider>
          {children}
        </SimulationProvider>
      </body>
    </html>
  );
}