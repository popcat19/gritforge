import { PPQ, secondsToSample, ticksToSeconds } from "./kernel.ts";
import { addNote, type Pattern } from "./pattern.ts";
import { normalize } from "./mix.ts";
import { render, wav16 } from "./render.ts";
import { sampleVoice } from "./sample-voice.ts";
import { schedule } from "./schedule.ts";
import { readWav } from "./wav-read.ts";

const SR = 48000, BPM = 165, SLICES = 16, BAR = PPQ * 4;
const file = Bun.file("samples/cw_amen02_165.wav");
if (!(await file.exists())) throw new Error("put the amen loop at samples/cw_amen02_165.wav");
const amen = readWav(new Uint8Array(await file.arrayBuffer()));

let seed = 7;
const rnd = (n: number) => ((seed = (seed * 1103515245 + 12345) % 2 ** 31), Math.floor((seed / 2 ** 31) * n));

let p: Pattern = { length: BAR * 4, notes: [] };
for (let k = 0; k < SLICES; k++) {
	p = addNote(p, { start: k * (PPQ / 2), length: PPQ / 2, pitch: 60, offset: k / SLICES, attackMs: 0, releaseMs: 0 });
}
for (let step = 0; step < 32; step++) {
	const start = BAR * 2 + step * (PPQ / 4), slice = rnd(SLICES);
	const roll = step % 4 === 3;
	for (let r = 0; r < (roll ? 4 : 1); r++) {
		const len = roll ? PPQ / 16 : PPQ / 4;
		p = addNote(p, {
			start: start + r * len,
			length: len,
			pitch: 60,
			offset: (slice + (rnd(4) === 0 ? 1 : 0)) / SLICES % 1,
			rate: rnd(6) === 0 ? 1.5 : 1,
			velocity: step % 4 === 0 ? 1 : 0.7,
			attackMs: 0,
			releaseMs: 2,
			reverse: rnd(5) === 0,
		});
	}
}
const total = Math.round(secondsToSample(ticksToSeconds(p.length, PPQ, BPM), SR));
const mix = render(schedule(p, BPM, SR), total, SR, sampleVoice(amen), { gain: 1 });
await Bun.write("out-amen.wav", wav16(normalize(mix, 0.9), SR));
console.log("out-amen.wav", p.notes.length, "hits", total, "samples");
