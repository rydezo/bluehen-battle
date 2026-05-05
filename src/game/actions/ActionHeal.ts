/*
ActionHeal represents an action the player can make where the
PieceMedic heals the first inactive teammate from the team's piece
list and places them on a random empty square on the board.

The Medic selects only its own start square - no end square needed.
The action finds the first inactive teammate automatically.

On a heal:
- The first inactive piece on the current team is found
- That piece is set to active
- It is placed on a random empty square on the board
- The Medic's heal count is incremented
- The Medic speaks
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

        // NEW ACTION - check there is room on the board for the revived piece
        if (this.game.getGameBoard().isBoardFull()) {
            this.game.setMessage("Board is full, cannot heal.");
            return false;
        }

        // NEW ACTION - check there is actually an inactive teammate to heal
        const inactivePiece: Piece | undefined = this.game
            .getCurrentTeam()
            .filterPieces(false)
            .find(
                (p) =>
                    p !==
                    this.game
                        .getGameBoard()
                        .getSquare(this.startSquare)
                        .getPiece(),
            );

        if (!inactivePiece) {
            this.game.setMessage("No inactive teammates to heal.");
            return false;
        }

        return true;
    }

    performAction(): boolean {
        if (!this.validAction()) {
            throw new ActionError(this.game.getMessage(), this.actionType);
        }

        // NEW ACTION - find the first inactive teammate
        // (excluding the medic itself which is on the start square)
        const medic: Piece | null = this.game
            .getGameBoard()
            .getSquare(this.startSquare)
            .getPiece();

        const inactivePiece: Piece | undefined = this.game
            .getCurrentTeam()
            .filterPieces(false)
            .find((p) => p !== medic);

        if (inactivePiece) {
            // NEW ACTION - revive the piece and place on random empty square
            inactivePiece.setActive(true);
            const randomSquare = this.game
                .getGameBoard()
                .findRandomEmptySquare();
            randomSquare.setPiece(inactivePiece);

            // NEW ACTION - increment heal count if medic, then speak
            if (medic instanceof PieceMedic) {
                medic.incrementHealCount();
            }
            medic?.speak();
            this.game.changeTurn();
            return true;
        }
        return false;
    }
}
