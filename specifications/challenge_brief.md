# Bomb Defuser Lab — Challenge Brief (no code)

## Objective
The interface represents a bomb with 6 wires. The candidate must, using an LLM:
1) Figure out "what the system should do" (context and the defusal rule)
2) Fix the bugs that make the bomb explode even when following the correct flow

## Expected initial state (product intent)
- Bomb: ARMED
- Wires:
  - Blue: starts CUT (must be spliced)
  - Red: starts INTACT (must be cut)
  - Green: starts INTACT (must be cut)
  - Yellow / White / Black: start intact (must not be touched)

## Valid actions (mechanics)
- cutWire(wireId): marks the wire as cut
- mendWire(wireId): reconnects the wire (only if it is cut)

## Correct defusal sequence
The bomb should be defused when:
- Blue is SPLICED (reconnected)
- Red is CUT
- Green is CUT
- No other wire has been changed

## Expected behavior
- If the user performs an invalid action (e.g., splicing a wire that is not cut), the bomb EXPLODES.
- If the user touches a wire outside the allowed set (yellow/white/black), the bomb EXPLODES.
- If the user cuts the blue wire instead of splicing it, the bomb EXPLODES.
- If the user tries to cut red/green before splicing blue, the bomb EXPLODES.
- After completing the 3 correct actions, the bomb becomes DEFUSED and stops accepting actions.

## What is broken today
Even when the user tries to follow the correct flow, the system explodes due to bugs related to:
- Identity (the wrong wire being modified)
- Sync/validation (incorrect rules)
- Source of truth (the DOM influencing state)

The fix must be minimal and readable.
