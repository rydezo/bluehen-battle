/* Problem 6
Abstractly represents the actions a player can take.
 where the player must select the start location
 and the end location.

6.1 Create an abstract class named ActionStartEnd that
extends ActionStart with the additional member field:
- member field for the location of the end square
- member field that represents whether the end location
     should be empty for this action (boolean)
- optional member field that represents whether the piece
    on the end square should belong to the current team 
     (false should represent opponent's team)

- constructor with 6 parameters that
    - calls the super to set its three member fields 
    - sets the end location member field
    - sets the empty member field
    - sets whether the end location should hold current team's piece

6.2 Override the method validAction with no parameters and 
    returns a boolean representing whether the action is valid.

    For all actions that require an end piece in our game the following
    requirements must be met:
        - must first meet all of the ActionStart requirements (call your super's method)
        - the end location must be in bounds of the board      
        - the path between the start location and the end location must
            be a valid path for the piece on the START location (don't skip
            this requirement even though at this point in the development, we
            have made all paths for all pieces to be valid - see Piece class) 
        - some actions don't require a piece on the end location
           if the end location should be empty - this requirement must be met
        - some actions require a piece on the end location - if so this requirement
            must be met  along with the next requirement
        - the piece on the end square (if required) must belong to the current OR
        opponent's team as specified by this member field
              
    If any of these requirements are not met:
        - call the Game's setMessage and set the message the appropriate message:
            "End square out of bounds."
            "Invalid path for start piece."
            "End square should be empty."
            "No Piece on end square."
            "Piece on end square is not yours."
            "Piece on end square is yours."   

Note: You do not need to override the performAction method - why?

- This class will be tested when you created more subclasses.

*/

import { BoardLocation } from "../elements/Utilities";
import { GameS26 } from "../elements/GameS26";
import { Piece } from "../elements/Piece";
import { ActionType } from "../elements/Utilities";
import { ActionStart } from "./ActionStart";

/**
 * @description Abstract class representing any action that requires both a
 * start and an end square. Extends ActionStart with end location validation.
 * Subclasses configure whether the end square should be empty and whether
 * the piece on the end square should belong to the current or opponent team.
 * @abstract
 * @extends ActionStart
 */
export abstract class ActionStartEnd extends ActionStart {
    /** @description The board location the player selected as the end square */
    protected endSquare: BoardLocation;
 
    /** @description Whether the end square must be empty for this action */
    protected endShouldBeEmpty: boolean;
 
    /**
     * @description Whether the piece on the end square (if required) must
     * belong to the current team (true) or the opponent team (false)
     */
    protected shouldBelongToCurrent: boolean = true;
 
    /**
     * @description Creates an ActionStartEnd with all required location and
     * ownership parameters
     * @param game The GameS26 instance this action operates on
     * @param actionType The type of action being performed
     * @param startSquare The board location the player selected as the start
     * @param endSquare The board location the player selected as the end
     * @param endShouldBeEmpty Whether the end square must be empty
     * @param shouldBelongToCurrent Whether the end piece must belong to current team
     */
    constructor(
        game: GameS26,
        actionType: ActionType,
        startSquare: BoardLocation,
        endSquare: BoardLocation,
        endShouldBeEmpty: boolean,
        shouldBelongToCurrent: boolean,
    ) {
        super(game, actionType, startSquare);
        this.endSquare = endSquare;
        this.endShouldBeEmpty = endShouldBeEmpty;
        this.shouldBelongToCurrent = shouldBelongToCurrent;
    }
 
    /**
     * @description Validates all ActionStart requirements plus end square
     * requirements: end location must be in bounds, the path from start to
     * end must be valid for the start piece, and the end square must either
     * be empty or contain the correct team's piece depending on the action.
     * Sets the game message to an appropriate error string if invalid.
     * @returns true if all requirements are met, false otherwise
     */
    validAction(): boolean {
        if (!super.validAction()) return false;
 
        if (!this.game.getGameBoard().inBounds(this.endSquare)) {
            this.game.setMessage("End square out of bounds.");
            return false;
        }
 
        const startPiece: Piece | null = this.game
            .getGameBoard()
            .getSquare(this.startSquare)
            .getPiece();
        if (!startPiece?.validPath(this.startSquare, this.endSquare)) {
            this.game.setMessage("Invalid path for start piece.");
            return false;
        }
 
        if (
            this.endShouldBeEmpty &&
            this.game.getGameBoard().getSquare(this.endSquare).getPiece()
        ) {
            this.game.setMessage("End square should be empty.");
            return false;
        }
 
        const endPiece: Piece | null = this.game
            .getGameBoard()
            .getSquare(this.endSquare)
            .getPiece();
 
        if (this.endShouldBeEmpty && endPiece !== null) {
            this.game.setMessage("End square should be empty.");
            return false;
        }
 
        if (!this.endShouldBeEmpty && endPiece === null) {
            this.game.setMessage("No Piece on end square.");
            return false;
        }
 
        if (!this.endShouldBeEmpty && endPiece !== null) {
            const endPieceIsCurrent: boolean =
                endPiece.getTeamColor() ===
                this.game.getCurrentTeam().getTeamColor();
            if (this.shouldBelongToCurrent && !endPieceIsCurrent) {
                this.game.setMessage("Piece on end square is not yours.");
                return false;
            }
            if (!this.shouldBelongToCurrent && endPieceIsCurrent) {
                this.game.setMessage("Piece on end square is yours.");
                return false;
            }
        }
        return true;
    }
}