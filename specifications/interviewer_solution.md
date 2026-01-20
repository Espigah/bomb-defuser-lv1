# Answer Key (for interviewer)

## Correct sequence
1) Splice BLUE (it starts cut)
2) Cut RED
3) Cut GREEN
=> Final status: DEFUSED

## Main intentional bugs in the code
1) Index-based identity: the UI passes `data-index` and the handler modifies the wrong wire.
2) DOM as the source of truth: the UI shows inverted state for some wires.
3) Buggy validation: the engine explodes on the first action due to an incorrect guard.

## Expected minimal fix (high-level)
- Replace `index` with `wireId` in all handlers and in the API (cutWire/mendWire).
- Render wire state only from `store.wires[].isCut` (no inversions).
- Fix `validate()` so it only explodes on invalid actions and allows the correct sequence.
