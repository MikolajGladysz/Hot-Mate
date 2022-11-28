import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CardService } from '../shared/card.service';
import { User } from '../shared/user.model';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent implements OnInit {
  currUser: User;
  constructor(
    private cardService: CardService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  messageInput;

  @ViewChild('input') input: ElementRef;

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.currUser = this.cardService.users.find(
        (user) => user.id === params['id']
      );
      if (!this.currUser) {
        this.closeMessageWindow();
      }
    });
  }

  closeMessageWindow() {
    this.router.navigate(['/']);
  }
  sendMessage() {
    if (!this.currUser.messages) {
      this.currUser.messages = [];
    }
    this.currUser.messages.push({
      fromUser: true,
      message: {
        content: this.messageInput,
        date: '1111',
      },
    });

    this.cardService.emitUsersObs();

    this.messageInput = '';
  }
}
