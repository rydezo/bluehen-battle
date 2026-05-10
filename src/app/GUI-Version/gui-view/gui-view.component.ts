import { BindValue, WebzComponent, WebzDialog } from "@boots-edu/webz";
import html from "./gui-view.component.html";
import css from "./gui-view.component.css";
import { Controller } from "../../../game/Controller";
import { BoardViewComponent } from "../board-view/board-view.component";
import { ActionType, BoardLocation } from "../../../game/elements/Utilities";
import { ActionViewComponent } from "../action-view/action-view.component";
import { TeamViewComponent } from "../team-view/team-view.component";

// NEW COMPONENTS
import { ScoreViewComponent } from "../score-view/score-view.component";
import { PieceInfoComponent } from "../piece-info/piece-info.component";
import { GameRO } from "../../../game/elements/GameRO";

/**
 * @description Root GUI component that owns and coordinates all child components.
 * Manages the Controller, handles board and action clicks, and updates all views
 * after each action. Orchestrates the full player interaction loop.
 * @extends WebzComponent
 */
export class GuiViewComponent extends WebzComponent {
    /** @description Displays the currently selected start and end squares */
    @BindValue("locations")
    private selectedSquares: string = "";

    /** @description Displays the current turn or game status message */
    @BindValue("message")
    private message: string = "Start Game";

    private boardView: BoardViewComponent;
    private teamView1: TeamViewComponent;
    private teamView2: TeamViewComponent;
    private actionView: ActionViewComponent;

    /** @description The action type the player has selected, Cancel by default */
    private actionType: ActionType = ActionType.Cancel;

    /** @description The start square location, (-1,-1) means not yet selected */
    private startLocation: BoardLocation = new BoardLocation(-1, -1);

    /** @description The end square location, (-1,-1) means not yet selected */
    private endLocation: BoardLocation = new BoardLocation(-1, -1);

    /** @description Bridges game logic and the UI */
    private controller: Controller = new Controller(4, 5);

    /**
     * @description Actions that only require a start square — no end square needed.
     * When one of these is selected, the action fires immediately after start selection.
     */
    private noEndSquareActions: ActionType[] = [
        ActionType.Heal,
        ActionType.Spawn,
        ActionType.Revive,
    ];

    // NEW COMPONENTS
    private scoreView: ScoreViewComponent;

    /** @description Dynamically created when a square is clicked, null otherwise */
    private pieceInfo: PieceInfoComponent | null = null;

    /**
     * @description Creates the GuiViewComponent, initializes all child components,
     * and wires up all notifier subscriptions
     */
    constructor() {
        super(html, css);

        this.message = "Ready to Play! " + this.controller.getTurn();

        /************** Board View Component*******/
        // Create an instance of the Board Component
        this.boardView = new BoardViewComponent(
            this.controller.getGame().getGameBoard(),
        );
        // Add the board component to the main component
        this.addComponent(this.boardView, "board-view");
        // Suscribe to its click notifier to capture the
        // location of the square on the board that was clicked
        this.boardView.boardClicked.subscribe((location: BoardLocation) => {
            this.handleBoardClick(location);
        });

        /************** Action View Component*******/
        // Create an instance of the Action Component
        this.actionView = new ActionViewComponent();
        // Add the action component to the main component
        this.addComponent(this.actionView, "action-view");

        // Suscribe to each action notifier to capture the
        // action type that was selected
        for (let notifier of this.actionView.getNotifiers()) {
            notifier.subscribe((actionType: ActionType): void => {
                this.handleActionClick(actionType);
            });
        }
        this.actionView.cancelNotifier.subscribe((): void => {
            this.reset();
        });

        /************** Team View Component*******/
        // Create an instance of for each team
        this.teamView1 = new TeamViewComponent(
            this.controller.getGame().getCurrentTeam(),
        );
        this.teamView2 = new TeamViewComponent(
            this.controller.getGame().getOpponentTeam(),
        );
        // Add the Team components to the main component
        this.addComponent(this.teamView1, "team1");
        this.addComponent(this.teamView2, "team2");

        // NEW COMPONENTS
        // add ScoreViewComponent - static, always present
        this.scoreView = new ScoreViewComponent(
            this.controller.getGame() as GameRO,
        );
        this.addComponent(this.scoreView, "score-view");

        // listen for win notification from score component
        this.scoreView.winNotifier.subscribe((winnerColor: string) => {
            WebzDialog.popup(this, `Game Over! ${winnerColor} team wins!`);
        });
    }

    /**
     * @description Handles a click on a board square. Dynamically creates a
     * PieceInfoComponent for the clicked square, replacing any existing one.
     * Subscribes to the PieceInfoComponent's selectNotifier to set start or
     * end location and trigger the action if ready.
     * @param location The BoardLocation of the clicked square
     */
    handleBoardClick(location: BoardLocation) {
        // dynamically add PieceInfoComponent when square is clicked
        const square = this.controller
            .getGame()
            .getGameBoard()
            .getSquare(location);

        // remove old piece info if present
        if (this.pieceInfo) {
            this.removeComponent(this.pieceInfo);
        }

        // dynamically create and add new PieceInfoComponent
        this.pieceInfo = new PieceInfoComponent(square, location);
        this.addComponent(this.pieceInfo, "piece-info");

        // listen for select notification - sets start or end location
        this.pieceInfo.selectNotifier.subscribe((loc: BoardLocation) => {
            if (this.startLocation.getRow() === -1) {
                this.startLocation = loc;
                this.selectedSquares =
                    "Start: " + loc.getRow() + ", " + loc.getCol();

                if (
                    this.actionType !== ActionType.Cancel &&
                    this.noEndSquareActions.includes(this.actionType)
                ) {
                    this.endLocation = new BoardLocation(0, 0);
                    this.carryingOutAction();
                }
            } else {
                this.endLocation = loc;
                this.selectedSquares +=
                    " End: " + loc.getRow() + ", " + loc.getCol();

                if (this.actionType !== ActionType.Cancel) {
                    this.carryingOutAction();
                }
            }
        });
    }

    /**
     * @description Handles an action button click. Validates that a start
     * square has been selected, then either fires immediately (for single-square
     * actions) or prompts the player to select an end square.
     * @param actionType The ActionType the player selected
     */
    handleActionClick(actionType: ActionType) {
        if (actionType === ActionType.Cancel) {
            this.reset();
            return;
        }

        if (this.startLocation.getRow() === -1) {
            WebzDialog.popup(this, "Select a start location on the board.");
            return;
        }

        this.actionType = actionType;

        // if action only needs start square, carry it out immediately
        // with a dummy end location
        if (this.noEndSquareActions.includes(actionType)) {
            this.endLocation = new BoardLocation(0, 0);
            this.carryingOutAction();
            return;
        }

        // otherwise wait for end square to be selected on the board
        if (this.endLocation.getRow() === -1) {
            WebzDialog.popup(this, "Now select an end location on the board.");
            return;
        }

        this.carryingOutAction();
    }

    /**
     * @description Passes the current action type and locations to the Controller.
     * On success, redraws the board, team panels, and score display, then checks
     * for game over. On failure, shows an error dialog with the game's message.
     * Always resets selection state after attempting the action.
     */
    carryingOutAction() {
        if (
            this.controller.carryOutAction(
                this.actionType,
                this.startLocation,
                this.endLocation,
            )
        ) {
            this.boardView.redraw();
            this.teamView1.redraw(this.controller.getGame().getCurrentTeam());
            this.teamView2.redraw(this.controller.getGame().getOpponentTeam());

            // update score display after every action
            this.scoreView.update();

            if (this.controller.getGame().isGameEnded()) {
                WebzDialog.popup(
                    this,
                    "Game Over! Winner: " +
                        this.controller.getGame().getWinner().getTeamColor(),
                );
            } else {
                this.message =
                    "It is Team " +
                    this.controller.getGame().getCurrentTeam().getTeamColor() +
                    "'s turn.";
            }
        } else {
            WebzDialog.popup(
                this,
                this.controller.getGame().getMessage(),
                "Invalid Action",
            );
        }
        this.reset();
    }

    /**
     * @description Resets all selection state — action type, selected squares
     * display, start location, and end location — back to their defaults
     */
    reset() {
        this.actionType = ActionType.Cancel;
        this.selectedSquares = "";
        this.startLocation = new BoardLocation(-1, -1);
        this.endLocation = new BoardLocation(-1, -1);
    }
}
