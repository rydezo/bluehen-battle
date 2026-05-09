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
import { ActionError } from "../ActionError";
import { PieceMedic } from "../elements/PieceMedic";

/**
 * @description NEW ACTION - Represents a heal action performed by a PieceMedic.
 * The Medic selects only its own start square. The action automatically finds
 * the first inactive teammate from the team's piece list and revives them to
 * a random empty square on the board. The Medic's heal count is incremented
 * and the turn changes after a successful heal.
 * @extends ActionStart
 */
export class ActionHeal extends ActionStart {
    /**
     * @description Creates an ActionHeal for the given game and start location
     * @param game The GameS26 instance this action operates on
     * @param startSquare The location of the Medic performing the heal
     */
    constructor(game: GameS26, startSquare: BoardLocation) {
        super(game, ActionType.Heal, startSquare);
    }
 
    /**
     * @description Validates all ActionStart requirements plus checks that the
     * board is not full and that there is at least one inactive teammate
     * (other than the Medic itself) to heal.
     * @returns true if the heal action is valid, false otherwise
     */
    validAction(): boolean {
        if (!super.validAction()) return false;
 
        if (this.game.getGameBoard().isBoardFull()) {
            this.game.setMessage("Board is full, cannot heal.");
            return false;
        }
 
        const inactivePiece: Piece | undefined = this.findFirstInactiveTeammate();
        if (!inactivePiece) {
            this.game.setMessage("No inactive teammates to heal.");
            return false;
        }
 
        return true;
    }
 
    /**
     * @description Finds the first inactive teammate, sets them to active,
     * places them on a random empty square, increments the Medic's heal count,
     * calls speak on the Medic, and changes the turn.
     * Throws ActionError if the action is not valid.
     * @returns true if the heal was performed successfully
     * @throws ActionError if validAction returns false
     */
    performAction(): boolean {
        if (!this.validAction()) {
            throw new ActionError(this.game.getMessage(), this.actionType);
        }
 
        const medic: Piece | null = this.game
            .getGameBoard()
            .getSquare(this.startSquare)
            .getPiece();
 
        const inactivePiece: Piece | undefined =
            this.findFirstInactiveTeammate();
 
        if (inactivePiece) {
            inactivePiece.setActive(true);
            const randomSquare = this.game
                .getGameBoard()
                .findRandomEmptySquare();
            randomSquare.setPiece(inactivePiece);
 
            if (medic instanceof PieceMedic) {
                medic.incrementHealCount();
            }
            medic?.speak();
            this.game.changeTurn();
            return true;
        }
        return false;
    }
 
    /**
     * @description Finds the first inactive piece on the current team that is
     * not the Medic itself (i.e. not on the start square)
     * @returns The first inactive teammate, or undefined if none exists
     */
    private findFirstInactiveTeammate(): Piece | undefined {
        const medic: Piece | null = this.game
            .getGameBoard()
            .getSquare(this.startSquare)
            .getPiece();
        return this.game
            .getCurrentTeam()
            .filterPieces(false)
            .find((p) => p !== medic);
    }
}