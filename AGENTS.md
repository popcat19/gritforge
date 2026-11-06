# AGENTS

Purpose: disposable LLM-built prototype of the gridforge idea.

## Entry points

| file | what it has |
|------|-------------|
| `context.md` | rules and one-line purpose per source file |
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
src/kernel.ts      # re-export from vendor/gridforge (symlink to ~/gridforge)
src/pattern.ts     # immutable Pattern and Note ops, ticks
src/schedule.ts    # pattern to sample events via kernel
src/render.ts      # sine voice, 16-bit WAV
src/render-cli.ts  # demo chord to out.wav
```

## Conventions

- `~/gridforge` is hand-written. Read only. Never edit, stage, or commit there.
- Time is integer ticks at 960 PPQ. Convert only in `schedule.ts` via kernel.
- Ops are pure. Return new values. No mutation.
- One kernel-backed slice per round. Tests first.
- No layout until the user picks one. UI follows PMD at `~/project-minimalist-design`.
- Findings go to the docs as decisions. Code never merges into gridforge.
- Dev rules: dev-mini. Commits: `type(scope): verb summary`, lowercase, no period.

## Sync

New device: clone, then `ln -s <path-to-gridforge> vendor/gridforge && bun install`.

## Deploy

Remote: GitHub `popcat19/gritforge`. Push to `main` deploys `site/` via `.github/workflows/pages.yml`.
CI has no `vendor/gridforge`. Build into `site/` locally and commit, or vendor the kernel before CI builds.
