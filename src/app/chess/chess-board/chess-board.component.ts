import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ChessRulesService } from '../chess-rules.service';
import { Tile } from '../tile-info';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css'],
})
export class ChessBoardComponent implements OnInit {
  @Input() fenCode: string;
  @Input() flipBoard: number = 0;
  @Input() nextMove: string;
  //Only true in new match window
  @Input() firstMove: boolean = false;

  @Output() newFirstMove = new EventEmitter<string>();

  _boardInfo: Tile[];
  _legalMoves: number[] = [];

  private initialBoardState = 'rnbq1bnr/pppkpppp/8/5P2/8/8/PPP1PPPP/R3K2R';

  private mouseDown: boolean = false;
  private selectedPieceImg: HTMLElement;
  private selectedPieceTile: HTMLElement;
  private currentTile: HTMLElement;
  private turn: number = 0;

  // 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
  constructor(private chessRulesService: ChessRulesService) {}

  ngOnInit(): void {
    //generate board with fenCode provided by parent or initial board state
    this._boardInfo = this.chessRulesService.generateBoard(
      this.fenCode ? this.fenCode : this.initialBoardState,
      this.nextMove ? this.nextMove : ''
    );
  }

  @HostListener('dragstart', ['$event.target'])
  selectPiece(event) {
    this._legalMoves = [];

    //Check if appropriate piece is selected
    //If first move is true, move only white piece

    if (
      this._boardInfo[+event.closest('.chess-tile')?.dataset['index']][
        'piece'
      ][0] == (this.turn % 2 == 0 || this.firstMove ? 'w' : 'b')
    ) {
      this.mouseDown = true;
      this.selectedPieceImg = event.closest('img');
      this.selectedPieceTile = event.closest('.chess-tile');

      if (this.firstMove) {
        this.chessRulesService.generateBoard();
      }

      //check if piece is moved only once if first move is true
      if (
        this._boardInfo[+event.closest('.chess-tile').dataset['index']]['row'] <
          6 &&
        this.firstMove
      ) {
        this.turn = 0;
        return;
      }

      //check legal moves for selected piece
      this._legalMoves = this.chessRulesService.checkLegalMoves(
        this._boardInfo[+event.closest('.chess-tile').dataset['index']]
      );
    }
  }

  @HostListener('document:click', ['$event.target'])
  highlightTile(event) {
    this._legalMoves = [];
    if (!event.closest('.chess-tile')) return;

    //Show possible moves if piece is selected
    if (
      this._boardInfo[+event.closest('.chess-tile').dataset['index']]['piece']
    ) {
      this._legalMoves = this.chessRulesService.checkLegalMoves(
        this._boardInfo[+event.closest('.chess-tile').dataset['index']]
      );
    }

    //Highlight current tile
    this._legalMoves.push(
      +(event.closest('.chess-tile') as HTMLElement).dataset['index']
    );
  }

  _resetPieceImg(pieceImg: HTMLElement) {
    pieceImg.style.position = 'static';
    pieceImg.style.pointerEvents = 'all';
    pieceImg.style.width = '50px';
    pieceImg.style.height = '50px';
    pieceImg.style.top = 'unset';
    pieceImg.style.left = 'unset';

    return pieceImg;
  }

  @HostListener('document:dragend', ['$event'])
  placePiece() {
    this.mouseDown = false;

    // if (this.firstMove && this.turn > 0) {
    // }
    //check if piece was placed on legal tile
    if (this._legalMoves.indexOf(+this.currentTile?.dataset['index']) != -1) {
      this._boardInfo = this.chessRulesService.movePiece(
        +this.selectedPieceTile.dataset['index'],
        +this.currentTile.dataset['index']
      );

      this.turn++;
      if (this.firstMove) {
        this._legalMoves = [];
        this.chessRulesService.moves = [this.chessRulesService.moves.at(-1)];
        this.chessRulesService.generateArrow(this.chessRulesService.moves[0]);
        this.newFirstMove.emit(this.chessRulesService.moves[0]);
        return;
      }
    } else {
      this._resetPieceImg(this.selectedPieceImg);
    }
    this._legalMoves = [];
  }

  @HostListener('drag', ['$event'])
  movePiece(event: DragEvent) {
    if (this.mouseDown) {
      this.selectedPieceImg.style.position = 'fixed';
      this.selectedPieceImg.style.width = '60px';
      this.selectedPieceImg.style.height = '60px';
      this.selectedPieceImg.style.pointerEvents = 'none';
      this.selectedPieceImg.style.top = event.clientY - 25 + 'px';
      this.selectedPieceImg.style.left = event.clientX - 25 + 'px';
    }
  }
  @HostListener('dragover', ['$event'])
  currentTileDrag(event: DragEvent) {
    this.currentTile = (event.target as HTMLElement).closest('.chess-tile');
  }
}
