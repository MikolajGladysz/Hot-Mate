export class User{
  constructor(public name:string, public photos:string[],public distance:number,public description?:string, public tags?:string[],public favOpening?:[openingName:string,opening:string],public favGames?:string){}
}
