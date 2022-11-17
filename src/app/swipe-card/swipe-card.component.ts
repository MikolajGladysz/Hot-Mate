import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-swipe-card',
  templateUrl: './swipe-card.component.html',
  styleUrls: ['./swipe-card.component.css']
})
export class SwipeCardComponent implements OnInit {

  //Dummy user, TODO: get user from serve
  dummy:User[] = [new User('Nikola',21,
  ["https://lh3.googleusercontent.com/pw/AL9nZEXpHVeB6yupPfA_-gpx4xacwLsEsGlK2NNbBwYci9tzzglW-E1ijAWPAfoaPeR5dxIDXfX2IJc436cvQUV9dx7twaobpri44kENZzhmebJQdHGRg71s2jU5ivI50fj4D6N_YCNJ5yvJdmZv_aomezxpXQ=w703-h937-no?authuser=0",
  'https://lh3.googleusercontent.com/pw/AL9nZEXscMR2jO1NrMqk79uzsPIhG4LvMMhcBJ7W7rfT3HEyE7lkAIMnxaLmn7vWmiHyqryetxvdmCrky5Y0PLXq1RvR7eaNp3Je0peDxUYGDJ3AKP2qF_Kel0R5OK2L45g9hSn71RtPWJBfp_3kYX3frO19iw=w428-h937-no?authuser=0',
'https://lh3.googleusercontent.com/pw/AL9nZEWNMDJwXiIxK2b2Hpepk89tlSgewBB3fbOWL0cFrd8ZQg9QFhJ-oh7VZcEHUS1I-YZdfErRDxoXipsBR_91r5a9uwDgSH6Pjqysm_J2iUhnMwJSSRgSDPjnnPSf0SRxKewGQTcpOpDRNhqWGyqbzvetSQ=w703-h937-no?authuser=0']
  ,1,'kocha mikołaja',
  ['Sra do basenu',"Szanuje świdwin"],
  [{openingName:"gambit rumski",opening:"xddd"},
  {openingName:"Świdwińska Roszada",opening:"ddd"}],
  [{gameTitle:"Oro na nobów",game:'coś tam'},
  {gameTitle:"dupa2",game:"coś tam2"},
  {gameTitle:"dupa3",game:"coś tam2"},
  {gameTitle:"dupa4",game:"coś tam2"},
  {gameTitle:"dupa5",game:"coś tam2"},
  {gameTitle:"dupa6",game:"coś tam2"},
  {gameTitle:"dupa7",game:"coś tam2"}],
  "Rumia",
  "Grand Master"),
new User('Mikołaj',21,
["https://lh3.googleusercontent.com/FCz_rVGmEU-oyx7aTWlENDgNCoe8FCCho3orI62Vx06OQI5BdOz5k_PjgxtCins9Z35ITRGvOfMntkOZE6v1v9edKK8Bx9iIIdDxx_QZjvoCvHNMg73_kDmCngxyH10xernSS8QdlN6o4_sdexFMu67lRM9ND9Zhdabs7de0gSdonZDTjyfIFoc7CaZFpEjpBitZLyCoV4l4UbOTgUfCUFI1PfTIuRA0lXpXdKoJY-X9NTdkLDjTshP8hjs6Yuuw4p6roeHXGzZI7HqSVzv62SbxkK4mRJZtFEVnj8qryD9crYuFbmuczpgPShumkA43IdmZ69kjcZ1qFsVohvG0PVFU313OBIQKPJaqDFw4cQXXVFwHelE0DZCDj2gHacoWUGNBgoutkhCwR2x14F2P2gK0M__5YMMsJiykDfIyMAzZDZoPh-gTUY3x2hkl3ea1paSaOFxaSoqDf-z6pB_U2FawZJPyQ82cCVgPaJiwxI1w3DClSh4BtW0oY9sgk-8BvhTMb8ZSxeLHv5N2v2752GyfrITjsbu04iKCHdAyGnGMO1INy09d7fxOfh6a6HshJMKS_-EeUUjcrZLxYTpsbH5hkHffNWaINOqWkQp4mSk_d2aAxCxhWZaRAz0_yMqNxkUAO8oMzrDCXWjInN_ICjULSbtJ9TFtBEG3CbFl7TavkGVzXo3rz-KuBDxPQ9YDw-zs79okBzGOlCEvRldNVk3O0kvu2Cyl8wemw_ChBGhySwiNV6LfrKjihtr6lheC4M9SbddXh7Pxe9yZgvM1gVl1dO6WUYH7JXGeikshqiczB06p0iKxCoZ4SXbtTq7J5ux-Aqes9G0qQEq1KFUxDqQqCc9KRWZ-Hdf1RUcKNek6w-ELZ6ukoJKM9jTbiw2B_D1fy0Z39gEUfrCyPOkW1oYYjwtu4F_NEkWiwtXWZEwtLVy3OAlArmZysAkY-OxP_BMWu1isSzVU1IjPTWBX=w428-h937-no?authuser=0",
"https://lh3.googleusercontent.com/zHEyqynrJXw8afmDYe8vmBBL1JyPqfg-2zW7IbOiRYQMXTtELS5lbvbAxzAVsi_JSfevwVYXrEs-5uHDqi5w9U-QIngy6pwgZt80kLGbEl3oB-fl6uRS-scozJ16kgs-MvOdSN8ceOg2yW02TIiAmLZdz1Z5dQveivxBPZCHbqa64Uhh4PubfQeKluFX3ucBInPVUsbmXkxeP7AZ4dCJPCh43BrXei8AqIirBv77fQwBJzy_aRtW5w3e86gcMkfzc2dEe0Y9fB1xxEw5NRO5Vv7gy3ID7fET8LuUObxq6G-VT0ocObVeDqdhvjZlgCwAdToI5c0clmQj21CP8bT6MOVcvHpemZK9vqBqMnoS1o_bNbq9z6tessqUe66gPDMGAovevRtG3etXjDnAeIkPBjgn_pwnllSrw_682RssS8ROoOMSQOU7l2JSb1nBKjV9F1Q1ELLIpYUQOTgQhMBym7ZiDF-bjpZIiapcCvfOttnvb1ig6LFTELVv5aYHG2hPzRTlsi0qzVHVdvSTBQbboaa4cHS26CiPMrtMLTj3lzYPgfmMRIL8TFHwtaobQrJZExjRs-rvjghkURWvPanT3vY3zYOXqJymVVJF5IQEICTOaKlNyz6fId9xOW_w9ao2FIhPvy5nQ_d1rZ29MjqGJu4zY6RDosiHB4A1pBZDM8bf1wbR594LcbJZ0sXAg_PvIdtl1CS1hp8dUKtSsbOKQx246fMxS8z7rUeL0Lt8t1KWnZhPAu55OyhuCHpm03u-p7VyjlupGy-C6G76i24c1SVmElCDHiHcGKfknGokgNvfDCVidjpUFoOVt06e57OEfoGcYeHlwvK3bLDc_VS-zYJMdoCWbA5xlfLM58GONMk25bxhSbskMmudu4ks2yPIng7wPfEacN1k9RyC1d4ig46h5s1Cu-EDHcdu6yeGrR7gPaLaRqzRkyO16Fctce2Xfbbo_WFrR4VmISXNYp-b=w428-h937-no?authuser=0"
],
15,
"Ola Nikolczak jest w porządku ;)",
['Swidwinski knur', 'Wielbiciel Nikoli', 'Kocha szachy'],
[{openingName:"Swidwinskie or",opening:"aaxx"}],
[{gameTitle:"Kongo w Świdwinie",game:"aa"},{gameTitle:"mat w 69",game:"sss"},{gameTitle:"Zjadlbym cos",game:"aa"},
],
'Świdwin',
"International Master"
)
]
 @ViewChild("cardDrag",{static:true}) cardDrag:ElementRef;
 @ViewChild("iconYeah",{static:true}) iconYeah:ElementRef;
 @ViewChild("iconNope",{static:true}) iconNope:ElementRef;

@HostListener('document:mouseup')
onMouseUp(){
  //reset bottom icons size and background
  this._resetIcon();
  this.mouseDown = false;

  //decide if card is dragged enough to consider swipe (if drag>350px from origin)
  if(this.transformX>350){
    this._resetCard(1);
    return;
  }
  if(this.transformX<-350){
    this._resetCard(-1);
    return
  }else{

    this._resetCard();
    return
  }
}

  constructor() {}

  //profile photo
  currPhoto = 1;
  //Fav games card
  currCard = 1;
  //amount of fav games card
  gamesCards = Array(Math.ceil(this.dummy[0].favGames.length/2));
  //reder detailed view after click on bottom of card
  detail:boolean = false;
  //control card drag funcionality
  oldX:number = 0;
  oldY:number = 0;
  transformX:number = 0;
  transformY:number = 0;
  rotate:number;
  mouseDown:boolean = false;
  swipeYeah:boolean = false;
  swipeNope:boolean = false;
  opacity:number = 0;

  //changing bottom icons look
  _setIcon(icon:ElementRef,size:number,color:string,){
    const opacity =Math.round( size)-30;

    icon.nativeElement.style.backgroundColor  = "rgba("+color+",."+opacity+")";
    icon.nativeElement.style.width = size+"px"
    icon.nativeElement.style.height = size+"px"
    icon.nativeElement.style.fill= "white";
  }

  //reseting bottom icons
  _resetIcon(){
    this.swipeNope = false;
    this.swipeYeah = false

    this.iconNope.nativeElement.style.backgroundColor  = "transparent";
    this.iconNope.nativeElement.style.width = "70px"
    this.iconNope.nativeElement.style.height = "70px"
    this.iconNope.nativeElement.style.fill= "red";

    this.iconYeah.nativeElement.style.backgroundColor  = "transparent";
    this.iconYeah.nativeElement.style.width = "70px"
    this.iconYeah.nativeElement.style.height = "70px"
    this.iconYeah.nativeElement.style.fill= "green";
  }

  //reset card position, or swipe it left/right if card swipe value was provided
  _resetCard(swipe?:number){
    this.cardDrag.nativeElement.classList.remove('disable-pointer-event')
    this.oldX=0;
    this.oldY=0;

    if(swipe){
      //setting time for swipe left/right animation
      const time = 250*Math.abs(swipe);
      //sending card off screen
      this.cardDrag.nativeElement.style.transition = 'transform '+time/1000+'s'
      const swipeTo = -this.transformX-(700*swipe)
      this.cardDrag.nativeElement.style.transform = "translate("+ swipeTo+"px , "+ -this.transformY+"px) rotate("+ -12*swipe+"deg)"


      //reseting card position after animation time
      setTimeout(()=>{
        //always load 2 users to make sure there is new card already rendered behaing current card
        //after swipe animation end, reset 1st card posiotin, swap 2nd user in user arr with 1st, so new user is displayed TODO:get new user from server, after swap in arr
        this.dummy.push(this.dummy[0])
        this.dummy[0] = this.dummy[1];
        this.dummy[1]= this.dummy[2]
        this.dummy.pop();
      this.cardDrag.nativeElement.style.transition = 'transform 0ms'
      this.cardDrag.nativeElement.style.transform = 'unset'

      },time);
    }else{
      //Simply reset position of card if there were no swipe
      this.cardDrag.nativeElement.style.transform = 'unset'
      this.cardDrag.nativeElement.style.transition = 'transform 1s cubic-bezier(0.52, 0.11, 0, 1.33) 0s'
    }
    //reset transform origin values
    this.transformX=0;
    this.transformY=0;

  }

  ngOnInit(): void {
  }


  mousedown(e){
    //allow drag only if detail window isnt opened
    if(!this.detail){
      //reset transition value to prevent drag lag
      this.cardDrag.nativeElement.style.transition = 'transform 0s'
        //change rotate value regarding if user clicked bottom or top part of card
        if(e.offsetY>300){
          this.rotate=-1;
        }else{
          this.rotate =1;
        }
        if(e.target.classList[0]=="card-bottom-trigger"){
          this.rotate = -1
        }

        this.mouseDown = true

      }
  }

  moveCard(e){
    if(!this.mouseDown)return;

    //calculate change in mouse coordinates to determine drag direction.
    const x = this.oldX - e.x;
    const y = this.oldY - e.y;

    //disable pointer events to prevent text highlight during drag
    this.cardDrag.nativeElement.classList.add('disable-pointer-event');

    //check if move event occured before to prevent moving card from wrong origin
    if(this.oldX!=0&&this.oldY!=0){

      //updating transform value
      this.transformX = this.transformX+x;
      this.transformY =this.transformY+y;
      const clampNumber = (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));

      const rotate = clampNumber((this.transformX/30),-20,20)

      //calculate size of bottom icons
      const size =clampNumber(70-Math.abs(this.transformX/10),55,70)

      //after moving card eathier left or right, update bottom icon size
      if(this.transformX>10){
        this._setIcon(this.iconNope,size,"255,0,0")
        this.swipeNope = true;
        this.opacity = clampNumber(this.transformX/400,0,1)

      }
      if(this.transformX<-10){
        this._setIcon(this.iconYeah,size,"0,255,0")
        this.swipeYeah = true;
        this.opacity = clampNumber(Math.abs(this.transformX)/400,0,1);

      }
      //reset bottom icon size when changing drag direction
      if(this.transformX>-10 && this.transformX<10){
        this._resetIcon();
        this.swipeNope = false;
        this.swipeYeah = false
      }

      //update card transform
      this.cardDrag.nativeElement.style.transform = "translate("+ -this.transformX+"px,"+ -this.transformY+"px) rotate("+(-rotate*this.rotate*1.2)+"deg)"

    }

    this.oldX = e.x;
    this.oldY = e.y;


  }

  goToPage(i:number){
    this.currPhoto = i +1
  }
  goToGame(i:number){
    this.currCard = i + 1;
  }
  changePhoto(i:number){
    if(this.currPhoto+i>0 && this.currPhoto+i<=this.dummy[0].photos.length){
      this.currPhoto= this.currPhoto+i;
    }
  }

  changeGameCard(i:number){
    if(this.currCard+i>0 && this.currCard+i<=this.gamesCards.length){
      this.currCard= this.currCard+i;
    }
  }
}
