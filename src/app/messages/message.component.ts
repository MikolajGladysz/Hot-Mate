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
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent implements OnInit, OnChanges {
  matchedUser: User;
  localUser: User;
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
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  currentMessageEmoji;
  messageInput;

  ngOnInit(): void {
    // On url change, get id from url and find user
    this.route.params.subscribe((params: Params) => {
      this.newGameWindow = false;
      this.matchedUser = this.cardService.users.find(
        (user) => user.id === params['id']
      );
      this.localUser = this.authService.user.getValue();
      if (!this.matchedUser) {
        this.closeMessageWindow();
      }
      this.messages = this.messageService.findMessage([
        this.localUser.id,
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
        this.localUser.id,
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
    this.router.navigate(['/app']);
  }
  sendMessage(
    message: string,
    from = this.localUser.id,
    reactionMessage = this.reactTo
  ) {
    this.messageService.createMessage(
      [this.localUser.id, this.matchedUser.id],
      from,
      message,
      reactionMessage ? reactionMessage['target'] : null
    );

    this.cardService.emitUsersObs();
    this.messageInput = '';
    this.reactTo = null;
    this.messages = this.messageService.findMessage([
      this.localUser.id,
      this.matchedUser.id,
    ]);

    if (Math.floor(Math.random() * 3) + 1 > 1 && from == this.localUser.id) {
      this.sendMessage(
        'Sorry i dont speak england, lets play chess ;)',
        this.matchedUser.id
      );
    }
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
  showEmoji(ev, id) {
    console.dir(ev.target.closest('.show-emoji-button'));
    function getOffset(el) {
      const rect = el.getBoundingClientRect();
      return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
      };
    }
    const offset = getOffset(ev.target.closest('.show-emoji-button'));

    // this.showEmojiOffset = [offset.left + 236, offset.top - 44];
    this.showEmojiOffset = [offset.left - 140, offset.top - 44];
    if (window.innerWidth < this.showEmojiOffset[0] + 307) {
      this.showEmojiOffset[0] -=
        this.showEmojiOffset[0] + 307 - window.innerWidth;
    }

    this.currentMessageEmoji = this.messages.content[id];
  }

  sendEmoji(ev) {
    const emojiBtn = ev.target.closest('button');
    if (!emojiBtn) return;

    const emojiId = emojiBtn.dataset.emojiid;
    this.currentMessageEmoji.emojiId = emojiId;
  }
}
