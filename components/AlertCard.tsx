import { Alert } from "@/design-system/components/alert";

interface AlertCardProps {
  alerts: string[];
  type: "critical" | "positive";
}

export function AlertCard({ alerts, type }: AlertCardProps) {
  if (alerts.length === 0) return null;

  return (
    <Alert
      tone={type === "critical" ? "danger" : "success"}
      title={type === "critical" ? "Alertas críticas" : "Señales positivas"}
      items={alerts}
    />
  );
}