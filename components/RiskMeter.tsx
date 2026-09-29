import { Alert } from "@/design-system/components/alert";
import { Meter } from "@/design-system/components/meter";
import { RISK_LABELS, RISK_TONES, type RiskLevel } from "@/lib/risk-classifier";

interface RiskMeterProps {
  level: RiskLevel;
  score: number;
}

export function RiskMeter({ level, score }: RiskMeterProps) {
  const tone = RISK_TONES[level];

  return (
    <Alert tone={tone} title="Nivel de riesgo">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-foreground">{RISK_LABELS[level]}</p>
        <span className="text-2xl font-semibold tracking-tight text-foreground">
          {score}/100
        </span>
      </div>
      <Meter value={score} tone={tone} className="mt-3" />
    </Alert>
  );
}