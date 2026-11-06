import { expect, test } from "bun:test";
import { addNote, removeNote, type Pattern } from "./pattern.ts";
import { schedule } from "./schedule.ts";

const p: Pattern = { length: 3840, notes: [] };

test("addNote sorts by start then pitch", () => {
	const q = addNote(addNote(p, { start: 960, length: 480, pitch: 60 }), { start: 0, length: 480, pitch: 64 });
	expect(q.notes.map((n) => n.start)).toEqual([0, 960]);
});
test("addNote rejects out of range", () => {
	expect(() => addNote(p, { start: 3600, length: 480, pitch: 60 })).toThrow(RangeError);
	expect(() => addNote(p, { start: 0, length: 0, pitch: 60 })).toThrow(RangeError);
});
test("ops do not mutate", () => {
	const q = addNote(p, { start: 0, length: 480, pitch: 60 });
	expect(p.notes.length).toBe(0);
	expect(removeNote(q, 0).notes.length).toBe(0);
});
test("schedule maps ticks to samples via kernel", () => {
	const q = addNote(p, { start: 960, length: 960, pitch: 60 });
	expect(schedule(q, 120, 48000)).toEqual([{ startSample: 24000, endSample: 48000, pitch: 60 }]);
});
