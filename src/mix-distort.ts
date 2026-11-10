// Purpose: mix-level tanh distortion on a rendered buffer, mirroring the per-voice distort in voice.ts.

export function distortMix(buffer: Float32Array, drive: number): Float32Array {
	if (drive <= 0) return buffer.slice();
	const norm = Math.tanh(drive);
	if (norm === 0) return buffer.slice();
	return buffer.map((v) => Math.tanh(drive * v) / norm);
}
