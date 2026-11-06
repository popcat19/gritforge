import type { Event } from "./schedule.ts";
import { sine, type Voice } from "./voice.ts";

const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

export function render(events: Event[], totalSamples: number, sampleRate: number, voice: Voice = sine, opts: { gain?: number } = {}): Float32Array {
	const out = new Float32Array(totalSamples);
	const gain = opts.gain ?? 0.2;
	const ramp = (ms: number) => Math.round((sampleRate * ms) / 1000);
	for (const e of events) {
		const f = hz(e.pitch), len = e.endSample - e.startSample;
		const ctx = { offset: e.offset ?? 0, rate: e.rate ?? 1, reverse: e.reverse ?? false };
		const vel = e.velocity ?? 1;
		const atk = ramp(e.attackMs ?? 5), rel = ramp(e.releaseMs ?? 5);
		for (let i = 0; i < len && e.startSample + i < totalSamples; i++) {
			const env = Math.min(1, atk > 0 ? i / atk : 1, rel > 0 ? (len - i) / rel : 1);
			out[e.startSample + i] += gain * env * vel * voice(f, i, sampleRate, ctx);
		}
	}
	return out;
}

export function wav16(pcm: Float32Array, sampleRate: number): Uint8Array {
	const b = new DataView(new ArrayBuffer(44 + pcm.length * 2));
	const s = (o: number, t: string) => [...t].forEach((c, i) => b.setUint8(o + i, c.charCodeAt(0)));
	s(0, "RIFF"); b.setUint32(4, 36 + pcm.length * 2, true); s(8, "WAVEfmt ");
	b.setUint32(16, 16, true); b.setUint16(20, 1, true); b.setUint16(22, 1, true);
	b.setUint32(24, sampleRate, true); b.setUint32(28, sampleRate * 2, true);
	b.setUint16(32, 2, true); b.setUint16(34, 16, true); s(36, "data"); b.setUint32(40, pcm.length * 2, true);
	pcm.forEach((v, i) => b.setInt16(44 + i * 2, Math.max(-1, Math.min(1, v)) * 32767, true));
	return new Uint8Array(b.buffer);
}
