/* Problem 9

ActionAttack represents an action the player can make where the start
piece attacks an opponents piece on the end square. The attacking piece
moves to the end square. The attacked piece is removed from the board
and set to inactive. 

9.1 Define a class named ActionAttack that extends ActionStartEnd 
(We need to specify both the start and end locations) 

- Define the constructor with ONLY the game and the location parameters 
   required by the superclass.
   Constructor should call the super's constructor with the arguments
   set to meet an attack's requirements.
   Note: the second argument for the super class call should be the ActionType. 
   We don't need this value passed to our constructor because it will
   always represent an Attack. 
   The location parameters are to be determined by an Attack action. 
   (Should the end square be empty or have a piece? 
   Should the end piece (if required) belong to the current team or the opponent team?)   

9.2 Implement method performAction. This method will carry out the
    attack action on the GameBoard. 

    First - check that this is a valid action the player can make.
    If the action is not valid - throw an ActionError and pass:
        - the Game's message (this was set in the validAction method)
        - the appropriate ActionType.

    If the action is valid - implement the logic to reflect an attack was made in the 
    game.   
    On an attack:
    - the Piece on the End Square is removed from the board
          UNLESS it is a ghost that is not dormant!
            - ghosts that are not dormant will change to dormant and stay on the board
                on their first attack
    - the Piece on the End Square is set to inactive
    - Piece on the Start Square is moved to the End Square
    - update the action for the Piece doing the attacking
    - the Piece being attacked speaks
    - the turn of the game is changed to the other player

    Note: Use  your UML diagram to take advantage of the methods you 
    already created in Part A! This method should not require a lot of coding
    other than to call methods you've already written. 

    Test your ActionAttack with ActionAttack.test.ts 
    View the output of the gameboard to see a piece attack
*/

import { GameS26 } from "../elements/GameS26";
import { ActionType } from "../elements/Utilities";
import { BoardLocation } from "../elements/Utilities";
import { Piece } from "../elements/Piece";
import { ActionStartEnd } from "./ActionStartEnd";
import { PieceGhost } from "../elements/PieceGhost";
import { ActionError } from "../ActionError";

/**
 * @description Represents an attack action where the start piece attacks an
 * opponent's piece on the end square. The attacked piece is set to inactive.
 * Special case: attacking a non-dormant Ghost makes it go dormant instead of
 * removing it. A shielded piece will block the attack and consume the shield.
 * Awards points to the attacking team on a successful attack.
 * @extends ActionStartEnd
 */
export class ActionAttack extends ActionStartEnd {
    /**
     * @description Creates an ActionAttack for the given game and locations.
     * The end square must have an opponent's piece.
     * @param game The GameS26 instance this action operates on
     * @param startSquare The location of the attacking piece
     * @param endSquare The location of the piece being attacked
     */
    constructor(
        game: GameS26,
        startSquare: BoardLocation,
        endSquare: BoardLocation,
    ) {
        super(game, ActionType.Attack, startSquare, endSquare, false, false);
    }
 
    /**
     * @description Carries out the attack. Handles three cases: shielded target
     * (attack blocked, shield consumed), dormant ghost target (goes dormant,
     * attacker stays), and normal attack (piece removed, attacker moves,
     * points awarded). Changes the turn in all cases.
     * Throws ActionError if the attack is not valid.
     * @returns false if the attack was blocked by a shield, true otherwise
     * @throws ActionError if validAction returns false
     */
    performAction(): boolean {
        if (!this.validAction()) {
            throw new ActionError(this.game.getMessage(), ActionType.Attack);
        }
 
        const endPiece: Piece | null = this.game
            .getGameBoard()
            .getSquare(this.endSquare)
            .getPiece();
 
        // NEW ABILITY OPTION - check if the target is shielded
        if (endPiece && endPiece.isShielded()) {
            endPiece.setShielded(false);
            this.game.setMessage("Attack was blocked by a shield!");
            this.game.changeTurn();
            return false;
        }
 
        if (endPiece instanceof PieceGhost && !endPiece.isDormant()) {
            // ghost goes dormant, stays on board, attacker stays in place
            endPiece.changeDormant(true);
            endPiece.changeSymbol();
            endPiece.setActive(false);
            endPiece.speak();
            // NEW OBJECTIVE - ghost goes dormant, no points awarded yet
        } else {
            // normal attack - remove end piece, move attacker to end square
            this.game.getGameBoard().getSquare(this.endSquare).removePiece();
            if (endPiece) {
                endPiece.setActive(false);
                endPiece.speak();
                // NEW OBJECTIVE - award points to current team
                this.game.addScoreToCurrentTeam(endPiece.getPointValue());
            }
            const startPiece: Piece | null = this.game
                .getGameBoard()
                .getSquare(this.startSquare)
                .removePiece();
            if (startPiece) {
                this.game
                    .getGameBoard()
                    .getSquare(this.endSquare)
                    .setPiece(startPiece);
                startPiece.updateAction(this.actionType);
            }
        }
 
        this.game.changeTurn();
        return true;
    }
}