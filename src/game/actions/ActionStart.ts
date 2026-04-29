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

export abstract class ActionStart extends Action {
    protected startSquare: BoardLocation;

    constructor(
        game: GameS26,
        actionType: ActionType,
        startSquare: BoardLocation
    ) {
        super(game, actionType);
        this.startSquare = startSquare;
    }

    validAction(): boolean {
        if (!this.game.getGameBoard().inBounds(this.startSquare)) {
            this.game.setMessage("Start square out of bounds.");
            return false;
        }
        const piece: Piece | null = this.game.getGameBoard().getSquare(this.startSquare).getPiece();
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
