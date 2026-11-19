# Mobile-friendly UX gates

Purpose: Keep Studio usable on handheld and touch without compromising desktop power. Every module and input layer must pass these constraints before landing.

## Context

Desktop apps (Krita, Drawpile, FL Studio, Reaper) port poorly to mobile because they assume hover, large screens, and nested menus. Studio treats handheld as a core platform from the start. These gates prevent implicit nesting, hover-only state, and tiny hit regions.

Related docs:
- `workflow-intents.md`: intents this serves (Sketch, Sound, Chop, Live)
- `~/gridforge-studio-slots.md`: slot and mod contract
- `spec/cell-geometry.md`: 8px radius, state via corner/outline/alpha

## Design gates (fail = rework or reject)

### Gate 1: Hit regions 44 px or larger

Every tappable target has a hit region of 44 px or more on its smallest axis. The drawn control can stay smaller: a PMD 24 px button keeps its look and gets a 44 px invisible hit region. Controls too dense for that go into a long-press picker or the command palette.

**Pass:**
- PMD 24 px button inside a 44 px hit region
- Param row 48 tall (label + field + rail in one row)
- Note cell 44×44 on zoomed grid
- Voice slot chip 120×44

**Fail:**
- 24 px button whose hit region is also 24 px
- 16 px timeline clip boundary (invisible on phone)
- 32×32 grid cell (forced small by zoom)

**Fix when space is scarce:**
- Long-press picker for tool variants (quantize 1/4, 1/8, 1/16 → one Quantize button + 3-option picker on hold)
- Command palette for rare actions (export stems, rebuild cache)
- Zoom in (notes at 48 px per bar instead of 16 px)

---

### Gate 2: No hover-only state

Hover tooltips, hover-revealed controls, and hover highlights must not carry information that touch users cannot access.

**Pass:**
- Focus ring (visible when keyboard/gamepad focuses, tapping also focuses)
- Key hints shown while a modifier is held (works with sticky keys on touch)
- Selection via long-press, state persists after release
- Playhead always visible, not only when hovering the timeline

**Fail:**
- Tooltip with param unit or range (no way to see it on touch)
- Close button visible only on hover (touch user cannot close)
- Waveform zoom slider hidden until hover (cannot zoom)
- Edit controls in a card header that appear on hover (cannot edit)

**Fix:**
- Tooltip info becomes inline label or a `(?)` icon-button that shows a card
- Close and minimize are always visible (or gestures: swipe to dismiss, drag-down to minimize)
- Zoom is a pinned control or a pinch gesture
- Edit enters a mode with visible controls, or goes in a context menu

---

### Gate 3: One mode, no nesting past two levels

Every feature is reachable in at most two taps from the visible surface. Nested tabs, accordion menus, and multi-level drill-downs are rejected.

**Pass:**
- Pattern editor → 3×3 jump overlay (one hold)
- Transport → tempo field (one tap, focus, type, Enter)
- Voice slot → preset browser (one tap, flat list with search)
- Inspector → param row (zero taps, already visible)

**Fail:**
- Settings → Audio → Devices → ALSA → hw:0 config (four levels)
- Voice → Oscillator tab → Waveform tab → Harmonics panel (three levels)
- Arranger → Track menu → Color submenu → Palette submenu (three levels)
- File → Export → Stems → Format picker → WAV options (four taps before action)

**Fix:**
- Flatten to one searchable list (osu!lazer settings model)
- Device picker is a command-palette action, not nested
- Voice browser shows harmonics inline or in a `details` disclosure (one tap)
- Export opens one dialog with format + stems checkboxes visible

---

### Gate 4: Command-palette escape hatch

Every action has a stable name (`note.add`, `clip.split`, `voice.setParam`). The command palette lists all commands with search. Rare or hard-to-fit controls live here instead of adding nest depth.

**Pass:**
- Palette shows `note.transpose +12` with the current keybind beside it (`Shift+T`)
- Typing "exp" filters to "export.wav", "export.midi", "export.stems"
- Commands work the same from key, gamepad, palette or script

**Fail:**
- A control exists but has no command name (cannot script, cannot search)
- A command is keyboard-only, no palette entry (gamepad and touch users blocked)
- The palette shows internal IDs instead of readable names

**Fix:**
- Every interaction that changes state is a command
- Commands are named in verb.noun style
- The palette is searchable by name, keystroke, or tag

---

### Gate 5: Param rows over knobs and dropdowns

Parameters (cutoff, attack, tempo, swing) use the JukeBox row layout: label, field (tap to type), rail (drag to adjust). No knobs, no detached sliders, no dropdown menus with 30 options.

**Pass:**
```
┌──────────────────────────┐
│ Cutoff  │ 1200 │ ▂▂▂▃▅▆█ │  44 px tall
│ Resonan │  0.4 │ ▂▂▃▅──── │
└──────────────────────────┘
```
- Label 20% width, field 15%, rail rest
- Tapping field focuses for type-in
- Dragging rail adjusts, bar shows current value
- All three regions are 44 px tall

**Fail:**
- Rotary knob 32×32 (too small, needs precise pointer)
- Dropdown with 50 waveforms (scrolling, no preview)
- Slider with an invisible 8 px thumb (cannot grab on touch)
- Param in a tooltip (cannot adjust, cannot see current value)

**Fix:**
- Knobs become rows
- Long dropdown becomes a picker card with search and preview
- Invisible thumb becomes a full-width rail with a bar graph
- Hidden param becomes an inline row or moves to the Inspector

---

### Gate 6: Keyboard/gamepad/touch parity

The same action is reachable by all three inputs, using the command system. Learning one transfers to the others. Keymap is swappable data, not hard-coded per input.

**Pass:**
- `note.add`: `i` key, gamepad A (in stamp mode), tap empty cell
- `clip.split`: `s` key, gamepad X, long-press + Split chip
- `transport.play`: Space, gamepad Start, tap play button
- Every command shows its current input(s) in the status bar and palette

**Fail:**
- A feature is keyboard-only, no touch or gamepad equivalent
- Gamepad bindings are hard-coded differently from the keyboard keymap
- Touch gestures have no corresponding key command

**Fix:**
- Map gestures to commands (`longPress → note.select`, `doubleTap → clip.open`)
- Keymap data includes gamepad (`{ input: "A", command: "note.add", context: "editor" }`)
- Hard-to-gesture actions go in the command palette

---

### Gate 7: Focused module fills, neighbors peek

The niri-style horizontal-scroll layout gives the focused module nearly full width. Neighbors show 48-80 px peeks. No overlapping panels, no minimize/maximize buttons, no z-order management.

**Pass:**
```
┌─────────────────────────────────┐
│ Arr│  Pattern Editor      │Insp │  ← Arranger 48px, Inspector 80px
│────┼──────────────────────┼─────│
│ P2 │ ┌───┬───┬───┬───┐    │ Voi │
│    │ │ C │   │   │ E │    │ Att │
└─────────────────────────────────┘
```
- Swipe or arrow moves focus
- Tapping a peek brings it forward
- Pinned Transport stays visible (44 px hit regions, bottom or top)

**Fail:**
- Three equal-width columns fighting for space (none fills)
- Floating Inspector obscures the grid
- Tabs with 12 tiny labels at the top

**Fix:**
- One module fills, others hide or peek
- Floating cards auto-hide when the grid regains focus
- Tabs become workspaces (one-tap presets for which slots are visible)

---

### Gate 8: Workspaces over layout dialogs

Switching which modules are visible is a one-tap preset, not a configuration dialog. Four built-in workspaces (Seed, Grow, Sound, Mix) cover the main intents. Custom workspaces are data, portable in `studio.json`.

**Pass:**
- Pill strip beside Transport: `[ 1 Seed ]  [ 2 Grow ]  [ 3 Sound ]`
- Tapping Seed hides Inspector and Arranger, expands Editor
- Switching to Sound shows Inspector large, Editor medium, Arranger hidden
- Workspace layout is JSON, not UI state

**Fail:**
- Per-panel visibility toggles in a View menu (nested, slow)
- Layout saved in local cache, not portable
- Split-pane dividers that need precise dragging (hard on touch)

**Fix:**
- Workspaces are named presets
- Each workspace declares which slots are `docked`, `floating`, `hidden`
- The workspace pill strip is always visible

---

### Gate 9: 3×3 proximity jump for far nav

Arrows move one cell. The 3×3 jump layer moves to the **nearest note** in each direction. This replaces the earlier Vimium-style two-letter labels and fits every input.

**Pass:**
```
7 ↖  8 ↑  9 ↗        nearest note in each octant
4 ←  5 ●  6 →        5 = act on focus
1 ↙  2 ↓  3 ↘
```
- Numpad: 1-9 as-is
- Keyboard: `q w e / a s d / z x c`
- Gamepad: 8-way stick or d-pad, center with A
- Touch: 8 tappable chips around the focused note, 44 px each
- Hints show only while the jump layer is active (held key/button)

**Fail:**
- Two-letter labels (requires memorization, slows entry)
- 12+ jump targets (too many to fit on touch)
- Jump targets overlap with the grid (cannot see notes behind labels)

**Fix:**
- 8 targets fit a circle, match d-pad and numpad
- Chips appear only while the jump layer is held and sit in the octant, offset from the notes they point at
- Empty directions fall back to a boundary (next bar, next octave)

---

### Gate 10: Tracker entry, BeepBox view

Piano-layout keys (`z s x d c` for C, C#, D, D#, E) place notes at the cursor without vertical navigation. The BeepBox grid with scale rows and tonic emphasis stays as the **view**, and tracker keys become the **entry**. Gamepad uses the LSDj model: hold A, d-pad adjusts pitch.

**Pass:**
- Typing `c` places C at the cursor column
- Typing `e` then `g` places E, then G (chord build)
- The `q` row enters the octave above the `z` row, as in FT2. A separate key pair shifts the base octave
- Gamepad: hold A, up/down shifts semitone, left/right shifts octave
- The grid shows scale-row emphasis (tonic `base09@0.28`, fifth `base02`), so pitch is still visible

**Fail:**
- Piano keys require navigating to the correct row first (slow)
- Entering a chord needs 6 arrow presses between notes
- Gamepad has no pitch entry, only pointer nav

**Fix:**
- Tracker keys are default entry mode
- Arrow keys stay for fine adjustment of placed notes
- Gamepad A+d-pad replicates tracker pitch entry

---

## Input layers summary

| layer | keyboard | gamepad | touch | use |
|-------|----------|---------|-------|-----|
| Arrows | arrow keys | d-pad | swipe | move one cell |
| 3×3 jump | `q w e / a s d / z x c` (held) | 8-way stick (held) | 8 chips (appear on long-press) | jump to nearest note in direction |
| Tracker entry | `z s x d c v ...` | A+d-pad | on-screen piano strip or 12-key grid | place note at pitch, no nav |
| Command | Space, `i`, `d`, `:` | A, B, X, Y, Start | tap control or palette | trigger named command |
| Modifier | Shift, Ctrl | L/R shoulder | sticky-key toggle or hold | show hints, change tap behavior |

All five layers are active on the same grid. The jump layer uses letters that tracker entry also uses (`z x c`, `s d`), so jump letters only count while the jump modifier is held. Without the modifier, letters are pitch entry.

---

## Module acceptance checklist

Before a module or Editor mod lands, verify it passes all ten gates. Mark each one:

- [ ] **Gate 1:** All hit regions ≥ 44 px. Smaller controls use picker or palette.
- [ ] **Gate 2:** No hover-only state. Info and controls visible or reachable by tap.
- [ ] **Gate 3:** No nesting past two levels. Flatten or use palette.
- [ ] **Gate 4:** Every action has a command name. All commands in the palette.
- [ ] **Gate 5:** Params are rows (label, field, rail), not knobs or long dropdowns.
- [ ] **Gate 6:** Keyboard, gamepad and touch reach the same commands.
- [ ] **Gate 7:** Focused module fills. Neighbors peek, no overlap.
- [ ] **Gate 8:** Workspaces are one-tap presets, not nested layout menus.
- [ ] **Gate 9:** 3×3 jump to nearest note works on keyboard, gamepad, touch.
- [ ] **Gate 10:** Tracker keys place notes without vertical nav.

A fail on any gate blocks landing. The module is reworked or archived.

---

## Open

- **Gestures:** pinch-zoom and two-finger pan are standard, but rotation and three-finger gestures vary by OS. Which gestures are safe to rely on?
- **Landscape vs portrait:** most intents assume landscape (editor wide). Should portrait mode hide the arranger and inspector automatically, or let the user pick?
- **Stylus:** treat as a precise touch, or bind stylus buttons to modifier keys?
- **Screen size floor:** what is the smallest usable screen? 5 inch phone in portrait (360×640 logical px)?
