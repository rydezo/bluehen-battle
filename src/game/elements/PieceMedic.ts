/*
NEW PIECE - PieceMedic represents a support piece that can heal inactive
pieces on its own team. It can move and heal but cannot attack.

New member field: healCount tracks how many heals the Medic has performed.
    The Medic can only heal a limited number of times (MAX_HEALS = 3).
New member method: getHealCount returns the current heal count.
New member method: incrementHealCount increments the count and removes Heal
    from permAbilities once the max is reached.
Logic change: once MAX_HEALS is reached, Heal is removed from permAbilities
    so allowableAction returns false for Heal, blocking further heals through
    the existing validation system without needing any changes to ActionHeal.
validPath: can only move one square up, down, left, or right (no diagonals).
Worth 2 points when defeated.
*/

import { Backpack } from "./Backpack";
import { Piece } from "./Piece";
import { ActionType, BoardLocation } from "./Utilities";

/**
 * @description NEW PIECE - A support piece that can revive inactive teammates.
 * The Medic can move and heal but cannot attack. After healing MAX_HEALS times,
 * the Heal ability is permanently removed from its permAbilities. Can only move
 * one square orthogonally (no diagonals). Worth 2 points when defeated.
 * @extends Piece
 */
export class PieceMedic extends Piece {
    // NEW PIECE
    /** @description Maximum number of heals this Medic can perform */
    private readonly MAX_HEALS: number = 3;

    /** @description Number of heals this Medic has performed so far */
    private healCount: number = 0;

    /** @description Medic can move and heal but not attack */
    protected permAbilities: ActionType[] = [ActionType.Move, ActionType.Heal];

    /**
     * @description Creates a PieceMedic. Sets point value to 2.
     * @param symbol The symbol for this piece, defaults to "Md"
     * @param teamColor The team color, defaults to "NON"
     * @param backpack The piece's backpack of abilities
     * @param active Whether the piece starts active
     */
    constructor(
        symbol: string = "Md",
        teamColor: string = "NON",
        backpack: Backpack = new Backpack(),
        active: boolean = true,
    ) {
        super(symbol, teamColor, backpack, active);
        // NEW OBJECTIVE - Medic is worth 2 points
        this.pointValue = 2;
    }

    // NEW PIECE - returns how many heals this Medic has performed
    /**
     * @description Returns the number of heals this Medic has performed
     * @returns The heal count
     */
    getHealCount(): number {
        return this.healCount;
    }

    // NEW PIECE - increments heal count and removes Heal from permAbilities
    // once the max number of heals has been reached
    /**
     * @description Increments the heal count. If MAX_HEALS is reached,
     * removes Heal from permAbilities so no further heals are possible.
     */
    incrementHealCount(): void {
        this.healCount++;
        if (this.healCount >= this.MAX_HEALS) {
            this.permAbilities = this.permAbilities.filter(
                (ability) => ability !== ActionType.Heal,
            );
        }
    }

    /**
     * @description Returns the Medic's message including remaining heal count
     * @returns A string indicating how many heals remain
     */
    speak(): string {
        return `The medic is here! Heals remaining: ${this.MAX_HEALS - this.healCount}`;
    }

    /**
     * @description Creates a spawned copy of this Medic with the same symbol
     * and team color
     * @returns A new PieceMedic instance
     */
    spawn(): PieceMedic {
        return new PieceMedic(this.symbol, this.teamColor, this.backpack);
    }

    /**
     * @description Validates the path for this Medic. Can only move one square
     * orthogonally — up, down, left, or right. No diagonal movement allowed.
     * @param startLocation The square the piece is moving from
     * @param endLocation The square the piece is moving to
     * @returns true if the path is a single orthogonal step
     */
    validPath(
        startLocation: BoardLocation,
        endLocation: BoardLocation,
    ): boolean {
        if (!super.validPath(startLocation, endLocation)) return false;

        const rowDiff = Math.abs(endLocation.getRow() - startLocation.getRow());
        const colDiff = Math.abs(endLocation.getCol() - startLocation.getCol());

        return (
            (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)
        );
    }
}