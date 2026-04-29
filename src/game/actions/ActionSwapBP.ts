/*Problem 2

ActionSwap represents an action the player can make where the start
piece swaps their backpack with the backpack of an opponents piece
on the end square. The original backpack of the piece doing the swapping
has it's swap ability expire. The newly acquired backpack of the piece
doing the swapping has all of its abilities set to available.

2.1 Define a class named ActionSwapBP that extends ActionStartEnd 
(We need to specify both the start and end locations) 

- Define the constructor with ONLY the game and the location parameters 
   required by the superclass.
   Constructor should call the super's constructor with the arguments
   set to meet swap backpack's requirements.
   Note: the second argument for the super class call should be the ActionType. 
   We don't need this value passed to our constructor because it will
   always represent a SwapBP Action. 
   The location parameters are to be determined by a Swap Backpack action. 
   (Should the end square be empty or have a piece? 
   Should the end piece (if required) belong to the current team or the opponent team?)

2.2 Implement method performAction. This method will carry out the
    swap backpack action on the GameBoard. 

    First - check that this is a valid action the player can make.
    If the action is not valid - throw an ActionError and pass:
        - the Game's message (this was set in the validAction method)
        - the appropriate ActionType.

    If the action is valid - implement the logic to reflect a backpack swap
    was made in the game.   
    On a swap backpack: 
    - the Piece on the End Square and the Piece on the Start square swap backpacks
    - the Start Piece's newly acquired backpack has all its abilites set to available
    - update the action for the Piece doing the swapping - note the only ability in the
        start piece's original backpack that gets modified is the 'swap' ability 
        which should now be expired. 
        Be careful of the order in which you call your methods!
    - one of the Pieces speaks 
    - the turn of the game is changed to the other player

    Note: Use  your UML diagram to take advantage of the methods you 
    already created in Part A! This method should not require a lot of coding
    other than to call methods you've already written. 

    Test your ActionSwapBP with ActionSwapBPtest.ts 
    View the output of the gameboard to see a piece swap its backpack

*/


import { GameS26 } from "../elements/GameS26";
import { BoardLocation } from "../elements/Utilities";
import { Piece } from "../elements/Piece";

import { ActionStartEnd } from "./ActionStartEnd";
import { ActionType } from "../elements/Utilities";
import { ActionError } from "../ActionError";


export class ActionSwapBP extends ActionStartEnd {
    constructor(
        game: GameS26,
        startSquare: BoardLocation,
        endSquare: BoardLocation,
    ) {
        super(game, ActionType.Swap, startSquare, endSquare, false, false);
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
            startPiece.updateAction(this.actionType);
            startPiece.swapBackpack(endPiece);
            startPiece.getBackpack().renew();
            startPiece.speak();
            this.game.changeTurn();
            return true;
        }
        return false;
    }
}
