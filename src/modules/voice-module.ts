import type { Voice } from "../voice.ts";

export type ParamSpec = { id: string; label: string; min: number; max: number; default: number; integer?: boolean };

export type VoiceModule = {
	id: string;
	kind: "voice";
	params: ParamSpec[];
	create: (values: Record<string, number>) => Voice;
};

export function defaults(m: VoiceModule): Record<string, number> {
	return Object.fromEntries(m.params.map((p) => [p.id, p.default]));
}

export function instantiate(m: VoiceModule, overrides: Record<string, number> = {}): Voice {
	const known = new Set(m.params.map((p) => p.id));
	for (const id of Object.keys(overrides)) if (!known.has(id)) throw new RangeError(`unknown param ${id} for ${m.id}`);
	const values = Object.fromEntries(
		m.params.map((p) => {
			const raw = overrides[p.id] ?? p.default;
			const clamped = Math.min(p.max, Math.max(p.min, raw));
			return [p.id, p.integer ? Math.round(clamped) : clamped];
		}),
	);
	return m.create(values);
}
