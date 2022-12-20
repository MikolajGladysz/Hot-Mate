import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart } from '@angular/router';
import { CardService } from '../shared/card.service';
import { MessageService } from '../shared/message.service';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  matches: boolean = true;
  users: User[];
  currentUser: User;
  usersMatch: User[] = [];
  usersMessage: User[] = [];

  selectedUser: User;

  constructor(
    private cardService: CardService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.users = this.cardService.users;
    this.currentUser = this.cardService.currentUser;
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
      if (this.messageService.findMessage([this.currentUser.id, user.id])) {
        this.usersMessage.push(user);
      } else {
        this.usersMatch.push(user);
      }
    });
  }
  _getLastMessage(id: string) {
    return this.messageService.findMessage([id, this.currentUser.id]).content[
      this.messageService.findMessage([id, this.currentUser.id]).content
        .length - 1
    ].text;
  }
}
