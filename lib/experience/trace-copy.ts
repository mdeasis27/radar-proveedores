const COPY: Record<string, { en: string; es: string }> = {
  "batch.1": { en: "signals 1 and 2 triaged", es: "señales 1 y 2 revisadas" },
  "batch.2": { en: "signals 3 and 4 triaged", es: "señales 3 y 4 revisadas" },
  "batch.3": { en: "signals 5 and 6 triaged", es: "señales 5 y 6 revisadas" },
  "batch.4": { en: "signals 7 and 8 triaged", es: "señales 7 y 8 revisadas" },
  "batch.5": { en: "signals 9 and 10 triaged", es: "señales 9 y 10 revisadas" },
};
export function traceCopy(locale: "en" | "es", key: string) { return COPY[key]?.[locale] ?? key; }
