import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountData } from '../shared/account-data.service';
import { CardService } from '../shared/card.service';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
})
export class CreateAccountComponent implements OnInit {
  // TODO: file upload
  constructor(
    private accountData: AccountData,
    private router: Router,
    private cardService: CardService
  ) {}
  private user: User;

  //0 - chess personality, 1 - fav openings
  modalValue: number;

  dataToDisplay: {
    tagsId?: number[];
    tagsNames?: string[];
    name?: string;
    moves?: string[];
    playedAsBlack?: boolean;
    chessGame?: boolean;
  };
  selectedChessPersonalities: number[];
  chessPersonalities: string[];

  selectedFavoriteOpenings: number[];
  favoriteOpenings: string[];

  radioActive: number;
  selectedItemsInput: any;

  favoriteGames: {
    fenCode?: string;
    moves: string[];
    name?: string;
    playedAsBlack?: boolean;
  }[] = [];

  ngOnInit(): void {
    this.chessPersonalities = this.accountData.GET_CHESS_PERSONALITIES([-1]);
    this.favoriteOpenings = this.accountData.GET_FAVORITE_OPENINGS([-1]);
  }

  getSelectedItems(val: {
    tagsId?: number[];
    name?: string;
    moves?: string[];
    playedAsBlack?: boolean;
    fenCode?: string;
  }) {
    if (Array.isArray(val)) {
      val = { tagsId: val };
    }

    if (this.modalValue == 0) {
      this.selectedChessPersonalities = val?.tagsId;
    }
    if (this.modalValue == 1) {
      this.selectedFavoriteOpenings = val?.tagsId;
    }
    if (this.modalValue > 1) {
      if (!val) {
        this.dataToDisplay = null;
        return;
      }
      const favoriteGame = {
        fenCode: val.fenCode,
        name: val.name,
        moves: val.moves,
        playedAsBlack: val.playedAsBlack,
      };
      if (this.modalValue == 2) {
        this.favoriteGames.push(favoriteGame);
      }
      if (this.modalValue > 2) {
        this.favoriteGames[this.modalValue - 3] = favoriteGame;
      }
    }

    this.dataToDisplay = null;
  }
  deleteGame(id: number) {
    this.favoriteGames.splice(id, 1);
  }
  //type 0 - chess personalities, 1 - favorite openings
  getTagsString(ids: number[], type: number) {
    if (!ids) return null;
    const outputType =
      type == 0 ? this.chessPersonalities : this.favoriteOpenings;

    return outputType.filter((val, i) => ids.includes(i));
  }
  onSubmit(formValue: {
    birthDate: { birthDay: number; birthMonth: number; birthYear: number };
    email: string;
    gender: string;
    userName: string;
  }) {
    const id = Math.random().toString(36).slice(2, 10);
    const photos = [
      '../../assets/images/user1/360_F_224869519_aRaeLneqALfPNBzg0xxMZXghtvBXkfIA.jpg',
      '../../assets/images/user1/360_F_297245133_gBPfK0h10UM3y7vfoEiBC3ZXt559KZar.jpg',
      '../../assets/images/user1/gettyimages-1250238624-612x612.jpg',
      '../../assets/images/user1/istockphoto-1200677760-612x612.jpg',
      '../../assets/images/user1/pexels-photo-2379004.jpeg',
    ];
    this.user = new User(
      id,
      formValue.userName,
      2023 - formValue.birthDate.birthYear,
      photos,
      420,
      null,
      this.selectedChessPersonalities,
      this.selectedFavoriteOpenings,
      this.favoriteGames,
      'Swidwin',
      'GM',
      null
    );
    localStorage.setItem('localUser', JSON.stringify(this.user));
    this.cardService.currentUser = this.user;
    this.router.navigate(['/']);
  }
}
