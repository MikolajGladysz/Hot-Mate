import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AccountData {
  private _chessPersonalities = [
    'E4 enjoyer',
    'London player',
    'Fast hand',
    'Beginner',
    'Tournament player',
    'I played as a Kid',
    'Gambit enjoyer',
    'IDK how horsey moves',
    'Classic player',
    'GM mindset',
    'I love tactics',
    'Positional player',
    'Had stalemate',
    'No stalemate',
    'Google EnPassant',
    'I play only on toilet',
    'Plays chess at parties',
  ];
  private _favoriteOpenings = [
    "Alekhine's Defense",
    'Benko Gambit',
    'Benoni Defense',
    "Bird's Opening",
    'Bogo-Indian Defense',
    'Budapest Gambit',
    'Catalan Opening',
    'Caro-Kann Defense',
    'Bong Cloud',
    'Fried Liver',
    "Queen's Gambit",
  ];
  public GET_CHESS_PERSONALITIES(ids: number[]) {
    if (ids[0] == -1) {
      return this._chessPersonalities;
    }
    return this._chessPersonalities.filter((val, i) => ids.includes(i));
  }
  public GET_FAVORITE_OPENINGS(ids: number[]) {
    if (ids[0] == -1) {
      return this._favoriteOpenings;
    }
    return this._favoriteOpenings.filter((val, i) => ids.includes(i));
  }
}
