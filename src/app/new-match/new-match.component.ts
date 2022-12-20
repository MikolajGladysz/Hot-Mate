import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CardService } from '../shared/card.service';
import { Game } from '../shared/models/game.model';
import { GameService } from '../shared/game.service';
import { User } from '../shared/models/user.model';
import { MessageService } from '../shared/message.service';

@Component({
  selector: 'app-new-match',
  templateUrl: './new-match.component.html',
  styleUrls: ['./new-match.component.css'],
})
export class NewMatchComponent implements OnInit, OnDestroy {
  user: User;
  currPhoto = 1;
  messageInput;
  displayBoard = false;
  move: string = '';
  game: Game;

  activeBtn: boolean = false;

  private _gameSent = false;
  constructor(
    private cardService: CardService,
    private gameService: GameService,
    private messageService: MessageService
  ) {}
  @HostListener('document:click', ['$event'])
  closeWindow(e) {
    if (
      !e.target.closest('.new-match-con') &&
      !e.target.closest('.chess-board')
    ) {
      this._closeWindow();
    }
  }

  ngOnInit(): void {
    this.user = this.cardService.users[this.cardService.users.length - 1];
  }
  _changePhoto(i: number) {
    if (
      this.currPhoto + i > 0 &&
      this.currPhoto + i <= this.user.photos.length
    ) {
      this.currPhoto = this.currPhoto + i;
    }
  }
  _goToPage(i: number) {
    this.currPhoto = i + 1;
  }
  _closeWindow() {
    this.cardService.newMatch(null);
  }
  _sendMessage() {
    console.log(this.messageInput);

    if (this.activeBtn || this.move) {
      this.messageService.createMessage(
        [this.user.id, this.cardService.currentUser.id],
        'system',
        this.cardService.currentUser.name + ' invited you to chess match!'
      );
      this._gameSent = true;
    }
    if (this.messageInput) {
      this.messageService.createMessage(
        [this.user.id, this.cardService.currentUser.id],
        this.cardService.currentUser.id,
        this.messageInput
      );
    }

    this.cardService.emitUsersObs();
    this._closeWindow();
  }
  _createGame(color: string) {
    const whiteId = color == 'w' ? 'current User' : this.user.id;
    const blackId = color == 'w' ? this.user.id : 'current User';
    this.game = {
      id: Math.random().toString(36).slice(2, 10),
      whiteId: whiteId,
      blackId: blackId,
      moves: this.move,
    };
  }
  ngOnDestroy(): void {
    if ((this.activeBtn || this.move) && !this._gameSent) {
      this.gameService.addGame(this.game);
      this.messageService.createMessage(
        [this.user.id, this.cardService.currentUser.id],
        'system',
        this.cardService.currentUser.name + ' invited you to chess match!'
      );
    }
  }
}
