import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CardService } from './shared/card.service';
import { User } from './shared/models/user.model';
import { AuthService } from './auth/auth.service';
import { exhaustMap, take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  newUser: User = null;
  constructor(
    private cardService: CardService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.autoLogin();

    if (!!this.authService.user.getValue()) {
      this.router.navigate['/create-account'];
    }
    if (
      this.authService.user.getValue() &&
      !!this.authService.user.getValue().name
    ) {
      this.router.navigate(['/app']);
    }
  }
}
