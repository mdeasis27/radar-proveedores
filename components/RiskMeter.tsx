import { RISK_COLORS, RISK_LABELS, type RiskLevel } from "@/lib/risk-classifier";

interface RiskMeterProps {
  level: RiskLevel;
  score: number;
}

export function RiskMeter({ level, score }: RiskMeterProps) {
  return (
    <div className={`rounded-xl border px-6 py-4 ${RISK_COLORS[level]}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium uppercase tracking-wide">
          Nivel de riesgo
        </span>
        <span className="text-2xl font-bold">{score}/100</span>
      </div>
      <p className="mt-1 text-sm">{RISK_LABELS[level]}</p>
    </div>
  );
}
