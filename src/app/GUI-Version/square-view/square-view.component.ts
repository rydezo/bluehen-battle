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

export class SquareViewComponent extends WebzComponent {
    // Part B - Steps 3-5
    @BindStyle("square", "backgroundColor")
    private squareColor: string = "black";

    @BindStyleToNumberAppendPx("square", "width")
    @BindStyleToNumberAppendPx("square", "height")
    private squareSize: number = 70;

    @BindVisibleToBoolean("image")
    private hasImage: boolean = false;

    getSquareSize() {
        return this.squareSize;
    }

    // Part B - Step 20
    @BindAttribute("image", "src", (imgName: string): string => {
        return "assets/images/" + imgName;
    })
    public imgName: string = "blue_hen.png";

    // Part B - Step 21
    @BindStyle("image", "background")
    private imageBackgroundColor: string = "green";

    // Part B - Step 22
    @BindStyleToNumberAppendPx("image", "width")
    @BindStyleToNumberAppendPx("image", "height")
    private imageSize: number = 52;

    // Part B - Step 23
    @BindStyleToNumberAppendPx("image", "padding")
    private padding: number = 4;

    // Part B - Step 31
    clickedSquare: Notifier<BoardLocation> = new Notifier<BoardLocation>();

    // fields for the BoardSquare and for where the location of this square is
    private squareData: BoardSquare;
    private location: BoardLocation;
    constructor(squareData: BoardSquare, location: BoardLocation) {
        super(html, css);
        this.squareData = squareData;
        this.location = location;
        this.squareColor = squareData.getSquareColor();
        this.setImage(this.squareData);
    }

    // Part B Step 25
    setImage(squareData: BoardSquare) {
        // Part B Step 27
        if (squareData.isEmpty()) {
            this.imgName = "";
            this.hasImage = false;
        } else {
            this.hasImage = true;
            let piece: Piece | null = squareData.getPiece();
            if (piece) {
                this.imageBackgroundColor = piece.getTeamColor();
            }
            if (piece instanceof PieceBlueHen) {
                this.imgName = "bluehen.png";
            } else if (piece instanceof PieceMinion) {
                if ((<PieceMinion>piece).getKind() === MinionKind.Evil) {
                    this.imgName = "evil-minion.png";
                } else {
                    this.imgName = "friendly-minion.png";
                }
            } else if (piece instanceof PieceGhost) {
                if ((<PieceGhost>piece).isDormant()) {
                    this.imgName = "dormant-ghost.png";
                } else {
                    this.imgName = "ghost.png";
                }
            } else if (piece instanceof PieceMedic) {
                this.imgName = "medic.png";
            }
        }
    }

    @Click("square")
    onclick() {
        this.clickedSquare.notify(this.location);
    }
}