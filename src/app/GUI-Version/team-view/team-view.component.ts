import { BindValue, WebzComponent } from "@boots-edu/webz";
import html from "./team-view.component.html";
import css from "./team-view.component.css";
import { Team } from "../../../game/elements/Team";
import { PieceViewComponent } from "../piece-view/piece-view.component";

/**
 * @description Displays one team's pieces as a list of PieceViewComponents.
 * Shows active pieces first, then inactive pieces. Can be redrawn after each
 * action to reflect the current team state.
 * @extends WebzComponent
 */
export class TeamViewComponent extends WebzComponent {
    /** @description The color label shown at the top of the team panel */
    @BindValue("team-color")
    private teamColor: string = "";

    /** @description Tracks all current PieceViewComponents so they can be removed on redraw */
    private pieceViews: PieceViewComponent[] = [];

    /**
     * @description Creates a TeamViewComponent and performs an initial draw
     * for the given team
     * @param team The Team to display
     */
    constructor(team: Team) {
        super(html, css);
        this.redraw(team);
    }

    /**
     * @description Removes all existing PieceViewComponents and rebuilds the
     * list from the given team's current active and inactive pieces.
     * Active pieces are shown first, followed by inactive pieces.
     * @param team The Team whose pieces should be displayed
     */
    redraw(team: Team): void {
        // remove all existing piece views before rebuilding
        for (const teamComp of this.pieceViews) {
            this.removeComponent(teamComp);
        }
        this.pieceViews = [];

        this.teamColor = team.getTeamColor();

        for (const aPiece of team.filterPieces(true)) {
            const aPieceView = new PieceViewComponent(aPiece);
            this.pieceViews.push(aPieceView);
            this.addComponent(aPieceView, "piece");
        }
        for (const aPiece of team.filterPieces(false)) {
            const aPieceView = new PieceViewComponent(aPiece);
            this.pieceViews.push(aPieceView);
            this.addComponent(aPieceView, "piece");
        }
    }
}