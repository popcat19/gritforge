import { expect, test } from "bun:test";
import { distort, saw, sine, stack } from "../voice.ts";
import { sawLeadModule, sineModule, voiceModules } from "./builtin-voices.ts";
import { defaults, instantiate } from "./voice-module.ts";

const SR = 48000;

test("defaults lists every declared parameter at its default", () => {
	expect(defaults(sawLeadModule)).toEqual({ layers: 4, spreadCents: 12, drive: 4 });
	expect(defaults(sineModule)).toEqual({});
});

test("every module has unique id and defaults inside min and max", () => {
	expect(new Set(voiceModules.map((m) => m.id)).size).toBe(voiceModules.length);
	for (const m of voiceModules) {
		expect(m.kind).toBe("voice");
		for (const p of m.params) {
			expect(p.default).toBeGreaterThanOrEqual(p.min);
			expect(p.default).toBeLessThanOrEqual(p.max);
		}
	}
});

test("sine module builds the sine voice", () => {
	const v = instantiate(sineModule);
	for (const i of [0, 3, 77]) expect(v(440, i, SR)).toBe(sine(440, i, SR));
});

test("saw lead defaults equal the demo voice", () => {
	const v = instantiate(sawLeadModule);
	const demo = distort(stack(saw, [-12, -4, 4, 12]), 4);
	for (const i of [0, 5, 100, 999]) expect(v(220, i, SR)).toBeCloseTo(demo(220, i, SR), 12);
});

test("one layer with no spread is a distorted single saw", () => {
	const v = instantiate(sawLeadModule, { layers: 1, spreadCents: 0, drive: 2 });
	const ref = distort(saw, 2);
	for (const i of [0, 9, 400]) expect(v(330, i, SR)).toBeCloseTo(ref(330, i, SR), 12);
});

test("out of range values clamp and layers round to an integer", () => {
	const v = instantiate(sawLeadModule, { layers: 99, spreadCents: -5, drive: 1000 });
	const ref = instantiate(sawLeadModule, { layers: 8, spreadCents: 0, drive: 20 });
	for (const i of [0, 9, 400]) expect(v(330, i, SR)).toBeCloseTo(ref(330, i, SR), 12);
	const r = instantiate(sawLeadModule, { layers: 2.6 });
	const three = instantiate(sawLeadModule, { layers: 3 });
	expect(r(330, 17, SR)).toBeCloseTo(three(330, 17, SR), 12);
});

test("unknown parameter ids are rejected", () => {
	expect(() => instantiate(sawLeadModule, { warmth: 1 })).toThrow(RangeError);
});
