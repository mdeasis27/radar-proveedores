import assert from "node:assert/strict";
import test from "node:test";
import { STORY } from "./story";
import { lintStory, storyStrings as strings } from "@/design-system/demo/copy-lint";

const keys = (o: unknown): string[] => o && typeof o === "object" && !Array.isArray(o) ? Object.entries(o).filter(([k]) => k !== "before" && k !== "after").flatMap(([k, v]) => [k, ...keys(v).map(x => `${k}.${x}`)]) : [];

test("same shape in English and Spanish", () => assert.deepEqual(keys(STORY.es), keys(STORY.en)));

test("no empty strings except the owner-supplied why note", () => {
  for (const locale of ["en", "es"] as const) {
    const { why, ...rest } = STORY[locale];
    assert.notEqual(why.title.trim(), "");
    for (const s of strings(rest)) assert.notEqual(s.trim(), "", `${locale}: empty string`);
  }
});

test("avoids AI-sounding patterns and brand names", () => {
  for (const locale of ["en", "es"] as const) {
    assert.deepEqual(lintStory(STORY[locale]), [], locale);
    const cases = [[{ read: 6, missed: 1 }, { read: 10, missed: 0 }], [{ read: 7, missed: 0 }, { read: 10, missed: 0 }], [{ read: 10, missed: 0 }, { read: 10, missed: 0 }]] as const;
    for (const [m, a] of cases) assert.deepEqual(lintStory({ s: STORY[locale].compare.sentence(m, a) }), []);
  }
});

test("the bet names the cutoff", () => {
  assert.match(STORY.es.tryIt.question(50), /relevancia 50/);
  assert.match(STORY.en.tryIt.question(40), /relevance 40/);
});

test("the comparison sentence is true for a miss, a clean cut and reading everything", () => {
  assert.equal(STORY.es.compare.sentence({ read: 6, missed: 1 }, { read: 10, missed: 0 }), "Leyendo 6 señales, al analista se le pasó una grave. Leyendo las 10, no se le pasó ninguna.");
  assert.match(STORY.es.compare.sentence({ read: 7, missed: 0 }, { read: 10, missed: 0 }), /aun así encontró/);
  assert.match(STORY.en.compare.sentence({ read: 10, missed: 0 }, { read: 10, missed: 0 }), /already reads everything/);
  assert.equal(STORY.en.compare.sentence({ read: 1, missed: 2 }, { read: 10, missed: 0 }), "Reading 1 signal, the analyst missed 2 serious ones. Reading all 10, nothing slipped by.");
  assert.equal(STORY.es.compare.sentence({ read: 1, missed: 2 }, { read: 10, missed: 0 }), "Leyendo 1 señal, al analista se le pasaron 2 graves. Leyendo las 10, no se le pasó ninguna.");
});

test("missed count agrees in number", () => {
  assert.equal(STORY.es.scene.missedOf(1), "Quedó sin leer 1 señal grave");
  assert.equal(STORY.en.scene.missedOf(2), "2 serious signals went unread");
});
