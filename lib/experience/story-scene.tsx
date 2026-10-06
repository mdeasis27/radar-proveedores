"use client";
import type { PlaybackFrame } from "@/design-system/demo/playback";
import type { TraceEvent } from "@/design-system/demo/types";
import { StoryStage } from "@/design-system/demo/decision-lab";
import { OutcomeTape, useReducedMotion } from "@/design-system/demo/project-story";
import type { MissionResult } from "./mission";
import { activeCall, cutIndex, radarCards, radarCells, revealedSignals, type CardState } from "./scene-state";
import { STORY, type RadarStory } from "./story";

type Layout = { cols: number; cardW: number; gap: number; padX: number; width: number };
const WIDE: Layout = { cols: 10, cardW: 52, gap: 8, padX: 12, width: 616 };
const NARROW: Layout = { cols: 5, cardW: 56, gap: 10, padX: 12, width: 344 };
const HEADER = 56;
const ROW = 200;
const FOOTER = 64;

const BODY: Record<CardState, string> = {
  pending: "fill-foreground/5 stroke-border",
  ok: "fill-success/15 stroke-success",
  skip: "fill-success/15 stroke-success",
  found: "fill-info/15 stroke-info",
  lost: "fill-danger/15 stroke-danger",
};
const BADGE: Partial<Record<CardState, { fill: string; glyph: string }>> = {
  ok: { fill: "fill-success", glyph: "✓" },
  skip: { fill: "fill-success", glyph: "✓" },
  found: { fill: "fill-info", glyph: "!" },
  lost: { fill: "fill-danger", glyph: "×" },
};
const LEGEND = [["ok", "bg-success", "✓"], ["found", "bg-info", "!"], ["lost", "bg-danger", "×"]] as const;
const POP = "animate-[radar-pop_.3s_ease-out_both] motion-reduce:animate-none";

export function RadarStoryScene({ frame, result, cutoff, locale }: { frame: PlaybackFrame<TraceEvent>; result: MissionResult; cutoff: number; locale: "en" | "es" }) {
  const copy = STORY[locale].scene;
  const reduced = useReducedMotion();
  const n = result.items.length;
  const revealed = revealedSignals(frame, n, reduced);
  const read = result.items.filter(s => s.read).length;
  const label = copy.describe(cutoff, read, result.missed);
  const props = { result, revealed, cutoff, reduced, copy, label };
  return <StoryStage locale={locale} title={copy.title} caption={copy.caption} step={frame.visible} total={frame.total}>
    <div className="sm:hidden"><ReferenceCalls layout={NARROW} {...props} /></div>
    <div className="hidden sm:block"><ReferenceCalls layout={WIDE} {...props} /></div>
    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
      {LEGEND.map(([key, bg, glyph]) => <li key={key} className="flex items-center gap-1.5"><span aria-hidden="true" className={`inline-flex size-3.5 items-center justify-center rounded-full text-[9px] font-bold leading-none text-white ${bg}`}>{glyph}</span>{copy.legend[key]}</li>)}
    </ul>
    <div className="mt-6">
      <OutcomeTape cells={radarCells(result.items, revealed)} labels={copy.tape} ariaLabel={copy.tapeLabel} columns={10} />
      <p className="mt-4 font-mono text-xl font-semibold tracking-tight sm:text-2xl">{revealed === n ? copy.missedOf(result.missed) : " "}</p>
    </div>
  </StoryStage>;
}

function ReferenceCalls({ layout, result, revealed, cutoff, reduced, copy, label }: { layout: Layout; result: MissionResult; revealed: number; cutoff: number; reduced: boolean; copy: RadarStory["scene"]; label: string }) {
  const { cols, cardW, gap, padX, width } = layout;
  const items = result.items;
  const n = items.length;
  const rows = Math.ceil(n / cols);
  const height = HEADER + rows * ROW + FOOTER;
  const cardX = (i: number) => padX + (i % cols) * (cardW + gap);
  const rowY = (i: number) => HEADER + Math.floor(i / cols) * ROW;
  const center = (i: number) => cardX(i) + cardW / 2;

  const states = radarCards(items, revealed);
  const cut = cutIndex(items);
  const active = activeCall(items, revealed);
  let lastRead = -1;
  for (let i = 0; i < revealed && i < n; i++) if (items[i].read) lastRead = i;
  const phoneAt = active >= 0 ? active : lastRead >= 0 ? lastRead : Math.min(cut, n - 1);
  const calling = active >= 0 && !reduced;
  const done = revealed === n;
  const bubbleW = copy.bubble.length * 7.4 + 16;

  // One dashed "not called" zone per row that holds unread cards.
  const zones: { from: number; to: number }[] = [];
  for (let r = 0; r < rows; r++) {
    const from = r * cols;
    const to = Math.min(cut, (r + 1) * cols) - 1;
    if (to >= from) zones.push({ from, to });
  }

  return <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} className="block h-auto w-full" data-radar-calls>
    <text x={padX} y={22} className="fill-foreground" fontSize={16} fontWeight={600}>{copy.callsFrom(cutoff)}</text>
    <text x={padX} y={44} className="fill-muted-foreground" fontSize={14}>{copy.order}</text>

    {zones.map(z => {
      const x0 = cardX(z.from) - 4;
      const x1 = cardX(z.to) + cardW + 4;
      return <g key={z.from}>
        <rect x={x0} y={rowY(z.from) + 32} width={x1 - x0} height={166} rx={8} className="fill-foreground/[.03] stroke-border" strokeDasharray="4 4" />
        <text x={(x0 + x1) / 2} y={rowY(z.from) + 192} textAnchor="middle" fontSize={13} className="fill-muted-foreground">{copy.notCalled}</text>
      </g>;
    })}
    {cut > 0 && cut < n ? <line x1={cardX(cut) - gap / 2} x2={cardX(cut) - gap / 2} y1={rowY(cut) + 28} y2={rowY(cut) + 198} strokeWidth={2} strokeDasharray="6 5" className="stroke-foreground" data-radar-cut /> : null}

    {items.map((s, i) => {
      const state = states[i];
      const x = cardX(i);
      const y = rowY(i) + 38;
      const cx = center(i);
      const badge = BADGE[state];
      const delay = reduced ? undefined : { transitionDelay: `${s.read ? 450 + (i % 2) * 200 : (i % 2) * 200}ms` };
      return <g key={s.id} data-radar-card={state} className={`transition-opacity duration-300 motion-reduce:transition-none ${state === "skip" ? "opacity-50" : ""}`} style={delay}>
        <rect x={x} y={y} width={cardW} height={92} rx={8} strokeWidth={2} className={`transition-[fill,stroke] duration-300 motion-reduce:transition-none ${BODY[state]}`} style={delay} />
        <circle cx={cx} cy={y + 24} r={9} className="fill-muted-foreground" />
        <path d={`M${cx - 16} ${y + 58} q16 -26 32 0z`} className="fill-muted-foreground" />
        <text x={cx} y={y + 82} textAnchor="middle" fontSize={18} fontWeight={600} className="fill-foreground">{s.relevance}</text>
        {badge ? <g key={state} className={POP} style={reduced ? undefined : { animationDelay: delay?.transitionDelay }}>
          <circle cx={x + cardW - 4} cy={y + 2} r={10} className={badge.fill} />
          <text x={x + cardW - 4} y={y + 7} textAnchor="middle" fontSize={14} fontWeight={700} fill="#fff">{badge.glyph}</text>
        </g> : null}
        {!s.read && state !== "pending" ? <g className={POP} aria-hidden="true">
          <circle cx={cx} cy={rowY(i) + 162} r={10} fill="none" strokeWidth={2} className="stroke-muted-foreground" />
          <line x1={cx - 7} y1={rowY(i) + 155} x2={cx + 7} y2={rowY(i) + 169} strokeWidth={2} className="stroke-muted-foreground" />
        </g> : null}
        {state === "found" ? <g className={POP} style={reduced ? undefined : { animationDelay: delay?.transitionDelay }} data-radar-bubble>
          <rect x={Math.max(2, Math.min(width - bubbleW - 2, cx - bubbleW / 2))} y={rowY(i) + 2} width={bubbleW} height={24} rx={6} strokeWidth={1.5} className="fill-surface stroke-info" />
          <path d={`M${cx - 6} ${rowY(i) + 26} l6 9 l6 -9z`} className="fill-info" />
          <text x={Math.max(2, Math.min(width - bubbleW - 2, cx - bubbleW / 2)) + bubbleW / 2} y={rowY(i) + 19} textAnchor="middle" fontSize={13} className="fill-foreground">{copy.bubble}</text>
        </g> : null}
      </g>;
    })}

    {calling ? <line key={`wire-${revealed}`} x1={center(active)} x2={center(active)} y1={rowY(active) + 131} y2={rowY(active) + 146} strokeWidth={2} strokeDasharray="3 3" className={`stroke-foreground ${POP} [animation-delay:.45s]`} /> : null}
    <g className="transition-transform duration-500 ease-in-out motion-reduce:transition-none" style={{ transform: `translate(${center(phoneAt)}px, ${rowY(phoneAt) + 146}px)` }} data-radar-phone>
      <g key={revealed} className={calling ? "origin-center [transform-box:fill-box] animate-[radar-ring_.12s_linear_.45s_4]" : undefined}>
        <rect x={-13} y={0} width={26} height={42} rx={6} strokeWidth={2} className="fill-surface stroke-foreground" />
        <rect x={-8} y={5} width={16} height={24} rx={2} className="fill-foreground/20" />
        <circle cx={0} cy={36} r={2.5} className="fill-foreground" />
      </g>
    </g>

    {done ? <g className={POP} data-radar-result>
      <text x={width / 2} y={height - FOOTER + 30} textAnchor="middle" fontSize={18} fontWeight={600} className="fill-foreground">{copy.called(items.filter(s => s.read).length)}</text>
      <text x={width / 2} y={height - FOOTER + 54} textAnchor="middle" fontSize={14} className={result.missed > 0 ? "fill-danger" : "fill-muted-foreground"}>{copy.uncalled(result.missed)}</text>
    </g> : null}
  </svg>;
}
