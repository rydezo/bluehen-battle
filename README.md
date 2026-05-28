# BlueHen Battle

A turn-based strategy game built with TypeScript and the Webz component framework. Two teams compete on a grid board, each controlling a squad of unique pieces with special abilities.

---

## Demo

> `npm install && npm run start`

---

## Features

- **Turn-based gameplay** — two players alternate turns on a shared board
- **4 unique piece types** with distinct movement rules and abilities
- **9 action types** including Attack, Recruit, Spawn, Heal, Shield, and more
- **Point-based scoring** — pieces are worth different amounts when defeated
- **Dynamic UI** — clicking any board square shows live piece info, valid paths, and backpack contents
- **Tiebreaker logic** — guarantees a winner even in stalemate scenarios (50-turn limit, active piece count, turn-based fallback)

---

## Piece Types

| Piece | Symbol | Movement | Special |
|-------|--------|----------|---------|
| BlueHen | H | Anywhere (flying) → 1 square up/down after 2 attacks | Permanent Attack ability, 3 pts |
| Minion | M | 1 square diagonally | Turns evil after 3 recruits, gaining Attack, 1 pt |
| Ghost | G | 1–2 squares left/right | Goes dormant instead of dying on first attack, 2 pts |
| Medic | Md | 1 square orthogonally | Heals inactive teammates (max 3 heals), 2 pts |

---

## Actions

| Action | Type | Description |
|--------|------|-------------|
| Move | Permanent | Move a piece to an empty square |
| Attack | Permanent | Attack an opponent's piece, earning points |
| Recruit | Permanent (Minion) | Convert an opponent's piece to your team |
| Spawn | Backpack | Create a copy of a piece on a random empty square |
| Revive | Backpack | Bring all dormant Ghosts back to life |
| Renew | Backpack | Refresh all abilities in a teammate's backpack |
| Swap | Backpack | Swap backpacks with an opponent's piece |
| Heal | Permanent (Medic) | Revive the first inactive teammate to a random square |
| Shield | Backpack | Protect a teammate from the next attack |

---

## Tech Stack

- **TypeScript** — full type safety throughout
- **Webz** — component-based UI framework (similar to Angular)
- **Jest** — unit tests for all game logic classes
- **HTML/CSS** — custom component styling with no external UI library

---

## Architecture

The project is split into two layers:

**Game Logic (`src/game/`)**
```
elements/        # Core classes: Piece, Team, GameBoard, BoardSquare
actions/         # Action hierarchy: Action → ActionStart → ActionStartEnd
Controller.ts    # Bridges game logic and UI
GameRO.ts        # Extended win condition (point-based scoring)
```

**UI (`src/app/GUI-Version/`)**
```
gui-view/        # Root component, owns Controller, coordinates all children
board-view/      # Renders the game board grid
square-view/     # Individual board square with click events
team-view/       # Team panel listing all pieces
piece-view/      # Single piece display with image and abilities
score-view/      # Live scoreboard with win notification
piece-info/      # Dynamically loaded piece inspector on square click
action-view/     # Action button bar
```

---

## OOP Design

- **Encapsulation** — all state is private/protected with public accessors
- **Inheritance** — `Game → GameS26 → GameRO`, `Action → ActionStart → ActionStartEnd → concrete actions`, `Piece → PieceBlueHen / PieceMinion / PieceGhost / PieceMedic`
- **Polymorphism** — `isGameEnded()` and `getWinner()` behave differently in `GameRO` vs `GameS26`; `speak()`, `spawn()`, and `validPath()` are overridden per piece type
- **Abstraction** — `Game`, `Action`, `ActionStart`, `ActionStartEnd`, and `Piece` are all abstract

---

## Getting Started

```bash
# Install dependencies
npm install

# Run in browser
npm run start

# Run tests
npm test
```
