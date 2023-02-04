import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CardService } from '../shared/card.service';
import { User } from '../shared/models/user.model';
import { MessageService } from '../shared/message.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-new-match',
  templateUrl: './new-match.component.html',
  styleUrls: ['./new-match.component.css'],
})
export class NewMatchComponent implements OnInit {
  user: User;
  currPhoto = 1;
  messageInput;
  displayBoard = false;
  move: string = '';
  game;
  activeBtn: boolean = false;

  private localUser: User;
  constructor(
    private cardService: CardService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}
  @HostListener('document:click', ['$event'])
  closeWindowOnClick(e) {
    if (
      !e.target.closest('.new-match-con') &&
      !e.target.closest('.chess-board')
    ) {
      this.closeWindow();
    }
  }

  ngOnInit(): void {
    // TODO: get user from api
    this.user = this.cardService.users.at(-1);
    this.localUser = this.authService.user.getValue();
    this.messageService.createNewMessageThread([
      this.localUser.id,
      this.user.id,
    ]);
  }
  changePhoto(i: number) {
    if (
      this.currPhoto + i > 0 &&
      this.currPhoto + i <= this.user.photos.length
    ) {
      this.currPhoto = this.currPhoto + i;
    }
  }
  goToPage(i: number) {
    this.currPhoto = i + 1;
  }
  closeWindow() {
    if (this.activeBtn || this.move) {
      this.messageService.createMessage(
        [this.user.id, this.localUser.id],
        'system',
        this.localUser.name + ' invited you to chess match!'
      );
      this.messageService.createGame(this.game[0], this.game[1]);

      if (this.move) {
        this.messageService.updateGame(
          [this.user.id, this.localUser.id],
          this.move
        );
      }

      this.cardService.emitUsersObs();
    }
    this.cardService.newMatch(null);
  }
  sendMessage() {
    if (this.messageInput) {
      this.messageService.createMessage(
        [this.user.id, this.localUser.id],
        this.localUser.id,
        this.messageInput
      );
    }

    this.cardService.emitUsersObs();
    this.closeWindow();
  }
  createGame(color: string) {
    const whiteId = color == 'w' ? this.localUser.id : this.user.id;
    const blackId = color == 'w' ? this.user.id : this.localUser.id;
    this.game = [whiteId, blackId];
  }
}
