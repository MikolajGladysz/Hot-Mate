import { Component, OnInit } from '@angular/core';
import { CardService } from './shared/card.service';
import { User } from './shared/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  newUser: User = null;
  constructor(private cardService: CardService) {}

  ngOnInit() {
    this.cardService.generateUsers(20);

    this.cardService.newMatchObs.subscribe((user) => {
      if (user) {
        this.newUser = user;
        this.cardService.addUser(user);
      } else {
        this.newUser = null;
      }
    });
  }

  title = 'chess-tinder';
}
