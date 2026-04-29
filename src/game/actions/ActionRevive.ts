/*Problem 3

ActionRevive represents an action the player can make where the start
piece carrying this ability can revive all dormant ghosts that are 
on its own team and still on the board. The dormant ghosts are no longer 
dormant and they are moved to a new random location on the board.

3.1 Define a class named ActionRevive that extends ActionStart
(We don't need to specify an End location) 

- Define the constructor with ONLY the game and the location parameters 
   required by the superclass.
   Constructor should call the super's constructor with the arguments
   set to meet Revive's requirements.
   Note: the second argument for the super class call should be the ActionType. 
   We don't need this value passed to our constructor because it will
   always represent an Attack. 
   

3.2 Override the method valid Action. There is an additional requirement
    that should be met. Since we are moving a ghost piece to a random
    location - we must make sure there is room on the board to do this.
    Using good OOP practices, this method should check that this action
    meets all the requirement for all ActionStarts as well as this 
    additional requirement.

3.3 Implement method performAction. This method will carry out the
    revive action on the GameBoard. 

    First - check that this is a valid action the player can make.
    If the action is not valid - throw an ActionError and pass:
        - the Game's message (this was set in the validAction method)
        - the appropriate ActionType.

    If the action is valid - implement the logic to reflect a revive was made in the 
    game. 
        On a revive:
        - all the pieces on the board that are dormant ghosts
            belonging to the current team - are brought back to life
            and no longer dormant 
            NOTE: changeDormant should be public in PieceGhost (I had a typo
            in the instructions for this piece class)
        - these revived ghost pieces are moved to a random empty spot on the board
        - update the action for the Piece on start square
        - one of the Pieces being speaks
        - the turn of the game is changed to the other player

    Note: Use  your UML diagram to take advantage of the methods you 
    already created in Part A! This method should not require a lot of coding
    other than to call methods you've already written. 

    Test your ActionRevive with ActionRevie.test.ts 
    View the output of the gameboard to see a piece revive their dormant ghosts
*/


import { GameS26 } from "../elements/GameS26";
import { ActionType } from "../elements/Utilities";
import { BoardLocation } from "../elements/Utilities";
import { Piece } from "../elements/Piece";
import { ActionStart } from "./ActionStart";
import { PieceGhost } from "../elements/PieceGhost";
import { ActionError } from "../ActionError";


export class ActionRevive extends ActionStart {
    constructor(game: GameS26, startSquare: BoardLocation) {
        super(game, ActionType.Revive, startSquare);
    }

    validAction(): boolean {
        if (!super.validAction()) return false;
        if (this.game.getGameBoard().isBoardFull()) {
            this.game.setMessage("Board is full.");
            return false;
        }
        return true;
    }

    performAction(): boolean {
        if (!this.validAction()) {
            throw new ActionError(this.game.getMessage(), this.actionType);
        }

        const startPiece: Piece | null = this.game
            .getGameBoard()
            .getSquare(this.startSquare)
            .getPiece();

        // Find all dormant ghosts on the board belonging to the current team
        for (const row of this.game.getGameBoard().getAllSquares()) {
            for (const square of row) {
                const piece: Piece | null = square.getPiece();
                if (
                    piece instanceof PieceGhost &&
                    piece.isDormant() &&
                    piece.getTeamColor() ===
                        this.game.getCurrentTeam().getTeamColor()
                ) {
                    // Revive the ghost - no longer dormant, move to random empty square
                    square.removePiece();
                    piece.changeDormant(false);
                    piece.setActive(true);
                    piece.changeSymbol();
                    const randomSquare = this.game
                        .getGameBoard()
                        .findRandomEmptySquare();
                    randomSquare.setPiece(piece);
                }
            }
        }

        if (startPiece) {
            startPiece.updateAction(this.actionType);
            startPiece.speak();
        }

        this.game.changeTurn();
        return true;
    }
}
