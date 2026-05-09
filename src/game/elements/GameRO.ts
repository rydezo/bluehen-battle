/*
Requirements 5 and 7
NEW OBJECTIVE - GameRO changes the winning condition of the game.
Instead of simply eliminating all opponent pieces, teams earn points
when they defeat opponent pieces. Each piece has a point value:
    - BlueHen = 3 points
    - Ghost = 2 points
    - Medic = 2 points
    - Minion = 1 point

The game ends when:
    - One team reaches 10 points first, OR
    - One team has no active pieces left,
    - ENSURE WINNER: OR 50 turns have passed

The winner is the team with the most points when the game ends.
If scores are tied, the team with active pieces remaining wins.
*/

import { Team } from "./Team";
import { GameS26 } from "./GameS26";
import { GameBoard } from "./GameBoard";

/**
 * @description Extended game class implementing a point-based win condition.
 * Teams earn points by defeating opponent pieces. The game ends when a team
 * reaches 10 points, runs out of active pieces, or 50 turns pass.
 * The winner is determined first by score, then by active piece count,
 * then by whose turn it is (last resort tiebreaker).
 * NEW OBJECTIVE, ENSURE WINNER
 * @extends GameS26
 */
export class GameRO extends GameS26 {
    /**
     * @description Creates a GameRO with the given board, teams, and turn
     * @param gameBoard The GameBoard for this game
     * @param teamA The first team
     * @param teamB The second team
     * @param turn The team that goes first
     */
    constructor(gameBoard: GameBoard, teamA: Team, teamB: Team, turn: Team) {
        super(gameBoard, teamA, teamB, turn);
    }

    /**
     * @description Returns true if the game is over. The game ends when:
     * a team reaches the winning score, either team has no active pieces,
     * or 50 turns have passed to prevent infinite stalemates.
     * NEW OBJECTIVE, ENSURE WINNER
     * @returns true if the game has ended
     */
    isGameEnded(): boolean {
        // ENSURE WINNER - end after 50 turns to prevent infinite stalemates
        if (this.turnCount >= 50) return true;
        // NEW OBJECTIVE - end when a team hits the winning score
        if (
            this.scoreA >= this.WINNING_SCORE ||
            this.scoreB >= this.WINNING_SCORE
        )
            return true;
        return super.isGameEnded();
    }

    /**
     * @description Returns the winning team using a three-tier tiebreaker:
     * 1. Higher score wins
     * 2. More active pieces wins if scores are tied
     * 3. Opponent of the current turn wins as a last resort
     * NEW OBJECTIVE, ENSURE WINNER
     * @returns The winning Team
     */
    getWinner(): Team {
        // NEW OBJECTIVE - higher score wins
        if (this.scoreA > this.scoreB) return this.teamA;
        if (this.scoreB > this.scoreA) return this.teamB;

        // ENSURE WINNER - tiebreaker: count active pieces
        const teamAActive = this.teamA.filterPieces(true).length;
        const teamBActive = this.teamB.filterPieces(true).length;
        if (teamAActive > teamBActive) return this.teamA;
        if (teamBActive > teamAActive) return this.teamB;

        // ENSURE WINNER - last resort: the team whose turn it is loses
        // (they failed to make a winning move)
        return this.getOpponentTeam();
    }

    /**
     * @description Returns a formatted string showing the current score for
     * both teams and the winning score threshold
     * @returns Score message string e.g. "Score — red: 4 | blue: 7 | First to 10 wins!"
     */
    getScoreMessage(): string {
        return (
            `Score — ${this.teamA.getTeamColor()}: ${this.scoreA} | ` +
            `${this.teamB.getTeamColor()}: ${this.scoreB} | ` +
            `First to ${this.WINNING_SCORE} wins!`
        );
    }
}