import { Injectable } from '@angular/core';
import { Game } from './models/game.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  games: Game[] = [];

  constructor() {}

  addGame(game: Game) {
    this.games.push(game);
  }
  createGame(whiteId: string, blackId: string) {
    this.games.push(
      new Game(Math.random().toString(36).slice(2, 10), whiteId, blackId, '')
    );
  }
}
