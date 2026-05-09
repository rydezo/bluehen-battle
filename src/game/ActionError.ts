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

/**
 * @description Custom error class for invalid or failed game actions.
 * Extends the built-in Error class with an additional actionType field
 * so callers know which action caused the error.
 * @extends Error
 */
export class ActionError extends Error {
    /** @description The type of action that caused this error */
    public actionType: ActionType;
 
    /**
     * @description Creates an ActionError with a message and the action type
     * that triggered it
     * @param message A description of why the action failed
     * @param actionType The ActionType that was being attempted
     */
    constructor(message: string, actionType: ActionType) {
        super(message);
        this.name = "ActionError";
        this.actionType = actionType;
    }
}