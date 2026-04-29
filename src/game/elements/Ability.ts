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
export class Ability {
    private description: ActionType;
    private available: boolean = true;

    constructor(description: ActionType) {
        this.description = description;
    }

    getDescription(): ActionType {
        return this.description;
    }

    isAvailable(): boolean {
        return this.available;
    }

    setAvailable(available: boolean): void {
        this.available = available;
    }

    clone(): Ability {
        const cloned = new Ability(this.description);
        cloned.available = this.available;
        return cloned;
    }

    equals(other: Ability): boolean {
        return this.description === other.description;
    }

    toString(): string {
        const ability: string = this.isAvailable() ? ":ready" : ":expired";
        return this.getDescription() + ability;
    }
}
