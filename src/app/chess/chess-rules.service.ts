import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Tile } from './tile-info';

@Injectable({
  providedIn: 'root',
})
export class ChessRulesService implements OnInit {
  private flipBoard: number = 0;
  private boardInfo: Tile[];
  move: string;
  subject: Subject<{ fenCode: string; move?: string }> = new Subject<{
    fenCode: string;
    move?: string;
  }>();

  kingChecked: boolean;

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

  _resetTile(tileIndex: number, resetTarget) {
    if (!tileIndex && tileIndex != 0) return;

    resetTarget[tileIndex]['piece'] = null;
    resetTarget[tileIndex]['pieceUrl'] = null;
    delete resetTarget[tileIndex]['moved'];
  }

  private _addToSet(num: number, color: string) {
    if (color == 'w') {
      this.attackedSquaresW.add(num);
    } else {
      this.attackedSquaresB.add(num);
    }
  }

  private _checkAllAttackedSquares(boardInfo: Tile[]) {
    this.attackedSquaresB = new Set();
    this.attackedSquaresW = new Set();

    //for each piece on board
    boardInfo.forEach((tile) => {
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
      this.checkLegalMoves(+tile['index'], boardInfo, true).forEach((val) => {
        this._addToSet(val, tile.piece[0]);
      });
    });

    return {
      w: Array.from(this.attackedSquaresW),
      b: Array.from(this.attackedSquaresB),
    };
  }

  checkLegalMoves(
    tileIndex: number,
    InputBoardInfo: Tile[],
    futureMove = false
  ) {
    let boardInfo = [];
    InputBoardInfo.forEach((tile) => {
      boardInfo.push(Object.assign({}, tile));
    });

    let newLegalMoves = [];
    const tileDataSet = boardInfo[tileIndex];

    const currentPieceColor = tileDataSet['piece'][0];

    const isKing = tileDataSet['piece'].includes('King');

    const startPosition = +tileDataSet['index'];
    const row = +boardInfo[startPosition]['row'];
    const column = +boardInfo[startPosition]['column'];

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
            boardInfo[startPosition + moveSet[directionIndex] * (n + 1)];

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
      if (
        isKing &&
        tileDataSet['column'] == 4 &&
        !futureMove &&
        !tileDataSet['moved']
      ) {
        const attackedSquares = Array.from(
          currentPieceColor == 'w'
            ? this.attackedSquaresB
            : this.attackedSquaresW
        );

        if (
          !boardInfo[startPosition + 1]['piece'] &&
          !boardInfo[startPosition + 2]['piece'] &&
          boardInfo[startPosition + 3]['piece'] &&
          boardInfo[startPosition + 3]['piece']?.includes('Rook') &&
          !boardInfo[startPosition + 3]['moved']
        ) {
          if (
            !(
              attackedSquares.includes(startPosition + 1) ||
              attackedSquares.includes(startPosition + 2)
            )
          )
            newLegalMoves.push(startPosition + 2);
        }
        //queen side
        if (
          !boardInfo[startPosition - 1]['piece'] &&
          !boardInfo[startPosition - 2]['piece'] &&
          !boardInfo[startPosition - 3]['piece'] &&
          boardInfo[startPosition - 4]['piece'] &&
          boardInfo[startPosition - 4]['piece']?.includes('Rook') &&
          !boardInfo[startPosition - 4]['moved']
        ) {
          if (
            !(
              attackedSquares.includes(startPosition - 1) ||
              attackedSquares.includes(startPosition - 2)
            )
          )
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
        if (boardInfo[startPosition + direction * n]['piece']) {
          break;
        }

        newLegalMoves.push(startPosition + direction * n);
      }

      // check capturing pieces to the side if there is enemy piece on target square
      //right side: pawn is not standing on h column
      if (
        boardInfo[startPosition + (direction == 8 ? 9 : -7)]['piece'] &&
        boardInfo[startPosition + (direction == 8 ? 9 : -7)]['piece'][0] !=
          currentPieceColor &&
        column != 7
      ) {
        newLegalMoves.push(startPosition + (direction == 8 ? 9 : -7));
      }
      //left side: pawn is not standing on a column
      if (boardInfo[startPosition + (direction == 8 ? 7 : -9)]['piece']) {
        if (
          boardInfo[startPosition + (direction == 8 ? 7 : -9)]['piece'][0] ==
            (direction == 8 ? 'w' : 'b') &&
          column != 0
        ) {
          newLegalMoves.push(startPosition + (direction == 8 ? 7 : -9));
        }
      }

      //Google en Passant
      //if piece on left or right is en passantable

      if (
        this.enPassant + 1 == startPosition ||
        this.enPassant - 1 == startPosition
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
        const targetSquare = boardInfo[startPosition + knightMoves[n]];
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

    if (futureMove) {
      return [...newLegalMoves];
    }

    newLegalMoves = newLegalMoves.filter((move) => {
      const returnVal = this.movePiece(
        tileDataSet.index,
        move,
        tileDataSet.piece[0]
      );
      return returnVal;
    });

    this.legalMoves = [];
    this.legalMoves.push(...newLegalMoves);

    return this.legalMoves;
  }

  movePiece(
    oldTileIndex: number,
    newTileIndex: number,
    checkFutureMoveColor = null
  ): Tile[] | boolean {
    let newBoardInfo = [];

    this.boardInfo.forEach((tile) => {
      newBoardInfo.push(Object.assign({}, tile));
    });

    const oldTile = newBoardInfo[oldTileIndex];
    const newTile = newBoardInfo[newTileIndex];

    if (!this.legalMoves.includes(newTile['index']) && !checkFutureMoveColor) {
      return newBoardInfo;
    }

    newTile['piece'] = oldTile['piece'];
    newTile['pieceUrl'] = oldTile['pieceUrl'];

    //en Passant
    if (
      +newTile['index'] ==
      this.enPassant + (oldTile['piece'][0] == 'w' ? -8 : 8)
    ) {
      this._resetTile(this.enPassant, newBoardInfo);
    }
    if (!checkFutureMoveColor) {
      this.enPassant = null;
    }

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

    this._resetTile(oldTile['index'], newBoardInfo);
    newTile['moved'] = true;

    //check for castle and move the rooks
    if (
      newTile['piece']?.includes('King') &&
      Math.abs(+oldTile['column'] - +newTile['column']) == 2 &&
      !checkFutureMoveColor
    ) {
      if (+newTile['column'] > +oldTile['column']) {
        newBoardInfo[+oldTile['index'] + 1]['piece'] =
          newBoardInfo[+oldTile['index'] + 3]['piece'];
        newBoardInfo[+oldTile['index'] + 3]['piece'] = null;
        newBoardInfo[+oldTile['index'] + 3]['pieceUrl'] = null;
      } else {
        newBoardInfo[+oldTile['index'] - 1]['piece'] =
          newBoardInfo[+oldTile['index'] - 4]['piece'];
        newBoardInfo[+oldTile['index'] - 4]['pieceUrl'] = null;
        newBoardInfo[+oldTile['index'] - 4]['piece'] = null;
      }
    }

    //promote to queen
    if (
      newTile['piece'].includes('Pawn') &&
      newTile['row'] == (newTile['piece'][0] == 'w' ? 0 : 7)
    ) {
      newTile['piece'] = newTile['piece'][0] + 'Queen';
    }

    this.legalMoves = [];

    //Prevents from moving into check
    if (checkFutureMoveColor) {
      if (this.check(newBoardInfo, checkFutureMoveColor)) {
        return false;
      } else {
        return true;
      }
    }

    this.boardInfo = newBoardInfo;

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

    return new Object(this.boardInfo) as Tile[];
  }
  movesToFenCode(moves: string[]) {
    let returnMoves: string[] = [];
    const allLegalMoves = Array(64)
      .fill('')
      .map((val, i) => i);
    this.boardInfo = this.generateBoard();
    moves.forEach((move) => {
      this.legalMoves = allLegalMoves;
      const tiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      const startPosition =
        (8 - Number.parseInt(move[1])) * 8 + tiles.indexOf(move[0]);
      const endPosition =
        (8 - Number.parseInt(move[3])) * 8 + tiles.indexOf(move[2]);

      this.movePiece(startPosition, endPosition);

      returnMoves.push(this.generateFenCode());
    });

    return returnMoves;
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

  private _tileColumn(tileIndex: number) {
    return tileIndex - Math.floor(tileIndex / 8) * 8;
  }
  private _tileRow(tileIndex: number) {
    return Math.floor(tileIndex / 8);
  }
  private _tileColor(n: number) {
    return (
      (Math.floor(n / 8) + (n - Math.floor(n / 8) * 8)) % 2 == this.flipBoard
    );
  }
  private _getPiece(pieceName: string) {
    return `../../assets/images/chessPieces/${pieceName}.svg`;
  }
  check(boardInfo: Tile[], pieceColor: 'w' | 'b') {
    //[0] - white king, [1] - black king
    const kingsPosition = ['w', 'b'].map(
      (kingColor) =>
        boardInfo.find((tile) => tile?.piece == kingColor + 'King')['index']
    );

    const attackedSquares = this._checkAllAttackedSquares(boardInfo);

    return attackedSquares[pieceColor == 'w' ? 'b' : 'w'].includes(
      kingsPosition[pieceColor == 'w' ? 0 : 1]
    );
  }
}
