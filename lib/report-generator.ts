// Síntesis LLM — convierte resultados de Tavily en un informe ejecutivo estructurado

import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import type { TavilyResult } from "./tavily";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY ?? "",
});

export interface SupplierReport {
  risk_level: "verde" | "amarillo" | "rojo";
  risk_score: number; // 0-100 (100 = máximo riesgo)
  executive_summary: string;
  critical_alerts: string[];
  positive_signals: string[];
  recommendation: "aprobar" | "investigar_mas" | "rechazar";
  sources: { title: string; url: string }[];
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
  searchBatches: SearchBatch[]
): Promise<SupplierReport> {
  const allResults = searchBatches.flatMap((b) => b.results);

  const evidence = allResults
    .map((r) => `[${r.title}] (${r.url})\n${r.content}`)
    .join("\n\n---\n\n");

  const sources = allResults.map((r) => ({ title: r.title, url: r.url }));

  const { object } = await generateObject({
    model: openrouter("meta-llama/llama-3.1-8b-instruct:free"),
    schema: reportSchema,
    prompt: `Eres un analista de riesgo corporativo senior con experiencia en due diligence de proveedores en América Latina.

Analiza la siguiente evidencia recolectada sobre el proveedor "${company}" y genera un informe de riesgo estructurado.

CRITERIOS DE EVALUACIÓN:
- risk_score: 0 = sin riesgo, 100 = máximo riesgo
- verde (0-39): empresa confiable, sin señales de alerta
- amarillo (40-69): señales de alerta moderadas, requiere investigación adicional
- rojo (70-100): señales graves de fraude, sanciones, demandas importantes o reputación muy negativa
- critical_alerts: hallazgos negativos concretos (fraudes, demandas, sanciones, malas prácticas)
- positive_signals: hallazgos positivos (trayectoria, certificaciones, clientes reconocidos, buena reputación)
- executive_summary: párrafo de 2-4 oraciones con el veredicto ejecutivo en español
- recommendation: "aprobar" si risk_score < 40, "investigar_mas" si 40-69, "rechazar" si >= 70

EVIDENCIA RECOLECTADA:
${evidence}

Si la evidencia es insuficiente o la empresa no es conocida públicamente, indícalo en executive_summary y asigna risk_level "amarillo" con score 50.`,
  });

  return { ...object, sources };
}
