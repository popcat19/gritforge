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

## Open

- **Stateful voices.** A stateless voice has no phase memory. A real supersaw starts layers at random phases. A bellows pitch bend needs a control lane. Untested.
- **Mix FX stage.** `distort` wraps one voice, so chord notes do not intermodulate. Distorting the mix needs a stage after render.
- **Sidechain.** Kick envelope scales other voices. Needs a mix stage with cross-track input.
- **Project schema.** No serializable project yet. Demo scripts build patterns inline.
- **Command layer.** `addNote` and `removeNote` are proto-commands. No names, no log, no undo.
- **960 vs 1360 PPQ.** Not tested here. All timing assumes 960.
- **Where do modules ship.** Same repo as the renderer here. Whether kernel and Studio mods ship together is undecided.
- **Crash recovery.** Synth and watchdog must be separate PIDs. A synth crash does not kill the watchdog. Browser constraints: Web Audio runs in the page process, no fork. Worklet or shared worker only, same PID.
- **Data safety.** Project state is immutable data, not process memory. Writes are atomic (temp + rename). Every save appends a revision, never overwrites. A fault loses at most the current edit.

## Not worth porting

- `src/chop-cli.ts` and `src/render-cli.ts`: demo scripts.
- `distort` tanh shaper and polyBLEP `saw`: fine for sound, not a design decision.
- Random slice order: a pattern-writing problem, not a kernel one.
