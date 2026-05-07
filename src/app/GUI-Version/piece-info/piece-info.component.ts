import { BindValue, Click, WebzComponent } from "@boots-edu/webz";
import html from "./piece-info.component.html";
import css from "./piece-info.component.css";
import { Notifier } from "@boots-edu/webz";
import { BoardLocation } from "../../../game/elements/Utilities";
import { Piece } from "../../../game/elements/Piece";
import { PieceMedic } from "../../../game/elements/PieceMedic";
import { BoardSquare } from "../../../game/elements/BoardSquare";

export class PieceInfoComponent extends WebzComponent {
    @BindValue("piece-details")
    private pieceDetails: string = "";

    @BindValue("backpack-details")
    private backpackDetails: string = "";

    // Notifier fires when player clicks "Select This Piece"
    // passes the BoardLocation back up to GuiViewComponent
    selectNotifier: Notifier<BoardLocation> = new Notifier<BoardLocation>();

    constructor(
        private square: BoardSquare,
        private location: BoardLocation,
    ) {
        super(html, css);
        this.displayInfo();
    }

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

    @Click("select-btn")
    onSelect() {
        // notify parent with this location
        this.selectNotifier.notify(this.location);
    }
}