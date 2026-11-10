import { describe, expect, test } from "bun:test";
import { addTrack, emptyProject, type Project } from "./project.ts";

describe("project schema", () => {
	test("empty project has format and version", () => {
		const p = emptyProject(140);
		expect(p.format).toBe("gritforge-project");
		expect(p.version).toBe(1);
		expect(p.tempo).toBe(140);
		expect(p.tracks).toEqual([]);
	});

	test("round trip through JSON", () => {
		const p = emptyProject(128);
		const t = {
			voice: { moduleId: "saw-lead", params: { layers: 4, spreadCents: 12, drive: 4 } },
			pattern: { length: 960, notes: [{ start: 0, length: 480, pitch: 60 }] },
		};
		const withTrack = addTrack(p, t);
		const json = JSON.stringify(withTrack);
		const parsed = JSON.parse(json);
		expect(parsed).toEqual(withTrack);
	});

	test("extra fields survive round trip (forward compatible)", () => {
		const p = emptyProject();
		const withExtra = { ...p, futureField: "yes" };
		const json = JSON.stringify(withExtra);
		const parsed = JSON.parse(json);
		expect(parsed.futureField).toBe("yes");
		expect(parsed.format).toBe("gritforge-project");
	});

	test("tracks can be added immutably", () => {
		const p = emptyProject();
		const t1 = { voice: { moduleId: "sine", params: {} }, pattern: { length: 960, notes: [] } };
		const t2 = { voice: { moduleId: "saw-lead", params: { layers: 2 } }, pattern: { length: 480, notes: [] } };
		const p1 = addTrack(p, t1);
		const p2 = addTrack(p1, t2);
		expect(p1.tracks).toHaveLength(1);
		expect(p2.tracks).toHaveLength(2);
		expect(p.tracks).toHaveLength(0);
	});
});
