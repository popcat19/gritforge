# Conventions

Purpose: key gridforge principles this prototype follows. Sources: `~/gridforge/ideas/vision.md` and the Studio slots draft. Gridforge decides. Gritforge only tests.

## Headless first

Core runs with no UI, no browser, no audio device. Studio is a client of core.

| rule | check |
|------|-------|
| Every behavior is a function call | a test calls it |
| Every flow has a CLI | `bun run render`, `bun run chop` |
| Output is data or a WAV | assert on samples, not on a screen |
| Host APIs live only in `*-cli.ts` | `Bun.file`, `Bun.write` stay out of core |
| Core imports no DOM, no Node, no Bun globals | runs under any host |

Why: debug by rendering and asserting. No click path to reproduce a bug. A host (browser, terminal, STM32 port) wraps core and adds nothing to it.

## Core and Studio stay apart

| side | job | changes the project by |
|------|-----|------------------------|
| Kernel module | makes notes or sound (ruleset, stamp, DSP brick, voice) | returning new values |
| Studio mod | draws a view, calls commands | kernel commands only |

- Studio never writes project data directly.
- Project data never records which Studio or distro made it.
- Any Studio opens any project.
- Studio slots and mods: see the slots draft. Do not copy it here.

## Composition data

- Store the composition as the author wrote it (tracker, roll, code).
- Standardize to note events only at the schedule step.
- Two front ends that write the same music must schedule to the same events.

## Time

- Integer ticks at 960 PPQ.
- Convert to seconds or samples only in `schedule.ts`, through the kernel.
- Sound-domain values (fade ms, buffer offset 0 to 1) are not ticks. Mark each one.

## Modules

- A module declares `id`, `kind`, and `params` with `min`, `max`, `default`.
- A UI builds its controls from `params`. A module has no UI code.
- Values clamp to range. Unknown param ids throw.

## Ops and tests

- Ops are pure. Return new values. No mutation.
- Tests first, one kernel-backed slice per round.
- Refactors pin old output with a copy of the old formula.
- Sound checks use math, not ears: beat frequency, range, sample values.
- Ears confirm. Tests decide.

## Gritforge only

- LLM-built, disposable. Never merge code into gridforge.
- Findings go to docs as decisions. Open questions stay open.
- `~/gridforge` is read only.
- No layout until the user picks one.
