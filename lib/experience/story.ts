import type { ExperienceInput } from "./types";
export const supplierScenarios: Record<"resolved" | "investigate", ExperienceInput> = { resolved: { highImpactUnresolved: false, relevance: 35 }, investigate: { highImpactUnresolved: true, relevance: 85 } };
export function isSupplierScenario(input: ExperienceInput, id: keyof typeof supplierScenarios) { const scenario = supplierScenarios[id]; return input.highImpactUnresolved === scenario.highImpactUnresolved && input.relevance === scenario.relevance; }
