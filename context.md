# gritforge

Disposable LLM-built prototype of the gridforge idea. Gridforge stays hand-written and is imported read-only. Findings go back as written decisions, never as merged code.

Rules: grow one kernel-backed slice per round. No layout until the user picks it. PMD applies to any UI.

- `src/kernel.ts`: Purpose: re-export gridforge time functions, set PPQ 960.
- `src/pattern.ts`: Purpose: immutable Pattern and Note operations in ticks.
- `src/schedule.ts`: Purpose: pattern to sample-position events via kernel time.
- `src/render.ts`: Purpose: sine renderer and 16-bit WAV encoder.
- `site/index.html`: Purpose: Pages root, placeholder.
- `.github/workflows/pages.yml`: Purpose: deploy site/ to GitHub Pages.
- `src/render-cli.ts`: Purpose: render a demo chord to out.wav.
