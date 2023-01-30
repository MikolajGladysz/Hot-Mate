import { Component, OnInit } from '@angular/core';
import { CardService } from '../shared/card.service';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  newUser: User = null;

  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.cardService.newMatchObs.subscribe((user) => {
      if (user) {
        this.newUser = user;
        this.cardService.addUser(user);
      } else {
        this.newUser = null;
      }
    });
  }
}
