import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.css'],
})
export class ChessComponent implements OnInit {
  currentUser: User;
  messageInput;
  reaction: { target: string; id: string };
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationStart) {
      }
    });
  }
  sendReaction(event) {
    this.reaction = {
      target: event.target.innerText,
      id: event.target.dataset['id'],
    };
  }
}
