# AGENTS

Purpose: disposable LLM-built prototype of the gridforge idea.

## Entry points

| file | what it has |
|------|-------------|
| `status.md` | live state, next step, resume steps. Read first |
| `context.md` | rules and one-line purpose per source file |
| `findings.md` | decisions in port order for hand-writing gridforge |
| `conventions.md` | key gridforge principles: headless first, core and Studio apart |
| `src/kernel.ts` | gridforge time re-export, PPQ 960 |
| `~/gridforge/ideas/vision.md` | the idea this prototype tests (read only) |
| `~/gridforge-studio-slots.md` | Studio slot and mod contract |

## Build

```bash
bun install
bun test ./src
bunx tsc -p .
bun run render
```

## Source layout

```
src/kernel.ts                  # re-export from ../../gridforge/time.ts
src/pattern.ts                 # immutable Pattern and Note ops, ticks
src/schedule.ts                # pattern to sample events via kernel
src/voice.ts                   # Voice type, sine, saw, stack, distort
src/sample-voice.ts            # WAV buffer playback voice
src/render.ts                  # events and voice to buffer, 16-bit WAV
src/mix.ts                     # buffer ops, peak normalize
src/wav-read.ts                # 16-bit PCM WAV decode
src/modules/                   # VoiceModule manifest and built-in voices
src/render-cli.ts              # demo chord to out.wav
src/chop-cli.ts                # amen chop demo to out-amen.wav
```

## Conventions

- `~/gridforge` is hand-written. Read only. Never edit, stage, or commit there.
- Time is integer ticks at 960 PPQ. Convert only in `schedule.ts` via kernel.
- Ops are pure. Return new values. No mutation.
- One kernel-backed slice per round. Tests first.
- No layout until the user picks one. UI follows PMD at `~/project-minimalist-design`.
- Findings go to the docs as decisions. Code never merges into gridforge.
- Update `status.md` Now and Next in every slice commit.
- Dev rules: dev-mini. Commits: `type(scope): verb summary`, lowercase, no period.

## Sync

New device: clone gritforge next to gridforge, then `bun install`.

## Deploy

Remote: GitHub `popcat19/gritforge`. Push to `main` deploys `site/` via `.github/workflows/pages.yml`.
CI has no ../gridforge checkout. Build into `site/` locally and commit, or vendor the kernel before CI builds.
