import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { ChessComponent } from './chess/chess.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { DetailComponent } from './detail/detail.component';
import { MainComponent } from './main/main.component';
import { MessageComponent } from './messages/message.component';
import { SwipeCardComponent } from './swipe-card/swipe-card.component';
import { WelcomeComponent } from './welcome/welcome.component';

const appRoutes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'create-account', component: CreateAccountComponent },
  {
    path: 'app',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: SwipeCardComponent },
      { path: 'profile', component: DetailComponent },
      { path: 'messages/:id', component: MessageComponent },
      { path: 'messages/:id/game', component: ChessComponent },
      { path: 'edit-profile', component: CreateAccountComponent },
    ],
  },

  { path: '**', redirectTo: 'app' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
