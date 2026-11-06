import { distort, saw, sine, stack } from "../voice.ts";
import type { VoiceModule } from "./voice-module.ts";

export const sineModule: VoiceModule = {
	id: "sine",
	kind: "voice",
	params: [],
	create: () => sine,
};

const spreadCents = (layers: number, spread: number) =>
	layers === 1 ? [0] : Array.from({ length: layers }, (_, k) => spread * ((2 * k) / (layers - 1) - 1));

export const sawLeadModule: VoiceModule = {
	id: "saw-lead",
	kind: "voice",
	params: [
		{ id: "layers", label: "Layers", min: 1, max: 8, default: 4, integer: true },
		{ id: "spreadCents", label: "SpreadCents", min: 0, max: 50, default: 12 },
		{ id: "drive", label: "Drive", min: 0.1, max: 20, default: 4 },
	],
	create: (v) => distort(stack(saw, spreadCents(v.layers!, v.spreadCents!)), v.drive!),
};

export const voiceModules: VoiceModule[] = [sineModule, sawLeadModule];
