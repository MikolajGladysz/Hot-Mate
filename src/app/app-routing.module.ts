import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChessComponent } from './chess/chess.component';
import { DetailComponent } from './detail/detail.component';
import { MessageComponent } from './messages/message.component';
import { SwipeCardComponent } from './swipe-card/swipe-card.component';

const appRoutes: Routes = [
  { path: '', component: SwipeCardComponent },
  { path: 'profile', component: DetailComponent },
  { path: 'messages/:id', component: MessageComponent },
  { path: 'messages/:id/game', component: ChessComponent },
  // { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
