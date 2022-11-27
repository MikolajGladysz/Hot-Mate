export class User{
  constructor(public name:string,
     public age:number,
     public photos:string[],
     public distance?:number,
     public description?:string,
      public tags?:string[],
      public favOpening?:{openingName:string,opening:string},
      public favGames?:{gameTitle:string,game:string}[],
      public city?:string,
      public chessTitle?:string,
      public messanges?:{fromUser:boolean,messange:{content:string,date:string}}[]){}
}
