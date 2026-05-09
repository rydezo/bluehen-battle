import { GameS26 } from "./elements/GameS26";
import { Action } from "./actions/Action";
import { ActionMove } from "./actions/ActionMove";
import { ActionAttack } from "./actions/ActionAttack";
import { ActionSpawn } from "./actions/ActionSpawn";
import { ActionRecruit } from "./actions/ActionRecruit";
import { Team } from "./elements/Team";
import { PieceBlueHen } from "./elements/PieceBlueHen";
import { PieceMinion } from "./elements/PieceMinion";
import { GameBoard } from "./elements/GameBoard";
import { Ability } from "./elements/Ability";
import { Backpack } from "./elements/Backpack";
import { BoardLocation } from "./elements/Utilities";
import { ActionType } from "./elements/Utilities";
import { ActionSwapBP } from "./actions/ActionSwapBP";
import { ActionRenew } from "./actions/ActionRenew";
import { ActionRevive } from "./actions/ActionRevive";
import { PieceGhost } from "./elements/PieceGhost";
import { ActionHeal } from "./actions/ActionHeal";
import { PieceMedic } from "./elements/PieceMedic";
import { ActionShield } from "./actions/ActionShield";
import { GameRO } from "./elements/GameRO";

/**
 * @description Main driver class that bridges the game logic and the UI.
 * Creates and owns the GameRO instance, builds teams and backpacks,
 * and routes player input to the appropriate Action class.
 */
export class Controller {
    /** @description The active game instance */
    private game: GameS26;

    /**
     * @description The pool of ability types that can be randomly assigned
     * to piece backpacks when the game is created
     */
    private abilityOptions: ActionType[] = [
        ActionType.Spawn,
        ActionType.Swap,
        ActionType.Renew,
        ActionType.Revive,
        ActionType.Shield,
    ];

    /**
     * @description Creates a Controller and initializes a new game with the
     * given board dimensions
     * @param rows Number of rows for the game board
     * @param cols Number of columns for the game board
     */
    constructor(rows: number, cols: number) {
        this.game = this.createGame(rows, cols);
    }

    /**
     * @description Creates a new GameRO instance with two teams, each
     * containing a BlueHen, Minion, Ghost, and Medic with randomly generated
     * backpacks. Team A (red) always goes first.
     * NEW OBJECTIVE - uses GameRO for point-based win condition
     * @param rows Number of rows for the game board
     * @param cols Number of columns for the game board
     * @returns A fully initialized GameRO instance
     */
    createGame(rows: number, cols: number): GameRO {
        const gameBoard = new GameBoard(rows, cols);
        const teamA = new Team("red", [
            new PieceBlueHen("H", "red", this.createABackpack()),
            new PieceMinion("M", "red", this.createABackpack()),
            new PieceGhost("G", "red", this.createABackpack()),
            new PieceMedic("Md", "red", this.createABackpack()),
        ]);
        const teamB = new Team("blue", [
            new PieceBlueHen("H", "blue", this.createABackpack()),
            new PieceMinion("M", "blue", this.createABackpack()),
            new PieceGhost("G", "blue", this.createABackpack()),
            new PieceMedic("Md", "blue", this.createABackpack()),
        ]);
        return new GameRO(gameBoard, teamA, teamB, teamA);
    }

    /**
     * @description Creates a Backpack loaded with 0-3 randomly selected
     * abilities from the abilityOptions pool
     * @returns A new Backpack with random abilities
     */
    createABackpack(): Backpack {
        const numAbilities = Math.floor(Math.random() * 4);
        const randomAbilities: Ability[] = [];
        for (let i = 0; i < numAbilities; i++) {
            const randomAbility = new Ability(
                this.abilityOptions[
                    Math.floor(Math.random() * this.abilityOptions.length)
                ],
            );
            randomAbilities.push(randomAbility);
        }
        return new Backpack(randomAbilities);
    }

    /**
     * @description Returns the current game instance
     * @returns The active GameRO instance
     */
    getGame(): GameRO {
        return this.game as GameRO;
    }

    /**
     * @description Returns a string describing whose turn it is and the
     * current score for both teams
     * NEW OBJECTIVE - includes score message from GameRO
     * @returns A formatted turn and score string
     */
    getTurn(): string {
        return (
            `It is ${this.game.getCurrentTeam().getTeamColor()} team's turn. ` +
            `${(this.game as GameRO).getScoreMessage()}`
        );
    }

    /**
     * @description Creates and performs the appropriate Action subclass based
     * on the given action type and locations. Catches any ActionError thrown
     * by performAction and logs it to the console.
     * @param actionType The type of action the player wants to take
     * @param start The start board location selected by the player
     * @param end The end board location selected by the player (ignored for
     * single-square actions like Heal, Spawn, and Revive)
     * @returns true if the action was performed successfully, false otherwise
     */
    carryOutAction(
        actionType: ActionType,
        start: BoardLocation,
        end: BoardLocation,
    ): boolean {
        let action: Action;

        switch (actionType) {
            case ActionType.Move:
                action = new ActionMove(this.game, start, end);
                break;
            case ActionType.Spawn:
                action = new ActionSpawn(this.game, start);
                break;
            case ActionType.Attack:
                action = new ActionAttack(this.game, start, end);
                break;
            case ActionType.Recruit:
                action = new ActionRecruit(this.game, start, end);
                break;
            case ActionType.Swap:
                action = new ActionSwapBP(this.game, start, end);
                break;
            case ActionType.Renew:
                action = new ActionRenew(this.game, start, end);
                break;
            case ActionType.Revive:
                action = new ActionRevive(this.game, start);
                break;
            // NEW ACTION
            case ActionType.Heal:
                action = new ActionHeal(this.game, start);
                break;
            // NEW ABILITY ACTION
            case ActionType.Shield:
                action = new ActionShield(this.game, start, end);
                break;
            default:
                console.error(`Unhandled action type: ${actionType}`);
                return false;
        }

        try {
            action.performAction();
            return true;
        } catch (error) {
            console.error("Error occurred while performing action:", error);
            return false;
        }
    }
}