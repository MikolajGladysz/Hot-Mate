import { Component, Input, OnInit } from '@angular/core';
import { CardService } from '../shared/card.service';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-new-match',
  templateUrl: './new-match.component.html',
  styleUrls: ['./new-match.component.css'],
})
export class NewMatchComponent implements OnInit {
  @Input() user: User;
  currPhoto = 1;
  messageInput;

  constructor(private cardService: CardService) {}

  ngOnInit(): void {}
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
    if (!this.user.messanges) {
      this.user.messanges = [];
    }
    this.user.messanges.push({
      fromUser: true,
      messange: {
        content: this.messageInput,
        date: '123',
      },
    });
    this.cardService.emitUsersObs();
    this._closeWindow();
  }
}
