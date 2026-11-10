import { expect, test } from "bun:test";
import { fm } from "./fm-voice.ts";

const sr = 44100;
const n = 512;
const collect = (v: ReturnType<typeof fm>, f: number) => Array.from({ length: n }, (_, i) => v(f, i, sr));
const energy = (xs: number[]) => xs.reduce((a, x) => a + x * x, 0);

test("produces non-zero output", () => {
	const xs = collect(fm(440, 220, 5), 440);
	expect(energy(xs)).toBeGreaterThan(0);
});

test("different modIndex values produce different output", () => {
	const a = collect(fm(440, 220, 1), 440);
	const b = collect(fm(440, 220, 5), 440);
	const same = a.every((x, k) => x === b[k]!);
	expect(same).toBe(false);
});

test("modFreq=0 falls back to sine (no modulation)", () => {
	const v = fm(440, 0, 5);
	for (let i = 0; i < n; i++) {
		const t = i / sr;
		expect(v(1, i, sr)).toBeCloseTo(Math.sin(2 * Math.PI * 440 * t), 6);
	}
});
