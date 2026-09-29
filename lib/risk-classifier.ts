// Clasifica el nivel de riesgo a partir del score numérico

import type { Tone } from "@/design-system/components/tone";

export type RiskLevel = "verde" | "amarillo" | "rojo";

export function classifyRisk(score: number): RiskLevel {
  if (score >= 70) return "rojo";
  if (score >= 40) return "amarillo";
  return "verde";
}

export const RISK_LABELS: Record<RiskLevel, string> = {
  verde: "Bajo riesgo — puede proceder",
  amarillo: "Riesgo medio — investigar más",
  rojo: "Alto riesgo — no recomendar",
};

export const RISK_TONES: Record<RiskLevel, Tone> = {
  verde: "success",
  amarillo: "warning",
  rojo: "danger",
};
