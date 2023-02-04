import { Component, HostBinding, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
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
    private authService: AuthService
  ) {}

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

  userEmail: string;
  localUser: User;
  userPhotos: string[];

  editProfile: boolean = false;
  preview: boolean = false;

  ngOnInit(): void {
    this.chessPersonalities = this.accountData.GET_CHESS_PERSONALITIES([-1]);
    this.favoriteOpenings = this.accountData.GET_FAVORITE_OPENINGS([-1]);
    this.localUser = this.authService.user.getValue();
    this.userEmail = this.localUser.email;
    this.userPhotos = this.localUser.photos;
    if (!this.userPhotos) {
      this.userPhotos = [];
    }

    if (this.router.url.includes('edit-profile')) {
      // tu tuez^
      this.editProfile = true;
      this.selectedChessPersonalities = this.localUser.tags;
      this.selectedFavoriteOpenings = this.localUser.favOpening;
      this.favoriteGames = this.localUser.favGames;

      if (!this.favoriteGames) {
        this.favoriteGames = [];
      }
    }
  }

  @HostBinding('class.edit')
  get edited() {
    return this.editProfile;
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
    gender: string;
    userName: string;
    chessTitle?: string;
    description?: string;
  }) {
    if (!this.userPhotos || this.userPhotos.length == 0) {
      this.userPhotos = [' ../../assets/images/default_pfp.png'];
    }
    const user = this.authService.user.getValue();

    if (formValue.userName) user.name = formValue.userName;

    if (formValue.birthDate) user.age = 2023 - formValue.birthDate.birthYear;

    user.photos = this.userPhotos;
    user.distance = 420;
    user.tags = this.selectedChessPersonalities;
    user.favOpening = this.selectedFavoriteOpenings;
    user.favGames = this.favoriteGames;
    user.city = 'Swidwin';
    if (formValue.chessTitle) user.chessTitle = formValue.chessTitle;

    if (formValue.description) user.description = formValue.description;

    localStorage.setItem('userData', JSON.stringify(user));

    this.router.navigate(['/app']);
  }
  uploadFile(id: number) {
    if (id < 0) {
      this.userPhotos.splice(-id - 1, 1);
      return;
    }
    let input = document.createElement('input');
    input.type = 'file';

    input.onchange = (_) => {
      let file = input.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (ev) => {
        const url = ev.target.result;

        if (id > this.userPhotos.length - 1) {
          this.userPhotos[this.userPhotos.length] = url as string;
        } else {
          this.userPhotos[id] = url as string;
        }
      };
    };
    input.click();
  }
}
