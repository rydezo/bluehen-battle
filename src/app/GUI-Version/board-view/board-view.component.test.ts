import { describe, expect, test, beforeAll } from "@jest/globals";
import { BoardViewComponent } from "./board-view.component";
//import { bootstrap } from "@boots-edu/webz";
import { Controller } from "../../../game/Controller";

describe("BoardViewComponent", () => {
    let component: any = undefined;
    const controller: Controller = new Controller(4, 5);
    beforeAll(() => {
        //const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        // component = bootstrap<BoardViewComponent>(BoardViewComponent, html);
        component = new BoardViewComponent(controller.getGame().getGameBoard());
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(BoardViewComponent);
        });
    });
});
