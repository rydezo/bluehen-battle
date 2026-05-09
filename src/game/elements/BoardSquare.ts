/*Problem 8: 

8.1 Create a class named named BoardSquare which will represent a square
on our game board with the following members:

- member field of type Piece to represent the Piece that is located 
    in this square - this field can either hold a Piece or be null
- member field of type string to represent color of the board square

- constructor with one parameter - color
     - sets the color
     - the square should not have a Piece by default 

8.2 Accessor methods:
    - getPiece, isEmpty, getSquareColor

8.3 Mutator method:
    - setPiece that has a Piece parameter - this method sets the Piece member field       

8.4 Mutator method:
    - removePiece which has no parameters and returns the Piece that is on this square
    - update the Piece to null 

8.5 A toString method with no parameters and returns a string
    - if no Piece on this square should return:  "-------" (7 dashes)
    - if there is a Piece on this square should return: "-"  
      followed by the Piece's toString() followed by "-" 
*/

import { Piece } from "./Piece";

/**
 * @description Represents a single square on the game board. Each square
 * has a color (black or white) and can hold at most one piece at a time.
 */
export class BoardSquare {
    private piece: Piece | null = null;
    private color: string;

    /**
     * @description Creates a BoardSquare with the given color and no piece
     * @param color The color of this square ("black" or "white")
     */
    constructor(color: string) {
        this.color = color;
    }

    /**
     * @description Returns the piece on this square, or null if empty
     * @returns The Piece on this square, or null
     */
    getPiece(): Piece | null {
        return this.piece;
    }

    /**
     * @description Returns whether this square has no piece on it
     * @returns true if the square is empty, false if it has a piece
     */
    isEmpty(): boolean {
        return this.piece === null;
    }

    /**
     * @description Returns the color of this square
     * @returns "black" or "white"
     */
    getSquareColor(): string {
        return this.color;
    }

    /**
     * @description Places a piece on this square
     * @param piece The Piece to place on this square
     */
    setPiece(piece: Piece): void {
        this.piece = piece;
    }

    /**
     * @description Removes and returns the piece on this square.
     * The square becomes empty after this call.
     * @returns The Piece that was on this square, or null if it was empty
     */
    removePiece(): Piece | null {
        const removedPiece = this.piece;
        this.piece = null;
        return removedPiece;
    }

    /**
     * @description Returns "-------" if the square is empty, or
     * "-{piece.toString()}-" if it contains a piece
     * @returns String representation of this square
     */
    toString(): string {
        if (this.piece === null) return "-------";
        return "-" + this.piece.toString() + "-";
    }
}