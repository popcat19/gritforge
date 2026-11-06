export function normalize(pcm: Float32Array, peak: number): Float32Array {
	let max = 0;
	for (const v of pcm) max = Math.max(max, Math.abs(v));
	if (max === 0) return pcm.slice();
	return pcm.map((v) => (v * peak) / max);
}
