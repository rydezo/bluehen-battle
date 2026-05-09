/* Problem 1 
Define a class named Ability that has:

1.1 Two member fields: 
 - description of the ability of type:  ActionType (enumerated Type)
 - boolean representing whether this ability is available 
                   (or has expired) - default value set to true
 - a constructor with ONE parameter that sets the description field
  
1.2 Two getters:
    getDescription, isAvailable

1.3 One setter for the available field
    setAvailable
    Note: description should not be changed anywhere outside this class definition

1.4 A clone method for this class that returns a deep copy of this object

1.5 An equals method that has one Ability parameter and returns a boolean. 
This method compares the description only.
Two instances of Ability will be considered equivalent if their descriptions match.

1.6 A toString method that has no parameters and returns a string containing
the description. 
If the ability is available it should be followed by ":ready" otherwise
 it should be followed by ":expired".
        example of an available ability:  "Spawn:ready"
        example of an expired ability:  "Renew:expired"

-You can test your class with Ability.test.ts
*/

import { ActionType } from "./Utilities";

/**
 * @description Represents a single ability a piece can hold in its backpack.
 * Each ability has a type and an availability flag indicating whether it
 * has been used or is still ready to use.
 */
export class Ability {
    private description: ActionType;
    private available: boolean = true;

    /**
     * @description Creates an Ability of the given type, available by default
     * @param description The ActionType this ability represents
     */
    constructor(description: ActionType) {
        this.description = description;
    }

    /**
     * @description Returns the ActionType that describes this ability
     * @returns The ActionType of this ability
     */
    getDescription(): ActionType {
        return this.description;
    }

    /**
     * @description Returns whether this ability is currently available to use
     * @returns true if available, false if expired
     */
    isAvailable(): boolean {
        return this.available;
    }

    /**
     * @description Sets whether this ability is available or expired
     * @param available true to mark as available, false to mark as expired
     */
    setAvailable(available: boolean): void {
        this.available = available;
    }

    /**
     * @description Returns a deep copy of this Ability with the same
     * description and availability
     * @returns A new Ability instance with the same state
     */
    clone(): Ability {
        const cloned = new Ability(this.description);
        cloned.available = this.available;
        return cloned;
    }

    /**
     * @description Compares this ability to another by description only.
     * Two abilities are equal if they have the same ActionType.
     * @param other The Ability to compare against
     * @returns true if both abilities have the same description
     */
    equals(other: Ability): boolean {
        return this.description === other.description;
    }

    /**
     * @description Returns a string of the form "Type:ready" or "Type:expired"
     * @returns Formatted string representing this ability and its availability
     */
    toString(): string {
        const ability: string = this.isAvailable() ? ":ready" : ":expired";
        return this.getDescription() + ability;
    }
}