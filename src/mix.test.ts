import { expect, test } from "bun:test";
import { normalize } from "./mix.ts";

test("normalize scales the peak to the target", () => {
	const out = normalize(Float32Array.from([0.1, -0.4, 0.2]), 0.9);
	expect(Math.max(...out.map(Math.abs))).toBeCloseTo(0.9, 6);
	expect(out[0]).toBeCloseTo(0.225, 6);
});

test("normalize leaves silence alone and does not mutate the input", () => {
	const quiet = new Float32Array(4);
	expect(normalize(quiet, 0.9)).toEqual(quiet);
	const src = Float32Array.from([0.5]);
	normalize(src, 1);
	expect(src[0]).toBe(0.5);
});
