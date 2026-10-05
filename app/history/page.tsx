import Link from "next/link";

import { StatusBadge } from "@/design-system/components/status-badge";
import type { Tone } from "@/design-system/components/tone";

type Locale = "en" | "es";
type Risk = "low" | "medium" | "high";

const SAMPLE_HISTORY: { supplier: string; country: string; risk: Risk; score: number; analyzedAt: string }[] = [
  { supplier: "A", country: "Colombia", risk: "low", score: 18, analyzedAt: "2026-04-10" },
  { supplier: "B", country: "Mexico", risk: "medium", score: 54, analyzedAt: "2026-04-11" },
  { supplier: "C", country: "Argentina", risk: "high", score: 82, analyzedAt: "2026-04-12" },
];

const tones: Record<Risk, Tone> = { low: "success", medium: "warning", high: "danger" };

function labels(lang: Locale) {
  return lang === "es" ? {
    title: "Historial de análisis", description: "Ejemplos históricos ficticios; esta vista no consulta una base de datos.", notice: "Los proveedores, países, fechas y resultados son datos de muestra. El puntaje es ilustrativo y no constituye una recomendación operativa.", back: "Volver al demo", date: "Fecha de muestra", supplier: "Proveedor", levels: { low: "Riesgo bajo", medium: "Riesgo medio", high: "Riesgo alto" }, recommendation: { low: "Continuar con monitoreo", medium: "Revisar la señal", high: "Investigar antes de continuar" },
  } : {
    title: "Analysis history", description: "Fictional historical examples; this view does not query a database.", notice: "Suppliers, countries, dates, and outcomes are sample data. The score is illustrative and is not an operational recommendation.", back: "Back to demo", date: "Sample date", supplier: "Supplier", levels: { low: "Low risk", medium: "Medium risk", high: "High risk" }, recommendation: { low: "Continue monitoring", medium: "Review the signal", high: "Investigate before proceeding" },
  };
}

export default function HistoryPage({ lang = "es" }: { lang?: Locale }) {
  const text = labels(lang);
  return <main className="mx-auto max-w-2xl px-6 py-16">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl font-semibold text-foreground">{text.title}</h1><p className="mt-2 text-muted-foreground">{text.description}</p></div><Link href={`/${lang}/app`} className="rounded border px-3 py-2 text-sm">← {text.back}</Link></div>
    <p className="mt-6 rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-muted-foreground">{text.notice}</p>
    <ul className="mt-8 space-y-4">{SAMPLE_HISTORY.map((entry) => <li key={entry.supplier} className="rounded-xl border bg-card px-5 py-4"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-semibold text-foreground">{text.supplier} {entry.supplier}</p><p className="text-sm text-muted-foreground">{entry.country} · {text.date}: {entry.analyzedAt}</p></div><StatusBadge tone={tones[entry.risk]} dot className="shrink-0 px-3 py-1">{entry.score}/100</StatusBadge></div><p className="mt-3 text-sm text-foreground">{text.levels[entry.risk]}</p><p className="mt-1 text-xs text-muted-foreground">{text.recommendation[entry.risk]}</p></li>)}</ul>
  </main>;
}
