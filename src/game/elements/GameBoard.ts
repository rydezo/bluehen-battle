/*Problem 9: 

9.1 Create a class named GameBoard that will represent the game board.
Its rows start at top of the board with row 0.
Its columns start at left side of the board with column 0.
It will contain a 2D array of BoardSquare objects.

9.2 Accessors methods: getNumRows, getNumColumns, getAllSquares
9.3 Accessor method: getSquare
9.4 A method named inBounds
9.5 A private method named setUpEmptyBoard
9.6 A method named isBoardFull
9.7 A method named findRandomEmptySquare
9.8 A method toString is already defined for you

Test your GameBoard classes with GameBoard.test.ts
*/

import { BoardSquare } from "./BoardSquare";
import { BoardLocation } from "./Utilities";

/**
 * @description Represents the game board as a 2D grid of BoardSquare objects.
 * Row 0 is the top row, column 0 is the leftmost column. Squares alternate
 * between black and white starting with black at (0,0).
 */
export class GameBoard {
    /**
     * @description Returns a random integer between min and max inclusive
     * @param min The minimum value (inclusive)
     * @param max The maximum value (inclusive)
     * @returns A random integer in [min, max]
     */
    public static getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    private numRows: number;
    private numColumns: number;
    private allSquares: BoardSquare[][];

    /**
     * @description Creates a GameBoard with the given dimensions and
     * initializes all squares with alternating black/white colors
     * @param numRows The number of rows on the board
     * @param numColumns The number of columns on the board
     */
    constructor(numRows: number, numColumns: number) {
        this.numRows = numRows;
        this.numColumns = numColumns;
        this.allSquares = [];
        this.setUpEmptyBoard();
    }

    /**
     * @description Returns the number of rows on this board
     * @returns The row count
     */
    getNumRows(): number {
        return this.numRows;
    }

    /**
     * @description Returns the number of columns on this board
     * @returns The column count
     */
    getNumColumns(): number {
        return this.numColumns;
    }

    /**
     * @description Returns the full 2D array of BoardSquare objects
     * @returns The allSquares 2D array
     */
    getAllSquares(): BoardSquare[][] {
        return this.allSquares;
    }

    /**
     * @description Returns the BoardSquare at the given board location
     * @param location The BoardLocation specifying row and column
     * @returns The BoardSquare at that location
     */
    getSquare(location: BoardLocation): BoardSquare {
        return this.allSquares[location.getRow()][location.getCol()];
    }

    /**
     * @description Returns whether the given location falls within the
     * bounds of this board (row and column both non-negative and within size)
     * @param location The BoardLocation to check
     * @returns true if the location is in bounds, false otherwise
     */
    inBounds(location: BoardLocation): boolean {
        const row = location.getRow();
        const col = location.getCol();
        return (
            row >= 0 && row < this.numRows && col >= 0 && col < this.numColumns
        );
    }

    /**
     * @description Fills the 2D array with BoardSquare objects, alternating
     * colors. Even rows start with black at column 0; odd rows start with white.
     */
    private setUpEmptyBoard(): void {
        for (let row = 0; row < this.numRows; row++) {
            this.allSquares[row] = [];
            for (let col = 0; col < this.numColumns; col++) {
                const isEvenRow = row % 2 === 0;
                const isEvenCol = col % 2 === 0;
                const color =
                    (isEvenRow && isEvenCol) || (!isEvenRow && !isEvenCol) ?
                        "black"
                    :   "white";
                this.allSquares[row][col] = new BoardSquare(color);
            }
        }
    }

    /**
     * @description Returns whether every square on the board has a piece on it
     * @returns true if no empty squares remain, false otherwise
     */
    isBoardFull(): boolean {
        for (let row = 0; row < this.numRows; row++) {
            for (let col = 0; col < this.numColumns; col++) {
                if (this.allSquares[row][col].isEmpty()) return false;
            }
        }
        return true;
    }

    /**
     * @description Finds and returns a random empty square on the board.
     * Keeps generating random locations until an empty one is found.
     * Should only be called when the board is not full.
     * @returns A randomly selected empty BoardSquare
     */
    findRandomEmptySquare(): BoardSquare {
        let randomSquare = this.allSquares[0][0];
        while (!randomSquare.isEmpty()) {
            const randomRow = GameBoard.getRandomInt(0, this.numRows - 1);
            const randomCol = GameBoard.getRandomInt(0, this.numColumns - 1);
            randomSquare = this.allSquares[randomRow][randomCol];
        }
        return randomSquare;
    }

    /**
     * @description Returns a string representation of the game board showing
     * all squares and their contents
     * @returns Formatted multi-line board string
     */
    toString(): string {
        let boardString: string = "";
        boardString = boardString.concat("Col :" + "       ");
        for (let col = 0; col < this.getNumColumns(); col++) {
            boardString = boardString.concat(col + "        ");
        }
        boardString = boardString.concat("\n");
        for (let row = 0; row < this.getNumRows(); row++) {
            boardString = boardString.concat("Row : " + row + "   ");
            for (let col = 0; col < this.getNumColumns(); col++) {
                boardString = boardString.concat(
                    this.getAllSquares()[row][col].toString() + "  ",
                );
            }
            boardString = boardString.concat("\n");
        }
        return boardString;
    }
}

/**
 * @description Returns a string showing the color of every square on the board.
 * Useful for debugging the board setup.
 * @param board The GameBoard to display colors for
 * @returns Formatted multi-line color grid string
 */
export function squareColors(board: GameBoard): string {
    let boardString: string = "";
    boardString = boardString.concat("Col :   ");
    for (let col = 0; col < board.getNumColumns(); col++) {
        boardString = boardString.concat(col + "   ");
    }
    boardString = boardString.concat("\n");
    for (let row = 0; row < board.getNumRows(); row++) {
        boardString = boardString.concat("Row : " + row + "   ");
        for (let col = 0; col < board.getNumColumns(); col++) {
            boardString = boardString.concat(
                board.getAllSquares()[row][col].getSquareColor() + "  ",
            );
        }
        boardString = boardString.concat("\n");
    }
    return boardString;
}