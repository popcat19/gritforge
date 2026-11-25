# gritforge

Disposable LLM-built prototype of the gridforge idea. Gridforge stays hand-written and is imported read-only. Findings go back as written decisions, never as merged code.

Rules: grow one kernel-backed slice per round. No layout until the user picks it. PMD applies to any UI.

- `status.md`: Purpose: live state, intent, next step, and resume steps for any new session or device.
- `roadmap.md`: Purpose: living milestone tracker with 1 Core + 1 Studio WIP cap, proof-of-done gates, and Icebox unlock triggers.
- `findings.md`: Purpose: decisions from gritforge in the order to rewrite them by hand in gridforge.
- `conventions.md`: Purpose: key gridforge principles this prototype follows, including headless first.
- `src/kernel.ts`: Purpose: re-export gridforge time functions, set PPQ 960.
- `src/pattern.ts`: Purpose: immutable Pattern and Note operations in ticks.
- `src/pattern.test.ts`: Purpose: immutable Pattern and Note operation tests.
- `src/schedule.ts`: Purpose: pattern to sample-position events via kernel time.
- `src/voice.ts`: Purpose: Voice slot type, sine and polyBLEP saw voices, stack (detune layers) and distort (tanh) combinators.
- `src/voice.test.ts`: Purpose: tests for saw, stack beating, and distort range.
- `src/fm-voice.ts`: Purpose: two-operator FM synthesis voice.
- `src/fm-voice.test.ts`: Purpose: FM voice output, modulation, and purity tests.
- `src/modules/voice-module.ts`: Purpose: VoiceModule manifest (id, kind, declared params with min/max/default, create), defaults and instantiate with clamping.
- `src/modules/builtin-voices.ts`: Purpose: sine, saw-lead, and fm modules and the voiceModules list.
- `src/modules/voice-module.test.ts`: Purpose: manifest contract tests.
- `src/wav-read.ts`: Purpose: decode 16-bit PCM WAV to mono float with its sample rate.
- `src/wav-read.test.ts`: Purpose: WAV decoder tests.
- `src/sample-voice.ts`: Purpose: Voice that plays a WAV buffer from a fractional offset, with rate and reverse.
- `src/sample-voice.test.ts`: Purpose: sample voice offset, rate, and reverse tests.
- `src/chop-cli.ts`: Purpose: demo that chops samples/cw_amen02_165.wav (gitignored) to out-amen.wav.
- `src/mix.ts`: Purpose: mix-level ops on rendered buffers, starting with peak normalize.
- `src/mix.test.ts`: Purpose: normalize tests.
- `src/mix-distort.ts`: Purpose: mix-level tanh distortion on a rendered buffer, new buffer out.
- `src/mix-distort.test.ts`: Purpose: distortMix tests for change, harmonics, purity, and silence.
- `src/render.ts`: Purpose: voice-driven renderer with envelope and 16-bit WAV encoder.
- `src/render.test.ts`: Purpose: renderer envelope, gain, and WAV output tests.
- `src/project.ts`: Purpose: serializable project file schema (v1) and pure constructors.
- `src/project.test.ts`: Purpose: project schema round-trip and immutability tests.
- `src/render-project.ts`: Purpose: render a Project across tracks to a mixed audio buffer.
- `src/render-project.test.ts`: Purpose: project renderer tests.
- `src/render-project-cli.ts`: Purpose: CLI that renders a project JSON file to WAV.
- `src/render-cli.ts`: Purpose: render a demo chord to out.wav.
- `studio/emit-modules.ts`: Purpose: emit studio/modules.json from the voice module registry for the Penpot plugin.
- `studio/modules-spec.md`: Purpose: Penpot-compatible component contract mapping ParamSpec to controls.
- `studio/modules.json`: Purpose: generated voice module manifest consumed by the Penpot plugin.
- `studio/workflow-intents.md`: Purpose: session-agnostic brainstorm of what Studio is for, before any module drafting. LLM-built.
- `studio/mobile-ux-gates.md`: Purpose: ten design gates every Studio module passes to stay usable on handheld and touch. LLM-built.
- `site/index.html`: Purpose: Pages root, placeholder.
- `.github/workflows/pages.yml`: Purpose: manual-only (`workflow_dispatch`) workflow to deploy site/ to GitHub Pages; push trigger disabled.
