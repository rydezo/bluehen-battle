import { Click, Notifier, WebzComponent } from "@boots-edu/webz";
import html from "./action-view.component.html";
import css from "./action-view.component.css";
import { ActionType } from "../../../game/elements/Utilities";

/**
 * @description Displays the action buttons panel. Each button fires a Notifier
 * with its corresponding ActionType. The parent component subscribes to these
 * notifiers to know which action the player wants to take.
 * @extends WebzComponent
 */
export class ActionViewComponent extends WebzComponent {
    /** @description Fires when the Cancel button is clicked */
    cancelNotifier: Notifier = new Notifier();

    /** @description Fires with ActionType.Move when Move is clicked */
    moveNotifier: Notifier<ActionType> = new Notifier<ActionType>();

    /** @description Fires with ActionType.Attack when Attack is clicked */
    attackNotifier: Notifier<ActionType> = new Notifier<ActionType>();

    /** @description Fires with ActionType.Recruit when Recruit is clicked */
    recruitNotifier: Notifier<ActionType> = new Notifier<ActionType>();

    /** @description Fires with ActionType.Spawn when Spawn is clicked */
    spawnNotifier: Notifier<ActionType> = new Notifier<ActionType>();

    /** @description Fires with ActionType.Swap when Swap Backpacks is clicked */
    swapNotifier: Notifier<ActionType> = new Notifier<ActionType>();

    /** @description Fires with ActionType.Renew when Renew is clicked */
    renewNotifier: Notifier<ActionType> = new Notifier<ActionType>();

    /** @description Fires with ActionType.Revive when Revive is clicked */
    reviveNotifier: Notifier<ActionType> = new Notifier<ActionType>();

    // NEW ACTION
    /** @description Fires with ActionType.Heal when Heal is clicked */
    healNotifier: Notifier<ActionType> = new Notifier<ActionType>();

    // NEW ABILITY ACTION
    /** @description Fires with ActionType.Shield when Shield is clicked */
    shieldNotifier: Notifier<ActionType> = new Notifier<ActionType>();

    /**
     * @description Array of all action notifiers (excluding cancel).
     * The parent component iterates this to subscribe to all actions at once.
     */
    private actionNotifiers: Notifier<ActionType>[] = [
        this.moveNotifier,
        this.attackNotifier,
        this.recruitNotifier,
        this.spawnNotifier,
        this.swapNotifier,
        this.renewNotifier,
        this.reviveNotifier,
        this.healNotifier,
        this.shieldNotifier,
    ];

    /**
     * @description Creates the ActionViewComponent
     */
    constructor() {
        super(html, css);
    }

    /**
     * @description Returns the array of all action notifiers so the parent
     * can subscribe to all of them in a loop
     * @returns Array of Notifier<ActionType> instances
     */
    getNotifiers(): Notifier<ActionType>[] {
        return this.actionNotifiers;
    }

    /** @description Handles Cancel button click */
    @Click("cancel")
    onCancel(): void {
        this.cancelNotifier.notify();
    }

    /** @description Handles Move button click */
    @Click("move")
    onMove(): void {
        this.moveNotifier.notify(ActionType.Move);
    }

    /** @description Handles Attack button click */
    @Click("attack")
    onAttack(): void {
        this.attackNotifier.notify(ActionType.Attack);
    }

    /** @description Handles Recruit button click */
    @Click("recruit")
    onRecruit(): void {
        this.recruitNotifier.notify(ActionType.Recruit);
    }

    /** @description Handles Spawn button click */
    @Click("spawn")
    onSpawn(): void {
        this.spawnNotifier.notify(ActionType.Spawn);
    }

    /** @description Handles Swap Backpacks button click */
    @Click("swap")
    onSwap(): void {
        this.swapNotifier.notify(ActionType.Swap);
    }

    /** @description Handles Renew button click */
    @Click("renew")
    onRenew(): void {
        this.renewNotifier.notify(ActionType.Renew);
    }

    /** @description Handles Revive button click */
    @Click("revive")
    onRevive(): void {
        this.reviveNotifier.notify(ActionType.Revive);
    }

    // NEW ACTION
    /** @description Handles Heal button click */
    @Click("heal")
    onHeal(): void {
        this.healNotifier.notify(ActionType.Heal);
    }

    // NEW ABILITY ACTION
    /** @description Handles Shield button click */
    @Click("shield")
    onShield(): void {
        this.shieldNotifier.notify(ActionType.Shield);
    }
}