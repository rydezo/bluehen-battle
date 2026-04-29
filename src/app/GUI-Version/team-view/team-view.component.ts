import { BindValue, WebzComponent } from "@boots-edu/webz";
import html from "./team-view.component.html";
import css from "./team-view.component.css";
import { Team } from "../../../game/elements/Team";
import { PieceViewComponent } from "../piece-view/piece-view.component";

export class TeamViewComponent extends WebzComponent {
    @BindValue("team-color")
    private teamColor: string = "";

    private pieceViews: PieceViewComponent[] = [];

    constructor(team: Team) {
        super(html, css);
        this.redraw(team);
    }

    // Part B Step 30
    redraw(team: Team) {
        // remove current pieceViews
        for (let teamComp of this.pieceViews) {
            this.removeComponent(teamComp);
        }

        this.teamColor = team.getTeamColor();
        for (let aPiece of team.filterPieces(true)) {
            let aPieceView: PieceViewComponent = new PieceViewComponent(aPiece);
            this.pieceViews.push(aPieceView);
            this.addComponent(aPieceView, "piece");
        }
        for (let aPiece of team.filterPieces(false)) {
            let aPieceView: PieceViewComponent = new PieceViewComponent(aPiece);
            this.pieceViews.push(aPieceView);
            this.addComponent(aPieceView, "piece");
        }
    }
}
