/* Problem 3 
Modify the abstract class named Piece class to include:
 
3.1 An abstract method named speak that has no parameters and returns a string
3.2 An abstract method named spawn that has no parameters and returns a Piece
3.3 A method named swapBackpack that has one Piece parameter and returns nothing.
3.4 A method named allowableAction that has one ActionType parameter and returns a boolean.
3.5 A method named updateAction that has one ActionType parameter and doesn't return anything.
*/

import { Backpack } from "./Backpack";
import { ActionType } from "./Utilities";
import { BoardLocation } from "./Utilities";

/**
 * @description Abstract base class for all game pieces. Defines the common
 * state and behavior shared by BlueHen, Minion, Ghost, and Medic pieces.
 * Each subclass must implement speak(), spawn(), and validPath().
 * @abstract
 */
export abstract class Piece {
    protected symbol: string;
    protected teamColor: string;
    /** @description Whether this piece was on the board at game start */
    protected original: boolean = true;
    protected numSpawns: number = 0;
    protected backpack: Backpack;
    /** @description Whether this piece is currently in play */
    protected active: boolean = true;

    /**
     * @description Permanent abilities this piece always has regardless of backpack.
     * All pieces can move by default.
     */
    protected permAbilities: ActionType[] = [ActionType.Move];

    // NEW ABILITY OPTION - whether this piece is protected by a shield
    protected shielded: boolean = false;

    // NEW OBJECTIVE - each piece has a point value representing
    // how many points the opposing team earns when this piece is defeated
    protected pointValue: number = 1;

    /**
     * @description Creates a Piece with the given symbol, team, backpack, and
     * active status. The backpack is deep-cloned on construction.
     * @param symbol The character symbol representing this piece on the board
     * @param teamColor The color of the team this piece belongs to
     * @param backpack The backpack of abilities this piece carries
     * @param active Whether this piece starts in play
     */
    constructor(
        symbol: string = "X",
        teamColor: string = "NON",
        backpack: Backpack = new Backpack(),
        active: boolean = true,
    ) {
        this.symbol = symbol;
        this.teamColor = teamColor;
        this.backpack = backpack.clone();
        this.active = active;
    }

    /**
     * @description Returns the symbol character for this piece
     * @returns The piece's symbol string
     */
    getSymbol(): string {
        return this.symbol;
    }

    /**
     * @description Returns the team color this piece belongs to
     * @returns The team color string
     */
    getTeamColor(): string {
        return this.teamColor;
    }

    /**
     * @description Returns this piece's backpack of abilities
     * @returns The Backpack instance
     */
    getBackpack(): Backpack {
        return this.backpack;
    }

    /**
     * @description Returns whether this piece is currently active (in play)
     * @returns true if active, false if inactive
     */
    isActive(): boolean {
        return this.active;
    }

    /**
     * @description Returns whether this piece was placed on the board at
     * the start of the game (as opposed to being spawned mid-game)
     * @returns true if original, false if spawned
     */
    isOriginal(): boolean {
        return this.original;
    }

    /**
     * @description Sets the team color of this piece
     * @param teamColor The new team color string
     */
    setTeamColor(teamColor: string): void {
        this.teamColor = teamColor;
    }

    /**
     * @description Sets whether this piece is active or inactive
     * @param active true to activate, false to deactivate
     */
    setActive(active: boolean): void {
        this.active = active;
    }

    // NEW ABILITY OPTION
    /**
     * @description Returns whether this piece is currently shielded.
     * A shielded piece blocks the next attack against it.
     * @returns true if shielded, false otherwise
     */
    isShielded(): boolean {
        return this.shielded;
    }

    /**
     * @description Sets the shielded state of this piece
     * @param shielded true to apply a shield, false to remove it
     */
    setShielded(shielded: boolean): void {
        this.shielded = shielded;
    }

    // NEW OBJECTIVE
    /**
     * @description Returns the number of points awarded to the opposing team
     * when this piece is defeated
     * @returns The point value of this piece
     */
    getPointValue(): number {
        return this.pointValue;
    }

    /**
     * @description Returns whether the path from startLocation to endLocation
     * is valid for this piece type. By default all paths are valid as long as
     * start and end are different squares. Subclasses override this to enforce
     * movement restrictions.
     * @param startLocation The square the piece is moving from
     * @param endLocation The square the piece is moving to
     * @returns true if the path is valid, false otherwise
     */
    validPath(
        startLocation: BoardLocation,
        endLocation: BoardLocation,
    ): boolean {
        if (startLocation === endLocation) return false;
        return true;
    }

    /**
     * @description Returns a short string of the form "teamColor symbol"
     * using the first 3 characters of the team color
     * @returns Formatted piece string e.g. "red H"
     */
    toString(): string {
        return this.teamColor.slice(0, 3) + " " + this.symbol;
    }

    /**
     * @description Returns the piece string followed by the backpack contents
     * @returns Formatted string including backpack abilities
     */
    toStringwithBackPack(): string {
        return this.toString() + "\t" + this.backpack.toString();
    }

    /**
     * @description Returns a string that this piece says when it acts.
     * Each subclass provides its own catchphrase.
     * @returns The piece's spoken string
     */
    abstract speak(): string;

    /**
     * @description Creates and returns a copy of this piece.
     * Each subclass defines its own spawn behavior.
     * @returns A new Piece instance copied from this one
     */
    abstract spawn(): Piece;

    /**
     * @description Swaps this piece's backpack with another piece's backpack
     * @param otherPiece The other Piece to swap backpacks with
     */
    swapBackpack(otherPiece: Piece): void {
        [this.backpack, otherPiece.backpack] = [
            otherPiece.backpack,
            this.backpack,
        ];
    }

    /**
     * @description Returns whether this piece is allowed to perform the given
     * action. An action is allowed if it is in the piece's permanent abilities
     * OR if the backpack contains an available instance of that ability.
     * @param action The ActionType to check
     * @returns true if the action is allowed, false otherwise
     */
    allowableAction(action: ActionType): boolean {
        if (
            this.permAbilities.includes(action) ||
            this.backpack.hasUsableAbility(action)
        ) {
            return true;
        }
        return false;
    }

    /**
     * @description Marks the first available instance of the given ability
     * in the backpack as expired (used). Called after a piece uses a backpack
     * ability so it cannot be used again until renewed.
     * @param action The ActionType to expire in the backpack
     */
    updateAction(action: ActionType): void {
        this.backpack.changeAvailable(action, false);
    }
}