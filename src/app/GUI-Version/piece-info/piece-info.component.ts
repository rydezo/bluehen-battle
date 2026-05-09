import { BindValue, Click, WebzComponent } from "@boots-edu/webz";
import html from "./piece-info.component.html";
import css from "./piece-info.component.css";
import { Notifier } from "@boots-edu/webz";
import { BoardLocation } from "../../../game/elements/Utilities";
import { Piece } from "../../../game/elements/Piece";
import { PieceMedic } from "../../../game/elements/PieceMedic";
import { BoardSquare } from "../../../game/elements/BoardSquare";

/**
 * @description Displays information about the piece on a clicked board square.
 * Notifies the parent component when the player selects this piece's location.
 * Dynamically added to GuiViewComponent when a square is clicked.
 * @extends WebzComponent
 */
export class PieceInfoComponent extends WebzComponent {
    @BindValue("piece-details")
    private pieceDetails: string = "";

    @BindValue("backpack-details")
    private backpackDetails: string = "";

    /**
     * @description Notifies parent with the BoardLocation when
     * the player clicks "Select This Piece"
     */
    selectNotifier: Notifier<BoardLocation> = new Notifier<BoardLocation>();

    /**
     * @description Creates a PieceInfoComponent for the given square and location
     * @param square The BoardSquare that was clicked
     * @param location The BoardLocation of that square
     */
    constructor(
        private square: BoardSquare,
        private location: BoardLocation,
    ) {
        super(html, css);
        this.displayInfo();
    }

    /**
     * @description Builds and displays the piece details and backpack info
     * for the piece on the given square. Shows "No piece" message if empty.
     */
    displayInfo() {
        const piece: Piece | null = this.square.getPiece();

        if (!piece) {
            this.pieceDetails = "No piece on this square.";
            this.backpackDetails = "";
            return;
        }

        // build piece details string
        let details =
            `Symbol: ${piece.getSymbol()} | ` +
            `Team: ${piece.getTeamColor()} | ` +
            `Active: ${piece.isActive()} | ` +
            `Shielded: ${piece.isShielded()}`;

        // add heal count if it's a medic
        if (piece instanceof PieceMedic) {
            details += ` | Heals used: ${piece.getHealCount()}/3`;
        }
        this.pieceDetails = details;

        // build backpack details string
        const abilities = piece.getBackpack().getAbilities();
        if (abilities.length === 0) {
            this.backpackDetails = "Backpack: empty";
        } else {
            this.backpackDetails =
                "Backpack: " +
                abilities
                    .map(
                        (a) =>
                            `${a.getDescription()}` +
                            `(${a.isAvailable() ? "available" : "used"})`,
                    )
                    .join(", ");
        }
    }

    /**
     * @description Handles "Select This Piece" button click.
     * Notifies the parent with this piece's board location.
     */
    @Click("select-btn")
    onSelect() {
        // notify parent with this location
        this.selectNotifier.notify(this.location);
    }
}