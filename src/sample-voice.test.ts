import { expect, test } from "bun:test";
import { sampleVoice } from "./sample-voice.ts";

const buf = { rate: 1000, data: Float32Array.from([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]) };
const play = { offset: 0, rate: 1, reverse: false };
const v = sampleVoice(buf);

test("plays the buffer from the start at native rate", () => {
	for (let i = 0; i < 10; i++) expect(v(440, i, 1000, play)).toBeCloseTo(buf.data[i]!, 6);
});

test("returns silence past the end of the buffer", () => {
	expect(v(440, 10, 1000, play)).toBe(0);
	expect(v(440, 500, 1000, play)).toBe(0);
});

test("offset is a fraction of the buffer length", () => {
	expect(v(440, 0, 1000, { ...play, offset: 0.5 })).toBeCloseTo(0.5, 6);
	expect(v(440, 2, 1000, { ...play, offset: 0.5 })).toBeCloseTo(0.7, 6);
});

test("rate scales the read speed with linear interpolation", () => {
	expect(v(440, 2, 1000, { ...play, rate: 2 })).toBeCloseTo(0.4, 6);
	expect(v(440, 1, 1000, { ...play, rate: 0.5 })).toBeCloseTo(0.05, 6);
});

test("reverse reads backwards from the offset", () => {
	const r = { ...play, offset: 0.5, reverse: true };
	expect(v(440, 0, 1000, r)).toBeCloseTo(0.5, 6);
	expect(v(440, 1, 1000, r)).toBeCloseTo(0.4, 6);
	expect(v(440, 6, 1000, r)).toBe(0);
});

test("output sample rate converts to the buffer rate", () => {
	expect(v(440, 4, 2000, play)).toBeCloseTo(0.2, 6);
});

test("pitch argument is ignored and missing context plays plain", () => {
	expect(v(1, 3, 1000, play)).toBe(v(9000, 3, 1000, play));
	expect(v(440, 3, 1000)).toBeCloseTo(0.3, 6);
});
