import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AccountData } from '../shared/account-data.service';
import { CardService } from '../shared/card.service';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  currUser: User;
  messageDetail: Boolean = false;
  @Output() detailUpdate = new EventEmitter<boolean>();

  currPhoto = 1;
  //Fav games card
  currCard = 1;
  //amount of fav games card
  gamesCards;
  gamePreview: { fenCode?: string; name?: string; moves?: string[] };

  constructor(
    private cardService: CardService,
    private accountData: AccountData,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  _changePhoto(i: number) {
    if (
      this.currPhoto + i > 0 &&
      this.currPhoto + i <= this.currUser.photos.length
    ) {
      this.currPhoto = this.currPhoto + i;
    }
  }
  _goToPage(i: number) {
    this.currPhoto = i + 1;
  }
  _changeGameCard(i: number) {
    if (this.currCard + i > 0 && this.currCard + i <= this.gamesCards.length) {
      this.currCard = this.currCard + i;
    }
  }
  _goToGame(i: number) {
    console.log(this.gamesCards);

    this.currCard = i + 1;
  }
  _detailSwipe(direction: number) {
    this.cardService.setSwipeOnInit(direction);
    this.router.navigate(['/']);
  }
  _navigateBack() {
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.currPhoto = 1;
      this.currCard = 1;
      if (Object.keys(params).length !== 0) {
        this.messageDetail = true;
        this.currUser = this.cardService.users.find(
          (user) => user.id === params['id']
        );
      } else {
        this.currUser = this.cardService.dummyUser[0];
      }
      this.gamesCards = Array(Math.ceil(this.currUser.favGames.length / 2));
    });
    if (!this.currUser) {
      this.router.navigate(['/']);
    }

    this.gamesCards = Array(Math.ceil(this.currUser.favGames.length / 2));
  }
  getOpenings(ids: number[]) {
    return this.accountData.GET_FAVORITE_OPENINGS(ids);
  }
}
