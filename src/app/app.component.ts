import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardService } from './shared/card.service';
import { User } from './shared/models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  newUser: User = null;
  showSidebar: boolean = true;
  constructor(private cardService: CardService, private router: Router) {}

  ngOnInit() {
    this.cardService.currentUser = JSON.parse(
      localStorage.getItem('localUser')
    );
    console.log(this.cardService.currentUser);

    if (!this.cardService.currentUser) {
      this.router.navigate(['/create-account']);
      this.showSidebar = false;
    } else {
      this.showSidebar = true;
    }

    this.cardService.generateUsers(10);

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
