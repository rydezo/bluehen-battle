import {
    BindAttribute,
    BindStyle,
    BindStyleToNumberAppendPx,
    BindValue,
    WebzComponent,
} from "@boots-edu/webz";
import html from "./piece-view.component.html";
import css from "./piece-view.component.css";
import { Piece } from "../../../game/elements/Piece";
import { PieceBlueHen } from "../../../game/elements/PieceBlueHen";
import { PieceMinion } from "../../../game/elements/PieceMinion";
import { PieceGhost } from "../../../game/elements/PieceGhost";
import { MinionKind } from "../../../game/elements/Utilities";
import { PieceMedic } from "../../../game/elements/PieceMedic";

/**
 * @description Renders a single piece in the team panel. Shows the piece's
 * image with the team color as background, and lists all backpack abilities
 * below the image. Marks inactive pieces with an "Inactive:" prefix.
 * Used by TeamViewComponent to build the full team list.
 * @extends WebzComponent
 */
export class PieceViewComponent extends WebzComponent {
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
     * @description The filename of the piece image.
     * Transformed to a full path via the BindAttribute callback.
     */
    @BindAttribute("image", "src", (imgName: string): string => {
        return "assets/images/" + imgName;
    })
    public imgName: string = "blue_hen.png";

    /** @description Displays the piece's backpack abilities as a string */
    @BindValue("abilities")
    private abilities: string = "Abilities: ";

    /**
     * @description Creates a PieceViewComponent for the given piece.
     * Sets the image and builds the abilities string, prefixing with
     * "Inactive:" if the piece is not currently active.
     * @param piece The Piece to display
     */
    constructor(piece: Piece) {
        super(html, css);
        this.setImage(piece);
        this.abilities =
            (piece.isActive() ? "" : "Inactive: ") +
            this.abilities +
            piece.getBackpack().toString();
    }

    /**
     * @description Sets the piece image and team color background based on
     * the piece's type and current state (e.g. dormant ghost, evil minion,
     * or Medic).
     * @param piece The Piece whose image should be displayed
     */
    setImage(piece: Piece): void {
        this.imageBackgroundColor = piece.getTeamColor();
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