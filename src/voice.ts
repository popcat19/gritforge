export type Voice = (freqHz: number, sampleIndex: number, sampleRate: number) => number;

export const sine: Voice = (f, i, sr) => Math.sin((2 * Math.PI * f * i) / sr);

const polyBlep = (t: number, dt: number) => {
	if (t < dt) {
		const x = t / dt;
		return x + x - x * x - 1;
	}
	if (t > 1 - dt) {
		const x = (t - 1) / dt;
		return x * x + x + x + 1;
	}
	return 0;
};

export const saw: Voice = (f, i, sr) => {
	const dt = f / sr;
	const t = (f * i) / sr % 1;
	return 2 * t - 1 - polyBlep(t, dt);
};

export const stack = (voice: Voice, cents: number[]): Voice => (f, i, sr) => {
	let sum = 0;
	for (const c of cents) sum += voice(f * 2 ** (c / 1200), i, sr);
	return sum / cents.length;
};

export const distort = (voice: Voice, drive: number): Voice => {
	const norm = Math.tanh(drive);
	return (f, i, sr) => Math.tanh(drive * voice(f, i, sr)) / norm;
};
