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

2.7 A method named emptyBackpack that has no parameters and
doesn't return anything. This method empties the abilities array.

2.8 A clone method for this class that returns a deep copy of this object.

2.9 A toString method that has no parameters and returns the toString value
of each ability in the backpack inside of square brackets.

** Only for Honors
2.10 An equals method that has one Backpack parameter and returns a boolean.

-You can test your class with Backpack.test.ts
*/

import { ActionType } from "./Utilities";
import { Ability } from "./Ability";

/**
 * @description Represents the collection of abilities a piece carries.
 * Abilities can be used once and then expire, renewed, or swapped with
 * another piece's backpack.
 */
export class Backpack {
    private abilities: Ability[] = [];

    /**
     * @description Creates a Backpack with the given array of abilities.
     * Defaults to an empty backpack if no abilities are provided.
     * @param abilities The initial array of Ability objects
     */
    constructor(abilities: Ability[] = []) {
        this.abilities = abilities;
    }

    /**
     * @description Returns the array of abilities in this backpack
     * @returns The abilities array
     */
    getAbilities(): Ability[] {
        return this.abilities;
    }

    /**
     * @description Replaces the entire abilities array with the given array
     * @param abilities The new array of Ability objects
     */
    setAbilities(abilities: Ability[]): void {
        this.abilities = abilities;
    }

    /**
     * @description Sets all abilities in this backpack to available
     */
    renew(): void {
        for (const ability of this.abilities) {
            ability.setAvailable(true);
        }
    }

    /**
     * @description Checks whether this backpack contains a usable (available)
     * instance of the given ability type
     * @param action The ActionType to search for
     * @returns true if the backpack has this ability and it is available
     */
    hasUsableAbility(action: ActionType): boolean {
        for (const ability of this.abilities) {
            if (ability.getDescription() === action && ability.isAvailable()) {
                return true;
            }
        }
        return false;
    }

    /**
     * @description Finds the first ability matching the given type whose
     * availability differs from the target value and updates it.
     * Only the first mismatched instance is changed.
     * @param action The ActionType to search for
     * @param shouldChange The desired availability value to set
     */
    changeAvailable(action: ActionType, shouldChange: boolean): void {
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

    /**
     * @description Removes all abilities from this backpack
     */
    emptyBackpack(): void {
        this.abilities = [];
    }

    /**
     * @description Returns a deep copy of this backpack with cloned abilities
     * @returns A new Backpack with independent copies of all abilities
     */
    clone(): Backpack {
        const newAbilities = [];
        for (const ability of this.abilities) {
            newAbilities.push(ability.clone());
        }
        return new Backpack(newAbilities);
    }

    /**
     * @description Returns a string listing all abilities inside square brackets
     * @returns Formatted string e.g. "[ Spawn:ready Renew:expired ]"
     */
    toString(): string {
        return (
            "[ " +
            this.abilities.map((ability) => ability.toString()).join(" ") +
            " ]"
        );
    }

    /**
     * @description Compares this backpack to another by ability counts.
     * Two backpacks are equal if they contain the same number of each
     * ability type, regardless of order or availability.
     * @param other The Backpack to compare against
     * @returns true if both backpacks have equivalent ability compositions
     */
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
            if (otherCounts.get(desc) !== count) return false;
        }
        return true;
    }
}