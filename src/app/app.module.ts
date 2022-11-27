import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SwipeCardComponent } from './swipe-card/swipe-card.component';
import { DetailComponent } from './detail/detail.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MessangeComponent } from './messange/messange.component';
import { FormsModule } from '@angular/forms';
import { NewMatchComponent } from './new-match/new-match.component';

@NgModule({
  declarations: [
    AppComponent,
    SwipeCardComponent,
    DetailComponent,
    SidebarComponent,
    MessangeComponent,
    NewMatchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
