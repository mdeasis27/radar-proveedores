"use client";
import type { PlaybackFrame } from "@/design-system/demo/playback";
import type { TraceEvent } from "@/design-system/demo/types";
import { StoryStage } from "@/design-system/demo/decision-lab";
import { OutcomeTape, useReducedMotion } from "@/design-system/demo/project-story";
import { tapeCounts } from "@/design-system/demo/outcome-tape";
import { FlowDiagram, type FlowTone } from "@/design-system/demo/flow-diagram";
import type { MissionResult } from "./mission";
import { radarCells, revealedSignals } from "./scene-state";
import { STORY } from "./story";

const ORDER = ["signals", "ranking", "analyst", "decision"] as const;

export function RadarStoryScene({ frame, result, locale }: { frame: PlaybackFrame<TraceEvent>; result: MissionResult; locale: "en" | "es" }) {
  const copy = STORY[locale].scene;
  const reduced = useReducedMotion();
  const revealed = revealedSignals(frame, result.items.length, reduced);
  const cells = radarCells(result.items, revealed);
  const missed = tapeCounts(cells).lost;
  const done = revealed === result.items.length;
  const tone: Record<(typeof ORDER)[number], FlowTone> = { signals: "idle", ranking: "idle", analyst: "active", decision: missed > 0 ? "danger" : done ? "success" : "idle" };
  const nodes = ORDER.map((id, i) => ({ id, x: 10 + i * 160, y: 15, ...copy.nodes[id], tone: tone[id] }));
  const edges = ORDER.slice(1).map((to, i) => ({ from: ORDER[i], to, tone: to === "decision" && missed > 0 ? ("danger" as const) : undefined }));
  return <StoryStage locale={locale} title={copy.title} caption={copy.caption} step={frame.visible} total={frame.total}>
    <FlowDiagram nodes={nodes} edges={edges} width={650} height={100} ariaLabel={copy.missedOf(missed)} statusLabels={copy.statusLabels} />
    <div className="mt-6">
      <OutcomeTape cells={cells} labels={copy.tape} ariaLabel={copy.tapeLabel} columns={10} />
      <p className="mt-4 font-mono text-2xl font-semibold tracking-tight">{copy.missedOf(missed)}</p>
    </div>
  </StoryStage>;
}
