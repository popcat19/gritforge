import type { Wav } from "./wav-read.ts";
import type { NoteCtx, Voice } from "./voice.ts";

const plain: NoteCtx = { offset: 0, rate: 1, reverse: false };

export const sampleVoice = (buf: Wav): Voice => (_f, i, sr, ctx = plain) => {
	const step = (i * ctx.rate * buf.rate) / sr;
	const pos = ctx.offset * buf.data.length + (ctx.reverse ? -step : step);
	if (pos < 0 || pos > buf.data.length - 1) return 0;
	const j = Math.floor(pos), frac = pos - j;
	const a = buf.data[j]!, c = buf.data[Math.min(j + 1, buf.data.length - 1)]!;
	return a + (c - a) * frac;
};
