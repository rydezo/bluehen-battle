/* Problem 4

4.1 Create a subclass of Piece named PieceBlueHen that will represent the 
main UD's Blue Hen Mascot. 
NOTE: This class is slightly different from the one we developed during lecture.
This class will inherit members from Piece and additionally include:

- member field to represent the number of attacks its made - default set to 0
- member field to represent whether it can fly - default set to true
Neither of these fields should be added to the constructor parameters

4.2 A private constant member named MAX_ATTACKS to represent
the maximum number of attacks this BlueHen can make before it loses 
its ability to fly anywhere on the game board. Set this value to 2

4.3 A constructor with only the parameters required by the superclass 
    (Do not add more parameters to this constructor)
     - call the super class' constructor (symbol should be set to 'H' by default)
     - add the ActionType - Attack to its permanent abilities
     BlueHen pieces will always be able to attack

4.4 An accessor method:
    - getNumAttacks

4.5 A private mutator:
    – increaseNumAttacks - increments number of attacks by 1  
    
4.6 A PRIVATE method named updateFly that has no
parameters and no return values. This is the only
method that can modify (mutate) the member field 'flies'
It is private and should be called everytime the
number of attacks is increased. This method will
check the number of current attacks and if it exceeds
the MAX_ATTACKS, it cannot fly. Otherwise, it can fly.
NOTE: After you create this method - call it from 
inside of increaseNumAttacks.

4.7 An implementation for the method named speak that has no parameters
and returns the string 'Go UD!'

4.8  Implement the method spawn which will return a copy
of the BlueHen piece  (type PieceBlueHen) with the following properties:
- symbol - should be the lowercase value of spawning object's symbol
- teamColor - should match value of spawning object
- backpack - should be a clone of the spawning object's backpack
- original - should be set to false (spawned pieces were not at the start of game)
- active - should be set to true
- numAttacks - should be set to match the spawning objects numAttacks
- numSpawns - should be set to 0
- flies should be set by the constructor
The object doing the spawning should have its number of spawns increased by 1
Note: some of these fields can be set using default values - others cannot

4.9 An override for the updateAction method that:
calls increaseNumAttacks if the ActionType is Attack
and calls the super's updateAction otherwise

Test your PieceBlueHen with PieceBlueHen.test.ts
*/

import { ActionType, BoardLocation } from "./Utilities";
import { Backpack } from "./Backpack";
import { Piece } from "./Piece";

export class PieceBlueHen extends Piece {
    private numAttacks: number = 0;
    private canFly: boolean = true;
    private readonly MAX_ATTACKS: number = 2;

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

    getNumAttacks(): number {
        return this.numAttacks;
    }

    /**
     * @description Returns whether this BlueHen can currently fly anywhere
     * on the board. Becomes false after exceeding MAX_ATTACKS.
     * @returns true if the BlueHen can fly, false if movement is restricted
     */
    getCanFly(): boolean {
        return this.canFly;
    }

    private increaseNumAttacks(): void {
        this.numAttacks += 1;
        this.updateFly();
    }

    private updateFly(): void {
        if (this.numAttacks > this.MAX_ATTACKS) {
            this.canFly = false;
        } else {
            this.canFly = true;
        }
    }

    speak(): string {
        return "Go UD!";
    }

    spawn(): PieceBlueHen {
        let newHen: PieceBlueHen = new PieceBlueHen(
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

    updateAction(action: ActionType): void {
        if (action === "Attack") {
            this.increaseNumAttacks();
        } else {
            super.updateAction(action);
        }
    }

    validPath(
        startLocation: BoardLocation,
        endLocation: BoardLocation,
    ): boolean {
        if (!super.validPath(startLocation, endLocation)) return false;

        const rowDiff = Math.abs(endLocation.getRow() - startLocation.getRow());
        const colDiff = Math.abs(endLocation.getCol() - startLocation.getCol());

        if (this.canFly) {
            // ensure spaces are distinct
            return !(rowDiff === 0 && colDiff === 0);
        }
        // one square up/down same column
        return rowDiff === 1 && colDiff === 0;
    }
}