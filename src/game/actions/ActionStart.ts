/* Problem 5
Abstractly represents the actions a player can take.
 where the player must select the start location.

5.1 Create an abstract class named ActionStart that
extends Action with the additional member field:
- member field for the location of the start square
- constructor with 3 parameters that
    - calls the super to set its two member fields 
    - sets the start location member field
5.2 Override the method validAction with no parameters and 
    returns a boolean representing whether the action is valid.
    For all actions that require a start piece in our game the following
    requirements must be true:
        - the location must be in bounds of the board       
        - there must be a piece on the start location
        - the piece on the start must belong to the current team
        - the piece on the start must be allowed to take that actions
    If any of these requirements are not met:
        - call the Game's setMessage and set the message the appropriate message:
                "Start square out of bounds."
                "No Piece on start square."
                "Piece on start square is not yours."
                "Piece on start square can't take that action."
        
    Note: Use your UML diagram to take advantage of the methods you 
    already created in Part A.  For example - the GameBoard class has a
    method to check if a location is in the bounds of the board.

- This class will be tested when you created more subclasses.

*/

import { BoardLocation } from "../elements/Utilities";
import { GameS26 } from "../elements/GameS26";
import { Piece } from "../elements/Piece";
import { ActionType } from "../elements/Utilities";
import { Action } from "./Action";

/**
 * @description Abstract class representing any action that requires the player
 * to select a start square. Extends Action with start location validation.
 * Subclasses that also need an end square should extend ActionStartEnd instead.
 * @abstract
 * @extends Action
 */
export abstract class ActionStart extends Action {
    /** @description The board location of the square the player selected as the start */
    protected startSquare: BoardLocation;
 
    /**
     * @description Creates an ActionStart with a game, action type, and start location
     * @param game The GameS26 instance this action operates on
     * @param actionType The type of action being performed
     * @param startSquare The board location the player selected as the start
     */
    constructor(game: GameS26, actionType: ActionType, startSquare: BoardLocation) {
        super(game, actionType);
        this.startSquare = startSquare;
    }
 
    /**
     * @description Validates that the start square meets all requirements:
     * the location must be in bounds, there must be a piece on the square,
     * the piece must belong to the current team, and the piece must be
     * allowed to take this action type.
     * Sets the game message to an appropriate error string if invalid.
     * @returns true if all start square requirements are met, false otherwise
     */
    validAction(): boolean {
        if (!this.game.getGameBoard().inBounds(this.startSquare)) {
            this.game.setMessage("Start square out of bounds.");
            return false;
        }
        const piece: Piece | null = this.game
            .getGameBoard()
            .getSquare(this.startSquare)
            .getPiece();
        if (piece === null) {
            this.game.setMessage("No Piece on start square.");
            return false;
        }
        if (piece.getTeamColor() !== this.game.getCurrentTeam().getTeamColor()) {
            this.game.setMessage("Piece on start square is not yours.");
            return false;
        }
        if (!piece.allowableAction(this.actionType)) {
            this.game.setMessage("Piece on start square can't take that action.");
            return false;
        }
        return true;
    }
}