import html from "./main.component.html";
import css from "./main.component.css";
import { WebzComponent } from "@boots-edu/webz";
import { GuiViewComponent } from "./GUI-Version/gui-view/gui-view.component";
import { TextViewComponent } from "./text-view/text-view.component";

/**
 * @description MainComponent is the main component of the app
 * @extends WebzComponent
 *
 */
export class MainComponent extends WebzComponent {
    constructor() {
        super(html, css);

        // pass true if you want to run the text based input
        // and false if you want to run the gui based
        this.setUpView(true);
    }

    setUpView(isTextInput: boolean) {
        if (isTextInput) {
            // set up the textView
            const textViewComponent = new TextViewComponent();
            this.addComponent(textViewComponent, "game");
        } else {
            // set up the guiView
            const guiViewComponent = new GuiViewComponent();
            this.addComponent(guiViewComponent, "game");
        }
    }
}
