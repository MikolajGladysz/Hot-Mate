import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GameStatus {
  constructor() {}
  getGameStatusString(gameStatus: number): string {
    let result = 'Game status not found: ' + gameStatus;

    switch (gameStatus) {
      case 0:
        result = 'Current match';
        break;
      case 1:
        result = 'White won by checkmate';
        break;
      case 2:
        result = 'Black won by checkmate';
        break;
      case 3:
        result = 'White won by resignation';
        break;
      case 4:
        result = 'Black won by resignation';

        break;
      case 5:
        result = 'draw';
        break;
      case 6:
        result = 'Draw by stalemate';

        break;
    }

    return result;
  }
}
