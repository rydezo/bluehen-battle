import { describe, expect, test, beforeAll } from "@jest/globals";
import { TextViewComponent } from "./text-view.component";
import { bootstrap } from "@boots-edu/webz";

describe("TextViewComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<TextViewComponent>(TextViewComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(TextViewComponent);
        });
    });
});
