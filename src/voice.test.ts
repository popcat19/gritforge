import { expect, test } from "bun:test";
import { distort, saw, sine, stack } from "./voice.ts";

const SR = 48000;

test("saw is zero at the phase origin and ramps from -1 to 1 across the cycle", () => {
	expect(saw(1000, 0, SR)).toBeCloseTo(0, 12);
	expect(saw(1000, 12, SR)).toBeCloseTo(-0.5, 12);
	expect(saw(1000, 24, SR)).toBeCloseTo(0, 12);
	expect(saw(1000, 36, SR)).toBeCloseTo(0.5, 12);
});

test("saw averages to zero over whole cycles", () => {
	let sum = 0;
	for (let i = 0; i < 480; i++) sum += saw(1000, i, SR);
	expect(Math.abs(sum / 480)).toBeLessThan(0.01);
});

test("saw stays within unit range", () => {
	for (let i = 0; i < 4800; i++) expect(Math.abs(saw(440, i, SR))).toBeLessThanOrEqual(1.001);
});

test("stack with one zero-cent layer equals the voice", () => {
	expect(stack(sine, [0])(440, 123, SR)).toBeCloseTo(sine(440, 123, SR), 12);
});

test("stack averages layers at detuned frequencies", () => {
	const v = stack(sine, [0, 1200]);
	for (const i of [0, 7, 100, 999]) {
		expect(v(440, i, SR)).toBeCloseTo((sine(440, i, SR) + sine(880, i, SR)) / 2, 12);
	}
});

test("stack of detuned layers beats at the frequency difference", () => {
	const v = stack(sine, [-20, 20]);
	const f = 440, d = f * (2 ** (20 / 1200) - 2 ** (-20 / 1200));
	const win = 480;
	const rms = (from: number) => {
		let s = 0;
		for (let i = from; i < from + win; i++) s += v(f, i, SR) ** 2;
		return Math.sqrt(s / win);
	};
	const quiet = rms(Math.round(SR / (2 * d)) - win / 2);
	const loud = rms(0);
	expect(loud).toBeGreaterThan(quiet * 5);
});

test("distort keeps range and approaches identity at low drive", () => {
	const v = distort(sine, 0.001);
	for (const i of [0, 5, 50, 500]) expect(v(440, i, SR)).toBeCloseTo(sine(440, i, SR), 4);
	const hard = distort(sine, 20);
	for (let i = 0; i < 200; i++) expect(Math.abs(hard(440, i, SR))).toBeLessThanOrEqual(1);
});

test("distort at high drive pushes mid-level samples toward the rail", () => {
	const clip = distort(() => 0.5, 10);
	expect(clip(440, 0, SR)).toBeGreaterThan(0.99);
});
