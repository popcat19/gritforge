import { expect, test } from "bun:test";
import { distortMix } from "./mix-distort.ts";

const SR = 8000;
const N = 800;
const F = 100;

const sineBuf = (amp: number) => {
	const b = new Float32Array(N);
	for (let i = 0; i < N; i++) b[i] = amp * Math.sin((2 * Math.PI * F * i) / SR);
	return b;
};

const harmonicMag = (buf: Float32Array, freq: number) => {
	let re = 0;
	let im = 0;
	for (let i = 0; i < buf.length; i++) {
		re += buf[i] * Math.cos((2 * Math.PI * freq * i) / SR);
		im += buf[i] * Math.sin((2 * Math.PI * freq * i) / SR);
	}
	return Math.hypot(re, im);
};

test("distortMix changes the buffer", () => {
	const src = sineBuf(0.5);
	const out = distortMix(src, 5);
	let diff = 0;
	for (let i = 0; i < N; i++) diff = Math.max(diff, Math.abs(out[i] - src[i]));
	expect(diff).toBeGreaterThan(0.01);
});

test("higher drive adds more harmonic content", () => {
	const src = sineBuf(0.5);
	const soft = distortMix(src, 1);
	const hard = distortMix(src, 8);
	const ratio = (b: Float32Array) => harmonicMag(b, 3 * F) / harmonicMag(b, F);
	expect(ratio(hard)).toBeGreaterThan(ratio(soft));
	expect(ratio(hard)).toBeGreaterThan(0.05);
});

test("distortMix approaches identity at low drive", () => {
	const src = sineBuf(0.5);
	const out = distortMix(src, 0.001);
	for (let i = 0; i < N; i++) expect(out[i]).toBeCloseTo(src[i], 5);
});

test("distortMix does not mutate the input", () => {
	const src = sineBuf(0.5);
	const copy = src.slice();
	distortMix(src, 10);
	expect(src).toEqual(copy);
});

test("a silent buffer stays silent", () => {
	const out = distortMix(new Float32Array(64), 5);
	expect(Math.max(...out.map(Math.abs))).toBe(0);
});

test("distortMix output stays within the unit range at high drive", () => {
	const src = sineBuf(0.9);
	const out = distortMix(src, 20);
	expect(Math.max(...out.map(Math.abs))).toBeLessThanOrEqual(1.000001);
});
