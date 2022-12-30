import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CardService } from '../shared/card.service';
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
  game;

  activeBtn: boolean = false;

  private _gameSent = false;
  constructor(
    private cardService: CardService,

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
    const whiteId =
      color == 'w' ? this.cardService.currentUser.id : this.user.id;
    const blackId =
      color == 'w' ? this.user.id : this.cardService.currentUser.id;
    this.game = [whiteId, blackId];
  }
  ngOnDestroy(): void {
    if ((this.activeBtn || this.move) && !this._gameSent) {
      this.messageService.createMessage(
        [this.user.id, this.cardService.currentUser.id],
        'system',
        this.cardService.currentUser.name + ' invited you to chess match!'
      );
      this.messageService.createGame(this.game[0], this.game[1]);
      console.log(this.move);

      if (this.move) {
        this.messageService.updateGame(
          [this.user.id, this.cardService.currentUser.id],
          this.move
        );
      }

      this.cardService.emitUsersObs();
    }
  }
}
