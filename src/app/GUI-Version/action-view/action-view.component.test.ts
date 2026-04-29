import { describe, expect, test, beforeAll } from "@jest/globals";
import { ActionViewComponent } from "./action-view.component";
import { bootstrap } from "@boots-edu/webz";

describe("ActionViewComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<ActionViewComponent>(ActionViewComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(ActionViewComponent);
        });
    });
});
