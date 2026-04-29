/* Game Elements Part B
Problem 1

1.1 Create a new abstract class named Game. 
This class should have the following members:
- a member field for the GameBoard
- a member field for team A
- a member field for team B
- a member field turn of type Team  that refers to the team that has the next turn
- a member field of type string for a message to hold the status of our game

- constructor with the first 4 parameters listed above in that order -
    it should
        - set these fields
        - set the message string to "Ready"
        - call initializeGameBoard to set up the GameBoard with 
                pieces on it  - this method is in the next instruction.

1.2 A private method name initializeGameBoard that has no parameters 
   and doesn't return a value. This method should
   set up both Team’s pieces randomly on the board
   Add a call to this method to your constuctor.
   Hint: use your findRandomEmptySquare method in your GameBoard class
   You should write your algorithm for this method before coding it!!
   This is very similar to a method we wrote in the In Class Activity Week 2!

1.3 The acessor methods:
    - getGameBoard,  getMessage

1.4 A method named getCurrentTeam that has no parameters and 
returns the Team team whose turn it is 
    - 
1.5 A method named getOpponentTeam that has no parameters and
returns the Team whose turn it isn’t 

1.6 A method named isTurn that has one Team parameter and returns a 
          boolean representing whether it is this Team’s turn 

1.7 A method named changeTurn that has no parameters and doesn't return
a value. This method sets the member field 'turn' to the other Team

1.8 A setter method
    setMessage

1.9 An abstract method named isGameEnded that has no parameters 
and returns a boolean.

1.10 An abstract method named getWinner that has no parameters 
and returns a Team.

1.11 A toString method is already defined for you.

- Complete GameS26 before testing.

*/

import { GameBoard } from "./GameBoard";
import { Team } from "./Team";
import { BoardSquare } from "./BoardSquare";
import { Piece } from "./Piece";

export abstract class Game {
    private status: string;

    constructor(
        private gameBoard: GameBoard,
        protected teamA: Team,
        protected teamB: Team,
        private turn: Team,
    ) {
        this.status = "Ready";
        this.initializeGameBoard();
    }

    private initializeGameBoard(): void {
        // dlear the board first
        for (const row of this.gameBoard.getAllSquares()) {
            for (const square of row) {
                if (!square.isEmpty()) {
                    square.removePiece();
                }
            }
        }
        // Place team A's pieces on random empty squares
        const teamAPieces: Piece[] = this.teamA.getAllPieces();
        for (let i = 0; i < teamAPieces.length; i++) {
            const randomSquare: BoardSquare =
                this.gameBoard.findRandomEmptySquare();
            randomSquare.setPiece(teamAPieces[i]);
        }

        // Place team B's pieces on random empty squares
        const teamBPieces: Piece[] = this.teamB.getAllPieces();
        for (let i = 0; i < teamBPieces.length; i++) {
            const randomSquare: BoardSquare =
                this.gameBoard.findRandomEmptySquare();
            randomSquare.setPiece(teamBPieces[i]);
        }
    }

    getGameBoard(): GameBoard {
        return this.gameBoard;
    }
    getMessage(): string {
        return this.status;
    }
    getCurrentTeam(): Team {
        return this.turn;
    }
    getOpponentTeam(): Team {
        if (this.turn === this.teamA) return this.teamB;
        return this.teamA;
    }
    isTurn(team: Team): boolean {
        return team === this.turn;
    }
    changeTurn(): void {
        this.turn = this.getOpponentTeam();
    }
    setMessage(message: string): void {
        this.status = message;
    }
    
    abstract isGameEnded(): boolean;
    abstract getWinner(): Team;

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
