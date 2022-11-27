import { Component, OnInit, ViewChild } from '@angular/core';
import { CardService } from './shared/card.service';
import { User } from './shared/user.model';
import { SwipeCardComponent } from './swipe-card/swipe-card.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  detail: boolean = false;
  currUser: User;
  newUser: User = null;
  constructor(private cardService: CardService) {}

  ngOnInit() {
    this.cardService.generateUsers(20);

    this.cardService.getCurrentUser().subscribe((user) => {
      this.currUser = user;
      this.newUser = null;
    });
    this.cardService.newMatchObs.subscribe((user) => {
      if (user) {
        this.newUser = user;
        this.cardService.addUser(user);
      } else {
        this.newUser = null;
      }
    });
  }

  detailUpdate(ev) {
    this.detail = ev;
  }
  title = 'chess-tinder';
}
