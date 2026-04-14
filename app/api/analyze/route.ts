import { NextRequest, NextResponse } from "next/server";
import { searchSupplier } from "@/lib/tavily";
import { generateReport } from "@/lib/report-generator";

export async function POST(req: NextRequest) {
  try {
    const { company, country } = await req.json();

    if (!company || typeof company !== "string") {
      return NextResponse.json(
        { error: "company es requerido" },
        { status: 400 }
      );
    }

    const searchBatches = await searchSupplier(company.trim(), country);
    const report = await generateReport(company.trim(), searchBatches);

    return NextResponse.json({ report, company, country });
  } catch (err) {
    console.error("[/api/analyze]", err);
    return NextResponse.json(
      { error: "Error al analizar el proveedor" },
      { status: 500 }
    );
  }
}
