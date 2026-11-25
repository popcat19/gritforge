# Roadmap

Purpose: living milestone tracker for gritforge. Minimal prose, hard WIP cap, lockstep updates with `status.md`.

## Rules

- **WIP cap:** max 1 active Studio item + 1 active Core item.
- **No jump-ahead:** new ideas go to Icebox with an unlock trigger. Moving an item up requires displacing the active item and adding a row to Revisions.
- **Proof of done:** every milestone ends on a runnable, visible, or audible artifact, never a doc alone.
- **Anti-bloat:** no new abstraction until a second concrete use (`ch1-trim.md`).
- **Lockstep:** update `roadmap.md` and `status.md` in the same commit as every completed slice.

## Active now

| lane | milestone | active item | next proof |
|------|-----------|-------------|------------|
| Studio | M1 | Settle `studio/workflow-intents.md` open questions + UX wireframes/flowcharts | Picked wireframe/flowchart passing `studio/mobile-ux-gates.md` |
| Core | M2 | Stateless `noise` + closed-form `modal` / ratio-harmonic voice in `src/voice.ts` | Tests pass + rendered WAV heard |

## Milestones

### M1: Studio wireframe and module flow

Lead milestone. Lock desktop-first, handheld-safe UX flow with zero implicit menus before building UI.

- [ ] Settle open questions in `studio/workflow-intents.md`
- [ ] Finish Studio UX wireframes and flowcharts (desktop + keyboard first, passes `studio/mobile-ux-gates.md`)
- [ ] Penpot plugin reads `studio/modules.json` and builds component instances

**Done when:** picked wireframe + flowchart exist and Penpot instantiates modules from `studio/modules.json`.

### M2: First real textured beat

Goal: replace BeepBox textures with a real multi-track beat rendered from plain JSON.

- [ ] Add stateless `noise` and closed-form `modal` / ratio-harmonic voices (`src/voice.ts`, `src/modules/builtin-voices.ts`)
- [ ] Add NaN/inf check after render slots (`src/render.ts`)
- [ ] Author and render one multi-track JSON beat (drums/noise + bass + modal/harmonic voice) via `bun run render:project`

**Done when:** checked-in JSON beat renders via CLI to a clean WAV and is listened to.

### M3: Extensible kernel seams

Goal: prove Gridforge's differentiator (pi-style seams without forking).

- [ ] Stateful voices (filtered noise, delay/feedback)
- [ ] Preset schema (data-only params, sparse ADSR/breakpoint envelopes, `(pitch, velocity)` curves)
- [ ] Second ruleset (step grid or pattern text) + one modifier (groove or transpose)

**Done when:** one song uses two rulesets, one modifier, and data presets over unchanged `schedule.ts`.

### M4: First playable Studio shell

Goal: live loop-tweak workflow in browser over the same headless kernel.

- [ ] Command layer + undo (`addNote`, `removeNote`, param edits)
- [ ] Minimal shell wired to M1 wireframe (`Transport` + `Editor` + auto-generated `Inspector` fallback)
- [ ] Real-time playback parity check against CLI WAV export

**Done when:** edit notes and tweak params live without restart, export matches CLI render.

## Icebox

Ideas parked until their unlock trigger fires. Do not pull early.

| idea | unlock trigger |
|------|----------------|
| Hybrid ~20 ms transient WAV + modal sustain | M2 modal attacks sound too soft on a real beat |
| Hash-pinned MIT SoundFont node (`MS Basic.sf2` via `rustysynth`/FluidSynth) | A real song needs GM/orchestral texture |
| Rust/WASM or Faust DSP backend behind `VoiceModule` | M4 `AudioWorklet` polyphony drops frames in measurement |
| KDL or TOML project loader at host boundary | Hand-editing JSON diffs hurts across 2+ real songs |
| Offline DDSP sample-to-patch fitter (`PyTorch` + MR-STFT/JTFS) | M3 preset schema is stable |
| Sidechain mix stage | A real beat needs kick-ducked bus |
| Studio sharing, packs, `studio.lock`, layered declarative config | 2+ real Studio mods exist |
| 960 vs 1360 PPQ test, render CLI Nix flake, spaced repetition deck | Dedicated side-quest round |

## Revisions

| date | change | why |
|------|--------|-----|
| 2026-11-25 | Created roadmap with M1 Studio wireframe lead + 1 Core / 1 Studio WIP cap | Ground progression in Gridforge seams and stop feature bloat |
