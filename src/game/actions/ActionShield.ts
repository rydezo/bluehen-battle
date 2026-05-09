/*
When Shield is used, the target teammate gets a shielded boolean property 
set to true. The performAction method checks this flag before allowing 
an attack. If the target is shielded, the attack is blocked. After the 
shielded team takes their next turn, the shield expires.

To be valid:
- The end square must have a piece on it.
- The end piece must belong to the current team.
- The end piece must not already be shielded.
*/

import { GameS26 } from "../elements/GameS26";
import { ActionType } from "../elements/Utilities";
import { BoardLocation } from "../elements/Utilities";
import { Piece } from "../elements/Piece";
import { ActionStartEnd } from "./ActionStartEnd";
import { ActionError } from "../ActionError";

/**
 * @description NEW ABILITY ACTION - Represents a shield action where the start
 * piece shields a teammate on the end square. The shielded piece will block
 * the next attack against it, consuming the shield in the process. A piece
 * cannot be shielded if it is already shielded.
 * @extends ActionStartEnd
 */
export class ActionShield extends ActionStartEnd {
    /**
     * @description Creates an ActionShield for the given game and locations.
     * The end square must contain a piece belonging to the current team.
     * @param game The GameS26 instance this action operates on
     * @param startSquare The location of the piece performing the shield
     * @param endSquare The location of the teammate to be shielded
     */
    constructor(
        game: GameS26,
        startSquare: BoardLocation,
        endSquare: BoardLocation,
    ) {
        super(game, ActionType.Shield, startSquare, endSquare, false, true);
    }
 
    /**
     * @description Validates all ActionStartEnd requirements plus checks that
     * the end piece is not already shielded.
     * @returns true if the shield action is valid, false otherwise
     */
    validAction(): boolean {
        if (!super.validAction()) return false;
 
        const endPiece: Piece | null = this.game
            .getGameBoard()
            .getSquare(this.endSquare)
            .getPiece();
        if (endPiece && endPiece.isShielded()) {
            this.game.setMessage("Piece on end square is already shielded.");
            return false;
        }
        return true;
    }
 
    /**
     * @description Sets the end piece's shielded flag to true, updates the
     * start piece's action, calls speak on the start piece, and changes the
     * turn. Throws ActionError if the action is not valid.
     * @returns true if the shield was applied successfully
     * @throws ActionError if validAction returns false
     */
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
            endPiece.setShielded(true);
            startPiece.updateAction(this.actionType);
            startPiece.speak();
            this.game.changeTurn();
            return true;
        }
        return false;
    }
}