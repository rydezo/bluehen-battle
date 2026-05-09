/* Problem 6
PieceGhost - a Ghost that goes dormant on first attack instead of being
removed. Can be revived by ActionRevive.

Test your PieceGhost with PieceGhost.test.ts
*/

import { ActionType, BoardLocation } from "./Utilities";
import { Backpack } from "./Backpack";
import { Piece } from "./Piece";

/**
 * @description Represents a Ghost piece. Unlike other pieces, when a Ghost
 * is attacked for the first time it goes dormant instead of being removed.
 * A dormant Ghost stays on the board but can only use backpack abilities
 * until revived. Can only move 1 or 2 squares left or right.
 * Worth 2 points when fully defeated.
 * NEW OBJECTIVE - pointValue = 2
 * @extends Piece
 */
export class PieceGhost extends Piece {
    private dormant: boolean;

    /**
     * @description Creates a PieceGhost. Adds Attack to permanent abilities
     * and sets point value to 2.
     * @param symbol The symbol for this piece, defaults to "G"
     * @param teamColor The team color, defaults to "NON"
     * @param backpack The piece's backpack of abilities
     * @param active Whether the piece starts active
     * @param dormant Whether this Ghost starts dormant, defaults to false
     */
    constructor(
        symbol: string = "G",
        teamColor: string = "NON",
        backpack: Backpack = new Backpack(),
        active: boolean = true,
        dormant: boolean = false,
    ) {
        super(symbol, teamColor, backpack, active);
        this.dormant = dormant;
        this.permAbilities.push(ActionType.Attack);
        // NEW OBJECTIVE - Ghost is worth 2 points
        this.pointValue = 2;
    }

    /**
     * @description Updates the symbol to reflect the current dormant state.
     * Dormant originals use "D", dormant spawned use "d".
     * Active originals use "G", active spawned use "g".
     */
    changeSymbol(): void {
        if (this.dormant) {
            this.symbol = this.isOriginal() ? "D" : "d";
        } else {
            this.symbol = this.isOriginal() ? "G" : "g";
        }
    }

    /**
     * @description Returns whether this Ghost is currently dormant
     * @returns true if dormant, false if active
     */
    isDormant(): boolean {
        return this.dormant;
    }

    /**
     * @description Sets the dormant state and updates the symbol accordingly
     * @param field true to make dormant, false to revive
     */
    changeDormant(field: boolean): void {
        this.dormant = field;
        this.changeSymbol();
    }

    /**
     * @description Returns the Ghost's catchphrase
     * @returns "Boo!"
     */
    speak(): string {
        return "Boo!";
    }

    /**
     * @description Creates a spawned copy of this Ghost with a lowercase
     * symbol, matching dormant state, and original set to false
     * @returns A new PieceGhost instance
     */
    spawn(): PieceGhost {
        const newGhost: PieceGhost = new PieceGhost(
            this.symbol.toLowerCase(),
            this.teamColor,
            this.backpack.clone(),
            true,
            this.dormant,
        );
        newGhost.original = false;
        newGhost.numSpawns = 0;
        this.numSpawns += 1;
        return newGhost;
    }

    /**
     * @description Overrides allowableAction. A dormant Ghost can only use
     * abilities from its backpack — its permanent abilities are suspended
     * until it is revived.
     * @param action The ActionType to check
     * @returns true if the action is allowed in the current state
     */
    allowableAction(action: ActionType): boolean {
        if (this.dormant) {
            return this.backpack.hasUsableAbility(action);
        }
        return super.allowableAction(action);
    }

    /**
     * @description Validates the path for this Ghost. Can only move 1 or 2
     * squares left or right (same row, colDiff of 1 or 2, rowDiff of 0).
     * @param startLocation The square the piece is moving from
     * @param endLocation The square the piece is moving to
     * @returns true if the path is a 1 or 2 square horizontal move
     */
    validPath(
        startLocation: BoardLocation,
        endLocation: BoardLocation,
    ): boolean {
        if (!super.validPath(startLocation, endLocation)) return false;

        const rowDiff = Math.abs(endLocation.getRow() - startLocation.getRow());
        const colDiff = Math.abs(endLocation.getCol() - startLocation.getCol());

        return (colDiff === 1 || colDiff === 2) && rowDiff === 0;
    }
}