import { PPQ, secondsToSample, ticksToSeconds } from "./kernel.ts";
import type { Pattern } from "./pattern.ts";

export type Event = {
	startSample: number;
	endSample: number;
	pitch: number;
	offset?: number;
	rate?: number;
	reverse?: boolean;
	velocity?: number;
	attackMs?: number;
	releaseMs?: number;
};

export function schedule(p: Pattern, bpm: number, sampleRate: number): Event[] {
	return p.notes.map((n) => ({
		startSample: Math.round(secondsToSample(ticksToSeconds(n.start, PPQ, bpm), sampleRate)),
		endSample: Math.round(secondsToSample(ticksToSeconds(n.start + n.length, PPQ, bpm), sampleRate)),
		pitch: n.pitch,
		...(n.offset !== undefined && { offset: n.offset }),
		...(n.rate !== undefined && { rate: n.rate }),
		...(n.reverse !== undefined && { reverse: n.reverse }),
		...(n.velocity !== undefined && { velocity: n.velocity }),
		...(n.attackMs !== undefined && { attackMs: n.attackMs }),
		...(n.releaseMs !== undefined && { releaseMs: n.releaseMs }),
	}));
}
