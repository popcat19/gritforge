#!/usr/bin/env bun
// Purpose: emit studio/modules.json from the voice module registry. Penpot plugin reads this to build component instances.

import { voiceModules } from "../src/modules/builtin-voices.ts";
import { defaults } from "../src/modules/voice-module.ts";
import { writeFileSync } from "node:fs";

const out = voiceModules.map((m) => ({
	id: m.id,
	kind: m.kind,
	defaultValues: defaults(m),
	params: m.params,
}));

writeFileSync("studio/modules.json", JSON.stringify(out, null, 2));
console.log(`wrote studio/modules.json with ${out.length} modules`);
