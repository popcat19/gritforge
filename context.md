# gritforge

Disposable LLM-built prototype of the gridforge idea. Gridforge stays hand-written and is imported read-only. Findings go back as written decisions, never as merged code.

Rules: grow one kernel-backed slice per round. No layout until the user picks it. PMD applies to any UI.

- `status.md`: Purpose: live state, intent, next step, and resume steps for any new session or device.
- `findings.md`: Purpose: decisions from gritforge in the order to rewrite them by hand in gridforge.
- `conventions.md`: Purpose: key gridforge principles this prototype follows, including headless first.
- `src/kernel.ts`: Purpose: re-export gridforge time functions, set PPQ 960.
- `src/pattern.ts`: Purpose: immutable Pattern and Note operations in ticks.
- `src/schedule.ts`: Purpose: pattern to sample-position events via kernel time.
- `src/voice.ts`: Purpose: Voice slot type, sine and polyBLEP saw voices, stack (detune layers) and distort (tanh) combinators.
- `src/modules/voice-module.ts`: Purpose: VoiceModule manifest (id, kind, declared params with min/max/default, create), defaults and instantiate with clamping.
- `src/modules/builtin-voices.ts`: Purpose: sine and saw-lead modules and the voiceModules list.
- `src/modules/voice-module.test.ts`: Purpose: manifest contract tests.
- `src/wav-read.ts`: Purpose: decode 16-bit PCM WAV to mono float with its sample rate.
- `src/sample-voice.ts`: Purpose: Voice that plays a WAV buffer from a fractional offset, with rate and reverse.
- `src/chop-cli.ts`: Purpose: demo that chops samples/cw_amen02_165.wav (gitignored) to out-amen.wav.
- `src/mix.ts`: Purpose: mix-level ops on rendered buffers, starting with peak normalize.
- `src/mix.test.ts`: Purpose: normalize tests.
- `src/voice.test.ts`: Purpose: tests for saw, stack beating, and distort range.
- `src/render.ts`: Purpose: voice-driven renderer with envelope and 16-bit WAV encoder.
- `site/index.html`: Purpose: Pages root, placeholder.
- `.github/workflows/pages.yml`: Purpose: deploy site/ to GitHub Pages.
- `src/render-cli.ts`: Purpose: render a demo chord to out.wav.
