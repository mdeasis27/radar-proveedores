// Historial de búsquedas — datos mock estáticos (sin DB)

import type { RiskLevel } from "@/lib/risk-classifier";
import { RISK_LABELS, RISK_COLORS } from "@/lib/risk-classifier";

interface HistoryEntry {
  company: string;
  country: string;
  risk_level: RiskLevel;
  risk_score: number;
  recommendation: string;
  analyzed_at: string;
}

const MOCK_HISTORY: HistoryEntry[] = [
  {
    company: "Acme Logistics S.A.",
    country: "Colombia",
    risk_level: "verde",
    risk_score: 18,
    recommendation: "Aprobar",
    analyzed_at: "2026-04-10",
  },
  {
    company: "Transportes del Norte",
    country: "México",
    risk_level: "amarillo",
    risk_score: 54,
    recommendation: "Investigar más",
    analyzed_at: "2026-04-11",
  },
  {
    company: "Global Supply Corp",
    country: "Argentina",
    risk_level: "rojo",
    risk_score: 82,
    recommendation: "Rechazar",
    analyzed_at: "2026-04-12",
  },
];

export default function HistoryPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">
        Historial de análisis
      </h1>
      <p className="mt-2 text-gray-500">
        Últimas búsquedas de due diligence realizadas.
      </p>

      <ul className="mt-10 space-y-4">
        {MOCK_HISTORY.map((entry, i) => (
          <li
            key={i}
            className="rounded-xl border border-gray-100 bg-white px-5 py-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900">{entry.company}</p>
                <p className="text-sm text-gray-400">
                  {entry.country} · {entry.analyzed_at}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${RISK_COLORS[entry.risk_level]}`}
              >
                {entry.risk_score}/100
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {RISK_LABELS[entry.risk_level]}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Recomendación: {entry.recommendation}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
