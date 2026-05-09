/* Game Elements Part B - Problem 1
Abstract base class for the game. Manages the board, both teams, turn
order, game status messages, and point scoring.
*/

import { GameBoard } from "./GameBoard";
import { Team } from "./Team";
import { BoardSquare } from "./BoardSquare";
import { Piece } from "./Piece";

/**
 * @description Abstract base class representing the game. Owns the GameBoard,
 * both teams, turn tracking, status messages, and point scores. Subclasses
 * implement isGameEnded() and getWinner() to define win conditions.
 * @abstract
 */
export abstract class Game {
    private status: string;

    // NEW OBJECTIVE - track scores for each team
    /** @description Team A's current score */
    protected scoreA: number = 0;
    /** @description Team B's current score */
    protected scoreB: number = 0;
    /** @description Points needed to win by score */
    protected readonly WINNING_SCORE: number = 10;

    // ENSURE WINNER - track turn count to prevent infinite stalemates
    /** @description Total number of turns taken so far */
    protected turnCount: number = 0;

    /**
     * @description Creates a Game with the given board, teams, and starting turn.
     * Clears the board and places all pieces at random empty squares.
     * @param gameBoard The GameBoard for this game
     * @param teamA The first team
     * @param teamB The second team
     * @param turn The team whose turn it is first
     */
    constructor(
        private gameBoard: GameBoard,
        protected teamA: Team,
        protected teamB: Team,
        private turn: Team,
    ) {
        this.status = "Ready";
        this.initializeGameBoard();
    }

    /**
     * @description Clears all pieces from the board then places each team's
     * pieces on random empty squares. Called once in the constructor.
     */
    private initializeGameBoard(): void {
        for (const row of this.gameBoard.getAllSquares()) {
            for (const square of row) {
                if (!square.isEmpty()) square.removePiece();
            }
        }
        this.placeTeamPieces(this.teamA.getAllPieces());
        this.placeTeamPieces(this.teamB.getAllPieces());
    }

    /**
     * @description Places each piece in the given array on a random empty square
     * @param pieces The array of Piece objects to place
     */
    private placeTeamPieces(pieces: Piece[]): void {
        for (let i = 0; i < pieces.length; i++) {
            const randomSquare: BoardSquare =
                this.gameBoard.findRandomEmptySquare();
            randomSquare.setPiece(pieces[i]);
        }
    }

    /**
     * @description Returns the game board
     * @returns The GameBoard instance
     */
    getGameBoard(): GameBoard {
        return this.gameBoard;
    }

    /**
     * @description Returns the current game status message
     * @returns The status message string
     */
    getMessage(): string {
        return this.status;
    }

    /**
     * @description Returns the team whose turn it currently is
     * @returns The current Team
     */
    getCurrentTeam(): Team {
        return this.turn;
    }

    /**
     * @description Returns the team whose turn it is not
     * @returns The opponent Team
     */
    getOpponentTeam(): Team {
        if (this.turn === this.teamA) return this.teamB;
        return this.teamA;
    }

    /**
     * @description Returns whether it is the given team's turn
     * @param team The Team to check
     * @returns true if it is this team's turn
     */
    isTurn(team: Team): boolean {
        return team === this.turn;
    }

    /**
     * @description Switches the turn to the other team and increments the
     * turn counter
     */
    changeTurn(): void {
        this.turn = this.getOpponentTeam();
        // ENSURE WINNER - increment turn count to detect stalemates
        this.turnCount++;
    }

    /**
     * @description Sets the game status message
     * @param message The new status message string
     */
    setMessage(message: string): void {
        this.status = message;
    }

    // NEW OBJECTIVE - score accessors and mutators
    /**
     * @description Returns team A's current score
     * @returns Team A's score
     */
    getScoreA(): number {
        return this.scoreA;
    }

    /**
     * @description Returns team B's current score
     * @returns Team B's score
     */
    getScoreB(): number {
        return this.scoreB;
    }

    /**
     * @description Adds points to team A's score
     * @param points The number of points to add
     */
    addScoreA(points: number): void {
        this.scoreA += points;
    }

    /**
     * @description Adds points to team B's score
     * @param points The number of points to add
     */
    addScoreB(points: number): void {
        this.scoreB += points;
    }

    /**
     * @description Adds points to whichever team is currently taking their turn.
     * Used by ActionAttack to award points without needing to know which team
     * is A or B.
     * @param points The number of points to award to the current team
     */
    addScoreToCurrentTeam(points: number): void {
        if (this.getCurrentTeam() === this.teamA) {
            this.scoreA += points;
        } else {
            this.scoreB += points;
        }
    }

    /**
     * @description Returns whether the game has ended.
     * Defined by each subclass based on its win condition.
     * @returns true if the game is over
     */
    abstract isGameEnded(): boolean;

    /**
     * @description Returns the winning team.
     * Should only be called after isGameEnded() returns true.
     * @returns The winning Team
     */
    abstract getWinner(): Team;

    /**
     * @description Returns a multi-line string showing the board, both teams,
     * and whose turn it is
     * @returns Formatted game state string
     */
    toString(): string {
        let retString: string = "";
        retString = retString.concat("\n" + this.getGameBoard().toString());
        retString = retString.concat(
            "\n" + this.getCurrentTeam().toString() + "\n",
        );
        retString = retString.concat(
            "\n" + this.getOpponentTeam().toString() + "\n",
        );
        retString = retString.concat(
            "\nIt is Team " + this.turn.getTeamColor() + "'s turn\n",
        );
        return retString.toString();
    }
}