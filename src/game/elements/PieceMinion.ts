/* Problem 5
5.1 Create a subclass of Piece named PieceMinion that will represent a 
minion character from the Despicable Me movie. The Minion Piece will turn
into an evil minion once it has recruited the MAX_RECRUITS from the other team.
This class will inherit members from Piece and additionally include:

- member field to represent the kind of minion it is - use an enumerated type
MinionType from Utilities. The minion will either be friendly (yellow) minion
    or evil (purple) minion - default value friendly
- member field to represent the number of recruits its made - default set to 0

Only the kind field should be added to the constructor parameters.

5.2 A private constant member named MAX_RECRUITS to represent
the number of recruits this minion can make before it turns into 
an evil minion. (When it turns into an evil minion - it attacks instead of recruits)
Set this value to 3

5.3 A constructor with the parameters required by the superclass and the kind field 
     - calls the super class' constructor (symbol should be set to 'M' by default)
     - adds the ActionType - Recruit to its permanent abilities
     - kind is set the kind MinionType.Friendly

5.3 Accessor methodd:
    - getNumRecruits, getKind

5.4 A mutator:
    – increaseNumRecruits - increments number of recruits by 1 
   
5.5 A PRIVATE method named updateKind that has no
parameters and no return values. This is the only
method that can modify (mutate) the member field 'kind'.
It is private and should be called everytime the
number of recruits is increased. This method will
check the number of current recruits and if it REACHES
the MAX_RECRUITS:
    - it will change the kind to EVIL
    - its symbol will change to 'E'
    - it can only permanently move and attack now
NOTE: After you create this method - call it from 
inside of increaseRecruits.
     
    
5.6 An implementation for the method named speak that has no parameters
and returns the string 'Bello!' if they are a friendly minion and 'Grrr!'
if they are evil.

5.7 An implementation for method named spawn which will return a copy
of the Minion piece (type PieceMinion) with the following properties:
- symbol - should be the SAME as value of spawning object's symbol
- teamColor - should match values of spawning object
- backpack - should be a clone of the spawning object's backpack
- original - should be set to false
- active - should be set to true
- kind - should match the spawning object's kind
- numRecruits - should be set to the spawning object's numRecruits
- numSpawns - should be set to 0
The object doing the spawning should have its number of spawns increased by 1

Note: some of these fields can be set using default values - others cannot

5.8 An override for the updateAction method that:
calls increaseNumRecruits if the ActionType is Recruit,
does nothing if the ActionType is Attack and 
and calls the super's updateAction otherwise

Test your PieceMinion with PieceMinion.test.ts
*/

import { Backpack } from "./Backpack";
import { Piece } from "./Piece";
import { ActionType, BoardLocation, MinionKind } from "./Utilities";

export class PieceMinion extends Piece {
    private typeMinion: MinionKind = MinionKind.Friendly;
    private numRecruits: number = 0;
    private readonly MAX_RECRUITS: number = 3;

    constructor(
        symbol: string = "M",
        teamColor: string = "NON",
        backpack: Backpack = new Backpack(),
        active: boolean = true) {
            super(symbol, teamColor, backpack, active);
            this.permAbilities.push(ActionType.Recruit);

            // NEW OBJECTIVE - Minion is worth 1 point
            this.pointValue = 1;
        }

    getNumRecruits(): number {
        return this.numRecruits;
    }
    getKind(): MinionKind {
        return this.typeMinion;
    }

    increaseNumRecruits(): void {
        this.numRecruits += 1;
        this.updateKind();
    }

    private updateKind(): void {
        if (this.numRecruits >= this.MAX_RECRUITS) {
            this.typeMinion = MinionKind.Evil;
            this.symbol = "E";
            this.permAbilities = [ActionType.Move, ActionType.Attack];
        }
    }

    speak(): string {
        switch (this.typeMinion) {
            case MinionKind.Friendly:
                return "Bello!";
            case MinionKind.Evil:
                return "Grrr!";
        }
    }

    spawn(): PieceMinion {
        const newMinion: PieceMinion = new PieceMinion(this.symbol,this.teamColor,this.backpack.clone(),true);
        newMinion.typeMinion = this.typeMinion;
        newMinion.original = false;
        newMinion.numRecruits = this.numRecruits;
        newMinion.numSpawns = 0;
        this.numSpawns += 1;
        this.updateKind();
        return newMinion;
    }

    updateAction(action: ActionType) {
        if (action === ActionType.Recruit) {
            this.increaseNumRecruits();
        } else if (action === ActionType.Attack) {
            return;
        } else {
            super.updateAction(action);
        }
    }

    validPath(startLocation: BoardLocation, endLocation: BoardLocation): boolean {
        if (!super.validPath(startLocation, endLocation)) return false;

        const rowDiff = Math.abs(endLocation.getRow() - startLocation.getRow());
        const colDiff = Math.abs(endLocation.getCol() - startLocation.getCol());

        return rowDiff === 1 && colDiff === 1;
    }
}
