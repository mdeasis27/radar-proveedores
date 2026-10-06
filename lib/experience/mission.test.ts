import assert from "node:assert/strict";
import test from "node:test";
import { runMission } from "./mission";

test("reveals the 10 signals two at a time and compares with reading everything", async () => {
  const r = await runMission({ cutoff: 50 }, new AbortController().signal, () => {});
  assert.equal(r.trace.length, 5);
  assert.deepEqual(r.trace[0].evidenceIds, ["signal-1", "signal-2"]);
  assert.equal(r.result.missed, 1);
  assert.deepEqual(r.result.comparison, { mine: { read: 6, missed: 1 }, all: { read: 10, missed: 0 } });
});

test("stops when aborted", async () => {
  const c = new AbortController(); c.abort();
  await assert.rejects(runMission({ cutoff: 50 }, c.signal, () => {}));
});
