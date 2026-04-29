/*Problem 7

7.1 Create a new class named Team that will represent one
player's set of game pieces. It will contain the following members:

- member field of type string for the color of the team
- member field to represent all Pieces that the belongs to the team 
    this should be of an array of Pieces (since they will have more than
    one type of Piece)

7.2 A constructor with two parameters: 
    (parameters should be in the order listed above) that sets the two member fields

7.3 Two accessor methods:
    – getTeamColor and getAllPieces

7.4 A mutator method named removePieceFromTeam with a Piece
parameter and no return value. This method removes the Piece from the array.

7.5 A mutator method named addPieceToTeam with one parameter Piece and no return value.
    This method should add the Piece to the Team AND set the Piece’s 
    color to the team color.

7.6 An accessor method named filterPieces that has one boolean parameter 
representing whether the filtered array should contain active (true) or
inactive (false) Pieces. This method should not modify this team's
array. It should return a new array of pieces.

7.7 toString method is provided for you - uncomment when ready
*/

import { Piece } from "./Piece";

export class Team {
    constructor(private teamColor: string, private pieces: Piece[]) {}

    getTeamColor(): string {
        return this.teamColor;
    }
    getAllPieces(): Piece[] {
        return this.pieces;
    }

    removePieceFromTeam(piece: Piece): void {
        for (let i=0; i<this.pieces.length; i++) {
            if (this.pieces[i] === piece) {
                this.pieces.splice(i, 1);
            }
        }
    }
    addPieceToTeam(piece: Piece): void {
        this.pieces.push(piece);
        piece.setTeamColor(this.teamColor);
    }
    filterPieces(active: boolean): Piece[] {
        const newPieces: Piece [] = [];
        if (active) {
            for (const piece of this.pieces) {
                if (piece.isActive()) newPieces.push(piece);
            }
            return newPieces;
        }
        for (const piece of this.pieces) {
            if (!piece.isActive()) newPieces.push(piece);
        }
        return newPieces;
    }

    toString(): string {
        let retString: string =
            "Team : " + this.getTeamColor() + "\n\n  Active Pieces : \n";
        for (let eachPiece of this.filterPieces(true)) {
            retString += "\n  " + eachPiece.toStringwithBackPack();
        }
        retString += "\n\n  Inactive Pieces : \n";
        for (let eachPiece of this.filterPieces(false)) {
            retString += "\n  " + eachPiece.toStringwithBackPack();
        }
        return retString;
    }
}
