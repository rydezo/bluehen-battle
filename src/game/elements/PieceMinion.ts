/* Problem 5
PieceMinion - a Minion that can recruit opponents until it turns evil.
After MAX_RECRUITS recruits, it becomes an evil minion and can only
move and attack.

Test your PieceMinion with PieceMinion.test.ts
*/

import { Backpack } from "./Backpack";
import { Piece } from "./Piece";
import { ActionType, BoardLocation, MinionKind } from "./Utilities";

/**
 * @description Represents a Minion piece from Despicable Me. Starts as a
 * friendly (yellow) minion that can recruit opponents. After recruiting
 * MAX_RECRUITS times it turns evil (purple), loses recruit ability, and
 * gains attack. Can only move diagonally one square. Worth 1 point when defeated.
 * NEW OBJECTIVE - pointValue = 1
 * @extends Piece
 */
export class PieceMinion extends Piece {
    private typeMinion: MinionKind = MinionKind.Friendly;
    private numRecruits: number = 0;

    /** @description Number of recruits before this Minion turns evil */
    private readonly MAX_RECRUITS: number = 3;

    /**
     * @description Creates a PieceMinion. Adds Recruit to permanent abilities
     * and sets point value to 1.
     * @param symbol The symbol for this piece, defaults to "M"
     * @param teamColor The team color, defaults to "NON"
     * @param backpack The piece's backpack of abilities
     * @param active Whether the piece starts active
     */
    constructor(
        symbol: string = "M",
        teamColor: string = "NON",
        backpack: Backpack = new Backpack(),
        active: boolean = true,
    ) {
        super(symbol, teamColor, backpack, active);
        this.permAbilities.push(ActionType.Recruit);
        // NEW OBJECTIVE - Minion is worth 1 point
        this.pointValue = 1;
    }

    /**
     * @description Returns the number of recruits this Minion has made
     * @returns The recruit count
     */
    getNumRecruits(): number {
        return this.numRecruits;
    }

    /**
     * @description Returns whether this Minion is friendly or evil
     * @returns The MinionKind enum value
     */
    getKind(): MinionKind {
        return this.typeMinion;
    }

    /**
     * @description Increments the recruit count and checks if the Minion
     * should turn evil
     */
    increaseNumRecruits(): void {
        this.numRecruits += 1;
        this.updateKind();
    }

    /**
     * @description Checks if the recruit count has reached MAX_RECRUITS and
     * if so turns this Minion evil: changes kind, symbol, and permAbilities
     */
    private updateKind(): void {
        if (this.numRecruits >= this.MAX_RECRUITS) {
            this.typeMinion = MinionKind.Evil;
            this.symbol = "E";
            this.permAbilities = [ActionType.Move, ActionType.Attack];
        }
    }

    /**
     * @description Returns the Minion's catchphrase based on its current kind
     * @returns "Bello!" if friendly, "Grrr!" if evil
     */
    speak(): string {
        switch (this.typeMinion) {
            case MinionKind.Friendly:
                return "Bello!";
            case MinionKind.Evil:
                return "Grrr!";
        }
    }

    /**
     * @description Creates a spawned copy of this Minion matching its current
     * kind and recruit count, with original set to false
     * @returns A new PieceMinion instance
     */
    spawn(): PieceMinion {
        const newMinion: PieceMinion = new PieceMinion(
            this.symbol,
            this.teamColor,
            this.backpack.clone(),
            true,
        );
        newMinion.typeMinion = this.typeMinion;
        newMinion.original = false;
        newMinion.numRecruits = this.numRecruits;
        newMinion.numSpawns = 0;
        this.numSpawns += 1;
        this.updateKind();
        return newMinion;
    }

    /**
     * @description Overrides updateAction to handle Recruit and Attack specially.
     * Recruit increments the recruit count. Attack does nothing (Minions don't
     * track attack count). All other actions delegate to super.
     * @param action The ActionType that was performed
     */
    updateAction(action: ActionType): void {
        if (action === ActionType.Recruit) {
            this.increaseNumRecruits();
        } else if (action === ActionType.Attack) {
            return;
        } else {
            super.updateAction(action);
        }
    }

    /**
     * @description Validates the path for this Minion. Can only move exactly
     * one square diagonally (rowDiff === 1 and colDiff === 1).
     * @param startLocation The square the piece is moving from
     * @param endLocation The square the piece is moving to
     * @returns true if the path is a single diagonal step
     */
    validPath(
        startLocation: BoardLocation,
        endLocation: BoardLocation,
    ): boolean {
        if (!super.validPath(startLocation, endLocation)) return false;

        const rowDiff = Math.abs(endLocation.getRow() - startLocation.getRow());
        const colDiff = Math.abs(endLocation.getCol() - startLocation.getCol());

        return rowDiff === 1 && colDiff === 1;
    }
}