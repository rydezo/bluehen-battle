/*Problem 8: 

8.1 Create a class named named BoardSquare which will represent a square
on our game board with the following members:

- member field of type Piece to represent the Piece that is located 
    in this square - this field can either hold a Piece or be null
- member field of type string to represent color of the board square

- constructor with one parameter - color
     - sets the color
     – the square should not have a Piece by default 

8.2 Accessor methods:
    - getPiece, isEmpty, getSquareColor

8.3 Mutator method:
    – setPiece that has a Piece parameter - this method sets the 
       Piece member field       

8.4 Mutator method:
    – removePiece which has no parameters and returns the 
    Piece that is on this square
    -  update the Piece to null 
       (Note: Think about how you can return the Piece while also 
       setting the piece property to null)
 8.5 A toString method with no parameters and returns a string
    - if no Piece on this square should return:  "-------" (7 dashes)
    - if there is a Piece on this square should return: "-"  
      followed by the Piece’s toString() followed by "-" 
*/

import { Piece } from "./Piece";
export class BoardSquare {
    private piece: Piece | null = null;
    private color: string;

    constructor(color: string) {
        this.color = color;
    }

    getPiece(): Piece | null {
        return this.piece;
    }
    isEmpty(): boolean {
        return (this.piece === null);
    }
    getSquareColor(): string {
        return this.color;
    }
    setPiece(piece: Piece): void {
        this.piece = piece;
    }
    removePiece(): Piece | null {
        const removedPiece = this.piece;
        this.piece = null;
        return removedPiece;
    }
    toString(): string {
        if (this.piece === null) return "-------";
        return "-"+this.piece.toString()+"-";
    }
}