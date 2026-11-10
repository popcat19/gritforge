import type { Voice } from "./voice.ts";

export function fm(carrierFreq: number, modFreq: number, modIndex: number): Voice {
	return (f, i, sr) => {
		const t = i / sr;
		const mod = modIndex * Math.sin(2 * Math.PI * modFreq * t);
		return Math.sin(2 * Math.PI * carrierFreq * f * t + mod);
	};
}
