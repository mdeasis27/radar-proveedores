import type { Metadata } from "next";
import { fontVariables } from "@/design-system/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Radar de Proveedores — Due Diligence con IA",
  description:
    "Análisis de riesgo reputacional y legal de proveedores en segundos, usando inteligencia artificial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
