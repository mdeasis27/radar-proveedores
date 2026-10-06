import type { TapeStatus } from "@/design-system/demo/outcome-tape";
import type { PlaybackFrame } from "@/design-system/demo/playback";
import type { TraceEvent } from "@/design-system/demo/types";
import type { TriagedSignal } from "./due-diligence";

const CELL: Record<TriagedSignal["status"], TapeStatus> = { clear: "served", found: "rerouted", missed: "lost" };

export function radarCells(items: readonly { status: TriagedSignal["status"] }[], revealed: number): TapeStatus[] {
  return items.map((s, i) => (i >= revealed ? "pending" : CELL[s.status]));
}

export function revealedSignals(frame: { visible: number; total: number; complete: boolean }, n: number, reducedMotion: boolean): number {
  if (reducedMotion || frame.complete || frame.total === 0) return n;
  return Math.ceil((n * frame.visible) / frame.total);
}

export const COMPLETE_FRAME: PlaybackFrame<TraceEvent> = { visible: 0, total: 0, event: undefined, complete: true };
