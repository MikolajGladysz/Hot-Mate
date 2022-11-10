import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-swipe-card',
  templateUrl: './swipe-card.component.html',
  styleUrls: ['./swipe-card.component.css']
})
export class SwipeCardComponent implements OnInit {
  dummy = new User('Nikola',
  ["https://lh3.googleusercontent.com/pw/AL9nZEXpHVeB6yupPfA_-gpx4xacwLsEsGlK2NNbBwYci9tzzglW-E1ijAWPAfoaPeR5dxIDXfX2IJc436cvQUV9dx7twaobpri44kENZzhmebJQdHGRg71s2jU5ivI50fj4D6N_YCNJ5yvJdmZv_aomezxpXQ=w703-h937-no?authuser=0",
  'https://lh3.googleusercontent.com/pw/AL9nZEXscMR2jO1NrMqk79uzsPIhG4LvMMhcBJ7W7rfT3HEyE7lkAIMnxaLmn7vWmiHyqryetxvdmCrky5Y0PLXq1RvR7eaNp3Je0peDxUYGDJ3AKP2qF_Kel0R5OK2L45g9hSn71RtPWJBfp_3kYX3frO19iw=w428-h937-no?authuser=0',
'https://lh3.googleusercontent.com/pw/AL9nZEWNMDJwXiIxK2b2Hpepk89tlSgewBB3fbOWL0cFrd8ZQg9QFhJ-oh7VZcEHUS1I-YZdfErRDxoXipsBR_91r5a9uwDgSH6Pjqysm_J2iUhnMwJSSRgSDPjnnPSf0SRxKewGQTcpOpDRNhqWGyqbzvetSQ=w703-h937-no?authuser=0']
  ,1,'kocha mikołaja', ['Sra do basenu'],["gambit rumski","xddd"])
  constructor() { }

  ngOnInit(): void {
  }

}
