import { describe, expect, test, beforeAll } from "@jest/globals";
import { SquareViewComponent } from "./square-view.component";
//import { bootstrap } from "@boots-edu/webz";
import { BoardSquare } from "../../../game/elements/BoardSquare";
import { BoardLocation } from "../../../game/elements/Utilities";

describe("SquareViewComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        //const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        //component = bootstrap<SquareViewComponent>(SquareViewComponent, html);
        component = new SquareViewComponent(
            new BoardSquare("black"),
            new BoardLocation(0, 0),
        );
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(SquareViewComponent);
        });
    });
});
