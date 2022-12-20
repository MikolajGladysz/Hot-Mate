import { Messages } from './message.model';

export class User {
  constructor(
    public id: string,
    public name: string,
    public age: number,
    public photos: string[],
    public distance?: number,
    public description?: string,
    public tags?: string[],
    public favOpening?: { openingName: string; opening: string },
    public favGames?: { gameTitle: string; game: string }[],
    public city?: string,
    public chessTitle?: string,
    public messagesId?: string[]
  ) {}
}
