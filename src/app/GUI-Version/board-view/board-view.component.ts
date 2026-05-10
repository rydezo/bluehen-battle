import {
    BindStyleToNumberAppendPx,
    Notifier,
    WebzComponent,
} from "@boots-edu/webz";
import html from "./board-view.component.html";
import css from "./board-view.component.css";
import { GameBoard } from "../../../game/elements/GameBoard";
import { SquareViewComponent } from "../square-view/square-view.component";
import { BoardLocation } from "../../../game/elements/Utilities";

/**
 * @description Renders the full game board as a grid of SquareViewComponents.
 * Dynamically creates one SquareViewComponent per board square and subscribes
 * to each square's click notifier, bubbling clicks up to the parent via
 * boardClicked. Provides a redraw method to refresh all squares after an action.
 * @extends WebzComponent
 */
export class BoardViewComponent extends WebzComponent {
    /** @description CSS width of the squares container, set to fit all columns */
    @BindStyleToNumberAppendPx("squares", "width")
    private gridWidth: number = 10;

    /** @description 2D array of SquareViewComponents matching the board layout */
    private squareViews: SquareViewComponent[][] = [];

    /**
     * @description Fires with the BoardLocation of whichever square was clicked.
     * Parent components subscribe to this to receive click events.
     */
    boardClicked: Notifier<BoardLocation> = new Notifier<BoardLocation>();

    /**
     * @description Creates a BoardViewComponent for the given GameBoard.
     * Dynamically creates and adds a SquareViewComponent for every square,
     * subscribing each to bubble clicks up through boardClicked.
     * @param boardData The GameBoard whose squares should be rendered
     */
    constructor(private boardData: GameBoard) {
        super(html, css);

        for (let row = 0; row < this.boardData.getNumRows(); row++) {
            this.squareViews.push([]);
            for (let col = 0; col < this.boardData.getNumColumns(); col++) {
                const aSquareView = new SquareViewComponent(
                    this.boardData.getAllSquares()[row][col],
                    new BoardLocation(row, col),
                );
                aSquareView.clickedSquare.subscribe(
                    (location: BoardLocation) => {
                        this.boardClicked.notify(location);
                    },
                );
                this.squareViews[row].push(aSquareView);
                this.addComponent(aSquareView, "squares");
                this.gridWidth =
                    this.boardData.getNumColumns() *
                    aSquareView.getSquareSize();
            }
        }
    }

    /**
     * @description Updates every SquareViewComponent to reflect the current
     * state of the board. Should be called after any action that modifies
     * piece positions.
     */
    redraw(): void {
        for (let row = 0; row < this.boardData.getNumRows(); row++) {
            for (let col = 0; col < this.boardData.getNumColumns(); col++) {
                this.squareViews[row][col].setImage(
                    this.boardData.getAllSquares()[row][col],
                );
            }
        }
    }
}