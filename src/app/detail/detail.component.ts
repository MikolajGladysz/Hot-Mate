import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CardService } from '../shared/card.service';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit{
  @Input() currUser:User;
  @Input() detail:boolean;

  @Output() detailUpdate = new EventEmitter<boolean>();


  currPhoto = 1;
   //Fav games card
  currCard = 1;
   //amount of fav games card
  gamesCards;

  constructor(private cardService:CardService) {}

  _changePhoto(i:number){
    if(this.currPhoto+i>0 && this.currPhoto+i<=this.currUser.photos.length){
      this.currPhoto= this.currPhoto+i;
    }
  }
  _updateDetail(detail:boolean){
    this.cardService.setCurrentUser(null)
    this.detailUpdate.emit(detail);
   }
   _goToPage(i:number){
    this.currPhoto = i +1
  }
  _changeGameCard(i:number){
    if(this.currCard+i>0 && this.currCard+i<=this.gamesCards.length){
      this.currCard= this.currCard+i;
    }
  }
  _goToGame(i:number){
    this.currCard = i + 1;
  }
  _detailSwipe(direction:number){
    this.cardService.setSwipeOnInit(direction);
    this.cardService.setCurrentUser(null)
    this.detailUpdate.emit(false);
  }

  ngOnInit(): void {
    console.log(this.currPhoto);

    this.gamesCards = Array(Math.ceil(this.currUser.favGames.length/2));
    this.cardService.getCurrentUser().subscribe((user:User)=>{
     this.currUser=user

    });
  }

}
