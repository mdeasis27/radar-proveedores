import { NextRequest, NextResponse } from "next/server";
import { searchSupplier } from "@/lib/tavily";
import { generateReport } from "@/lib/report-generator";
import { rateLimit } from "@/ai-kit/rate-limit";
import type { UserApiKey } from "@/ai-kit/types";

function parseByokHeader(header: string | null): UserApiKey | null {
  if (!header) return null;
  try {
    const parsed = JSON.parse(header) as unknown;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "provider" in parsed &&
      "key" in parsed
    ) {
      return parsed as UserApiKey;
    }
  } catch {
    // ignore
  }
  return null;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const { allowed, remaining } = rateLimit(ip, { maxRequests: 10, windowMs: 60 * 60 * 1000 });
  if (!allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Vuelve en una hora." }, { status: 429 });
  }

  try {
    const { company, country } = await req.json();

    if (!company || typeof company !== "string") {
      return NextResponse.json({ error: "company es requerido" }, { status: 400 });
    }

    const userApiKey = parseByokHeader(req.headers.get("x-user-api-key"));
    const searchBatches = await searchSupplier(company.trim(), country);
    const report = await generateReport(company.trim(), searchBatches, userApiKey ?? undefined);

    return NextResponse.json({
      report,
      company,
      country,
      remaining,
    });
  } catch (err) {
    console.error("[/api/analyze]", err);
    return NextResponse.json({ error: "Error al analizar el proveedor" }, { status: 500 });
  }
}
