"use client";

import { useState } from "react";
import { RiskMeter } from "@/components/RiskMeter";
import { AlertCard } from "@/components/AlertCard";
import type { SupplierReport } from "@/lib/report-generator";

interface AnalyzeResponse {
  report: SupplierReport;
  company: string;
  country?: string;
  error?: string;
}

const RECOMMENDATION_STYLES: Record<
  SupplierReport["recommendation"],
  { label: string; classes: string }
> = {
  aprobar: {
    label: "Recomendación: Aprobar",
    classes: "bg-green-100 text-green-800 border border-green-200",
  },
  investigar_mas: {
    label: "Recomendación: Investigar más",
    classes: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  },
  rechazar: {
    label: "Recomendación: Rechazar",
    classes: "bg-red-100 text-red-800 border border-red-200",
  },
};

export default function HomePage() {
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!company.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: company.trim(), country }),
      });

      const data: AnalyzeResponse = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Error inesperado al analizar el proveedor.");
      } else {
        setResult(data);
      }
    } catch {
      setError("No se pudo conectar con el servidor. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const rec = result?.report.recommendation
    ? RECOMMENDATION_STYLES[result.report.recommendation]
    : null;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Radar de Proveedores
        </h1>
        <p className="mt-2 text-gray-500">
          Due diligence en segundos. Ingresa el nombre de un proveedor para
          analizar su riesgo reputacional y legal.
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nombre de la empresa *
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Ej: Acme Logistics S.A."
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            País (opcional)
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Ej: Colombia"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-50"
        >
          {loading ? "Analizando..." : "Analizar proveedor"}
        </button>
      </form>

      {/* Estado loading */}
      {loading && (
        <div className="mt-10 space-y-4">
          <div className="h-20 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-28 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-24 animate-pulse rounded-xl bg-gray-100" />
        </div>
      )}

      {/* Estado error */}
      {error && !loading && (
        <div className="mt-10 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Resultados */}
      {result && !loading && (
        <div className="mt-10 space-y-5">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {result.company}
              {result.country && (
                <span className="ml-2 text-sm font-normal text-gray-400">
                  — {result.country}
                </span>
              )}
            </h2>
          </div>

          {/* Semáforo de riesgo */}
          <RiskMeter
            level={result.report.risk_level}
            score={result.report.risk_score}
          />

          {/* Resumen ejecutivo */}
          <div className="rounded-xl border border-gray-100 bg-white px-5 py-4">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Resumen ejecutivo
            </h3>
            <p className="text-sm leading-relaxed text-gray-700">
              {result.report.executive_summary}
            </p>
          </div>

          {/* Recomendación */}
          {rec && (
            <div className="flex">
              <span
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${rec.classes}`}
              >
                {rec.label}
              </span>
            </div>
          )}

          {/* Alertas críticas */}
          <AlertCard alerts={result.report.critical_alerts} type="critical" />

          {/* Señales positivas */}
          <AlertCard alerts={result.report.positive_signals} type="positive" />

          {/* Fuentes */}
          {result.report.sources.length > 0 && (
            <div className="rounded-xl border border-gray-100 bg-white px-5 py-4">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Fuentes consultadas
              </h3>
              <ul className="space-y-1.5">
                {result.report.sources.map((s, i) => (
                  <li key={i}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {s.title || s.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
