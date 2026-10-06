import assert from "node:assert/strict";
import test from "node:test";
import { SIGNALS, triage } from "./due-diligence";

const count = (cutoff: number) => {
  const r = triage(SIGNALS, cutoff);
  return { clear: r.filter(s => s.status === "clear").length, found: r.filter(s => s.status === "found").length, missed: r.filter(s => s.status === "missed").length, read: r.filter(s => s.read).length };
};

test("10 fictional signals; reading from 50 misses the serious one at 40", () => {
  assert.equal(SIGNALS.length, 10);
  assert.deepEqual(count(50), { clear: 8, found: 1, missed: 1, read: 6 });
  assert.deepEqual(count(40), { clear: 8, found: 2, missed: 0, read: 7 });
  assert.deepEqual(count(0), { clear: 8, found: 2, missed: 0, read: 10 });
});

test("a low-impact signal is clear whether or not it is read", () => {
  assert.equal(triage([{ id: "x", relevance: 90, impact: "low" }], 0)[0].status, "clear");
  assert.equal(triage([{ id: "x", relevance: 10, impact: "low" }], 50)[0].status, "clear");
});

test("sweep: both bet answers are reachable, and the default (50) says a serious signal goes unread", () => {
  const answers = new Set<boolean>();
  for (let c = 0; c <= 100; c += 10) answers.add(count(c).missed > 0);
  assert.deepEqual([...answers].sort(), [false, true]);
  assert.equal(count(50).missed > 0, true);
});

test("rejects a cutoff outside 0..100", () => assert.throws(() => triage(SIGNALS, 101)));
