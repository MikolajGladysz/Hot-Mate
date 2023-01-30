import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

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
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthComponent } from './auth/auth.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { MainComponent } from './main/main.component';

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
    WelcomeComponent,
    AuthComponent,
    SpinnerComponent,
    MainComponent,
  ],
  imports: [BrowserModule, FormsModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
