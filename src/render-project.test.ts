import { describe, expect, test } from "bun:test";
import { PPQ, secondsToSample, ticksToSeconds } from "./kernel.ts";
import { renderProject } from "./render-project.ts";
import { addTrack, emptyProject, type ProjectTrack } from "./project.ts";

const track = (moduleId: string, params: Record<string, number> = {}): ProjectTrack => ({
	voice: { moduleId, params },
	pattern: { length: PPQ, notes: [{ start: 0, length: PPQ / 2, pitch: 60 }] },
});

const expectedLength = (tempo: number, patternTicks: number, sampleRate: number) =>
	Math.round(secondsToSample(ticksToSeconds(patternTicks, PPQ, tempo), sampleRate));

describe("renderProject", () => {
	test("renders non-zero output for one track with one note", () => {
		const p = addTrack(emptyProject(120), track("sine"));
		const out = renderProject(p, 44100);
		expect(out.some((v) => v !== 0)).toBe(true);
	});

	test("output length matches scheduled pattern duration", () => {
		const p = addTrack(emptyProject(120), track("sine"));
		const out = renderProject(p, 44100);
		expect(out.length).toBe(expectedLength(120, PPQ, 44100));
	});

	test("two identical tracks sum to louder output than one track", () => {
		const single = addTrack(emptyProject(120), track("sine"));
		const twoTracks = addTrack(single, track("sine"));
		const one = renderProject(single, 44100);
		const two = renderProject(twoTracks, 44100);
		const peak = (a: Float32Array) => Math.max(...a.map(Math.abs));
		expect(peak(two)).toBeGreaterThan(peak(one));
	});

	test("unknown moduleId throws", () => {
		const p = addTrack(emptyProject(120), track("does-not-exist"));
		expect(() => renderProject(p, 44100)).toThrow();
	});
});
