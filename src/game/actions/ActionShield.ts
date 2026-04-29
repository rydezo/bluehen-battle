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

export class ActionShield extends ActionStartEnd {
    constructor(
        game: GameS26,
        startSquare: BoardLocation,
        endSquare: BoardLocation,
    ) {
        // end square must have a piece, belonging to current team
        super(game, ActionType.Shield, startSquare, endSquare, false, true);
    }

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