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
    - One team has no active pieces left

The winner is the team with the most points when the game ends.
If scores are tied, the team with active pieces remaining wins.
*/

import { Team } from "./Team";
import { GameS26 } from "./GameS26";
import { GameBoard } from "./GameBoard";

export class GameRO extends GameS26 {
    constructor(gameBoard: GameBoard, teamA: Team, teamB: Team, turn: Team) {
        super(gameBoard, teamA, teamB, turn);
    }

    // NEW OBJECTIVE - game ends when a team hits 10 points
    // OR when a team has no active pieces left
    // ENSURE WINNER - game ends after 50 turns with no winner
    // to prevent infinite stalemates
    isGameEnded(): boolean {
        if (this.turnCount >= 50) return true;
        if (
            this.scoreA >= this.WINNING_SCORE ||
            this.scoreB >= this.WINNING_SCORE
        )
            return true;
        return super.isGameEnded();
    }

    // NEW OBJECTIVE - winner is determined by points first,
    // then by active pieces if scores are tied.
    // ENSURE WINNER - if scores are tied,
    // the team with more active pieces wins.
    getWinner(): Team {
        if (this.scoreA > this.scoreB) return this.teamA;
        if (this.scoreB > this.scoreA) return this.teamB;

        // ENSURE WINNER - tiebreaker: count active pieces
        const teamAActive = this.teamA.filterPieces(true).length;
        const teamBActive = this.teamB.filterPieces(true).length;
        if (teamAActive > teamBActive) return this.teamA;
        if (teamBActive > teamAActive) return this.teamB;

        // ENSURE WINNER - last resort tiebreaker:
        // team whose turn it is loses (they couldn't make a move)
        return this.getOpponentTeam();
    }

    // NEW OBJECTIVE - returns a string showing current scores
    getScoreMessage(): string {
        return (
            `Score — ${this.teamA.getTeamColor()}: ${this.scoreA} | ` +
            `${this.teamB.getTeamColor()}: ${this.scoreB} | ` +
            `First to ${this.WINNING_SCORE} wins!`
        );
    }
}
