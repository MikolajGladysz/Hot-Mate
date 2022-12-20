import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CardService } from '../shared/card.service';
import { User } from '../shared/models/user.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GameService } from '../shared/game.service';
import { MessageService } from '../shared/message.service';
import { Messages } from '../shared/models/message.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent implements OnInit, OnChanges {
  matchedUser: User;
  currentUser: User;
  messages: Messages;
  @Input() chessGame: boolean = false;
  @Input() reaction;
  reactTo: { target: string; id: string };
  constructor(
    private cardService: CardService,
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private messageService: MessageService
  ) {}

  messageInput;

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.matchedUser = this.cardService.users.find(
        (user) => user.id === params['id']
      );
      this.currentUser = this.cardService.currentUser;
      if (!this.matchedUser) {
        this.closeMessageWindow();
      }
      this.messages = this.messageService.findMessage([
        this.currentUser.id,
        this.matchedUser.id,
      ]);
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.reactTo = changes['reaction'].currentValue;
  }

  _createGame(whiteId: string, blackId: string) {
    this.gameService.createGame(whiteId, blackId);
    // this.router.navigate(['game']);
  }
  _getDate(date: number) {
    return new Date(date).toDateString();
  }
  _reactToMessage(index: number) {
    this.reactTo = {
      target: this.messages.content[index].text,
      id: index.toString(),
    };
  }
  closeMessageWindow() {
    this.router.navigate(['/']);
  }
  sendMessage(
    message: string,
    from = this.currentUser.id,
    reactionMessage = this.reactTo
  ) {
    this.messageService.createMessage(
      [this.currentUser.id, this.matchedUser.id],
      from,
      message,
      reactionMessage ? reactionMessage['target'] : null
    );

    this.cardService.emitUsersObs();
    this.messageInput = '';
    this.reactTo = null;
    this.messages = this.messageService.findMessage([
      this.currentUser.id,
      this.matchedUser.id,
    ]);
    console.log(this.messages);
  }
}
