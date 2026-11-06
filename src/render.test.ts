import { expect, test } from "bun:test";
import { render } from "./render.ts";
import type { Event } from "./schedule.ts";
import { sine, type Voice } from "./voice.ts";

const SR = 48000;
const events: Event[] = [
	{ startSample: 0, endSample: 4800, pitch: 60 },
	{ startSample: 2400, endSample: 9600, pitch: 69 },
];

function reference(evs: Event[], total: number): Float32Array {
	const out = new Float32Array(total);
	const fade = Math.round(SR * 0.005);
	for (const e of evs) {
		const f = 440 * 2 ** ((e.pitch - 69) / 12), len = e.endSample - e.startSample;
		for (let i = 0; i < len && e.startSample + i < total; i++) {
			const env = Math.min(1, i / fade, (len - i) / fade);
			out[e.startSample + i] += 0.2 * env * Math.sin((2 * Math.PI * f * i) / SR);
		}
	}
	return out;
}

test("default voice matches the pre-extraction sine output", () => {
	expect(render(events, 10000, SR)).toEqual(reference(events, 10000));
});

test("explicit sine voice equals the default", () => {
	expect(render(events, 10000, SR, sine)).toEqual(render(events, 10000, SR));
});

test("sine voice is sin(2*pi*f*i/sr)", () => {
	expect(sine(440, 0, SR)).toBe(0);
	expect(sine(12000, 1, SR)).toBeCloseTo(1, 12);
});

test("render uses the supplied voice", () => {
	const dc: Voice = () => 1;
	const out = render([{ startSample: 0, endSample: 1000, pitch: 69 }], 1000, SR, dc);
	expect(out[500]).toBeCloseTo(0.2, 6);
});

test("render passes offset, rate and reverse to the voice with defaults", () => {
	const seen: unknown[] = [];
	const spy: Voice = (_f, _i, _sr, ctx) => (seen.push(ctx), 0);
	render([{ startSample: 0, endSample: 2, pitch: 69 }], 2, SR, spy);
	render([{ startSample: 0, endSample: 1, pitch: 69, offset: 0.25, rate: 2, reverse: true }], 1, SR, spy);
	expect(seen[0]).toEqual({ offset: 0, rate: 1, reverse: false });
	expect(seen.at(-1)).toEqual({ offset: 0.25, rate: 2, reverse: true });
});

test("render scales a note by velocity", () => {
	const dc: Voice = () => 1;
	const out = render([{ startSample: 0, endSample: 1000, pitch: 69, velocity: 0.5 }], 1000, SR, dc);
	expect(out[500]).toBeCloseTo(0.1, 6);
});
