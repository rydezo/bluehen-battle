/* Problem 4

4.1 Create a subclass of Piece named PieceBlueHen.
4.2 MAX_ATTACKS constant = 2
4.3 Constructor — adds Attack to permAbilities
4.4 getNumAttacks accessor
4.5 increaseNumAttacks mutator
4.6 updateFly private method
4.7 speak returns 'Go UD!'
4.8 spawn returns a copy of this BlueHen
4.9 Override updateAction to call increaseNumAttacks on Attack

Test your PieceBlueHen with PieceBlueHen.test.ts
*/

import { ActionType, BoardLocation } from "./Utilities";
import { Backpack } from "./Backpack";
import { Piece } from "./Piece";

/**
 * @description Represents the UD Blue Hen mascot piece. The BlueHen can
 * attack and move, and starts with the ability to fly anywhere on the board.
 * After exceeding MAX_ATTACKS, it loses its flying ability and can only move
 * one square up or down. Worth 3 points when defeated.
 * NEW OBJECTIVE - pointValue = 3
 * @extends Piece
 */
export class PieceBlueHen extends Piece {
    private numAttacks: number = 0;
    private canFly: boolean = true;

    /** @description Maximum attacks before the BlueHen loses flying ability */
    private readonly MAX_ATTACKS: number = 2;

    /**
     * @description Creates a PieceBlueHen. Adds Attack to permanent abilities
     * and sets point value to 3.
     * @param symbol The symbol for this piece, defaults to "H"
     * @param teamColor The team color, defaults to "NON"
     * @param backpack The piece's backpack of abilities
     * @param active Whether the piece starts active
     */
    constructor(
        symbol: string = "H",
        teamColor: string = "NON",
        backpack: Backpack = new Backpack(),
        active: boolean = true,
    ) {
        super(symbol, teamColor, backpack, active);
        this.permAbilities.push(ActionType.Attack);
        // NEW OBJECTIVE - BlueHen is worth 3 points
        this.pointValue = 3;
    }

    /**
     * @description Returns the number of attacks this BlueHen has made
     * @returns The attack count
     */
    getNumAttacks(): number {
        return this.numAttacks;
    }

    /**
     * @description Increments the attack count and updates fly ability
     */
    private increaseNumAttacks(): void {
        this.numAttacks += 1;
        this.updateFly();
    }

    /**
     * @description Updates the canFly field based on numAttacks.
     * If numAttacks exceeds MAX_ATTACKS, the BlueHen can no longer fly.
     */
    private updateFly(): void {
        this.canFly = this.numAttacks <= this.MAX_ATTACKS;
    }

    /**
     * @description Returns the BlueHen's catchphrase
     * @returns "Go UD!"
     */
    speak(): string {
        return "Go UD!";
    }

    /**
     * @description Creates a spawned copy of this BlueHen with a lowercase
     * symbol, matching team and attack count, and original set to false
     * @returns A new PieceBlueHen instance
     */
    spawn(): PieceBlueHen {
        const newHen: PieceBlueHen = new PieceBlueHen(
            this.symbol.toLowerCase(),
            this.teamColor,
            this.backpack.clone(),
            true,
        );
        newHen.original = false;
        newHen.numAttacks = this.numAttacks;
        newHen.numSpawns = 0;
        this.numSpawns += 1;
        this.updateFly();
        return newHen;
    }

    /**
     * @description Overrides updateAction to increment attack count when
     * the action is an Attack. Delegates to super for all other actions.
     * @param action The ActionType that was performed
     */
    updateAction(action: ActionType): void {
        if (action === ActionType.Attack) {
            this.increaseNumAttacks();
        } else {
            super.updateAction(action);
        }
    }

    /**
     * @description Validates the path from start to end for this BlueHen.
     * If canFly is true, any distinct square is valid. If canFly is false,
     * only one square up or down (same column) is valid.
     * @param startLocation The square the piece is moving from
     * @param endLocation The square the piece is moving to
     * @returns true if the path is valid for this BlueHen
     */
    validPath(
        startLocation: BoardLocation,
        endLocation: BoardLocation,
    ): boolean {
        if (!super.validPath(startLocation, endLocation)) return false;

        const rowDiff = Math.abs(endLocation.getRow() - startLocation.getRow());
        const colDiff = Math.abs(endLocation.getCol() - startLocation.getCol());

        if (this.canFly) {
            return !(rowDiff === 0 && colDiff === 0);
        }
        // can't fly - one square up or down, same column
        return rowDiff === 1 && colDiff === 0;
    }
}