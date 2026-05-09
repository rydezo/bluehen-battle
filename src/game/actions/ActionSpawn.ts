/* Problem 8

ActionSpawn represents an action the player can make where the start
piece selected to spawn another piece that gets placed on the board
in a random empty square on the board.

8.1 Define a class named ActionSpawn that extends ActionStart (We don't
need to specify an End location) and represents a 'spawn' action. 

- Define the constructor with ONLY the game and the location parameter
   required by the superclass
   Constructor should call the super's constructor with the arguments
   set to meet a spawn's requirements.
   Note: the second argument for the super class call should be the ActionType. 
   We don't need this value passed to our constructor because it will
   always represent a Spawn.
   The location parameter are to be determined by actions of a Spawn. 
   

8.2 Override the method valid Action. There is an additional requirement
    that should be met. Since we are creating a new piece - we must 
    make sure there is room on the board for this new piece. Using
    good OOP practices, this method should check that this action
    meets all the requirements in ActionStart as well as this 
    additional requirement.

8.3 Implement method performAction. This method will carry out the
    spawn on the GameBoard. 
    
    First - check that this is a valid action the player can make.
    If the action is not valid - throw an ActionError and pass:
        - the Game's message (this was set in the validAction method)
        - the appropriate ActionType.

    If the action is valid - implement the logic to reflect a spawn made in the 
    game. 
    On a spawn:  
        - the Piece on the Start Square is spawned 
        - update the action for the Piece on start square
        - the spawn is placed on a random empty square and added to the current team    
        - one of the pieces speaks
        - the turn of the game is changed to the other player

    Note: Use  your UML diagram to take advantage of the methods you 
    already created in Part A! This method should not require a lot of coding
    other than to call methods you've already written. 

    Test your ActionSpawn with ActionSpawn.test.ts 
    View the output of the gameboard to see a piece spawn

*/


import { GameS26 } from "../elements/GameS26";
import { ActionType } from "../elements/Utilities";
import { BoardLocation } from "../elements/Utilities";
import { Piece } from "../elements/Piece";
import { BoardSquare } from "../elements/BoardSquare";
import { ActionStart } from "./ActionStart";
import { ActionError } from "../ActionError";


/**
 * @description Represents a spawn action where the start piece creates a copy
 * of itself and places it on a random empty square on the board. The spawned
 * piece is added to the current team. Requires the board to not be full.
 * @extends ActionStart
 */
export class ActionSpawn extends ActionStart {
    /**
     * @description Creates an ActionSpawn for the given game and start location
     * @param game The GameS26 instance this action operates on
     * @param startSquare The location of the piece that is spawning
     */
    constructor(game: GameS26, startSquare: BoardLocation) {
        super(game, ActionType.Spawn, startSquare);
        this.startSquare = startSquare;
    }
 
    /**
     * @description Validates all ActionStart requirements plus checks that
     * the board is not full (there must be room for the spawned piece)
     * @returns true if the spawn is valid, false otherwise
     */
    validAction(): boolean {
        if (!super.validAction()) return false;
        // board must not be full to place the spawned piece
        return !this.game.getGameBoard().isBoardFull();
    }
 
    /**
     * @description Spawns a copy of the start piece, places it on a random
     * empty square, adds it to the current team, calls speak, and changes
     * the turn. Throws ActionError if the action is not valid.
     * @returns true if the spawn was performed successfully
     * @throws ActionError if validAction returns false
     */
    performAction(): boolean {
        if (!this.validAction()) {
            throw new ActionError(this.game.getMessage(), this.actionType);
        }
 
        const startPiece: Piece | null = this.game
            .getGameBoard()
            .getSquare(this.startSquare)
            .getPiece();
 
        if (startPiece) {
            const spawnedPiece: Piece = startPiece.spawn();
            startPiece.updateAction(this.actionType);
            const randomEmptySquare: BoardSquare =
                this.game.getGameBoard().findRandomEmptySquare();
            randomEmptySquare.setPiece(spawnedPiece);
            this.game.getCurrentTeam().addPieceToTeam(spawnedPiece);
            console.log(spawnedPiece.speak());
            this.game.changeTurn();
            return true;
        }
        return false;
    }
}