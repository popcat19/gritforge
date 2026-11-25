# Status

Purpose: live state and intent of gritforge. Read first in any new session or device. Update in the same commit as every slice.

## Intent

- Replace BeepBox workflows with better textures, without relearning a full DAW that hides controls in implicit menus.
- Extensible without forking (pi-agent style): small headless kernel with deliberate seams (`Raw clip → Ruleset → Modifiers → Schedule (960 PPQ) → Processors → Host`), plus swappable Studio mods over kernel commands.
- Gritforge is the real tool. Gridforge is the hand-written reimpl hobby, optional.
- No new abstraction until a second concrete use (`ch1-trim.md`). Keep core small until real beats prove each seam.
- Studio UX wireframes and flowcharts run alongside core slices: desktop and keyboard first, without fundamentally breaking future gamepad and handheld/mobile touch.

## Non-goals

- A traditional menu-heavy DAW.
- A BeepBox fork (monolithic URL/JSON state, Web Audio lock-in, rigid routing).
- A premature package manager, registry, lockfile, or capability stack (v0 failure mode).
- Real-time or AOT neural instrument synthesis (fails latency/polyphony or breaks live loop-tweak editing).
- A gridforge replacement (code never merges into `~/gridforge`).

## Done when

- A beat is written as JSON, rendered by CLI, and heard.
- Every kernel contract in `findings.md` is hand-written in gridforge.

## Slice gate

- A slice must be an Active item in `roadmap.md` (max 1 Core + 1 Studio active), serve Intent, or close an Open item in `findings.md`. Otherwise it goes to Icebox in `roadmap.md`.

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
| Docs | `roadmap.md`, `conventions.md`, `findings.md`, `studio/modules-spec.md`, `studio/workflow-intents.md`, `studio/mobile-ux-gates.md`, render pipeline page in `~/.agent/diagrams/` |
| Studio intents | wireframe/flowchart work active: desktop + keyboard first (handheld-safe), 3-tier acoustic texture ladder, Gridforge seam alignment |

Verify: `bun test ./src` and `bunx tsc -p .`. Unpushed work: `git log origin/main..HEAD`.

## Next

Tracked in `roadmap.md` (1 Studio + 1 Core WIP cap, M1 lead):

- **Studio (M1):** settle open questions in `studio/workflow-intents.md` + Studio UX wireframes/flowcharts, then Penpot plugin from `studio/modules.json`.
- **Core (M2):** stateless `noise` + closed-form `modal` / ratio-harmonic voices in `src/voice.ts`, then NaN/inf render guard and first real textured JSON beat.

## Parked

Full Icebox with unlock triggers lives in `roadmap.md`. Open design questions live in `findings.md`.

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
- Studio slots draft lives at `~/syncthing-shared/gridforge-studio-slots.md` on this device.
- `~/gridforge` is read only.

## Working agreements

- Explain with worked numbers. Tests are the check.
- One slice per round. Tests first. Commit each slice.
- Do not push without asking.
- Findings go to `findings.md` as decisions. No code goes to gridforge.
- Mark every LLM-built file or module as LLM-built.
- Sound-domain values (ms, buffer offset 0 to 1) are not ticks. Name them as such.
