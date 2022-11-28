import { Component, HostListener, OnInit } from '@angular/core';
import { CardService } from '../shared/card.service';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-new-match',
  templateUrl: './new-match.component.html',
  styleUrls: ['./new-match.component.css'],
})
export class NewMatchComponent implements OnInit {
  user: User;
  currPhoto = 1;
  messageInput;

  constructor(private cardService: CardService) {}
  @HostListener('document:click', ['$event'])
  closeWindow(e) {
    if (!e.target.closest('.new-match-con')) {
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
    if (!this.user.messages) {
      this.user.messages = [];
    }
    this.user.messages.push({
      fromUser: true,
      message: {
        content: this.messageInput,
        date: '123',
      },
    });
    this.cardService.emitUsersObs();
    this._closeWindow();
  }
}
