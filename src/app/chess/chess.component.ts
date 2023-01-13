import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardService } from '../shared/card.service';
import { GameStatus } from '../shared/game-status.service';
import { MessageService } from '../shared/message.service';
import { User } from '../shared/models/user.model';
import { ChessRulesService } from './chess-rules.service';
import { Tile } from './tile-info';

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.css'],
})
export class ChessComponent implements OnInit, OnDestroy {
  currentUser: User;
  messageInput;
  @Input() nextMove: string;

  //used for game preview in detail window
  @Input() gamePreviewMoves: string[];

  //Only true in new match window
  @Input() firstMove: boolean = false;
  @Input() userMatch: User;

  @Output() newFirstMove = new EventEmitter<[string, string]>();

  flipBoard: boolean = false;
  GameFenCode: string;

  moves: string[];

  gameResult: number;
  gameResultString: string;

  fenCodes: string[] = [];
  _boardInfo: Tile[];
  _legalMoves: number[] = [];
  _boardPreview: boolean = false;
  _currentPreviewedMove: number;

  //0-white, 1-black
  private playerColor: number = 0;

  private currentGame;

  reaction: { target: string; id: string };
  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private cardService: CardService,
    private chessRulesService: ChessRulesService,
    private gameStatus: GameStatus
  ) {}
  turn: number;

  moveInfo(move: [number, number]) {
    //check if piece was placed on legal tile
    if (!this._legalMoves.includes(move[1])) return;

    this._boardInfo = this.chessRulesService.movePiece(
      move[0],
      move[1]
    ) as Tile[];

    if (
      !this._boardInfo
        .filter((tile) => {
          if (tile.piece) {
            return tile.piece[0] == (this.turn % 2 == 0 ? 'b' : 'w');
          }
          return false;
        })
        .find(
          (tile) =>
            this.chessRulesService.checkLegalMoves(tile.index, this._boardInfo)
              .length > 0
        )
    ) {
      if (
        this.chessRulesService.check(
          this._boardInfo,
          this.turn % 2 == 0 ? 'b' : 'w'
        )
      ) {
        this.gameResult = this.turn % 2 == 0 ? 1 : 2;
      } else {
        this.gameResult = 6;
      }

      this.currentGame.status = this.gameResult;
      this.gameResultString = this.gameStatus.getGameStatusString(
        this.gameResult
      );
    }

    const tiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    const moveString =
      tiles[move[0] % 8] +
      (8 - Math.floor(move[0] / 8)) +
      tiles[move[1] % 8] +
      (8 - Math.floor(move[1] / 8));

    this.moves.push(moveString);

    this.turn++;
    this.fenCodes.push(this.chessRulesService.generateFenCode());

    if (this.firstMove) {
      this.turn = 0;

      this.newFirstMove.emit([this.moves[0], this.fenCodes[0]]);
      this.turn = 0;
      this.chessRulesService.subject.next({
        fenCode: this.fenCodes.at(-1),
        move: this.moves[0],
      });
      this._legalMoves = [];
      return;
    }

    this.chessRulesService.subject.next({ fenCode: this.fenCodes.at(-1) });
    this._legalMoves = [];
  }
  pieceInfo(pieceIndex: number) {
    if (this.firstMove && this.fenCodes.length > 0) {
      this._boardInfo = this.chessRulesService.generateBoard(
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
      );
      this.fenCodes = [];
      this.moves = [];
      this.newFirstMove.emit(null);

      this.chessRulesService.subject.next({
        fenCode: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
      });
    }

    this._legalMoves = [];
    if (this._boardPreview) {
      this._boardPreview = false;

      this.chessRulesService.subject.next({ fenCode: this.fenCodes.at(-1) });
    }
    this._currentPreviewedMove = null;

    if (!this._boardInfo[pieceIndex]['piece']) return;

    if (
      this._boardInfo[pieceIndex]['piece'][0] ==
      (this.turn % 2 == this.playerColor ? 'w' : 'b')
    ) {
      //check legal moves for selected piece
      this._legalMoves = this.chessRulesService.checkLegalMoves(
        pieceIndex,

        this._boardInfo
      );
    }
  }

  ngOnInit(): void {
    if (!this.gamePreviewMoves) {
      if (this.userMatch) {
        this.currentUser = this.userMatch;
      } else {
        this.route.params.subscribe((params) => {
          const urlId = params['id'];
          this.currentUser = this.cardService.findUser(urlId);
        });
      }

      this.currentGame = this.messageService.getCurrentGame([
        this.cardService.currentUser.id,
        this.currentUser.id,
      ]);
      if (this.currentGame.whiteId == this.currentUser.id) {
        this.flipBoard = true;
      }

      this._getCurrentMoves();
    } else {
      this.moves = this.gamePreviewMoves;
    }
    this._loadGame();
  }

  ngOnDestroy(): void {
    if (this.gamePreviewMoves) return;
    const fenCode = this.chessRulesService.generateFenCode();

    this.currentGame.fenCode = fenCode;
    this.currentGame.moves = this.moves;
  }

  sendReaction(event) {
    this.reaction = {
      target: event.target.innerText,
      id: event.target.dataset['index'],
    };
    this._currentPreviewedMove = +event.target.dataset['index'];

    this.chessRulesService.subject.next({
      fenCode: this.fenCodes[this._currentPreviewedMove],
    });
    this._boardPreview = true;
  }
  _getCurrentMoves() {
    this.moves = this.currentGame.moves;

    if (!this.moves) this.moves = [];
    this.turn = this.moves.length;
  }
  _addMoveToGame(move: string) {
    this.messageService.updateGame(
      [this.currentUser.id, this.cardService.currentUser.id],
      move
    );

    this.moves.push(move);
    if (this.moves.at(-1) == this.moves.at(-2)) this.moves.pop();
  }
  _changePreviewMove(direction: number) {
    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

    if (!this._currentPreviewedMove && this._currentPreviewedMove != 0) {
      this._currentPreviewedMove = this.fenCodes.length - 1;
    }

    this._currentPreviewedMove = clamp(
      this._currentPreviewedMove + direction,
      0,
      this.fenCodes.length - 1
    );

    this.chessRulesService.subject.next({
      fenCode: this.fenCodes[this._currentPreviewedMove],
    });

    this._boardPreview = true;
  }

  newGame() {
    this.currentGame.moves = this.moves;
    this.messageService.createGame(
      this.cardService.currentUser.id,
      this.currentUser.id
    );
    this.currentGame = this.messageService.getCurrentGame([
      this.cardService.currentUser.id,
      this.currentUser.id,
    ]);

    this.moves = [];
    this.fenCodes = ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'];
    this.chessRulesService.subject.next({ fenCode: this.fenCodes.at(-1) });
    this._boardInfo = this.chessRulesService.generateBoard(
      this.fenCodes.at(-1)
    );
    this.gameResult = this.currentGame.status;

    this._legalMoves = [];
    this.turn = 0;
  }

  loadGamePreview(gameId: number) {
    this.currentGame = this.messageService.findMessage([
      this.currentUser.id,
      this.cardService.currentUser.id,
    ]).games[gameId];
    this._getCurrentMoves();
    this._loadGame();
  }

  private _loadGame() {
    this.fenCodes = this.chessRulesService.movesToFenCode(this.moves);
    if (!this.fenCodes)
      this.fenCodes = ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'];

    this._boardInfo = this.chessRulesService.generateBoard(
      this.fenCodes.at(-1)
    );

    this.chessRulesService.subject.next({ fenCode: this.fenCodes.at(-1) });
    this.turn = this.moves.length;
    this.gameResult = this.currentGame.status;
  }

  //=====================================
}
