import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
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
export class ChessBoardComponent implements OnInit, OnDestroy {
  @Input() flipBoard: boolean = false;
  @Input() fenCode: [string, string];
  @Input() gamePreview: boolean = false;

  @Input()
  set tilesToHighlight(value: number[]) {
    this._legalMoves = value;
  }

  @Output() pieceInfo = new EventEmitter<number>();
  @Output() moveInfo = new EventEmitter<[number, number]>();

  //=======================
  _boardInfo: Tile[] = [];

  _legalMoves: number[] = [];

  private mouseDown: boolean = false;
  private selectedPieceImg: HTMLElement;
  private selectedPieceTile: HTMLElement;
  private currentTile: HTMLElement;

  private copySubscription;

  private _startOffset: number[];
  private _lastClickedPieceIndex: number;

  constructor(private chessRulesService: ChessRulesService) {
    this._legalMoves = [];

    this.copySubscription = this.chessRulesService.subject.subscribe((data) => {
      if (!this.gamePreview) {
        this._boardInfo = chessRulesService.generateBoard(
          data.fenCode,
          data.move
        );
      }
    });

    if (this.gamePreview) {
      this.chessRulesService.subject.unsubscribe();
    }
  }

  ngOnInit(): void {
    if (this.fenCode) {
      this._boardInfo = this.chessRulesService.generateBoard(
        this.fenCode[0],
        this.fenCode[1]
      );
    }
  }
  ngOnDestroy(): void {
    this.copySubscription.unsubscribe();
    this._boardInfo = [];
    this._legalMoves = [];
    this.fenCode = null;
  }

  @HostListener('dragstart', ['$event'])
  selectPiece(event) {
    if (this.gamePreview) return;

    this.pieceInfo.emit(+event.target.closest('.chess-tile').dataset['index']);

    if (
      this._boardInfo[+event.target.closest('.chess-tile')?.dataset['index']][
        'piece'
      ]
    ) {
      this.mouseDown = true;
      this.selectedPieceImg = event.target.closest('img');
      this.selectedPieceTile = event.target.closest('.chess-tile');
      this._startOffset = [event.pageX, event.pageY];
    }
  }

  @HostListener('document:click', ['$event.target.closest(".chess-tile")'])
  highlightTile(event) {
    if (!event) {
      this._lastClickedPieceIndex = null;
      return;
    }

    if (this._legalMoves.includes(+event.dataset['index'])) {
      this.moveInfo.emit([
        +this._lastClickedPieceIndex,
        +event.dataset['index'],
      ]);
      this._lastClickedPieceIndex = null;

      return;
    }

    // this._legalMoves = [];
    this.pieceInfo.emit(+event.dataset['index']);
    this._lastClickedPieceIndex = +event.dataset['index'];
  }

  _resetPieceImg(pieceImg: HTMLElement) {
    pieceImg.style.pointerEvents = 'all';
    pieceImg.style.transform = 'unset';
    return pieceImg;
  }

  @HostListener('document:dragend', ['$event'])
  placePiece() {
    if (this.gamePreview) return;

    this.mouseDown = false;
    this._resetPieceImg(this.selectedPieceImg);
    this.moveInfo.emit([
      +this.selectedPieceTile.dataset['index'],
      +this.currentTile.dataset['index'],
    ]);

    this._legalMoves = [];
  }

  @HostListener('drag', ['$event'])
  movePiece(event: DragEvent) {
    if (this.gamePreview) return;

    if (this.mouseDown && event.clientY != 0) {
      this.selectedPieceImg.style.pointerEvents = 'none';
      this.selectedPieceImg.style.transform =
        'translate(' +
        (event.pageX - this._startOffset[0]) +
        'px,' +
        (event.pageY - this._startOffset[1]) +
        'px)';
    }
  }
  @HostListener('dragover', ['$event'])
  currentTileDrag(event: DragEvent) {
    if (this.gamePreview) return;

    this.currentTile = (event.target as HTMLElement).closest('.chess-tile');
  }
}
