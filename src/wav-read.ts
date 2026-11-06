export type Wav = { rate: number; data: Float32Array };

export function readWav(bytes: Uint8Array): Wav {
	const b = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const tag = (o: number) => String.fromCharCode(...bytes.subarray(o, o + 4));
	if (bytes.length < 12 || tag(0) !== "RIFF" || tag(8) !== "WAVE") throw new Error("not a RIFF WAVE file");
	let channels = 0, rate = 0, bits = 0, format = 0;
	for (let o = 12; o + 8 <= bytes.length; ) {
		const size = b.getUint32(o + 4, true), body = o + 8;
		if (tag(o) === "fmt ") {
			format = b.getUint16(body, true); channels = b.getUint16(body + 2, true);
			rate = b.getUint32(body + 4, true); bits = b.getUint16(body + 14, true);
		} else if (tag(o) === "data") {
			if (format !== 1 || bits !== 16 || channels < 1) throw new Error("only 16-bit PCM is supported");
			const frames = Math.floor(Math.min(size, bytes.length - body) / (channels * 2));
			const data = new Float32Array(frames);
			for (let i = 0; i < frames; i++) {
				let sum = 0;
				for (let c = 0; c < channels; c++) sum += b.getInt16(body + (i * channels + c) * 2, true);
				data[i] = sum / channels / 32768;
			}
			return { rate, data };
		}
		o = body + size + (size % 2);
	}
	throw new Error("no data chunk");
}
