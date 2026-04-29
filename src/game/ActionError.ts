/* Problem 3

A custom Error class

3.1 Define a class named ActionError that extends the error class
    with an additional member:
    - member field (ActionType) to represent the action type

3.2 Define a constructor with two parameters:
     - the message (string) (which is inherited from the Error Class)
     - the action type
    - constructor should:
        - call the super and send the message 
        - set the name to "ActionError" (name is also inherited from the Error Class)
        - set the action type to the value passed
*/

import { ActionType } from "./elements/Utilities";

export class ActionError extends Error {
    public actionType: ActionType;
    constructor(
        message: string,
        actionType: ActionType
    ) {
        super(message);
        this.name = "ActionError";
        this.actionType = actionType;
    }
}
