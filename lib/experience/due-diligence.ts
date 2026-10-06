import{classifyRisk}from"@/lib/risk-classifier";import type{ExperienceInput,ExperienceResult}from"./types";export function assess(i:ExperienceInput):ExperienceResult{if(!Number.isFinite(i.relevance)||i.relevance<0||i.relevance>100)throw new Error("Relevance must be between 0 and 100.");const score=(i.highImpactUnresolved?75:15)+Math.round(i.relevance*.2);return{recommendation:classifyRisk(score)==="rojo"?"investigate":"proceed",score,checklist:i.highImpactUnresolved?["Resolve high-impact signal","Document analyst decision"]:["Evidence is resolved","Continue monitoring"]}}

export type Signal = { id: string; relevance: number; impact: "low" | "high" };
export type TriagedSignal = Signal & { read: boolean; status: "clear" | "found" | "missed" };

/** Ten fictional signals about one supplier, relevance 10 to 100. The serious ones sit at 40 and 80. */
export const SIGNALS: Signal[] = Array.from({ length: 10 }, (_, i) => ({ id: `signal-${i + 1}`, relevance: (i + 1) * 10, impact: i === 3 || i === 7 ? "high" : "low" }));

/** The analyst reads every signal at or above the cutoff. A serious signal left unread is missed. */
export function triage(signals: readonly Signal[], cutoff: number): TriagedSignal[] {
  if (!Number.isFinite(cutoff) || cutoff < 0 || cutoff > 100) throw new Error("The cutoff must be between 0 and 100.");
  return signals.map(s => {
    const read = s.relevance >= cutoff;
    return { ...s, read, status: s.impact === "low" ? "clear" : read ? "found" : "missed" };
  });
}
