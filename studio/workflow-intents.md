# Workflow intents (draft)

Purpose: session-agnostic brainstorm of what Studio is for, before any module drafting. LLM-built. Proposals, not decisions. Rewrite in own words before anything moves to gridforge.

Related: Studio slots draft (`~/syncthing-shared/gridforge-studio-slots.md`), `findings.md` Open items.

## Intents

| intent | goal | must hold |
|--------|------|-----------|
| Sketch | capture a loop before it fades | first sound under 10 s, no picker, default kit |
| Arrange | build song structure from patterns | clips outside, patterns inside, linked by default |
| Sound design | shape a voice while a loop plays | live param change, no restart |
| Chop | slice a break, map slices to notes | slices keep source untouched (`NoteCtx` offset, rate, reverse) |
| Remix, cover | rework existing music | reference track plays as a ghost, toggles off |
| Annotate | break down a sample or song | markers and sections are data, not drawings |
| Scaffold | try ideas without losing the old ones | every edit non-destructive, revisions append |
| DSP flex | build voices from primitives | Septabee-level freedom, explicit wiring |
| Entry | BeepBox-level first contact | no DAW jargon, one grid, one voice |
| Textures | build presets from generators and samples | presets are data on existing modules |
| Ecosystem | share presets, components, mods | blueprint-style shelf, item-level import |
| Open-ended | no forced workflow | kernel enforces ticks and events only |

## Input

- Keyboard, gamepad and handheld touch have equal priority. Handheld is core, not a port.
- Every command reachable from each input. Keys printed on controls (slots rule 2).
- Touch hit regions 44 px or more. No state shown only on hover.
- See `mobile-ux-gates.md` for ten design gates that keep modules usable on handheld without compromising desktop power.

### Layers

Five input layers work on the same grid. Context and held modifiers determine which one applies.

| layer | keyboard | gamepad | touch | use |
|-------|----------|---------|-------|-----|
| Arrows | arrow keys | d-pad | swipe | move one cell |
| 3×3 jump | `q w e / a s d / z x c` (held) | 8-way stick (held) | 8 chips (long-press) | jump to nearest note in direction |
| Tracker entry | `z s x d c v ...` | A+d-pad | on-screen piano or 12-key grid | place note at pitch, no nav |
| Command | Space, `i`, `d`, `:` | A, B, X, Y, Start | tap control or palette | trigger named command |
| Modifier | Shift, Ctrl | L/R shoulder | sticky-key toggle or hold | show hints, change tap behavior |

**3×3 proximity jump:**
```
7 ↖  8 ↑  9 ↗        nearest note in each octant
4 ←  5 ●  6 →        5 = act on focus
1 ↙  2 ↓  3 ↘
```
Targets the **nearest note** in each direction. Chips appear only while the jump modifier is held, so jump letters coexist with tracker pitch entry. Empty directions fall back to a boundary (next bar, next octave).

**Tracker entry, BeepBox view:**
Piano-layout keys (`z s x d c` for C, C#, D, D#, E) place notes at the cursor without vertical navigation. The `q` row enters the octave above the `z` row (FT2 model). A separate key pair shifts the base octave. Gamepad: hold A, d-pad adjusts pitch (up/down semitone, left/right octave). The BeepBox grid with scale rows and tonic emphasis stays as the **view**.

## Builtins

Default kit: sine and noise only. Timbre comes from combinators already in `src/voice.ts` (`stack`, `distort`) plus render envelopes.

| slot | stack | covers |
|------|-------|--------|
| Keys | sine detune x3, distort 0.1 | piano, mallet |
| Bass | sine, distort 0.4 | bass, sub |
| Lead | sine detune x2 | lead, organ |
| Pad | sine detune x4, slow attack | strings, pad |
| Pluck | sine, distort 0.2, short decay | guitar, pizz |
| Bell | sine partials 1.0, 2.7, 4.1 | bell, glock |
| Perc | noise, short decay | hat, snare |
| Breath | sine + noise 0.3 | flute, wind |

Open: the noise voice does not exist yet. Partials need a sine stack with ratios, not detune.

## Node system

Goal: Septabee-like DSP graphs, less implicit, less boilerplate. Borrow the Figma and Penpot component model.

| component idea | node equivalent |
|----------------|-----------------|
| main component | component: a saved subgraph with exposed params, inlets, outlets |
| variant | swap point inside a component, for example osc type sine or noise |
| instance override | per-instance param value, link kept |
| nested component | subgraph used as one node |
| detach | make unique |

Rules:

1. Three tiers: primitive (code), component (data graph), preset (component plus values).
2. Every node shows its live values. No hidden params.
3. Summing is a `Mix` node. No implicit sum at inlets.
4. Feedback only through an explicit one-sample delay node. Cycles without it are rejected.
5. One signal type at audio rate.
6. Common chains ship as components (`adsr-vca`, `chorus`, `delay-tail`), so a voice is 2 to 4 nodes.
7. Nesting capped at about 2 levels.

Open: auto layout or manual placement, polyphony in kernel or graph, modulation as wires or a matrix, per-node cost display.

## Sharing

Item is the unit. A pack is only a source to browse.

| kind | data or code |
|------|--------------|
| preset, component, blueprint, keymap, workspace, distro | data |
| primitive, Studio mod | code, sandboxed, declares `reads` and `commands` |

Import:

- Selective. Picking an item pulls only its dependency closure. The dialog shows the closure before import.
- Copy-in with provenance. Item records `origin` (pack, item, version, hash).
- Editing an import turns `origin` into `forkedFrom`. No detach step.
- Updates are opt-in. Forks get a param-level 3-way diff.
- Overrides stay on instances. Forks change the item. Most tweaks are overrides.
- Same content hash stores once. Different hashes stay namespaced by pack.
- Unused items show "used by 0" and prune without prompt.
- Projects embed snapshots of used items, so a project plays without the pack. Missing primitive: node goes silent with a warning.
- Packs declare a license. Lineage carries attribution.

```ts
type Origin = { pack: string; item: string; version: string; hash: string };
type Item = { id: string; kind: string; origin?: Origin; forkedFrom?: Origin; body: unknown };
```

Contract versioning: exposed params, inlets and outlets. Add is minor, remove or rename is major. An override on a removed param keeps its value and warns.

## Declarative config

Studio state resolves from `studio.json` plus `studio.lock`. Same pair, same Studio on any device.

| Nix | Studio |
|-----|--------|
| `flake.nix` | `studio.json`: distro, items, keymap, workspaces, PMD hue, profiles |
| `flake.lock` | `studio.lock`: item version plus content hash |
| store | content-addressed item cache, deduped |
| module merge, priorities | layers: distro, profile, host, user. Key-level merge, collisions error at eval |
| `hardware-configuration.nix` | host file: audio device, buffer, sample roots. Never synced |
| generations | numbered config revisions, rollback |

Rules:

1. Resolve is a pure function. JSON or TOML with merge rules, no scripting.
2. Config never enters a project (slots rule 4).
3. Shared layers hold no absolute paths. Samples resolve by hash or named root.
4. Nix is optional. A home-manager module may generate `studio.json`. JSON stays the format.

Open: how UI edits reach the file.

| option | effect |
|--------|--------|
| write-back | UI edits `studio.json`. Needs a format-preserving writer |
| overlay + promote | UI writes `local.json`. Promote moves keys into `studio.json`. Leaning this way |
| read-only | UI points at the key. Fights explore-first |

## References

### osu!lazer

Fair to learn from. Rulesets (osu!, taiko, catch, mania) are separate play modes over one shared beatmap and timing model, which matches the gridforge module idea.

Take:
- Ruleset contract as a reference for one data model serving several editors.
- Beat snap divisor: one control with 1/1, 1/2, 1/3, 1/4, 1/6, 1/8, 1/12, 1/16 and color-coded ticks. Triplets are first-class.
- Mod select: flat tile grid with a hotkey per tile, no nesting (slots rule 2).
- Settings: one searchable sidebar list in place of nested dialogs.
- Timeline pair: summary strip over a zoomed timeline (Overview slot).
- Skin layout editor: drag components into on-screen slots (Studio slot and mod idea).

Avoid:
- Dense desktop-first editor with right-click menus and small timeline targets. Mobile builds inherit it.
- State behind hover and tooltips (fails gate 2).
- Copying screens. The editor is still changing, so take principles only.

### BeepBox

Reuse the pattern grid only: scale rows, rhythm steps, tonic emphasis. The arranger stays open (see below).

## Open questions

- Clips workflow: bar cells or free clips. The slots draft treats bar cells as snapped free clips with the same data. Revisit after writing one song from scratch in Studio. Until then the 3×3 jump also runs on the arranger, targeting the nearest filled cell.

- Import default: copy-in (updates listed) or live link (updates applied until fork).
- Code items shareable from the start, or data items first.
- Septabee comparison is from the user's framing. Not yet checked against `~/syncthing-shared/concepts/septabee-studio-cells`, which has no node notes.
