/*
ActionHeal represents an action the player can make where the start piece
can heal itself by setting itself back to active. The start square must have 
an inactive piece belonging to the current team (because otherwise there's 
nothing to heal).

On a heal:
- The piece on the start square is set to active
- The piece speaks
- The turn is changed to the other player
*/

import { GameS26 } from "../elements/GameS26";
import { ActionType } from "../elements/Utilities";
import { BoardLocation } from "../elements/Utilities";
import { Piece } from "../elements/Piece";
import { ActionStart } from "./ActionStart";
// import { PieceBlueHen } from "../elements/PieceBlueHen";
import { ActionError } from "../ActionError";
import { PieceMedic } from "../elements/PieceMedic";


export class ActionHeal extends ActionStart {
    constructor(game: GameS26, startSquare: BoardLocation) {
        super(game, ActionType.Heal, startSquare);
    }

    validAction(): boolean {
        if (!super.validAction()) return false;

        const piece: Piece | null = this.game
            .getGameBoard()
            .getSquare(this.startSquare)
            .getPiece();
        if (piece && piece.isActive()) {
            this.game.setMessage("Piece on start square is already active.");
            return false;
        }
        return true;
    }

    performAction(): boolean {
        if (!this.validAction()) {
            throw new ActionError(this.game.getMessage(), this.actionType);
        }

        const piece: Piece | null = this.game
            .getGameBoard()
            .getSquare(this.startSquare)
            .getPiece();

        if (piece) {
            piece.setActive(true);
            // NEW ACTION - if the healing piece is a PieceMedic,
            // increment its heal count which may remove Heal from permAbilities
            if (piece instanceof PieceMedic) {
                piece.incrementHealCount();
            }
            piece.speak();
            this.game.changeTurn();
            return true;
        }
        return false;
    }
}