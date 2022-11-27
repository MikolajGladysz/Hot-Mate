import { Component, OnInit } from '@angular/core';
import { CardService } from '../shared/card.service';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  matches:boolean = true;
  users:User[];
  usersMatch:User[]=[];
  usersMessage:User[]=[];
  currUser:User;
  constructor(private cardService:CardService) { }

  ngOnInit(): void {
    this.users = this.cardService.users;

    this.cardService.usersObs.subscribe(()=>{
      this.users = this.cardService.users;
      this._addUsers()
    })
    this.cardService.currUser.subscribe((user)=>{
      this.currUser = user;
    })


    this._addUsers()

  }
  _addUsers(){
    this.usersMatch = [];
    this.usersMessage = []

    this.users.forEach(user=>{

      if(user.messanges){
       this.usersMessage.push(user)
      }
      else{
       this.usersMatch.push(user)

      }
    })
  }

  setCurrentUser(user:User){

    this.cardService.setCurrentUser(user);
  }

}
