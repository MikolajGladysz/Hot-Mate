import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GameStatus } from '../shared/game-status.service';

@Component({
  selector: 'app-games-window',
  templateUrl: './games-window.component.html',
  styleUrls: ['./games-window.component.css'],
})
export class GamesWindowComponent implements OnInit {
  @Input() games: {
    blackId: string;
    whiteId: string;
    status: number;
    date: number;
    moves?: string[];
    fenCode?: string;
  }[];
  @Output() showGame = new EventEmitter<number>();

  gamesCopy = [];

  constructor(private gameStatus: GameStatus) {}

  ngOnInit(): void {
    if (this.games) this.games = this.games.filter((game) => game.moves);
    else this.games = [];
  }
  toggleWindow(ev) {
    ev.target.closest('li').classList.toggle('active');
  }
  gamePreview(game) {
    this.showGame.emit(game);
  }
  getGameResultString(gameResult: number) {
    return this.gameStatus.getGameStatusString(gameResult);
  }
  getDate(date: number) {
    const dateObj = new Date(date);
    return dateObj.toLocaleTimeString() + ' ' + dateObj.toDateString();
  }
}
