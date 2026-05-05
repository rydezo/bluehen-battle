import { BindValue, WebzComponent, WebzDialog } from "@boots-edu/webz";
import html from "./gui-view.component.html";
import css from "./gui-view.component.css";
import { Controller } from "../../../game/Controller";
import { BoardViewComponent } from "../board-view/board-view.component";
import { ActionType, BoardLocation } from "../../../game/elements/Utilities";
import { ActionViewComponent } from "../action-view/action-view.component";
import { TeamViewComponent } from "../team-view/team-view.component";

export class GuiViewComponent extends WebzComponent {
    @BindValue("locations")
    private selectedSquares: string = "";

    // fields for each component
    private boardView: BoardViewComponent;
    private teamView1: TeamViewComponent;
    private teamView2: TeamViewComponent;
    private actionView: ActionViewComponent;
    private actionType: ActionType = ActionType.Cancel;

    // fields for start and end locations selected
    private startLocation: BoardLocation = new BoardLocation(-1, -1);
    private endLocation: BoardLocation = new BoardLocation(-1, -1);

    // the controller will be used to connect our game data
    // with the view presented to the user
    private controller: Controller = new Controller(4, 5);

    // actions that only need a start square
    private noEndSquareActions: ActionType[] = [
        ActionType.Heal,
        ActionType.Spawn,
        ActionType.Revive,
    ];

    @BindValue("message")
    private message: string = "Start Game";

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
    }

    handleBoardClick(location: BoardLocation) {
        if (this.startLocation.getRow() === -1) {
            this.startLocation = location;
            this.selectedSquares =
                "Start: " +
                this.startLocation.getRow() +
                ", " +
                this.startLocation.getCol();

            // if action is already selected and only needs start, go
            if (
                this.actionType !== ActionType.Cancel &&
                this.noEndSquareActions.includes(this.actionType)
            ) {
                this.endLocation = new BoardLocation(0, 0);
                this.carryingOutAction();
            }
        } else {
            this.endLocation = location;
            this.selectedSquares +=
                " End: " +
                this.endLocation.getRow() +
                ", " +
                this.endLocation.getCol();

            // if action is already selected, carry it out
            if (this.actionType !== ActionType.Cancel) {
                this.carryingOutAction();
            }
        }
    }

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

            // Display whether Game is Over
            if (this.controller.getGame().isGameEnded()) {
                WebzDialog.popup(
                    this,
                    "Game Over! Congratulations " +
                        this.controller.getGame().getWinner() +
                        "!",
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

    // handle the clicks - could be a location
    // on the board or it could be an action button
    // So using a Union Type
    /*
    handleClicks(clicked: BoardLocation | string) {
        if (clicked instanceof BoardLocation) {
            if (!this.startLocation) {
                this.startLocation = clicked;
                this.selectedSquares =
                    "Start Square: " +
                    this.startLocation.getRow() +
                    ", " +
                    this.startLocation.getCol();
            } else if (!this.endLocation) {
                this.endLocation = clicked;
                this.selectedSquares +=
                    " End Square: " +
                    this.endLocation.getRow() +
                    ", " +
                    this.endLocation.getCol();
            } else if (this.actionType === "") {
                WebzDialog.popup(this, "Select an action");
                return;
            }
        } else if (this.actionType === "cancel") {
            this.reset();
            return;
        } else if (this.actionType === "") {
            this.actionType = clicked;
        }

        if (this.startLocation && this.actionType !== "") {
            if (!this.endLocation) {
                this.endLocation = new BoardLocation(-1, -1);
            }
            if (
                this.controller.carryOutAction(
                    this.actionType,
                    this.startLocation,
                    this.endLocation,
                )
            ) {
                this.boardView.redraw();
                this.teamView1.redraw(
                    this.controller.getGame().getCurrentTeam(),
                );
                this.teamView2.redraw(
                    this.controller.getGame().getOpponentTeam(),
                );

                // Display whether Game is Over
                if (this.controller.getGame().isGameEnded()) {
                    WebzDialog.popup(
                        this,
                        "Game Over! Congratulations " +
                            this.controller.getGame().getWinner() +
                            "!",
                    );
                } else {
                    this.message =
                        "It is Team " +
                        this.controller
                            .getGame()
                            .getCurrentTeam()
                            .getTeamColor() +
                        "'s turn.";
                }
            } else {
                WebzDialog.popup(
                    this,
                    this.controller.getGame().getRules().getMessage(),
                    "Invalid Action",
                );
            }

            this.reset();
        }
    }
        */

    reset() {
        this.actionType = ActionType.Cancel;
        this.selectedSquares = "";
        this.startLocation = new BoardLocation(-1, -1);
        this.endLocation = new BoardLocation(-1, -1);
    }
}
