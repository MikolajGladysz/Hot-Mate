import { Component, HostListener, OnInit } from '@angular/core';
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

  collapse: boolean = false;
  showSidebar: boolean = true;

  constructor(
    private cardService: CardService,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // TODO: get user from account data
    this.users = this.cardService.users;
    this.localUser = this.authService.user.getValue();
    this.onResize();
    // update ui every time url is changed
    this.router.events.subscribe((ev: Event) => {
      if (ev instanceof NavigationStart) {
        if (!ev.url.startsWith('/messages')) {
          this.selectedUser = null;
        }

        // Change top icon in edit mode
        if (ev.url.includes('edit-profile')) {
          this.editMode = true;
        } else {
          this.editMode = false;
        }
      }
    });

    // update ui every time new user is emitted
    this.cardService.usersObs.subscribe(() => {
      this.users = this.cardService.users;

      this.addUsers();
    });

    this.addUsers();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth < 1600) {
      this.collapse = true;
      this.showSidebar = false;
    } else {
      this.collapse = false;
      this.showSidebar = true;
    }
  }

  addUsers() {
    this.usersMatch = [];
    this.usersMessage = [];

    // Add user without messages to match tab, with messages to messages tab
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
  getLastMessage(id: string) {
    // display latest message with user
    return this.messageService.findMessage([id, this.localUser.id]).content[
      this.messageService.findMessage([id, this.localUser.id]).content.length -
        1
    ].text;
  }
}
