/* Problem 4
Abstractly represents the actions a player can take.

4.1 Create an abstract class named Action with the following:
- member field to represent your game  (type GameS26)
- member field to represent the action type (ActionType)
- constructor with two parameters that sets the member fields
4.2 An abstract method validAction with no parameters and returns a boolean
4.3 An abstract method performAction with no parameters and returns a boolean

- This class will be tested when you created more subclasses.
*/

import { GameS26 } from "../elements/GameS26";
import { ActionType } from "../elements/Utilities";

/**
 * @description Abstract base class representing any action a player can take
 * in the game. All concrete actions must extend this class and implement
 * validAction and performAction.
 * @abstract
 * @extends nothing
 */
export abstract class Action {
    /**
     * @description Creates an Action bound to a game and action type
     * @param game The GameS26 instance this action operates on
     * @param actionType The type of action being performed
     */
    constructor(
        protected game: GameS26,
        protected actionType: ActionType,
    ) {}
 
    /**
     * @description Checks whether this action is valid in the current game state
     * @returns true if the action is valid, false otherwise
     */
    abstract validAction(): boolean;
 
    /**
     * @description Carries out the action on the game board.
     * Throws an ActionError if the action is not valid.
     * @returns true if the action was performed successfully
     */
    abstract performAction(): boolean;
}