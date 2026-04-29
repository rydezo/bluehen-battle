/* Problem 2 
Define a class named Backpack that has:

2.1 One member field: 
 - an array of Abilities set to an empty array by default
 - a constructor with one parameter that sets this property
  
2.2 A getter for the member field
    getAbilities

2.3 One setter for the member field
    setAbilities

2.4 A method named renew that has no parameters and 
sets all the ability available fields to true.

2.5 A method named hasUsableAbility that has one
parameter of type ActionType that represents the description of
an ability. This method returns a boolean representing
whether the backpack has this ability AND it is
available.

2.6 A method named changeAvailable that has two parameters: 
  - an ActionType representing the description of the ability
  - a boolean representing whether the ability should be changed to available
This method will find the FIRST instance in the backpack that has
a matching description where the available field does not match the boolean past 
this method. If found - the method updates the available field. This method has
 no return value

Example 1:   changeAvailable(ActionType.Spawn, true)
           would update this backpack's abilities from:
           " Spawn:available"
           " Spawn:expired "

           to:
           " Spawn:available "
           " Spawn:available "

Example 2:   changeAvailable(ActionType.Spawn, false)
           would update this backpack's abilities from:
           " Spawn:expired"
           " Spawn:available"

           to:
           " Spawn:expired"
           " Spawn:expired"


2.7 A method named emptyBackpack that has no parameters and
doesn't return anything. This method empties the 
abilities array.

2.8 A clone method for this class that returns a deep copy of this object.

2.9 A toString method that has no parameters and returns the toString value
of each ability in the backpack inside of square brackets. Example:

    [ Spawn:expired Revive:available Renew:expired ]

** Only for Honors
2.10 An equals method that has one Backpack parameter and returns a boolean. This
method compares the abilities in the backpack. 
Two instances of a Backpack will be considered equivalent they have the same
number of each ability's description regardless of order.


-You can test your class with Backpack.test.ts
*/

import { ActionType } from "./Utilities";
import { Ability } from "./Ability";
export class Backpack {
    private abilities: Ability[] = [];

    constructor(abilities: Ability[]=[]) {
        this.abilities = abilities;
    }

    getAbilities() {
        return this.abilities;
    }
    setAbilities(abilities: Ability[]) {
        this.abilities = abilities;
    }

    renew() {
        for (const ability of this.abilities) {
            ability.setAvailable(true);
        }
    }

    hasUsableAbility(action: ActionType): boolean {
        for (const ability of this.abilities) {
            if (ability.getDescription() === action && ability.isAvailable()) {
                return true;
            }
        }
        return false;
    }

    changeAvailable(action: ActionType, shouldChange: boolean) {
        for (const ability of this.abilities) {
            if (
                ability.getDescription() === action &&
                ability.isAvailable() !== shouldChange
            ) {
                ability.setAvailable(shouldChange);
                return;
            }
        }
    }

    emptyBackpack() {
        this.abilities = [];
    }

    clone(): Backpack {
        const newAbilities = [];
        for (const ability of this.abilities) {
            newAbilities.push(ability.clone());
        }
        return new Backpack(newAbilities);
    }

    toString(): string {
        return (
            "[ " +
            this.abilities.map((ability) => ability.toString()).join(" ") +
            " ]"
        );
    }

    equals(other: Backpack): boolean {
        if (this.abilities.length !== other.getAbilities().length) {
            return false;
        }
        const thisCounts = new Map<string, number>();
        const otherCounts = new Map<string, number>();

        for (const ability of this.abilities) {
            const desc = ability.getDescription();
            thisCounts.set(desc, (thisCounts.get(desc) || 0) + 1);
        }

        for (const ability of other.getAbilities()) {
            const desc = ability.getDescription();
            otherCounts.set(desc, (otherCounts.get(desc) || 0) + 1);
        }

        for (const [desc, count] of thisCounts) {
            if (otherCounts.get(desc) !== count) {
                return false;
            }
        }
        return true;
    }
}
