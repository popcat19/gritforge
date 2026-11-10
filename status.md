# Status

Purpose: live state and intent of gritforge. Read first in any new session or device. Update in the same commit as every slice.

## Intent

- Make beats with better textures than BeepBox derivatives. No full DAW to learn.
- Gritforge is the real tool. Gridforge is the hand-written reimpl hobby, optional.
- Test the gridforge idea: small kernel, modules fill the rest, headless first.
- Keep it simple until a beat can be written as plain data and heard.

## Non-goals

- A DAW. A Studio UI. A plugin host. A gridforge replacement.

## Done when

- A beat is written as JSON, rendered by CLI, and heard.
- Every kernel contract in `findings.md` is hand-written in gridforge.

## Slice gate

- A slice must serve Intent or close an Open item in `findings.md`. Otherwise it goes to Parked.

## Retire when

- Gridforge passes the gritforge tests with unchanged modules. Archive gritforge. Keep `findings.md`.
- Or: gritforge becomes the jukebox-exp modular successor and gridforge stays a hobby.

## Now

| area | state |
|------|-------|
| Voices | sine, polyBLEP saw, FM, detune stack, tanh distort, sample playback |
| Note fields | offset, rate, reverse, velocity, attackMs, releaseMs |
| Render | gain option, per-note envelope, peak normalize, mix-level distortion |
| Modules | VoiceModule manifest with declared params. sine, saw-lead, fm built in |
| Project | schema v1, JSON round trip, forward compatible |
| Demos | `bun run render` chord. `bun run chop` amen chops. `bun run render:project` from JSON |
| Docs | `conventions.md`, `findings.md`, `studio/modules-spec.md`, render pipeline page in `~/.agent/diagrams/` |

Verify: `bun test ./src` and `bunx tsc -p .`. Unpushed work: `git log origin/main..HEAD`.

## Next

1. Penpot plugin: read `studio/modules.json`, create component instances.
2. NaN/inf checks after render slots.
3. Stateful voices (for physical modeling, feedback).
4. Preset schema (JSON param combinations for genres).

## Parked

Stateful voices, sidechain, command layer, undo, 960 vs 1360 PPQ test, Studio UI, spaced repetition deck, flake for the render CLI. Detail in `findings.md` under Open.

## Studio modules (Penpot)

- `studio/modules-spec.md`: component contract mapping ParamSpec to controls
- `studio/emit-modules.ts`: emits `studio/modules.json` from the registry
- `studio/modules.json`: current manifest, Penpot plugin input
- Next: Penpot plugin reads modules.json, creates component instances

## Resume on a new device

```bash
git clone <gritforge> next to gridforge
bun install
bun test ./src
mkdir -p samples && curl -L -o samples/cw_amen02_165.wav https://file.garden/aWKwwS8voz-ck1Fb/cw_amen02_165.wav
bun run chop
```

- `samples/` is gitignored. The amen loop is the owner's own upload.
- Studio slots draft lives at `~/syncthing-shared/gridforge-studio-slots.md` on this device. `AGENTS.md` lists a different path.
- `~/gridforge` is read only.

## Working agreements

- Explain with worked numbers. Tests are the check.
- One slice per round. Tests first. Commit each slice.
- Do not push without asking.
- Findings go to `findings.md` as decisions. No code goes to gridforge.
- Mark every LLM-built file or module as LLM-built.
- Sound-domain values (ms, buffer offset 0 to 1) are not ticks. Name them as such.
