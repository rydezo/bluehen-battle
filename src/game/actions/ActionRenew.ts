/*Problem 1

ActionRenew represents an action the player can make where the start
piece selects another piece on its own team to renew all the
abilities in that piece's backpack. 

1.1 Define a class named ActionRenew that extends ActionStartEnd 
(We need to specify both the start and end locations) 

- Define a constructor with only the game and the location parameters 
   required by the superclass.
   Constructor should call the super's constructor with the arguments
   set to meet a renew's requirements.
   Note: the second argument for the super class call should be the ActionType. 
   We don't need this value passed to our constructor because it will
   always represent a Renew. 
   The location parameters are to be determined by a Renew action. 
   (Should the end square be empty or have a piece? 
   Should the end piece (if required) belong to the current team or the opponent team?)    

1.2 Implement method performAction. This method will carry out the
    renew action on the GameBoard. 

    First - check that this is a valid action the player can make.
    If the action is not valid - throw an ActionError and pass:
        - the Game's message (this was set in the validAction method)
        - the appropriate ActionType.

    If the action is valid - implement the logic to reflect a renew was made in the 
    game. 
    On a renew:
        - all the abilities in the backpack of the End Square's piece are
            set to available
        - update the action for the Piece on start square
        - one of the Pieces being speaks
        - the turn of the game is changed to the other player

    Note: Use  your UML diagram to take advantage of the methods you 
    already created in Part A! This method should not require a lot of coding
    other than to call methods you've already written. 

    Test your ActionRenew with ActionRenew.test.ts 
    View the output of the gameboard to see a piece's backpack renewed
*/


import { GameS26 } from "../elements/GameS26";
import { ActionType } from "../elements/Utilities";
import { BoardLocation } from "../elements/Utilities";
import { Piece } from "../elements/Piece";
import { ActionStartEnd } from "./ActionStartEnd";
import { ActionError } from "../ActionError";


export class ActionRenew extends ActionStartEnd {
    constructor(
        game: GameS26,
        startSquare: BoardLocation,
        endSquare: BoardLocation,
    ) {
        super(game, ActionType.Renew, startSquare, endSquare, false, true);
    }

    performAction(): boolean {
        if (!this.validAction()) {
            throw new ActionError(this.game.getMessage(), this.actionType);
        }

        const startPiece: Piece | null = this.game
            .getGameBoard()
            .getSquare(this.startSquare)
            .getPiece();
        const endPiece: Piece | null = this.game
            .getGameBoard()
            .getSquare(this.endSquare)
            .getPiece();

        if (startPiece && endPiece) {
            endPiece.getBackpack().renew();
            startPiece.updateAction(this.actionType);
            endPiece.speak();
            this.game.changeTurn();
            return true;
        }
        return false;
    }
}
