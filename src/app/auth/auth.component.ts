import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, ResponseData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  @Input() login = true;
  @Output() onCloseModal = new EventEmitter<boolean>();

  constructor(private router: Router, private authService: AuthService) {}
  errorMsg: string;
  loading = false;

  ngOnInit(): void {}
  onSubmit(f: NgForm, anon = false) {
    let authObs: Observable<ResponseData>;
    this.loading = true;
    if (anon) {
      authObs = this.authService.singInAnonymously();
    } else {
      if (!f.valid) return;

      const email = f.value.email;
      const password = f.value.password;

      if (this.login) {
        authObs = this.authService.login(email, password);
      } else {
        authObs = this.authService.signup(email, password);
      }
    }

    authObs.subscribe(
      (res) => {
        this.loading = false;
        this.router.navigate(['/create-account']);
      },
      (errorMessage) => {
        this.errorMsg = errorMessage;
        this.loading = false;
      }
    );
  }
  testCorrectPassword(f) {
    if (f.value.repeat != f.value.password && f.value.repeat && !this.login) {
      f.form.controls['repeat'].setErrors({ incorrect: true });
      this.errorMsg = 'Passwords have to be the same';
    } else {
      this.errorMsg = null;
    }
  }
  closeModal() {
    this.onCloseModal.next(false);
  }
  anon() {}
}
