import { BindValue, WebzComponent } from "@boots-edu/webz";
import html from "./score-view.component.html";
import css from "./score-view.component.css";
import { Notifier } from "@boots-edu/webz";
import { GameRO } from "../../../game/elements/GameRO";

export class ScoreViewComponent extends WebzComponent {
    @BindValue("score-display")
    private scoreDisplay: string = "";

    @BindValue("turn-display")
    private turnDisplay: string = "";

    // Notifier fires when a team hits the winning score
    // passes the winning team's color to the parent
    winNotifier: Notifier<string> = new Notifier<string>();

    private readonly WINNING_SCORE: number = 10;

    constructor(private game: GameRO) {
        super(html, css);
        this.update();
    }

    update() {
        const scoreA = this.game.getScoreA();
        const scoreB = this.game.getScoreB();

        this.scoreDisplay =
            `${this.game.getCurrentTeam().getTeamColor()}: ${scoreA} pts  |  ` +
            `${this.game.getOpponentTeam().getTeamColor()}: ${scoreB} pts  ` +
            `(First to ${this.WINNING_SCORE} wins)`;

        this.turnDisplay = `It is ${this.game.getCurrentTeam().getTeamColor()}'s turn.`;

        // notify parent if someone hit the winning score
        if (scoreA >= this.WINNING_SCORE) {
            this.winNotifier.notify(this.game.getCurrentTeam().getTeamColor());
        } else if (scoreB >= this.WINNING_SCORE) {
            this.winNotifier.notify(this.game.getOpponentTeam().getTeamColor());
        }
    }
}