import { BindValue, WebzComponent } from "@boots-edu/webz";
import html from "./score-view.component.html";
import css from "./score-view.component.css";
import { Notifier } from "@boots-edu/webz";
import { GameRO } from "../../../game/elements/GameRO";

/**
 * @description Displays the current score and turn for both teams.
 * Notifies the parent component when a team reaches the winning score.
 * @extends WebzComponent
 */
export class ScoreViewComponent extends WebzComponent {
    @BindValue("score-display")
    private scoreDisplay: string = "";

    @BindValue("turn-display")
    private turnDisplay: string = "";

    /**
     * @description Notifies parent with the winning team's color string
     * when a team reaches the winning score threshold
     */
    winNotifier: Notifier<string> = new Notifier<string>();

    /** @description The score a team must reach to win */
    private readonly WINNING_SCORE: number = 10;

    /**
     * @description Creates a ScoreViewComponent bound to the given game
     * @param game The GameRO instance to read scores from
     */
    constructor(private game: GameRO) {
        super(html, css);
        this.update();
    }

    /**
     * @description Updates the score and turn displays based on current
     * game state. Fires winNotifier if either team has reached
     * the winning score.
     */
    update() {
        const scoreA = this.game.getScoreA();
        const scoreB = this.game.getScoreB();

        // Use getScoreMessage() which reads teamA/teamB directly
        // NOT getCurrentTeam() which flips every turn and mislabels scores
        this.scoreDisplay = this.game.getScoreMessage();

        this.turnDisplay = `It is ${this.game.getCurrentTeam().getTeamColor()}'s turn.`;

        if (scoreA >= this.WINNING_SCORE || scoreB >= this.WINNING_SCORE) {
            this.winNotifier.notify(this.game.getWinner().getTeamColor());
        }
    }
}
