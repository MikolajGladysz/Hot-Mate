import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CardService } from '../shared/card.service';
import { User } from '../shared/user.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-messange',
  templateUrl: './messange.component.html',
  styleUrls: ['./messange.component.css']
})
export class MessangeComponent implements OnInit {
 @Input() currUser:User;
  constructor(private cardService:CardService) { }
  messageInput;
  @ViewChild('input') input:ElementRef;
  ngOnInit(): void {
  }
  closeMessageWindow(){
    this.cardService.setCurrentUser(null)
  }
  sendMessage(){
    if(!this.currUser.messanges){
      this.currUser.messanges = []
    }
    this.currUser.messanges.push({fromUser:true,messange:{
      content:this.messageInput,
      date:'1111'
    }

    })

    this.cardService.emitUsersObs();

    this.messageInput = ''

  }

}
