# Bomb Defuser Lab (Vite + Vanilla JS)

A mini-project intentionally broken to practice prompt engineering with an LLM.

## 🎮 The Challenge

You are a bomb defusal specialist. The bomb has 6 wires (6 colors).

### Objective
Perform 3 actions to defuse:
1) Splice the blue wire (it starts cut)
2) Cut the red wire
3) Cut the green wire

### Problem
The system is broken. Any action detonates the bomb (bug!).

### Solution
Use an LLM to:
1) Understand what should happen
2) Diagnose the bugs (there are 3)
3) Fix them with minimal changes
4) Test by clicking in the UI until you reach `DEFUSED`

⚠️ This is a game/simulation. Nothing here is about real bombs.

## ⚡ Running

~~~bash
npm install
npm run dev
~~~

Open: http://localhost:5174

## 🎯 Game Rules

### Structure
- 3 bugs to discover and fix
- Each bug must be solved using prompt engineering with an LLM (without looking directly at the code)
- After fixing a bug, the bomb returns to the `ARMED` state and the player moves on to the next one

### Time and Attempts
- Per bug: 2 minutes OR 3 attempts (whichever comes first)
- After fixing a bug: the player gets another 2 minutes + 3 attempts for the next bug
- On losing: the player passes the turn to the next participant

### Resetting the game
- When a new player starts, the game returns to the initial state (`ARMED` with all 3 bugs active)
- No continuity: the next player does not continue where the previous one left off
- To reset, reload the page or click the "New Game" button

### Victory
- Fix all 3 bugs and get the bomb to `DEFUSED`

### Defeat
- Exceed 2 minutes OR use 3 attempts without fixing the current bug
- Pass the turn to the next player

## 📚 Full Documentation

- [LLM_RULES.md](./LLM_RULES.md) — Detailed rules for the LLM
- [specifications/](./specifications/) — Technical specs and diagnostic prompts
