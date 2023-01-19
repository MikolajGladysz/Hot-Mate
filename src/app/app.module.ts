import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SwipeCardComponent } from './swipe-card/swipe-card.component';
import { DetailComponent } from './detail/detail.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MessageComponent } from './messages/message.component';
import { FormsModule } from '@angular/forms';
import { NewMatchComponent } from './new-match/new-match.component';
import { AppRoutingModule } from './app-routing.module';
import { ChessComponent } from './chess/chess.component';
import { ChessBoardComponent } from './chess/chess-board/chess-board.component';
import { GamesWindowComponent } from './games-window/games-window.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ModalComponent } from './create-account/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    SwipeCardComponent,
    DetailComponent,
    SidebarComponent,
    MessageComponent,
    NewMatchComponent,
    ChessComponent,
    ChessBoardComponent,
    GamesWindowComponent,
    CreateAccountComponent,
    ModalComponent,
  ],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
