/*
PieceMedic represents a support piece that can heal inactive BlueHens
on its own team. It can move and heal but cannot attack.
*/

import { Backpack } from "./Backpack";
import { Piece } from "./Piece";
import { ActionType } from "./Utilities";

export class PieceMedic extends Piece {
    protected permAbilities: ActionType[] = [ActionType.Move, ActionType.Heal];

    constructor(
        symbol: string = "Md",
        teamColor: string = "NON",
        backpack: Backpack = new Backpack(),
        active: boolean = true,
    ) {
        super(symbol, teamColor, backpack, active);
    }

    speak(): string {
        return "The medic is here!";
    }

    spawn(): PieceMedic {
        return new PieceMedic(this.symbol, this.teamColor, this.backpack);
    }
}
