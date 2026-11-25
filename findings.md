# Findings

Purpose: decisions from gritforge, in the order to rewrite them by hand in gridforge. Read the code, close it, write your own. Tests in gritforge are the check.

## Port order

| # | piece | gritforge source | size | proves you understand |
|---|-------|------------------|------|-----------------------|
| 1 | Pattern and Note, immutable ops | `src/pattern.ts` | 26 lines, core ~10 | why ops return new values |
| 2 | Schedule: ticks to sample events | `src/schedule.ts` | 28 lines, core ~8 | ticks convert in one place only |
| 3 | Voice: `(freq, index, rate) => sample` | `src/voice.ts` | 1 line type | what a voice can and cannot see |
| 4 | Render: events + voice to buffer | `src/render.ts` | 20 lines, wav16 excluded | gain, envelope, mix are render's job |
| 5 | Module manifest: id, kind, params | `src/modules/voice-module.ts` | 27 lines | how a UI builds controls from params |
| 6 | WAV encode and decode | `src/render.ts`, `src/wav-read.ts` | ~45 lines | host I/O stays out of core |

Stop after any row. Each row works alone.

## Decisions

1. **Headless first.** Core takes data, returns data or samples. Only CLIs touch the host. Evidence: every check so far ran as a script, no UI.
2. **Ticks convert once.** `schedule.ts` is the only place ticks become samples. Sound-domain values (ms, buffer offset 0 to 1) are not ticks and stay marked.
3. **A voice is a pure function.** Same inputs, same sample. Sine, saw, stack, distort, and sample playback all fit.
4. **A voice needs a note context.** Pitch alone cannot drive a sample chop. `NoteCtx` carries `offset`, `rate`, `reverse`. Voices that ignore it still work.
5. **Envelope and gain belong to render.** Voices return raw samples. Per-note `attackMs` and `releaseMs` default to 5. A 0 ms ramp makes slices match the source exactly. A fixed 5 ms fade cost 5 to 7 percent on slice edges.
6. **Modules declare params.** `min`, `max`, `default`, optional `integer`. Values clamp. Unknown ids throw. An Inspector fallback is buildable from this alone.
7. **Voice and note-producing modules differ.** Add a `kind` field so one registry can hold both.
8. **Studio mods call commands.** Gritforge has no command layer yet. This is the rule, not a result.
9. **Pipeline seams match Gridforge mapping.** `Raw clip → Ruleset → Modifiers → Schedule (960 PPQ) → Processors → Host`. Gritforge currently covers the right half (`Pattern → Schedule → Voice → Render → Mix → WAV`). Add no new abstraction until a second concrete use (`ch1-trim.md`).
10. **Three-tier acoustic texture ladder.** (1) Built-in DSP (harmonic bank with ratios/inharmonicity `B`, closed-form damped modal resonators, deterministic noise, stateful filtered noise) plus break slicing (`sample-voice`) cover synths, percussion, breaks, and mallets/plucks; (2) a hybrid ~20 ms transient WAV snippet plus modal/harmonic sustain handles sharp acoustic attacks without large libraries; (3) an optional hash-pinned MIT SoundFont processor (`MS Basic.sf2` via `rustysynth` or FluidSynth) gives GM/orchestral fallback without proprietary blobs. Real-time and AOT neural instrument synthesis are out of scope (latency/polyphony ceiling and loop-tweak stalls).
11. **Format-agnostic core, pluggable serialization.** Core operates on typed plain objects (`src/project.ts`). JSON stays the zero-dep canonical and machine format (stable key order, sorted notes, one note per line for clean Git diffs). KDL or TOML loaders belong at the host/CLI boundary if human-edited timelines or node graphs need them later.
12. **TS reference DSP first, WASM/native behind the same seam.** Pure TS/Bun has no real-time deadline for offline render and keeps custom modules zero-toolchain. Swap hot built-in primitives to Rust/WASM or Faust behind `VoiceModule` only when real-time `AudioWorklet` polyphony measurements require SIMD and zero GC pauses.

## Open

- **Rulesets and modifiers.** Current `ProjectNote[]` is one static representation. Proving Gridforge's differentiator needs a second ruleset (step grid or pattern text) and one modifier (groove or transpose).
- **Stateful voices.** A stateless voice has no phase or filter memory. Closed-form modal resonators, ratio harmonics, and hashed noise fit stateless `Voice`, while time-varying filtered noise (breath, snare wires), biquad filterbanks, supersaw random phase, bellows pitch bend, and waveguide delay/feedback need per-note state.
- **Sidechain.** Kick envelope scales other voices. Needs a mix stage with cross-track input.
- **Command layer.** `addNote` and `removeNote` are proto-commands. No names, no log, no undo.
- **960 vs 1360 PPQ.** Not tested here. All timing assumes 960.
- **Where do modules ship.** Same repo as the renderer here. Whether kernel and Studio mods ship together is undecided. Defer lockfile/registry/pack-sharing machinery until real modules exist (avoid v0 bloat).
- **Crash recovery.** Synth and watchdog must be separate PIDs. A synth crash does not kill the watchdog. Browser constraints: Web Audio runs in the page process, no fork. Worklet or shared worker only, same PID.
- **Data safety.** Project state is immutable data, not process memory. Writes are atomic (temp + rename). Every save appends a revision, never overwrites. A fault loses at most the current edit.
- **DSP primitives.** Current primitives: sine, saw, FM, sample. Stateless next: deterministic noise, closed-form modal resonators, harmonic bank with ratios and inharmonicity `B`. Stateful later: filtered noise, biquad/SVF filter, Karplus-Strong/waveguide delay and feedback.
- **SoundFont / external processor node.** Optional hash-pinned MIT `MS Basic.sf2` (~51 MB, stored outside Git) rendered via `rustysynth` or FluidSynth for GM/orchestral fallback.
- **Presets.** Data-only param combinations on existing modules, using sparse envelopes (ADSR or piecewise-linear breakpoints, not frame-by-frame arrays) plus optional `(pitch, velocity) → params` curves to avoid the pitch-shifted toy effect. External offline DDSP fitters (`PyTorch` + MR-STFT/JTFS) can emit these presets without touching core.
- **UI vs kernel cost.** A responsive piano roll costs more than the audio kernel; keep core headless so external trackers, text editors, or Studio mods act as replaceable input layers.

## Not worth porting

- `src/chop-cli.ts` and `src/render-cli.ts`: demo scripts.
- `distort` tanh shaper and polyBLEP `saw`: fine for sound, not a design decision.
- Random slice order: a pattern-writing problem, not a kernel one.
