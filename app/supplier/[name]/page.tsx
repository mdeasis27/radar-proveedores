import Link from "next/link";

type Locale = "en" | "es";

function safeName(value: string) {
  return value.slice(0, 120) || "—";
}

export default function SupplierPage({ params, lang = "es" }: { params: { name: string }; lang?: Locale }) {
  const supplier = safeName(params.name);
  const text = lang === "es" ? {
    title: "Informe local no disponible", detail: "Esta vista no consulta fuentes externas ni una base de datos. Ejecuta un escenario en el demo para evaluar una señal local.", evidence: "No hay evidencia disponible para este nombre.", back: "Volver al demo", label: "Nombre solicitado",
  } : {
    title: "Local report unavailable", detail: "This view does not query external sources or a database. Run a demo scenario to assess a local signal.", evidence: "No evidence is available for this name.", back: "Back to demo", label: "Requested name",
  };

  return <main className="mx-auto max-w-3xl px-6 py-16"><Link href={`/${lang}/app`} className="text-sm text-muted-foreground hover:text-foreground">← {text.back}</Link><h1 className="mt-8 text-2xl font-semibold text-foreground">{text.title}</h1><p className="mt-3 text-muted-foreground">{text.detail}</p><section className="mt-8 rounded-xl border bg-card p-5"><p className="text-xs uppercase text-muted-foreground">{text.label}</p><p className="mt-2 font-medium">{supplier}</p><p className="mt-5 text-sm text-muted-foreground">{text.evidence}</p></section></main>;
}
