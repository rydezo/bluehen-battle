/*
PieceMedic represents a support piece that can heal inactive pieces
on its own team. It can move and heal but cannot attack.

- New member field: healCount tracks how many heals the medic has performed.
    The medic can only heal a limited number of times (MAX_HEALS = 3).
- New member method: getHealCount returns the current heal count.
- Logic change: once the medic has healed MAX_HEALS times, Heal is removed
    from its permAbilities so allowableAction will return false for Heal,
    naturally blocking further heals through the existing validation system.
*/

import { Backpack } from "./Backpack";
import { Piece } from "./Piece";
import { ActionType } from "./Utilities";

export class PieceMedic extends Piece {
    // NEW PIECE
    private readonly MAX_HEALS: number = 3;
    private healCount: number = 0;
    protected permAbilities: ActionType[] = [ActionType.Move, ActionType.Heal];

    constructor(
        symbol: string = "Md",
        teamColor: string = "NON",
        backpack: Backpack = new Backpack(),
        active: boolean = true,
    ) {
        super(symbol, teamColor, backpack, active);
    }

    // NEW PIECE - returns how many heals this medic has performed
    getHealCount(): number {
        return this.healCount;
    }

    // NEW PIECE - increments heal count and removes Heal from permAbilities
    // once the max number of heals has been reached
    incrementHealCount(): void {
        this.healCount++;
        if (this.healCount >= this.MAX_HEALS) {
            this.permAbilities = this.permAbilities.filter(
                (ability) => ability !== ActionType.Heal,
            );
        }
    }

    speak(): string {
        return `The medic is here! Heals remaining: ${this.MAX_HEALS - this.healCount}`;
    }

    spawn(): PieceMedic {
        return new PieceMedic(this.symbol, this.teamColor, this.backpack);
    }
}