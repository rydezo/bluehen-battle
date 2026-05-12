import { BindValue, Click, WebzComponent } from "@boots-edu/webz";
import html from "./piece-info.component.html";
import css from "./piece-info.component.css";
import { Notifier } from "@boots-edu/webz";
import { BoardLocation } from "../../../game/elements/Utilities";
import { Piece } from "../../../game/elements/Piece";
import { PieceMedic } from "../../../game/elements/PieceMedic";
import { PieceBlueHen } from "../../../game/elements/PieceBlueHen";
import { PieceMinion } from "../../../game/elements/PieceMinion";
import { PieceGhost } from "../../../game/elements/PieceGhost";
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

    @BindValue("path-details")
    private pathDetails: string = "";

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
     * @description Builds and displays the piece details, valid path description,
     * and backpack info for the piece on the given square.
     * Shows "No piece" message if empty.
     */
    displayInfo(): void {
        const piece: Piece | null = this.square.getPiece();

        if (!piece) {
            this.pieceDetails = "No piece on this square.";
            this.pathDetails = "";
            this.backpackDetails = "";
            return;
        }

        this.pieceDetails = this.buildPieceDetails(piece);
        this.pathDetails = this.buildPathDetails(piece);
        this.backpackDetails = this.buildBackpackDetails(piece);
    }

    /**
     * @description Builds the main piece info string including symbol, team,
     * active/shielded status, and piece-specific fields like canFly and healCount
     * @param piece The piece to describe
     * @returns Formatted details string
     */
    private buildPieceDetails(piece: Piece): string {
        let details =
            `Symbol: ${piece.getSymbol()} | ` +
            `Team: ${piece.getTeamColor()} | ` +
            `Active: ${piece.isActive()} | ` +
            `Shielded: ${piece.isShielded()}`;

        // BlueHen — show canFly status
        if (piece instanceof PieceBlueHen) {
            const flying = piece.getCanFly();
            details += ` | Can Fly: ${flying} (${flying ? "moves anywhere" : "limited to 1 square up/down"})`;
        }

        // Medic — show remaining heals
        if (piece instanceof PieceMedic) {
            details += ` | Heals used: ${piece.getHealCount()}/3`;
        }

        return details;
    }

    /**
     * @description Builds a human-readable description of this piece's
     * valid movement path based on its type
     * @param piece The piece whose path to describe
     * @returns Formatted path description string
     */
    private buildPathDetails(piece: Piece): string {
        if (piece instanceof PieceBlueHen) {
            if (piece.getCanFly()) {
                return "Path: Can move to any square on the board (flying).";
            } else {
                return "Path: Can only move 1 square up or down (same column) — lost flying ability.";
            }
        }
        if (piece instanceof PieceMinion) {
            return "Path: Can only move exactly 1 square diagonally.";
        }
        if (piece instanceof PieceGhost) {
            return "Path: Can only move 1 or 2 squares left or right (same row).";
        }
        if (piece instanceof PieceMedic) {
            return "Path: Can only move 1 square up, down, left, or right (no diagonals).";
        }
        return "Path: Can move to any distinct square.";
    }

    /**
     * @description Builds the backpack abilities string for the given piece
     * @param piece The piece whose backpack to describe
     * @returns Formatted backpack string
     */
    private buildBackpackDetails(piece: Piece): string {
        const abilities = piece.getBackpack().getAbilities();
        if (abilities.length === 0) return "Backpack: empty";
        return (
            "Backpack: " +
            abilities
                .map(
                    (a) =>
                        `${a.getDescription()} (${a.isAvailable() ? "available" : "used"})`,
                )
                .join(", ")
        );
    }

    /**
     * @description Handles "Select This Piece" button click.
     * Notifies the parent with this piece's board location.
     */
    @Click("select-btn")
    onSelect(): void {
        this.selectNotifier.notify(this.location);
    }
}