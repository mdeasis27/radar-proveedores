// Clasifica el nivel de riesgo a partir del score numérico

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

export const RISK_COLORS: Record<RiskLevel, string> = {
  verde: "text-green-600 bg-green-50 border-green-200",
  amarillo: "text-yellow-700 bg-yellow-50 border-yellow-200",
  rojo: "text-red-600 bg-red-50 border-red-200",
};
