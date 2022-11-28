import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  Event,
  NavigationStart,
} from '@angular/router';
import { CardService } from '../shared/card.service';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  matches: boolean = true;
  users: User[];
  usersMatch: User[] = [];
  usersMessage: User[] = [];

  selectedUser: User;

  constructor(
    private cardService: CardService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.users = this.cardService.users;

    this.router.events.subscribe((ev: Event) => {
      if (ev instanceof NavigationStart) {
        if (!ev.url.startsWith('/messages')) {
          this.selectedUser = null;
        }
      }
    });
    this.cardService.usersObs.subscribe(() => {
      this.users = this.cardService.users;
      this._addUsers();
    });

    this._addUsers();
  }

  _addUsers() {
    this.usersMatch = [];
    this.usersMessage = [];

    this.users.forEach((user) => {
      if (user.messages) {
        this.usersMessage.push(user);
      } else {
        this.usersMatch.push(user);
      }
    });
  }
}
