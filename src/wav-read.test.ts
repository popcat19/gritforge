import { expect, test } from "bun:test";
import { readWav } from "./wav-read.ts";
import { wav16 } from "./render.ts";

function wavBytes(channels: number, rate: number, frames: number[][], extra = false): Uint8Array {
	const data = frames.length * channels * 2;
	const lead = extra ? 8 + 4 : 0;
	const b = new DataView(new ArrayBuffer(44 + lead + data));
	const s = (o: number, t: string) => [...t].forEach((c, i) => b.setUint8(o + i, c.charCodeAt(0)));
	s(0, "RIFF"); b.setUint32(4, 36 + lead + data, true); s(8, "WAVEfmt ");
	b.setUint32(16, 16, true); b.setUint16(20, 1, true); b.setUint16(22, channels, true);
	b.setUint32(24, rate, true); b.setUint32(28, rate * channels * 2, true);
	b.setUint16(32, channels * 2, true); b.setUint16(34, 16, true);
	let o = 36;
	if (extra) { s(o, "LIST"); b.setUint32(o + 4, 4, true); s(o + 8, "abcd"); o += 12; }
	s(o, "data"); b.setUint32(o + 4, data, true);
	frames.forEach((f, i) => f.forEach((v, c) => b.setInt16(o + 8 + (i * channels + c) * 2, v, true)));
	return new Uint8Array(b.buffer);
}

test("readWav decodes what wav16 writes", () => {
	const src = Float32Array.from([0, 0.5, -0.5, 1]);
	const w = readWav(wav16(src, 8000));
	expect(w.rate).toBe(8000);
	expect(w.data.length).toBe(4);
	src.forEach((v, i) => expect(w.data[i]).toBeCloseTo(v, 3));
});

test("readWav mixes stereo down to the channel average", () => {
	const w = readWav(wavBytes(2, 44100, [[16384, 0], [0, -16384]]));
	expect(w.rate).toBe(44100);
	expect(w.data[0]).toBeCloseTo(0.25, 3);
	expect(w.data[1]).toBeCloseTo(-0.25, 3);
});

test("readWav skips chunks before data", () => {
	const w = readWav(wavBytes(1, 8000, [[16384]], true));
	expect(w.data[0]).toBeCloseTo(0.5, 3);
});

test("readWav rejects non RIFF and non 16-bit PCM", () => {
	expect(() => readWav(new Uint8Array(64))).toThrow(Error);
	const bad = wavBytes(1, 8000, [[0]]);
	new DataView(bad.buffer).setUint16(34, 24, true);
	expect(() => readWav(bad)).toThrow(Error);
});
