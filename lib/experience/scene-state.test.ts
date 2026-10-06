import assert from "node:assert/strict";
import test from "node:test";
import { tapeCounts } from "@/design-system/demo/outcome-tape";
import { SIGNALS, triage } from "./due-diligence";
import { radarCells, revealedSignals } from "./scene-state";

test("final tape counts match the triage", () => {
  assert.deepEqual(tapeCounts(radarCells(triage(SIGNALS, 50), 10)), { served: 8, rerouted: 1, lost: 1, pending: 0 });
  assert.ok(radarCells(triage(SIGNALS, 50), 2).slice(2).every(c => c === "pending"));
});

test("reveals two signals per step, all when complete or under reduced motion", () => {
  assert.equal(revealedSignals({ visible: 1, total: 5, complete: false }, 10, false), 2);
  assert.equal(revealedSignals({ visible: 5, total: 5, complete: true }, 10, false), 10);
  assert.equal(revealedSignals({ visible: 1, total: 5, complete: false }, 10, true), 10);
});
