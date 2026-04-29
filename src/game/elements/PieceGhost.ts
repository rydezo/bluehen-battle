/* Problem 6

6.1 Create a subclass of Piece named PieceGhost that will represent a Ghost.
This class will inherit members from Piece and additionally include:

- boolean member field to represent whether the Piece is dormant

This field should be added to the constructor parameters, default should 
be set to false.
If a ghost is dormant, it's symbol changes to 'D' (or lowercase 'd' if 
its a spawned piece
and it can't move or attack until it is revived. The ghost can take other
actions from it's backpack.

6.2 A constructor with only the parameters required by the superclass 
     - calls the super class' constructor (symbol should be set to 'G' by default)
     - adds the ActionType - Attack to its permanent abilities

6.3 An accessor method:
    - isDormant that returns whether the Piece is dormant

6.4 A private mutator:
    – changeDormant with one boolean parameter 
    This method changes the dormant field. If the Ghost is changed
    to dormant, its symbol changed to 'D' or 'd'. If the Ghost is changed
    to not dormant, its symbol changes back to 'G' or 'g'.
    
6.5 An implementation for the method named speak that has no parameters
and returns the string 'Boo!'

6.6  Implement the method spawn which will return a copy
of the Ghost piece (type PieceGhost) with the following properties:
- symbol - should be the lowercase value of spawning object's symbol
- teamColor - should match values of spawning object
- original - should be set to false
- numSpawns - should be set to 0
- dormant - should match the spawning object's dormant field
- the object doing the spawning should have its number of spawns increased by 1
Note: some of these fields can be set using default values - others cannot

6.7 Override the allowableActions method. If the Ghost is dormant,
it can only take actions that are available in its backpack. If it is not
dormant it can take actions as defined in the Piece class' allowable actions
method.
------------------------------------------------------

Test your PieceGhost with PieceGhost.test.ts
*/

import { ActionType } from "./Utilities";
import { Backpack } from "./Backpack";
import { Piece } from "./Piece";

export class PieceGhost extends Piece {
    private dormant: boolean;

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
    }

    changeSymbol(): void {
        if (this.dormant) {
            if (this.isOriginal()) {
                this.symbol = "D";
            } else {
                this.symbol = "d";
            }
        } else {
            if (this.isOriginal()) {
                this.symbol = "G";
            } else {
                this.symbol = "g";
            }
        }
    }

    isDormant(): boolean {
        return this.dormant;
    }
    changeDormant(field: boolean): void {
        this.dormant = field;
        this.changeSymbol();
    }

    speak(): string {
        return "Boo!";
    }

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

    allowableAction(action: ActionType): boolean {
        if (this.dormant) {
            return this.backpack.hasUsableAbility(action);
        }
        return super.allowableAction(action);
    }
}
