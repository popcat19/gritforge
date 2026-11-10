#!/usr/bin/env bun
// Purpose: render a project JSON file to WAV. Reads file, renders, writes output.

import { readFileSync, writeFileSync } from "node:fs";
import type { Project } from "./project.ts";
import { renderProject } from "./render-project.ts";
import { wav16 } from "./render.ts";

const [,, inPath, outPath] = process.argv;
if (!inPath || !outPath) {
	console.error("usage: bun run render-project-cli.ts <project.json> <out.wav>");
	process.exit(1);
}

const project = JSON.parse(readFileSync(inPath, "utf8")) as Project;
if (project.format !== "gritforge-project") throw new Error("not a gritforge project");
const samples = renderProject(project, 44100);
const wav = wav16(samples, 44100);
writeFileSync(outPath, wav);
console.log(`wrote ${outPath} (${samples.length} samples)`);
