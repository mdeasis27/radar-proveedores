import assert from "node:assert/strict";
import test from "node:test";
import { tapeCounts } from "@/design-system/demo/outcome-tape";
import { SIGNALS, triage } from "./due-diligence";
import { activeCall, cutIndex, radarCards, radarCells, revealedSignals } from "./scene-state";

test("final tape counts match the triage", () => {
  assert.deepEqual(tapeCounts(radarCells(triage(SIGNALS, 50), 10)), { served: 8, rerouted: 1, lost: 1, pending: 0 });
  assert.ok(radarCells(triage(SIGNALS, 50), 2).slice(2).every(c => c === "pending"));
});

test("reveals two signals per step, all when complete or under reduced motion", () => {
  assert.equal(revealedSignals({ visible: 1, total: 5, complete: false }, 10, false), 2);
  assert.equal(revealedSignals({ visible: 5, total: 5, complete: true }, 10, false), 10);
  assert.equal(revealedSignals({ visible: 1, total: 5, complete: false }, 10, true), 10);
});

test("cards are pending until revealed, then ok, found, lost or skipped", () => {
  const items = triage(SIGNALS, 50);
  assert.deepEqual(radarCards(items, 0), Array(10).fill("pending"));
  assert.deepEqual(radarCards(items, 10), ["skip", "skip", "skip", "lost", "ok", "ok", "ok", "found", "ok", "ok"]);
  assert.deepEqual(radarCards(items, 4).slice(0, 5), ["skip", "skip", "skip", "lost", "pending"]);
});

test("the phone calls the highest read card in the newly revealed pair", () => {
  const items = triage(SIGNALS, 50);
  assert.equal(activeCall(items, 2), -1);
  assert.equal(activeCall(items, 4), -1);
  assert.equal(activeCall(items, 6), 5);
  assert.equal(activeCall(items, 10), 9);
  assert.equal(activeCall(triage(SIGNALS, 60), 6), 5);
});

test("the cut falls between the last unread and the first read card", () => {
  assert.equal(cutIndex(triage(SIGNALS, 50)), 4);
  assert.equal(cutIndex(triage(SIGNALS, 0)), 0);
  assert.equal(cutIndex(triage(SIGNALS, 100)), 9);
});
