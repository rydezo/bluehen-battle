/* Problem 2:
GameS26 extends Game and implements the base win condition:
the game ends when either team has no active pieces left.
*/

import { GameBoard } from "./GameBoard";
import { Team } from "./Team";
import { Game } from "./Game";

/**
 * @description Concrete game class implementing the base win condition.
 * The game ends when either team runs out of active pieces. The winner
 * is the team that still has active pieces remaining.
 * Extended by GameRO which adds a point-based win condition.
 * @extends Game
 */
export class GameS26 extends Game {
    /**
     * @description Creates a GameS26 with the given board, teams, and turn
     * @param gameBoard The GameBoard for this game
     * @param teamA The first team
     * @param teamB The second team
     * @param turn The team that goes first
     */
    constructor(gameBoard: GameBoard, teamA: Team, teamB: Team, turn: Team) {
        super(gameBoard, teamA, teamB, turn);
    }

    /**
     * @description Returns true if either team has no active pieces remaining.
     * Checks both teamA and teamB independently so the game ends as soon as
     * either side is fully eliminated.
     * @returns true if the game has ended, false if both teams still have active pieces
     */
    isGameEnded(): boolean {
        let teamAActive: boolean = false;
        let teamBActive: boolean = false;
        for (const piece of this.teamA.getAllPieces()) {
            if (piece.isActive()) teamAActive = true;
        }
        for (const piece of this.teamB.getAllPieces()) {
            if (piece.isActive()) teamBActive = true;
        }
        return !teamAActive || !teamBActive;
    }

    /**
     * @description Returns the team that still has active pieces. Checks
     * teamA first, then teamB. Returns a placeholder team with color "N/A"
     * if neither team has active pieces (a draw — should not normally occur).
     * @returns The winning Team
     */
    getWinner(): Team {
        let teamAHasActive: boolean = false;
        for (const piece of this.teamA.getAllPieces()) {
            if (piece.isActive()) teamAHasActive = true;
        }
        if (teamAHasActive) return this.teamA;

        let teamBHasActive: boolean = false;
        for (const piece of this.teamB.getAllPieces()) {
            if (piece.isActive()) teamBHasActive = true;
        }
        if (teamBHasActive) return this.teamB;

        return new Team("N/A", []);
    }
}