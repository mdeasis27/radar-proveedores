import type { DemoAdapter, TraceEvent } from "@/design-system/demo/types";
import { SIGNALS, triage, type TriagedSignal } from "./due-diligence";

export type MissionInput = { cutoff: number };
type Tally = { read: number; missed: number };
export type MissionResult = { items: TriagedSignal[]; missed: number; comparison: { mine: Tally; all: Tally } };

const STEP = 2;
const tally = (items: TriagedSignal[]): Tally => ({ read: items.filter(s => s.read).length, missed: items.filter(s => s.status === "missed").length });

/** Triages the 10 signals at one cutoff; the trace reveals them two at a time. */
export const runMission: DemoAdapter<MissionInput, MissionResult> = async (input, signal, onEvent) => {
  const startedAt = performance.now();
  const items = triage(SIGNALS, input.cutoff);
  const trace: TraceEvent[] = [];
  for (let i = 0; i < items.length; i += STEP) {
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    const n = i / STEP + 1;
    const event: TraceEvent = { id: `batch-${n}`, step: n, kind: "evidence", messageKey: `batch.${n}`, timestampMs: performance.now() - startedAt, evidenceIds: items.slice(i, i + STEP).map(s => s.id) };
    trace.push(event);
    onEvent(event);
  }
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  const mine = tally(items);
  return { input, result: { items, missed: mine.missed, comparison: { mine, all: tally(triage(SIGNALS, 0)) } }, trace, executionMs: performance.now() - startedAt, mode: "local" };
};
