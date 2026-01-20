# Bomb Defuser Lab — UI Specification (WYSIWYD)

Principle: What You See Is What It Does
Everything the user sees must correspond directly to the system’s state/actions.

## UI Regions
1) Bomb Panel
   - Status: `ARMED | EXPLODED | DEFUSED`
   - Counter of actions performed
2) Wires Panel
   - List of the 6 wires with:
     - color (id)
     - visible state: `INTACT | CUT`
     - visible actions: "Cut" and "Splice" buttons
3) Event Log
   - Every action generates a visible event (audit trail)

## Mapping (Screen → System)
- Wire card → `Wire` entity
- Wire state label → `wire.isCut`
- Cut button → `Wire.cut`
- Splice button → `Wire.mend`
- Bomb status → `Bomb.status`
- Log → `EventLog` (actions and validation-engine decisions)

## Readability (requirements)
- The UI must not "guess" state by reading DOM classes.
- The UI renders from a single in-memory store.
- Wire identity is by color (wireId), never by array index.
- An action must have an immediate visible consequence: a change in the wire, status, or log.
