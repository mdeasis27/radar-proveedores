interface AlertCardProps {
  alerts: string[];
  type: "critical" | "positive";
}

export function AlertCard({ alerts, type }: AlertCardProps) {
  if (alerts.length === 0) return null;

  const styles =
    type === "critical"
      ? { container: "border-red-200 bg-red-50", dot: "bg-red-500" }
      : { container: "border-green-200 bg-green-50", dot: "bg-green-500" };

  const label = type === "critical" ? "Alertas críticas" : "Señales positivas";

  return (
    <div className={`rounded-xl border p-5 ${styles.container}`}>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
        {label}
      </h3>
      <ul className="space-y-2">
        {alerts.map((a, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${styles.dot}`}
            />
            {a}
          </li>
        ))}
      </ul>
    </div>
  );
}
