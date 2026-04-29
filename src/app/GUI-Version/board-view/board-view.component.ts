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

export class BoardViewComponent extends WebzComponent {
    @BindStyleToNumberAppendPx("squares", "width")
    private gridWidth: number = 10;

    // Part B - step 12
    private squareViews: SquareViewComponent[][] = [];

    // Part B - Step 33
    boardClicked: Notifier<BoardLocation> = new Notifier<BoardLocation>();

    constructor(private boardData: GameBoard) {
        super(html, css);

        // Part B - Step 12
        for (let row = 0; row < this.boardData.getNumRows(); row++) {
            this.squareViews.push([]);
            for (let col = 0; col < this.boardData.getNumColumns(); col++) {
                let aSquareView = new SquareViewComponent(
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

    // Part B Step 30
    redraw() {
        for (let row = 0; row < this.boardData.getNumRows(); row++) {
            for (let col = 0; col < this.boardData.getNumColumns(); col++) {
                this.squareViews[row][col].setImage(
                    this.boardData.getAllSquares()[row][col],
                );
            }
        }
    }
}
