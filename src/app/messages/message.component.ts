import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CardService } from '../shared/card.service';
import { User } from '../shared/models/user.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
  gamesWindow: boolean = false;
  newGameWindow: boolean = false;
  showEmojiOffset: [number, number];
  @Input() chessGame: boolean = false;
  @Input() reaction;

  @Output() loadGamePreview = new EventEmitter<number>();

  reactTo: { target: string; id: string };
  constructor(
    private cardService: CardService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  currentMessageEmoji;
  messageInput;

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.newGameWindow = false;
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
  @HostListener('click', ['$event.target'])
  hideNewGameWindow(click) {
    if (!click.closest('.btn-new-game')) this.newGameWindow = false;
    if (!click.closest('.show-emoji-button')) this.showEmojiOffset = null;
  }

  createGame(whiteId: string, blackId: string) {
    if (!this.messages)
      this.messages = this.messageService.createNewMessageThread([
        this.currentUser.id,
        this.matchedUser.id,
      ]);
    this.messageService.createGame(whiteId, blackId);
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
  }
  openGamesWindow() {
    this.gamesWindow = true;
  }
  showGame(
    gamePreview = true,
    gameId = this.messages?.games?.length ? this.messages.games.length - 1 : -2
  ) {
    if (
      (gameId == -2 || this.messages?.games?.at(-1).status != 0) &&
      !gamePreview
    ) {
      this.newGameWindow = true;
      return;
    }

    if (!this.router.url.includes('game'))
      this.router.navigate(['game'], { relativeTo: this.route });

    this.loadGamePreview.emit(gameId);
    this.gamesWindow = false;
  }
  test(ev: MouseEvent, message) {
    const rect = (ev.target as HTMLElement)
      .closest('button')
      .getBoundingClientRect();
    this.showEmojiOffset = [rect.top - 46, rect.left - 513];

    this.currentMessageEmoji = message;
  }
  sendEmoji(ev) {
    const emojiBtn = ev.target.closest('button');
    if (!emojiBtn) return;

    const emojiId = emojiBtn.dataset.emojiid;
    this.currentMessageEmoji.emojiId = emojiId;
    console.log(this.currentMessageEmoji);
  }
}
