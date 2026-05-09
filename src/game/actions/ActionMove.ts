/* Problem 7

ActionMove represents an action the player can make where the start
piece is moved to an empty square on the board.

7.1 Define a class named ActionMove that extends ActionStartEnd 
(we need to specify both the start and end locations) 

- Define the constructor with ONLY the game and the location parameters 
   required by the superclass.
   Constructor should call the super's constructor with the arguments
   set to meet a move's requirements.
   Note: the second argument for the super class call should be the ActionType. 
   We don't need this value passed to our constructor because it will
   always represent a Move.
   The location parameters are to be determined by a Move action. 
   (Should the end square be empty or have a piece? 
   Should the end piece (if required) belong to the current team or the opponent team?)          

7.2 Implement method performAction. This method will carry out the
    move on the GameBoard. 

    First - check that this is a valid action the player can make.
    If the action is not valid - throw an ActionError and pass:
        - the Game's message (this was set in the validAction method)
        - the appropriate ActionType

    If the action is valid - implement the logic to reflect a move made in the 
    game. 
    On a move:  
        - the Piece on the Start Square is moved to the End Square   
        - the Piece speaks
        - the turn of the game is changed to the other player
   

    Note: Use  your UML diagram to take advantage of the methods you 
    already created in Part A! This method should not require a lot of coding
    other than to call methods you've already written. 

    Test your ActionMove with ActionMove.test.ts 
    View the output of the gameboard to see your piece move
*/

import { GameS26 } from "../elements/GameS26";
import { BoardLocation } from "../elements/Utilities";
import { Piece } from "../elements/Piece";
import { ActionStartEnd } from "./ActionStartEnd";
import { ActionType } from "../elements/Utilities";
import { ActionError } from "../ActionError";

/**
 * @description Represents a move action where the start piece is moved to
 * an empty end square. The end square must be empty and reachable via a
 * valid path for the start piece. Changes the turn after a successful move.
 * @extends ActionStartEnd
 */
export class ActionMove extends ActionStartEnd {
    /**
     * @description Creates an ActionMove for the given game and locations.
     * The end square must be empty for a move action.
     * @param game The GameS26 instance this action operates on
     * @param startSquare The location of the piece to move
     * @param endSquare The location to move the piece to
     */
    constructor(
        game: GameS26,
        startSquare: BoardLocation,
        endSquare: BoardLocation,
    ) {
        super(game, ActionType.Move, startSquare, endSquare, true, true);
    }
 
    /**
     * @description Moves the start piece to the end square, calls speak on
     * the piece, and changes the turn. Throws ActionError if the move is invalid.
     * @returns true if the move was performed successfully
     * @throws ActionError if validAction returns false
     */
    performAction(): boolean {
        if (!this.validAction()) {
            throw new ActionError(this.game.getMessage(), this.actionType);
        }
 
        const startSquareObj = this.game
            .getGameBoard()
            .getSquare(this.startSquare);
        const endSquareObj = this.game.getGameBoard().getSquare(this.endSquare);
 
        const piece: Piece | null = startSquareObj.removePiece();
        if (piece !== null) {
            endSquareObj.setPiece(piece);
            piece.speak();
        }
 
        this.game.changeTurn();
        return true;
    }
}