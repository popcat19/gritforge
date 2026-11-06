export type Voice = (freqHz: number, sampleIndex: number, sampleRate: number) => number;

export const sine: Voice = (f, i, sr) => Math.sin((2 * Math.PI * f * i) / sr);
