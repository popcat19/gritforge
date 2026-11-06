import { PPQ, secondsToSample, ticksToSeconds } from "./kernel.ts";
import { addNote, type Pattern } from "./pattern.ts";
import { render, wav16 } from "./render.ts";
import { schedule } from "./schedule.ts";
import { distort, saw, stack } from "./voice.ts";

const SR = 48000, BPM = 120;
let p: Pattern = { length: PPQ * 4, notes: [] };
[60, 64, 67, 72].forEach((pitch, i) => (p = addNote(p, { start: i * PPQ, length: PPQ, pitch })));
const total = Math.round(secondsToSample(ticksToSeconds(p.length, PPQ, BPM), SR));
await Bun.write("out.wav", wav16(render(schedule(p, BPM, SR), total, SR), SR));
console.log("out.wav", total, "samples");
const lead = distort(stack(saw, [-12, -4, 4, 12]), 4);
await Bun.write("out-lead.wav", wav16(render(schedule(p, BPM, SR), total, SR, lead), SR));
console.log("out-lead.wav");
