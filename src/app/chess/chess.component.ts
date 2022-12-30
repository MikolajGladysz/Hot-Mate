import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardService } from '../shared/card.service';
import { MessageService } from '../shared/message.service';
import { User } from '../shared/models/user.model';
import { ChessRulesService } from './chess-rules.service';

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.css'],
})
export class ChessComponent implements OnInit, OnDestroy {
  currentUser: User;
  messageInput;

  moves: string[];
  fenCode: string;
  private urlId: string;
  reaction: { target: string; id: string };
  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private cardService: CardService,
    private chessRulesService: ChessRulesService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.urlId = params['id'];
    });
    this._getCurrentMoves();
    this.currentUser = this.cardService.findUser(this.urlId);

    this.fenCode = this.messageService.getCurrentGame([
      this.cardService.currentUser.id,
      this.currentUser.id,
    ]).fenCode;
  }
  ngOnDestroy(): void {
    const fenCode = this.chessRulesService.generateFenCode();
    this.messageService.getCurrentGame([
      this.cardService.currentUser.id,
      this.currentUser.id,
    ]).fenCode = fenCode;
  }
  sendReaction(event) {
    this.reaction = {
      target: event.target.innerText,
      id: event.target.dataset['id'],
    };
  }
  _getCurrentMoves() {
    this.moves = this.messageService.getCurrentGame([
      this.urlId,
      this.cardService.currentUser.id,
    ]).moves;

    if (!this.moves) this.moves = [];
    this.chessRulesService.turn = this.moves.length;
  }
  _addMoveToGame(move: string) {
    this.messageService.updateGame(
      [this.urlId, this.cardService.currentUser.id],
      move
    );

    this.moves.push(move);
    if (this.moves.at(-1) == this.moves.at(-2)) this.moves.pop();
  }
}
