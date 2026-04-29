import { describe, expect, test, beforeAll } from "@jest/globals";
import { PieceViewComponent } from "./piece-view.component";
import { bootstrap } from "@boots-edu/webz";
import { PieceBlueHen } from "../../../game/elements/PieceBlueHen";
import { Ability } from "../../../game/elements/Ability";
import { Backpack } from "../../../game/elements/Backpack";
import { ActionType } from "../../../game/elements/Utilities";
import { Piece } from "../../../game/elements/Piece";

describe("PieceViewComponent", () => {
    let component: any = undefined;
    const piece: Piece = new PieceBlueHen(
        "H",
        "red",
        new Backpack([new Ability(ActionType.Attack)]),
        true,
    );
    beforeAll(() => {
        //const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        //component = bootstrap<PieceViewComponent>(PieceViewComponent, html);
        component = new PieceViewComponent(piece);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(PieceViewComponent);
        });
    });
});
