import {
    BindValue,
    BindValueToNumber,
    Change,
    Click,
    Input,
    ValueEvent,
    WebzComponent,
    WebzDialog,
} from "@boots-edu/webz";
import html from "./text-view.component.html";
import css from "./text-view.component.css";
import { Controller } from "../../game/Controller";
import { ActionType } from "../../game/elements/Utilities";
import { BoardLocation } from "../../game/elements/Utilities";

export class TextViewComponent extends WebzComponent {
    /* ------------------------------------*/
    // Bind the row and col elements
    @BindValueToNumber("start-row")
    private startRow: number = 0;

    @BindValueToNumber("start-col")
    private startCol: number = 0;

    @BindValueToNumber("end-row")
    private endRow: number = 0;

    @BindValueToNumber("end-col")
    private endCol: number = 0;

    /* ------------------------------------*/

    // Bind the selection box for action
    @BindValue("operation-select")
    operationSelect: string = "Move";

    // Bind the message
    @BindValue("message")
    private message: string = "Start Game";

    // Bind the game board - will be a string representation of the board
    @BindValue("game-board")
    private gameString: string = "Board Goes Here";

    // Bind the team - will be a string representation of the team
    @BindValue("teams")
    private teamsString: string = "Teams Go Here";

    // create the instance of the controller - 4 rows 5 cols
    private controller: Controller = new Controller(4, 5);

    constructor() {
        super(html, css);
        // set the string representation of the game board
        this.displayGame();
        this.message = "Ready to Play! " + this.controller.getTurn();
    }

    // Events - when user enters location values in the textboxes
    /* ------------------------------------*/
    @Input("start-row")
    onStartRowChange(evt: ValueEvent) {
        this.startRow = +evt.value;
    }

    @Input("start-col")
    onStartColChange(evt: ValueEvent) {
        this.startCol = +evt.value;
    }

    @Input("end-row")
    onEndRowChange(evt: ValueEvent) {
        this.endRow = +evt.value;
    }

    @Input("end-col")
    onEndColChange(evt: ValueEvent) {
        this.endCol = +evt.value;
    }
    /* ------------------------------------*/

    // Event - when user makes selection from selection box
    @Change("operation-select")
    onOperationSelectChange(event: ValueEvent) {
        this.operationSelect = event.value;
    }

    // Event - when user clicks Go button
    @Click("go")
    onGo() {
        let selection: ActionType;
        switch (this.operationSelect) {
            case "move": {
                selection = ActionType.Move;
                break;
            }
            case "attack": {
                selection = ActionType.Attack;
                break;
            }
            case "recruit": {
                selection = ActionType.Recruit;
                break;
            }
            case "revive": {
                selection = ActionType.Revive;
                break;
            }
            case "renew": {
                selection = ActionType.Renew;
                break;
            }
            case "spawn": {
                selection = ActionType.Spawn;
                break;
            }
            case "swap": {
                selection = ActionType.Swap;
                break;
            }
            case "heal": {
                selection = ActionType.Heal;
                break;
            }
            case "Shield": {
                selection = ActionType.Shield;
                break;
            }
            default:
                selection = ActionType.Move;
                break;
        }

        if (
            this.controller.carryOutAction(
                selection,
                new BoardLocation(this.startRow, this.startCol),
                new BoardLocation(this.endRow, this.endCol),
            )
        ) {
            // Update the 'View' with current status of the game
            // set the string representation of the game board
            this.displayGame();
            // Display whether Game is Over
            if (this.controller.getGame().isGameEnded()) {
                WebzDialog.popup(
                    this,
                    "Game Over! Congratulations " +
                        this.controller.getGame().getWinner() +
                        "!",
                );
            } else {
                // game not ended so update the message to players
                this.message = this.controller.getTurn();
            }
        } else {
            WebzDialog.popup(
                this,
                this.controller.getGame().getMessage(),
                "Invalid Action",
            );
        }
    }

    displayGame(): void {
        //this.gameString = this.controller.getGame().toString();
        this.gameString = this.controller.getGame().getGameBoard().toString();
        this.teamsString =
            this.controller.getGame().getCurrentTeam().toString() +
            "\n" +
            this.controller.getGame().getOpponentTeam().toString();
    }
}
