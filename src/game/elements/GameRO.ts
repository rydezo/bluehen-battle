// Requirement 5

import { GameBoard } from "./GameBoard";
import { Team } from "./Team";
import { GameS26 } from "./GameS26";

export class GameRO extends GameS26 {
    constructor(gameBoard: GameBoard, teamA: Team, teamB: Team, turn: Team) {
        super(gameBoard, teamA, teamB, turn);
    }

    isGameEnded(): boolean {
        
    }

    getWinner(): Team {
        
    }
}
