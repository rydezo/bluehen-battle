import { describe, expect, test, beforeAll } from "@jest/globals";
import { TeamViewComponent } from "./team-view.component";
import { Team } from "../../../game/elements/Team";
import { PieceBlueHen } from "../../../game/elements/PieceBlueHen";
import { Piece } from "../../../game/elements/Piece";
import { Backpack } from "../../../game/elements/Backpack";
import { Ability } from "../../../game/elements/Ability";
import { ActionType } from "../../../game/elements/Utilities";

describe("TeamComponent", () => {
    let component: any = undefined;
    const piece: Piece = new PieceBlueHen(
        "H",
        "red",
        new Backpack([new Ability(ActionType.Attack)]),
        true,
    );
    beforeAll(() => {
        //const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        //component = bootstrap<TeamViewComponent>(TeamViewComponent, html);
        component = new TeamViewComponent(new Team("red", [piece]));
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(TeamViewComponent);
        });
    });
});
