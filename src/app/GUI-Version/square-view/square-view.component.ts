import {
    BindAttribute,
    BindStyle,
    BindStyleToNumberAppendPx,
    BindVisibleToBoolean,
    Click,
    Notifier,
    WebzComponent,
} from "@boots-edu/webz";
import html from "./square-view.component.html";
import css from "./square-view.component.css";
import { BoardSquare } from "../../../game/elements/BoardSquare";
import { BoardLocation, MinionKind } from "../../../game/elements/Utilities";
import { PieceBlueHen } from "../../../game/elements/PieceBlueHen";
import { PieceMinion } from "../../../game/elements/PieceMinion";
import { PieceGhost } from "../../../game/elements/PieceGhost";
import { Piece } from "../../../game/elements/Piece";
import { PieceMedic } from "../../../game/elements/PieceMedic";

/**
 * @description Renders a single square on the game board. Displays the
 * square's background color and, if occupied, the appropriate piece image
 * with the team's color as background. Fires clickedSquare when clicked
 * so the parent BoardViewComponent can bubble the event upward.
 * @extends WebzComponent
 */
export class SquareViewComponent extends WebzComponent {
    /** @description CSS background color of the square ("black" or "white") */
    @BindStyle("square", "backgroundColor")
    private squareColor: string = "black";

    /** @description Width and height of the square in pixels */
    @BindStyleToNumberAppendPx("square", "width")
    @BindStyleToNumberAppendPx("square", "height")
    private squareSize: number = 50;

    /** @description Whether the piece image element is visible */
    @BindVisibleToBoolean("image")
    private hasImage: boolean = false;

    /**
     * @description Returns the size of this square in pixels, used by
     * BoardViewComponent to calculate total grid width
     * @returns The square size in pixels
     */
    getSquareSize(): number {
        return this.squareSize;
    }

    /**
     * @description The filename of the piece image to display.
     * Transformed to a full path via the BindAttribute callback.
     */
    @BindAttribute("image", "src", (imgName: string): string => {
        return "assets/images/" + imgName;
    })
    public imgName: string = "blue_hen.png";

    /** @description CSS background color of the piece image (team color) */
    @BindStyle("image", "background")
    private imageBackgroundColor: string = "green";

    /** @description Width and height of the piece image in pixels */
    @BindStyleToNumberAppendPx("image", "width")
    @BindStyleToNumberAppendPx("image", "height")
    private imageSize: number = 30;

    /** @description Padding around the piece image in pixels */
    @BindStyleToNumberAppendPx("image", "padding")
    private padding: number = 10;

    /**
     * @description Fires with this square's BoardLocation when the square
     * is clicked. Subscribed to by BoardViewComponent.
     */
    clickedSquare: Notifier<BoardLocation> = new Notifier<BoardLocation>();

    private squareData: BoardSquare;
    private location: BoardLocation;

    /**
     * @description Creates a SquareViewComponent for the given square and location.
     * Sets the background color and initial piece image.
     * @param squareData The BoardSquare this component represents
     * @param location The BoardLocation of this square on the board
     */
    constructor(squareData: BoardSquare, location: BoardLocation) {
        super(html, css);
        this.squareData = squareData;
        this.location = location;
        this.squareColor = squareData.getSquareColor();
        this.setImage(this.squareData);
    }

    /**
     * @description Updates the piece image based on the current state of the
     * given square. Hides the image if empty. Otherwise shows the image
     * corresponding to the piece type and state (e.g. dormant ghost, evil minion).
     * @param squareData The BoardSquare to read piece state from
     */
    setImage(squareData: BoardSquare): void {
        if (squareData.isEmpty()) {
            this.imgName = "";
            this.hasImage = false;
        } else {
            this.hasImage = true;
            const piece: Piece | null = squareData.getPiece();
            if (piece) {
                this.imageBackgroundColor = piece.getTeamColor();
            }
            if (piece instanceof PieceBlueHen) {
                this.imgName = "bluehen.png";
            } else if (piece instanceof PieceMinion) {
                this.imgName =
                    piece.getKind() === MinionKind.Evil ?
                        "evil-minion.png"
                    :   "friendly-minion.png";
            } else if (piece instanceof PieceGhost) {
                this.imgName =
                    piece.isDormant() ? "dormant-ghost.png" : "ghost.png";
            } else if (piece instanceof PieceMedic) {
                // NEW PIECE - Medic has its own image
                this.imgName = "medic.png";
            }
        }
    }

    /** @description Handles square click and notifies parent with this location */
    @Click("square")
    onclick(): void {
        this.clickedSquare.notify(this.location);
    }
}