import { Injectable, OnInit } from '@angular/core';
import { Tile } from './tile-info';

@Injectable({
  providedIn: 'root',
})
export class ChessRulesService implements OnInit {
  private flipBoard: number = 0;
  private boardInfo: Tile[];
  turn: number = 0;
  move: string;
  private legalMoves: number[] = [];
  private enPassant: number;
  private attackedSquaresW = new Set();
  private attackedSquaresB = new Set();

  constructor() {}

  ngOnInit(): void {
    this.resetBoard();
  }

  resetBoard() {
    this.boardInfo = [];
    for (let i = 0; i < 64; i++) {
      this.boardInfo.push({
        row: this._tileRow(i),
        column: this._tileColumn(i),
        darkTile: this._tileColor(i),
        index: i,
      });
    }
  }

  _resetTile(tileIndex: number) {
    this.boardInfo[tileIndex]['piece'] = null;
    this.boardInfo[tileIndex]['pieceUrl'] = null;
    delete this.boardInfo[tileIndex]['moved'];
  }

  _addToSet(num: number, color: string) {
    if (color == 'w') {
      this.attackedSquaresW.add(num);
    } else {
      this.attackedSquaresB.add(num);
    }
  }

  _checkAllAttackedSquares() {
    this.attackedSquaresB = new Set();
    this.attackedSquaresW = new Set();

    //for each piece on board
    this.boardInfo.forEach((tile) => {
      if (!tile.piece) return;

      //check for pawns attacked tiles.
      if (tile.piece.includes('Pawn')) {
        if (tile.column != (tile.piece[0] == 'w' ? 0 : 7))
          this._addToSet(
            +tile['index'] + (tile.piece[0] == 'w' ? -9 : 9),
            tile.piece[0]
          );
        if (tile.column != (tile.piece[0] == 'w' ? 7 : 0))
          this._addToSet(
            +tile['index'] + (tile.piece[0] == 'w' ? -7 : 7),
            tile.piece[0]
          );
        return;
      }

      //check for all other pieces
      this.checkLegalMoves(+tile['index'], true).forEach((val) => {
        this._addToSet(val, tile.piece[0]);
      });
    });

    return {
      w: Array.from(this.attackedSquaresW),
      b: Array.from(this.attackedSquaresB),
    };
  }

  checkLegalMoves(tileIndex: number, futureMove = false) {
    this.legalMoves = [];
    let newLegalMoves = [];
    const tileDataSet = this.boardInfo[tileIndex];

    const currentPieceColor = tileDataSet['piece'][0];

    const isKing = tileDataSet['piece'].includes('King');
    const startPosition = +tileDataSet['index'];
    const row = +this.boardInfo[startPosition]['row'];
    const column = +this.boardInfo[startPosition]['column'];

    // top, right, bottom, left, top-left, bottom-left, bottom-right, top-right : those direction can be achieved by this offset
    const moveSet = [-8, 1, 8, -1, -7, 9, 7, -9];
    // top, right, bottom, left, top-left, bottom-left, bottom-right, top-right : this is amount of tiles to edge of the board in those directions
    const tilesToEdgeOfBoard = [
      row,
      7 - column,
      7 - row,
      column,
      Math.min(row, 7 - column),
      Math.min(7 - row, 7 - column),
      Math.min(7 - row, column),
      Math.min(row, column),
    ];

    //Queen, king, bishop, rook moves
    const slidingMoves = (dirStartAndEnd) => {
      //loop starts at specific values to match moveset directions. For example queen moves in all directions, so loops starts at 0 and ends at 8
      for (
        let directionIndex = dirStartAndEnd[0];
        directionIndex < dirStartAndEnd[1];
        directionIndex++
      ) {
        // Loop till end of the board is reached
        for (let n = 0; n < tilesToEdgeOfBoard[directionIndex]; n++) {
          //break the loop after 1st iteration if piece is king
          if (n > 0 && isKing) {
            break;
          }

          const targetSquare =
            this.boardInfo[startPosition + moveSet[directionIndex] * (n + 1)];

          if (
            targetSquare['piece'] &&
            targetSquare['piece'][0] == currentPieceColor
          ) {
            this._addToSet(+targetSquare['index'], currentPieceColor);
            break;
          }

          //push this target index to legal moves array
          newLegalMoves.push(+targetSquare['index']);
          this._addToSet(+targetSquare['index'], currentPieceColor);

          //Stop loop if target square is enemy piece
          if (
            targetSquare['piece'] &&
            targetSquare['piece'][0] != currentPieceColor
          ) {
            //if target square is king, add one move behind king to attacked square to prevent enemy king from running into checkmate
            if (targetSquare['piece'].includes('King')) {
              this._addToSet(
                +targetSquare['index'] + moveSet[directionIndex],
                currentPieceColor
              );
            }
            break;
          }
        }
      }

      //Check castle possibility
      //king side
      if (isKing && !tileDataSet['moved']) {
        if (
          !this.boardInfo[startPosition + 1]['piece'] &&
          !this.boardInfo[startPosition + 2]['piece'] &&
          this.boardInfo[startPosition + 3]['piece'] &&
          this.boardInfo[startPosition + 3]['piece']?.includes('Rook') &&
          !this.boardInfo[startPosition + 3]['moved']
        ) {
          newLegalMoves.push(startPosition + 2);
        }
        //queen side
        if (
          !this.boardInfo[startPosition - 1]['piece'] &&
          !this.boardInfo[startPosition - 2]['piece'] &&
          !this.boardInfo[startPosition - 3]['piece'] &&
          this.boardInfo[startPosition - 4]['piece'] &&
          this.boardInfo[startPosition - 4]['piece']?.includes('Rook') &&
          !this.boardInfo[startPosition - 4]['moved']
        ) {
          newLegalMoves.push(startPosition - 2);
        }
      }
    };

    const pawnMove = () => {
      const direction = tileDataSet['piece'][0] == 'w' ? -8 : 8;

      // check 2 moves forward if:
      for (let n = 1; n < 3; n++) {
        //Pawn haven't move
        if (row != 1 && row != 6 && n > 1) break;
        //Pawn is on last row of the board
        if (
          startPosition + direction * n < 0 ||
          startPosition + direction * n > 63
        )
          break;
        //there is piece on target square
        if (this.boardInfo[startPosition + direction * n]['piece']) {
          break;
        }

        newLegalMoves.push(startPosition + direction * n);
      }

      // check capturing pieces to the side if there is enemy piece on target square
      //right side: pawn is not standing on h column
      if (
        this.boardInfo[startPosition + (direction == 8 ? 9 : -7)]['piece'] &&
        this.boardInfo[startPosition + (direction == 8 ? 9 : -7)]['piece'][0] !=
          currentPieceColor &&
        column != 7
      ) {
        newLegalMoves.push(startPosition + (direction == 8 ? 9 : -7));
      }
      //left side: pawn is not standing on a column
      if (this.boardInfo[startPosition + (direction == 8 ? 7 : -9)]['piece']) {
        if (
          this.boardInfo[startPosition + (direction == 8 ? 7 : -9)][
            'piece'
          ][0] == (direction == 8 ? 'w' : 'b') &&
          column != 0
        ) {
          newLegalMoves.push(startPosition + (direction == 8 ? 7 : -9));
        }
      }

      //Google en Passant
      //if piece on left or right is en passantable
      if (
        this?.enPassant + 1 == startPosition ||
        this?.enPassant - 1 == startPosition
      ) {
        newLegalMoves.push(
          this.enPassant + (currentPieceColor == 'w' ? -8 : 8)
        );
      }
    };

    const knightMove = () => {
      //offset
      const knightMoves = [-15, -6, 10, 17, 15, 6, -10, -17];

      for (let n = 0; n < 8; n++) {
        const targetSquare = this.boardInfo[startPosition + knightMoves[n]];
        if (!targetSquare) continue;
        //target square exist, and target square is on other side of the board due to knight being on edge of the board
        if (
          Math.abs(+targetSquare['row'] - row) > 2 ||
          Math.abs(+targetSquare['column'] - column) > 2
        )
          continue;
        //target square piece isn't allay piece
        if (
          targetSquare['piece'] &&
          targetSquare['piece'][0] == currentPieceColor
        ) {
          continue;
        }
        newLegalMoves.push(+targetSquare['index']);
      }
    };

    switch (tileDataSet['piece'].slice(1)) {
      case 'Bishop':
        slidingMoves([4, 8]);
        break;
      case 'Queen':
        slidingMoves([0, 8]);
        break;
      case 'Rook':
        slidingMoves([0, 4]);
        break;
      case 'Pawn':
        pawnMove();
        break;
      case 'Knight':
        knightMove();
        break;
      case 'King':
        slidingMoves([0, 8]);
        break;
    }

    //check attacked square for king
    if (isKing && !futureMove) {
      const attackedSquares =
        this._checkAllAttackedSquares()[currentPieceColor == 'w' ? 'b' : 'w'];

      newLegalMoves = newLegalMoves.filter((val) => {
        return attackedSquares.indexOf(val) == -1;
      });
    }

    this.legalMoves = [];
    this.legalMoves.push(...newLegalMoves);

    return this.legalMoves;
  }

  movePiece(oldTileIndex: number, newTileIndex: number) {
    const oldTile = this.boardInfo[oldTileIndex];
    const newTile = this.boardInfo[newTileIndex];

    console.log(this.legalMoves);
    console.log(newTile['index']);
    if (!this.legalMoves.includes(newTile['index'])) {
      return this.boardInfo;
    }

    //TODO: add check and checkmate
    if (newTile['piece']?.includes('King')) {
      this.resetBoard();
      return null;
    }

    newTile['piece'] = oldTile['piece'];
    newTile['pieceUrl'] = oldTile['pieceUrl'];

    //check for castle and move the rooks
    if (
      oldTile['piece']?.includes('King') &&
      Math.abs(+oldTile['column'] - +newTile['column']) == 2
    ) {
      if (+newTile['column'] > +oldTile['column']) {
        this.movePiece(+oldTile['index'] + 3, +oldTile['index'] + 1);
      } else {
        this.movePiece(+oldTile['index'] - 4, +oldTile['index'] - 1);
      }
    }

    //en Passant
    if (
      +newTile['index'] ==
      this.enPassant + (oldTile['piece'][0] == 'w' ? -8 : 8)
    ) {
      this._resetTile(this.enPassant);
    }
    this.enPassant = null;

    //check for pawn 2 move forward and set en Passantable pice
    if (
      Math.abs(+oldTile['row'] - +newTile['row']) == 2 &&
      oldTile['piece']?.includes('Pawn')
    ) {
      this.enPassant = +newTile['index'];
    }
    const tileNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    this.move =
      tileNames[+oldTile['column']] +
      (8 - oldTile['row']) +
      tileNames[+newTile['column']] +
      (8 - newTile['row']);

    this._resetTile(oldTile['index']);
    newTile['moved'] = true;

    this.legalMoves = [];

    return this.boardInfo;
  }

  generateArrow(chessMove: string) {
    const tiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    const arrowDirection = (direction: number[]) => {
      let mirrorAngle = 0;

      if (direction[0] < 0) {
        mirrorAngle = 6.28319;
      }
      if (direction[1] < 0) {
        mirrorAngle = 3.14159;
      }
      if (direction[0] < 0 && direction[1] < 0) {
        mirrorAngle = 4.71239;
      }
      direction[0] = Math.abs(direction[0]);
      direction[1] = Math.abs(direction[1]);
      const arrowHeight = Math.sqrt(
        direction[0] * direction[0] + direction[1] * direction[1]
      );

      const angleSine = direction[0] / arrowHeight;
      const angle =
        mirrorAngle != 0
          ? mirrorAngle - Math.asin(angleSine)
          : Math.asin(angleSine);

      return [arrowHeight * 100 - 50 + '%', 'rotate(' + angle + 'rad)'];
    };

    const startPosition =
      (8 - Number.parseInt(chessMove[1])) * 8 + tiles.indexOf(chessMove[0]);
    const horizontalMove =
      tiles.indexOf(chessMove[2]) - tiles.indexOf(chessMove[0]);
    const verticalMove = +chessMove[3] - +chessMove[1];

    this.boardInfo[startPosition]['arrow'] = {
      arrowIndex: startPosition,
      arrowHeight: arrowDirection([horizontalMove, verticalMove])[0],
      arrowTransform: arrowDirection([horizontalMove, verticalMove])[1],
    };
  }

  generateBoard(
    fenNotation = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
    move?: string
  ) {
    const fenDivided = fenNotation.split('/');
    let boardValid: boolean = true;
    let currentTileIndex = 0;

    //helper functions
    const isNumber = (char) => /\d/.test(char);
    const isUpperCase = (char: string) => char == char.toUpperCase();
    const checkPiece = (letter: string) => {
      const pieceColor = isUpperCase(letter) ? 'w' : 'b';
      let piece: string;
      letter = letter.toLowerCase();
      switch (letter) {
        case 'r':
          piece = 'Rook';
          break;
        case 'n':
          piece = 'Knight';
          break;
        case 'b':
          piece = 'Bishop';
          break;

        case 'q':
          piece = 'Queen';
          break;

        case 'k':
          piece = 'King';
          break;

        case 'p':
          piece = 'Pawn';
          break;
        default:
          return null;
      }
      return pieceColor + piece;
    };

    this.resetBoard();

    //===============================================
    //translate fen code into board info
    //===============================================
    fenDivided.forEach((fenWord) => {
      let currentWordCount = 0;
      for (let wordIndex = 0; wordIndex < fenWord.length; wordIndex++) {
        //check if current letter is number. If yes -> loop for that amount and generate empty tiles
        if (isNumber(fenWord[wordIndex])) {
          for (let i = 0; i < Number.parseInt(fenWord[wordIndex]); i++) {
            this.boardInfo[currentTileIndex]['piece'] = null;
            this.boardInfo[currentTileIndex]['pieceUrl'] = null;
            currentTileIndex++;
            currentWordCount++;
          }
          continue;
        }
        //check if piece code is known
        if (!checkPiece(fenWord[wordIndex])) {
          boardValid = false;
          continue;
        }
        //set piece url and piece name
        this.boardInfo[currentTileIndex]['pieceUrl'] = this._getPiece(
          checkPiece(fenWord[wordIndex])
        );

        this.boardInfo[currentTileIndex]['piece'] = checkPiece(
          fenWord[wordIndex]
        );

        currentTileIndex++;
        currentWordCount++;
      }

      if (currentWordCount != 8) {
        boardValid = false;
      }
    });

    if (move) {
      this.generateArrow(move);
    }

    if (!boardValid || currentTileIndex > 64) {
      console.log('invalid fen code');
    }

    console.log(this.boardInfo);

    return this.boardInfo;
  }

  generateFenCode() {
    let fenCode = [];

    for (let x = 0; x < 8; x++) {
      let fenWord = '';
      let fenNumber = 0;

      for (let y = 0; y < 8; y++) {
        let piece = this.boardInfo[y + 8 * x]['piece'];
        if (piece) {
          const fenLetter = piece.includes('Knight') ? 'n' : piece[1];

          if (fenNumber > 0) {
            fenWord += fenNumber.toString();
            fenNumber = 0;
          }

          fenWord +=
            piece[0] == 'w' ? fenLetter.toUpperCase() : fenLetter.toLowerCase();
        } else {
          fenNumber++;

          if (fenNumber == 8 || y == 7) fenWord += fenNumber;
        }
      }
      fenCode.push(fenWord);
    }
    return fenCode.join('/');
  }

  previewMove(moves: string[]) {
    moves.forEach((move) => {});
  }

  _tileColumn(tileIndex: number) {
    return tileIndex - Math.floor(tileIndex / 8) * 8;
  }
  _tileRow(tileIndex: number) {
    return Math.floor(tileIndex / 8);
  }
  _tileColor(n: number) {
    return (
      (Math.floor(n / 8) + (n - Math.floor(n / 8) * 8)) % 2 == this.flipBoard
    );
  }
  _getPiece(pieceName: string) {
    return `../../assets/images/chessPieces/${pieceName}.png`;
  }
}
