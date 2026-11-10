import { PPQ, secondsToSample, ticksToSeconds } from "./kernel.ts";
import { voiceModules } from "./modules/builtin-voices.ts";
import { instantiate } from "./modules/voice-module.ts";
import type { Project } from "./project.ts";
import { render } from "./render.ts";
import { schedule } from "./schedule.ts";

export function renderProject(p: Project, sampleRate: number): Float32Array {
	const duration = Math.max(
		0,
		...p.tracks.map((t) => secondsToSample(ticksToSeconds(t.pattern.length, PPQ, p.tempo), sampleRate)),
	);
	const totalSamples = Math.round(duration);
	const out = new Float32Array(totalSamples);
	for (const track of p.tracks) {
		const module = voiceModules.find((m) => m.id === track.voice.moduleId);
		if (!module) throw new RangeError(`unknown module ${track.voice.moduleId}`);
		const voice = instantiate(module, track.voice.params);
		const events = schedule(track.pattern, p.tempo, sampleRate);
		const buffer = render(events, totalSamples, sampleRate, voice);
		for (let i = 0; i < totalSamples; i++) out[i] += buffer[i];
	}
	return out;
}
