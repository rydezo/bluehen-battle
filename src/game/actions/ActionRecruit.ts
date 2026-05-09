/* Problem 10

ActionRecruit represents an action the player can make where the start
piece recruits an opponents piece on the end square. The recruited piece 
is removed from the opponents team and added to the current player's team.
Both pieces stay on the same squares and are still active.

10.1 Define a class named ActionRecruit that extends ActionStartEnd 
(We need to specify both the start and end locations)

- Define the constructor with ONLY the game and the location parameters 
   required by the superclass.
   Constructor should call the super's constructor with the arguments
   set to meet an recruit's requirements.
   Note: the second argument for the super class call should be the ActionType. 
   We don't need this value passed to our constructor because it will
   always represent a Recruit. 
   The location parameters are to be determined by a Recruit action. 
   (Should the end square be empty or have a piece? 
   Should the end piece (if required) belong to the current team or the opponent team?)

10.2 Implement method performAction. This method will carry out the
    recruit action on the GameBoard. 

    First - check that this is a valid action the player can make.
    If the action is not valid - throw an ActionError and pass:
        - the Game's message (this was set in the validAction method)
        - the appropriate ActionType.

    If the action is valid - implement the logic to reflect a recruit was made in the 
    game. 
    On a recruit: 
    - the Piece on the End Square is removed from the opponent's team
    - the Piece on the End Square is added to the current player's team
    - the Piece being recruited speaks
    - update the action for the Piece doing the recruiting
    - the turn of the game is changed to the other player

    Note: Use  your UML diagram to take advantage of the methods you 
    already created in Part A! This method should not require a lot of coding
    other than to call methods you've already written. 

    Test your ActionRecruit with ActionRecruit.test.ts 
    View the output of the gameboard to see a piece recruit

*/


import { GameS26 } from "../elements/GameS26";
import { ActionType } from "../elements/Utilities";
import { BoardLocation } from "../elements/Utilities";
import { Piece } from "../elements/Piece";
import { ActionStartEnd } from "./ActionStartEnd";
import { ActionError } from "../ActionError";


/**
 * @description Represents a recruit action where the start piece recruits an
 * opponent's piece on the end square. The recruited piece is removed from the
 * opponent's team and added to the current team. Both pieces stay on their
 * current squares and remain active.
 * @extends ActionStartEnd
 */
export class ActionRecruit extends ActionStartEnd {
    /**
     * @description Creates an ActionRecruit for the given game and locations.
     * The end square must contain an opponent's piece.
     * @param game The GameS26 instance this action operates on
     * @param startLocation The location of the recruiting piece
     * @param endLocation The location of the piece being recruited
     */
    constructor(
        game: GameS26,
        startLocation: BoardLocation,
        endLocation: BoardLocation,
    ) {
        super(game, ActionType.Recruit, startLocation, endLocation, false, false);
    }
 
    /**
     * @description Removes the end piece from the opponent's team, adds it to
     * the current team, calls speak on the recruited piece, updates the
     * recruiting piece's action, and changes the turn.
     * Throws ActionError if the action is not valid or pieces are missing.
     * @returns true if the recruit was performed successfully
     * @throws ActionError if validAction returns false or pieces are null
     */
    performAction(): boolean {
        if (!this.validAction()) {
            throw new ActionError(this.game.getMessage(), ActionType.Recruit);
        }
 
        const startPiece: Piece | null = this.game
            .getGameBoard()
            .getSquare(this.startSquare)
            .getPiece();
        const endPiece: Piece | null = this.game
            .getGameBoard()
            .getSquare(this.endSquare)
            .getPiece();
 
        if (!startPiece || !endPiece) {
            throw new ActionError(this.game.getMessage(), ActionType.Recruit);
        }
 
        this.game.getOpponentTeam().removePieceFromTeam(endPiece);
        this.game.getCurrentTeam().addPieceToTeam(endPiece);
        endPiece.speak();
        startPiece.updateAction(ActionType.Recruit);
        this.game.changeTurn();
        return true;
    }
}