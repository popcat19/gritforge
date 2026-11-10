# Studio Modules

Purpose: Penpot-compatible component spec for gritforge studio modules. Maps kernel `ParamSpec` to visual controls. Headless first, UI optional.

## Contract

A module card shows: id, kind badge, param controls built from `params` array. No hardcoded layouts. The manifest is the single source.

| ParamSpec | Control | Notes |
|-----------|---------|-------|
| `integer: true` | stepper or snap slider | round on input |
| `min 0..1, max 0..1` | knob | continuous, default arc |
| `max <= 16` | slider | labeled ticks |
| large range | slider + numeric readout | log scale optional |

## Components

- `module-card`: frame, auto-layout vertical, padding 16, gap 12
- `param-row`: label + control, gap 8
- `control-knob`: circle, 270deg arc, value in center
- `control-slider`: track + thumb + value readout
- `kind-badge`: pill, text "voice" / "note", semantic color

## Penpot Variants

- `module-card` has variant per module id (sine, saw-lead)
- Each variant shows that module's params, built from JSON

## Next

- Emit `studio/modules.json` from `src/modules/builtin-voices.ts`
- Penpot plugin reads JSON, creates component instances
- Keep gritforge headless: UI only renders the contract
