# Status

Purpose: live state and intent of gritforge. Read first in any new session or device. Update in the same commit as every slice.

## Intent

- Make beats with better textures than BeepBox derivatives. No full DAW to learn.
- Test the gridforge idea: small kernel, modules fill the rest, headless first.
- Gritforge is a sandbox. Gridforge is hand-written later from `findings.md`.
- Keep it simple until a beat can be written as plain data and heard.

## Now

| area | state |
|------|-------|
| Voices | sine, polyBLEP saw, detune stack, tanh distort, sample playback |
| Note fields | offset, rate, reverse, velocity, attackMs, releaseMs |
| Render | gain option, per-note envelope, peak normalize |
| Modules | VoiceModule manifest with declared params. sine and saw-lead built in |
| Demos | `bun run render` chord. `bun run chop` amen chops at 165 BPM |
| Docs | `conventions.md`, `findings.md`, render pipeline page in `~/.agent/diagrams/` |

Verify: `bun test ./src` and `bunx tsc -p .`. Unpushed work: `git log origin/main..HEAD`.

## Next

1. Project file: JSON with tempo, tracks (voice module and params), patterns, notes.
2. `render` CLI that reads it. Replaces the inline demo scripts.

Then, in order: FM voice, mix-level distortion. Nothing else until a beat plays from JSON.

## Parked

Stateful voices, sidechain, command layer, undo, 960 vs 1360 PPQ test, Studio UI, spaced repetition deck, flake for the render CLI. Detail in `findings.md` under Open.

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
