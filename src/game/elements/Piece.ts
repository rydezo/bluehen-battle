/* Problem 3 
Modify the abstract class named Piece class to include:
 
3.1 An abstract method named speak that has no parameters and returns
a string

3.2 An abstract method named spawn that has no parameters and returns
a Piece

3.3 A method named swapBackpack that has one Piece
parameter and returns nothing. This method swaps the backpack
of this Piece with the other Piece.

3.4 A method named allowableAction that has one ActionType parameter representing
the type of action the Piece can make and returns a boolean.
The method will check if this piece can make the action by checking if
the action is listed in it's permanent abilities member field OR if
the action is in the piece's backpace and is available. 
HINT: to check this last requirement you should use the 
hasUsableAbility method you created in the backpack!

3.5 A method named updateAction that has one ActionType parameter
representing an action and doesn't return anything. This 
method calls the backpack's setAvailable method to set the
available field for this ability action to false. (This method
will be called by our Action classes every time a piece uses
one of it's abilities from its backpack)

*/

import { Backpack } from "./Backpack";
import { ActionType } from "./Utilities";
import { BoardLocation } from "./Utilities";

export abstract class Piece {
    protected symbol: string;
    protected teamColor: string;
    protected original: boolean = true; // whether the piece is original or spawned
    protected numSpawns: number = 0;
    protected backpack: Backpack;
    protected active: boolean = true; // whether the piece is in play

    /*Each Piece has some permanent abilities that they keep throughout
    the entire game. 
    These are kept in this array permAbilities. All Pieces can Move.
    */
    protected permAbilities: ActionType[] = [ActionType.Move];
    protected shielded: boolean = false;

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

    getSymbol(): string {
        return this.symbol;
    }

    getTeamColor(): string {
        return this.teamColor;
    }

    getBackpack(): Backpack {
        return this.backpack;
    }

    isActive(): boolean {
        return this.active;
    }

    isOriginal(): boolean {
        return this.original;
    }

    setTeamColor(teamColor: string): void {
        this.teamColor = teamColor;
    }

    setActive(active: boolean): void {
        this.active = active;
    }

    // NEW ABILITY OPTION
    isShielded(): boolean {
        return this.shielded;
    }
    setShielded(shielded: boolean): void {
        this.shielded = shielded;
    }

    /* For development purposes - all pieces
    can move anywhere on board except from start
    location to start location. So all other paths
    will be considered valid. 
    After game is developed, we will
    add the logic for limiting paths each
    piece can take and override this method
    in each subclass
    */
    validPath(
        startLocation: BoardLocation,
        endLocation: BoardLocation,
    ): boolean {
        if (startLocation === endLocation) {
            return false;
        }
        return true;
    }

    toString(): string {
        return this.teamColor.slice(0, 3) + " " + this.symbol;
    }

    toStringwithBackPack(): string {
        // change to include backpack abilities
        return this.toString() + "\t" + this.backpack.toString();
    }
    // Add your methods
    abstract speak(): string;
    abstract spawn(): Piece;

    swapBackpack(otherPiece: Piece): void {
        [this.backpack, otherPiece.backpack] = [
            otherPiece.backpack,
            this.backpack,
        ];
    }

    allowableAction(action: ActionType): boolean {
        if (
            this.permAbilities.includes(action) ||
            this.backpack.hasUsableAbility(action)
        ) {
            return true;
        }
        return false;
    }

    updateAction(action: ActionType): void {
        this.backpack.changeAvailable(action, false);
    }
}