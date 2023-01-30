import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { CardService } from '../shared/card.service';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-swipe-card',
  templateUrl: './swipe-card.component.html',
  styleUrls: ['./swipe-card.component.css'],
})
export class SwipeCardComponent implements OnInit {
  @ViewChild('cardDrag', { static: true }) cardCon: ElementRef;
  @ViewChild('iconYeah', { static: true }) iconYeah: ElementRef;
  @ViewChild('iconNope', { static: true }) iconNope: ElementRef;

  @Output() detailUpdate = new EventEmitter<boolean>();

  //control card drag functionality
  rotate: number;
  mouseDown: boolean = false;
  swipeYeah: boolean = false;
  swipeNope: boolean = false;
  opacity: number = 0;

  swipeOnInit: number;
  //profile photo
  currPhoto = 1;
  //Fav games card
  currCard = 1;

  oldX: number = 0;
  oldY: number = 0;
  transformX: number = 0;
  transformY: number = 0;
  allowSwipe: boolean = true;

  dummy: User[] = [];

  ngOnInit(): void {
    if (this.cardService.dummyUser.length != 2) {
      this.dummy.push(
        this.cardService.generateUsers(1, true),
        this.cardService.generateUsers(1, true)
      );
      this.cardService.dummyUser = this.dummy;
    } else {
      this.dummy = this.cardService.dummyUser;
    }

    this._resetCard(this.cardCon);

    this.swipeOnInit = this.cardService.swipeOnInit;

    if (this.swipeOnInit) {
      setTimeout(() => {
        this._resetCard(this.cardCon, this.swipeOnInit);
        this.swipeOnInit = null;
      }, 0);
    }
    this.cardService.setSwipeOnInit(null);
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    //reset bottom icons size and background
    this._resetIcon();
    this.mouseDown = false;

    //decide if card is dragged enough to consider swipe (if drag>350px from origin)
    if (this.transformX > 350) {
      this._resetCard(this.cardCon, 1);
      return;
    }
    if (this.transformX < -350) {
      this._resetCard(this.cardCon, -1);
      return;
    } else {
      this._resetCard(this.cardCon);
      return;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  move(e: MouseEvent) {
    if (!this.mouseDown) return;

    //calculate change in mouse coordinates to determine drag direction.
    const x = this.oldX - e.x;
    const y = this.oldY - e.y;

    //disable pointer events to prevent text highlight during drag
    this.cardCon.nativeElement.classList.add('disable-pointer-event');

    //check if move event occured before to prevent moving card from wrong origin
    if (this.oldX != 0 && this.oldY != 0) {
      //updating transform value
      this.transformX = this.transformX + x;
      this.transformY = this.transformY + y;
      const clampNumber = (num, a, b) =>
        Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));

      const rotate = clampNumber(this.transformX / 30, -20, 20);

      //calculate size of bottom icons
      const size = clampNumber(70 - Math.abs(this.transformX / 10), 55, 70);

      //after moving card eathier left or right, update bottom icon size
      if (this.transformX > 10) {
        this._setIcon(this.iconNope, size);
        this.swipeNope = true;
        this.opacity = clampNumber(this.transformX / 400, 0, 1);
      }
      if (this.transformX < -10) {
        this._setIcon(this.iconYeah, size);
        this.swipeYeah = true;
        this.opacity = clampNumber(Math.abs(this.transformX) / 400, 0, 1);
      }
      //reset bottom icon size when changing drag direction
      if (this.transformX > -10 && this.transformX < 10) {
        this._resetIcon();
        this.swipeNope = false;
        this.swipeYeah = false;
      }

      //update card transform
      this.cardCon.nativeElement.style.transform =
        'translate(' +
        -this.transformX +
        'px,' +
        -this.transformY +
        'px) rotate(' +
        -rotate * this.rotate * 1.2 +
        'deg)';
    }

    this.oldX = e.x;
    this.oldY = e.y;
  }

  constructor(private cardService: CardService) {}

  _changePhoto(i: number) {
    if (
      this.currPhoto + i > 0 &&
      this.currPhoto + i <= this.dummy[0].photos.length
    ) {
      this.currPhoto = this.currPhoto + i;
    }
  }

  _resetCard(cardDrag: ElementRef, swipe?: number) {
    cardDrag.nativeElement.classList.remove('disable-pointer-event');
    this.oldX = 0;
    this.oldY = 0;

    if (swipe && this.allowSwipe) {
      this.currCard = 1;
      this.currPhoto = 1;

      //setting time for swipe left/right animation
      const time = 250 * Math.abs(swipe);

      //sending card off screen
      cardDrag.nativeElement.style.transition = 'transform ' + time + 'ms';

      const swipeTo = -this.transformX - 700 * swipe;
      cardDrag.nativeElement.style.transform =
        'translate(' +
        swipeTo +
        'px , ' +
        -this.transformY +
        'px) rotate(' +
        -12 * swipe +
        'deg)';
      this.allowSwipe = false;

      //reset card position after animation time
      setTimeout(() => {
        //always load 2 users to make sure there is new card already rendered behaing current card
        //after swipe animation end, reset 1st card posiotin, swap 2nd user in user arr with 1st, so new user is displayed TODO:get new user from server, after swap in arr

        if (swipe < 0) {
          console.log('pre', this.cardService.users.length);
          this.cardService.newMatch(this.dummy[0]);

          // this.cardService.addUser(this.dummy[0])
        }
        this.dummy[0] = this.dummy[1];
        this.dummy[1] = this.cardService.generateUsers(1, true);
        this.cardService.dummyUser = this.dummy;

        cardDrag.nativeElement.style.transition = 'transform 0ms';
        cardDrag.nativeElement.style.transform = 'unset';

        this.allowSwipe = true;
      }, time);
    } else {
      //Simply reset position of card if there were no swipe
      cardDrag.nativeElement.style.transform = 'unset';
      cardDrag.nativeElement.style.transition =
        'transform 1s cubic-bezier(0.52, 0.11, 0, 1.33) 0s';
    }

    //reset transform origin values
    this.transformX = 0;
    this.transformY = 0;
  }

  //changing bottom icons look
  _setIcon(icon: ElementRef, size: number) {
    icon.nativeElement.style.width = size + 'px';
    icon.nativeElement.style.height = size + 'px';
  }

  //reseting bottom icons
  _resetIcon() {
    this.swipeNope = false;
    this.swipeYeah = false;

    this.iconNope.nativeElement.style.width = '70px';
    this.iconNope.nativeElement.style.height = '70px';

    this.iconYeah.nativeElement.style.width = '70px';
    this.iconYeah.nativeElement.style.height = '70px';
  }
  _goToPage(i: number) {
    this.currPhoto = i + 1;
  }

  mousedown(e) {
    //reset transition value to prevent drag lag
    this.cardCon.nativeElement.style.transition = 'transform 0s';
    //change rotate value regarding if user clicked bottom or top part of card
    if (e.offsetY > 300) {
      this.rotate = -1;
    } else {
      this.rotate = 1;
    }
    if (e.target.classList[0] == 'card-bottom-trigger') {
      this.rotate = -1;
    }

    this.mouseDown = true;
  }
}
