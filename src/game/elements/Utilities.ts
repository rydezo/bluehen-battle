/**
 * @description Enumeration of all action types available in the game.
 * Used to identify what kind of action a piece is taking or what ability
 * is stored in a backpack.
 */
export const enum ActionType {
    Attack = "Attack",
    Move = "Move",
    Recruit = "Recruit",
    Renew = "Renew",
    Revive = "Revive",
    Spawn = "Spawn",
    Swap = "Swap",
    Cancel = "Cancel",

    // NEW ACTION
    Heal = "Heal",
    // NEW ABILITY ACTION
    Shield = "Shield",
}

/**
 * @description Enumeration of Minion kinds. A Minion starts Friendly and
 * turns Evil after reaching MAX_RECRUITS.
 */
export const enum MinionKind {
    Friendly = "Friendly",
    Evil = "Evil",
}

/**
 * @description Represents a location on the game board at the given row
 * and column indices. Row 0 is the top row, column 0 is the leftmost column.
 */
export class BoardLocation {
    /**
     * @description Creates a BoardLocation at the given row and column
     * @param row The row index (0 = top)
     * @param col The column index (0 = left)
     */
    constructor(
        private row: number,
        private col: number,
    ) {}

    /**
     * @description Returns the row index of this location
     * @returns The row number
     */
    public getRow(): number {
        return this.row;
    }

    /**
     * @description Returns the column index of this location
     * @returns The column number
     */
    public getCol(): number {
        return this.col;
    }

    /**
     * @description Sets the row index of this location
     * @param row The new row number
     */
    setRow(row: number): void {
        this.row = row;
    }

    /**
     * @description Sets the column index of this location
     * @param col The new column number
     */
    setCol(col: number): void {
        this.col = col;
    }
}