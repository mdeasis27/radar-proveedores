// TODO: recibir el informe via searchParams o localStorage y renderizarlo
// Componentes: RiskMeter, AlertCard, SupplierReport, lista de fuentes

export default function SupplierPage({
  params,
}: {
  params: { name: string };
}) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-bold">{decodeURIComponent(params.name)}</h1>
      <p className="mt-2 text-gray-500">Cargando informe…</p>
      {/* TODO: mostrar RiskMeter, AlertCard (critical), AlertCard (positive), fuentes */}
    </main>
  );
}
