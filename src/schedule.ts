import { PPQ, secondsToSample, ticksToSeconds } from "./kernel.ts";
import type { Pattern } from "./pattern.ts";

export type Event = { startSample: number; endSample: number; pitch: number };

export function schedule(p: Pattern, bpm: number, sampleRate: number): Event[] {
	return p.notes.map((n) => ({
		startSample: Math.round(secondsToSample(ticksToSeconds(n.start, PPQ, bpm), sampleRate)),
		endSample: Math.round(secondsToSample(ticksToSeconds(n.start + n.length, PPQ, bpm), sampleRate)),
		pitch: n.pitch,
	}));
}
