// Síntesis LLM — convierte resultados de Tavily en un informe ejecutivo estructurado

import { z } from "zod";
import { chat } from "@/ai-kit/router";
import type { UserApiKey } from "@/ai-kit/types";
import type { TavilyResult } from "./tavily";

export interface SupplierReport {
  risk_level: "verde" | "amarillo" | "rojo";
  risk_score: number; // 0-100 (100 = máximo riesgo)
  executive_summary: string;
  critical_alerts: string[];
  positive_signals: string[];
  recommendation: "aprobar" | "investigar_mas" | "rechazar";
  sources: { title: string; url: string }[];
  provider?: string;
  model?: string;
  latency_ms?: number;
}

interface SearchBatch {
  query: string;
  results: TavilyResult[];
}

const reportSchema = z.object({
  risk_level: z.enum(["verde", "amarillo", "rojo"]),
  risk_score: z.number().min(0).max(100),
  executive_summary: z.string(),
  critical_alerts: z.array(z.string()),
  positive_signals: z.array(z.string()),
  recommendation: z.enum(["aprobar", "investigar_mas", "rechazar"]),
});

export async function generateReport(
  company: string,
  searchBatches: SearchBatch[],
  userApiKey?: UserApiKey,
): Promise<SupplierReport> {
  const allResults = searchBatches.flatMap((b) => b.results);

  const evidence = allResults
    .map((r) => `[${r.title}] (${r.url})\n${r.content}`)
    .join("\n\n---\n\n");

  const sources = allResults.map((r) => ({ title: r.title, url: r.url }));

  const response = await chat({
    messages: [
      {
        role: "system",
        content:
          "Eres un analista de riesgo corporativo senior con experiencia en due diligence de proveedores en América Latina. Responde ÚNICAMENTE con un objeto JSON válido, sin markdown, sin texto adicional.",
      },
      {
        role: "user",
        content: `Analiza la siguiente evidencia sobre el proveedor "${company}" y genera un informe de riesgo estructurado.

CRITERIOS:
- risk_score: 0 = sin riesgo, 100 = máximo riesgo
- verde (0-39): empresa confiable | amarillo (40-69): señales moderadas | rojo (70-100): señales graves
- critical_alerts: hallazgos negativos concretos
- positive_signals: hallazgos positivos
- executive_summary: 2-4 oraciones en español
- recommendation: "aprobar" si < 40, "investigar_mas" si 40-69, "rechazar" si >= 70

Responde con JSON exactamente así:
{
  "risk_level": "verde" | "amarillo" | "rojo",
  "risk_score": número,
  "executive_summary": "texto",
  "critical_alerts": ["alerta"],
  "positive_signals": ["señal"],
  "recommendation": "aprobar" | "investigar_mas" | "rechazar"
}

EVIDENCIA:
${evidence}

Si la evidencia es insuficiente, usa risk_level "amarillo" con score 50.`,
      },
    ],
    maxTokens: 1024,
    userApiKey,
  });

  const jsonMatch = response.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("El modelo no devolvió JSON válido");

  const object = reportSchema.parse(JSON.parse(jsonMatch[0]));

  return {
    ...object,
    sources,
    provider: response.provider,
    model: response.model,
    latency_ms: response.latency_ms,
  };
}
