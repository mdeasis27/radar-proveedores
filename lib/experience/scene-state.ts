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

export type CardState = "pending" | "ok" | "found" | "lost" | "skip";
type Triaged = Pick<TriagedSignal, "read" | "status">;

/** What each reference card shows once `revealed` signals are on screen. */
export function radarCards(items: readonly Triaged[], revealed: number): CardState[] {
  return items.map((s, i) => (i >= revealed ? "pending" : s.status === "found" ? "found" : s.status === "missed" ? "lost" : s.read ? "ok" : "skip"));
}

/** Index of the card the phone is calling: the highest read card in the pair revealed last, or -1. */
export function activeCall(items: readonly Triaged[], revealed: number, pair = 2): number {
  for (let i = Math.min(revealed, items.length) - 1; i >= Math.max(0, revealed - pair); i--) if (items[i].read) return i;
  return -1;
}

/** Number of unread cards; the cut line sits just before this index. */
export function cutIndex(items: readonly Triaged[]): number {
  return items.filter(s => !s.read).length;
}
