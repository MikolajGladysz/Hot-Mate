import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart } from '@angular/router';
import { AuthService } from '../auth/auth.service';
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
  localUser: User;
  usersMatch: User[] = [];
  usersMessage: User[] = [];

  selectedUser: User;
  editMode: boolean = false;

  constructor(
    private cardService: CardService,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.users = this.cardService.users;
    this.localUser = this.authService.user.getValue();
    this.router.events.subscribe((ev: Event) => {
      if (ev instanceof NavigationStart) {
        if (!ev.url.startsWith('/messages')) {
          this.selectedUser = null;
        }

        if (ev.url.includes('edit-profile')) {
          this.editMode = true;
        } else {
          this.editMode = false;
        }
      }
    });
    this.cardService.usersObs.subscribe(() => {
      this.users = this.cardService.users;
      console.log(this.users);

      this._addUsers();
    });

    this._addUsers();
  }

  _addUsers() {
    this.usersMatch = [];
    this.usersMessage = [];

    this.users.forEach((user) => {
      const message = this.messageService.findMessage([
        this.localUser.id,
        user.id,
      ]);
      if (message && message?.content.length > 0) {
        this.usersMessage.push(user);
      } else {
        this.usersMatch.push(user);
      }
    });
  }
  _getLastMessage(id: string) {
    return this.messageService.findMessage([id, this.localUser.id]).content[
      this.messageService.findMessage([id, this.localUser.id]).content.length -
        1
    ].text;
  }
}
