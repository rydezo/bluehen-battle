import { describe, expect, test, beforeAll } from "@jest/globals";
import { GuiViewComponent } from "./gui-view.component";
import { bootstrap } from "@boots-edu/webz";

describe("GuiViewComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<GuiViewComponent>(GuiViewComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(GuiViewComponent);
        });
    });
});
