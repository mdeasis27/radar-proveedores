"use client";

import { useState } from "react";
import { RiskMeter } from "@/components/RiskMeter";
import { AlertCard } from "@/components/AlertCard";
import { Alert } from "@/design-system/components/alert";
import { StatusBadge } from "@/design-system/components/status-badge";
import type { Tone } from "@/design-system/components/tone";
import type { SupplierReport } from "@/lib/report-generator";

interface AnalyzeResponse {
  report: SupplierReport;
  company: string;
  country?: string;
  error?: string;
}

const RECOMMENDATION_STYLES: Record<
  SupplierReport["recommendation"],
  { label: string; tone: Tone }
> = {
  aprobar: { label: "Recomendación: Aprobar", tone: "success" },
  investigar_mas: { label: "Recomendación: Investigar más", tone: "warning" },
  rechazar: { label: "Recomendación: Rechazar", tone: "danger" },
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
        <h1 className="text-3xl font-semibold text-foreground">
          Radar de Proveedores
        </h1>
        <p className="mt-2 text-muted-foreground">
          Due diligence en segundos. Ingresa el nombre de un proveedor para
          analizar su riesgo reputacional y legal.
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Nombre de la empresa *
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Ej: Acme Logistics S.A."
            className="w-full rounded-[var(--radius-md)] shadow-[var(--shadow-border-light)] px-4 py-2.5 text-sm outline-none focus:shadow-[var(--shadow-border)] focus:ring-2 focus:ring-[var(--ring)]/20 bg-background text-foreground"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            País (opcional)
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Ej: Colombia"
            className="w-full rounded-[var(--radius-md)] shadow-[var(--shadow-border-light)] px-4 py-2.5 text-sm outline-none focus:shadow-[var(--shadow-border)] bg-background text-foreground"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-[var(--radius-md)] bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Analizando..." : "Analizar proveedor"}
        </button>
      </form>

      {/* Estado loading */}
      {loading && (
        <div className="mt-10 space-y-4">
          <div className="h-20 animate-pulse rounded-[var(--radius-md)] bg-muted/20" />
          <div className="h-28 animate-pulse rounded-[var(--radius-md)] bg-muted/20" />
          <div className="h-24 animate-pulse rounded-[var(--radius-md)] bg-muted/20" />
        </div>
      )}

      {/* Estado error */}
      {error && !loading && (
        <Alert tone="danger" className="mt-10">
          <strong>Error:</strong> {error}
        </Alert>
      )}

      {/* Resultados */}
      {result && !loading && (
        <div className="mt-10 space-y-5">
          <div className="border-b border-border pb-4">
            <h2 className="text-lg font-semibold text-foreground">
              {result.company}
              {result.country && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
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
          <div className="rounded-[var(--radius-md)] shadow-[var(--shadow-card)] bg-card px-5 py-4">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Resumen ejecutivo
            </h3>
            <p className="text-sm leading-relaxed text-foreground">
              {result.report.executive_summary}
            </p>
          </div>

          {/* Recomendación */}
          {rec && (
            <div className="flex">
              <StatusBadge tone={rec.tone} className="px-4 py-1.5 text-sm font-semibold">
                {rec.label}
              </StatusBadge>
            </div>
          )}

          {/* Alertas críticas */}
          <AlertCard alerts={result.report.critical_alerts} type="critical" />

          {/* Señales positivas */}
          <AlertCard alerts={result.report.positive_signals} type="positive" />

          {/* Fuentes */}
          {result.report.sources.length > 0 && (
            <div className="rounded-[var(--radius-md)] shadow-[var(--shadow-card)] bg-card px-5 py-4">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Fuentes consultadas
              </h3>
              <ul className="space-y-1.5">
                {result.report.sources.map((s, i) => (
                  <li key={i}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--accent)] hover:underline"
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
