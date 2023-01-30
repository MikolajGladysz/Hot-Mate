import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
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
  localUser: User;
  currentUser: User;
  messageInput;
  @Input() nextMove: string;

  //used for game preview in detail window
  @Input() gamePreviewMoves: string[];

  //Only true in new match window
  @Input() firstMove: boolean = false;
  @Input() userMatch: User;
  @Input() movesInput: string[];

  //In create account component
  @Input() gameEdit: boolean;

  @Output() newFirstMove = new EventEmitter<[string, string]>();

  //[0] - moves, [1] - fen code
  //for account creation
  @Output() gameEditData = new EventEmitter<[string[], string]>();

  @Input() flipBoard: boolean = false;
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
    private gameStatus: GameStatus,
    private authService: AuthService
  ) {}
  turn: number;

  ngOnInit(): void {
    this.localUser = this.authService.user.getValue();

    if (this.gameEdit) {
      this.moves = [];
      this.fenCodes = ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'];
      this.turn = 0;

      if (this.movesInput) {
        this.moves = this.movesInput;
        this.fenCodes = this.chessRulesService.movesToFenCode(this.moves);
        this.turn = this.fenCodes.length;
      }

      this._boardInfo = this.chessRulesService.generateBoard(
        this.fenCodes.at(-1)
      );
      this.chessRulesService.subject.next({ fenCode: this.fenCodes.at(-1) });
      this.gameResult = 0;

      return;
    }

    if (this.firstMove) {
      this.flipBoard = false;
      this.turn = 0;
      if (this.nextMove) this.moves = [this.nextMove];
    }

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
        this.localUser.id,
        this.currentUser.id,
      ]);
      if (this.currentGame.whiteId == this.currentUser.id && !this.firstMove) {
        this.flipBoard = true;

        this.playerColor = 1;
      }

      this._getCurrentMoves();
    } else {
      this.moves = this.gamePreviewMoves;
    }

    this._loadGame();
  }
  ngOnDestroy(): void {
    if (this.gamePreviewMoves || this.gameEdit) return;
    const fenCode = this.chessRulesService.generateFenCode();

    this.currentGame.fenCode = fenCode;
    this.currentGame.moves = this.moves;
  }

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

    this.gameEditData.emit([this.moves, this.fenCodes.at(-1)]);

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

    if (
      this.turn % 2 != this.playerColor &&
      this.gameResult == 0 &&
      !this.gameEdit
    ) {
      this._GMlevelChessEngine();
    }
  }

  pieceInfo(pieceIndex: number) {
    if (this.firstMove) {
      this.turn = 0;
    }

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
      (this._boardInfo[pieceIndex]['piece'][0] ==
        (this.playerColor == 0 ? 'w' : 'b') &&
        this.turn % 2 == this.playerColor) ||
      (this.gameEdit &&
        this._boardInfo[pieceIndex]['piece'][0] ==
          (this.turn % 2 == 0 ? 'w' : 'b'))
    ) {
      //check legal moves for selected piece
      this._legalMoves = this.chessRulesService.checkLegalMoves(
        pieceIndex,

        this._boardInfo
      );
    }
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
    if (!this.firstMove) this.moves = this.currentGame.moves;

    if (!this.moves) this.moves = [];
    this.turn = this.moves.length;
  }
  _addMoveToGame(move: string) {
    this.messageService.updateGame(
      [this.currentUser.id, this.localUser.id],
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
    this.messageService.createGame(this.localUser.id, this.currentUser.id);
    this.currentGame = this.messageService.getCurrentGame([
      this.localUser.id,
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
    if (this.playerColor == 1 && this.turn == 0) {
      this._GMlevelChessEngine();
    }
  }

  loadGamePreview(gameId: number) {
    this.currentGame = this.messageService.findMessage([
      this.currentUser.id,
      this.localUser.id,
    ]).games[gameId];
    this._getCurrentMoves();
    this._loadGame();
  }

  private _loadGame() {
    this.fenCodes = this.chessRulesService.movesToFenCode(this.moves);
    if (!this.fenCodes || this.fenCodes.length == 0)
      this.fenCodes = ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'];

    this._boardInfo = this.chessRulesService.generateBoard(
      this.fenCodes.at(-1)
    );

    this.chessRulesService.subject.next({ fenCode: this.fenCodes.at(-1) });
    this.turn = this.moves.length;
    this.gameResult = this.currentGame.status;

    if (this.turn % 2 != this.playerColor && !this.firstMove) {
      this._GMlevelChessEngine();
    }
  }

  private _GMlevelChessEngine() {
    const allEnemyPieces = this._boardInfo.filter(
      (val) => val.piece && val?.piece[0] == (this.playerColor == 0 ? 'b' : 'w')
    );
    function get_random(list) {
      return list[Math.floor(Math.random() * list.length)];
    }
    let selectAppropriatePiece = () => {
      const randomPiece = get_random(allEnemyPieces);
      const randomPieceLegalMoves = this.chessRulesService.checkLegalMoves(
        randomPiece.index,
        this._boardInfo
      );

      if (randomPieceLegalMoves.length == 0) selectAppropriatePiece();
      else {
        this._legalMoves = randomPieceLegalMoves;

        this.moveInfo([randomPiece.index, randomPieceLegalMoves.at(-1)]);
      }
    };
    selectAppropriatePiece();
  }
  //=====================================
}
