export class User {
  constructor(
    public id: string,
    public name: string,
    public age: number,
    public photos: string[],
    public distance?: number,
    public description?: string,
    public tags?: number[],
    public favOpening?: number[],
    public favGames?: {
      fenCode?: string;
      moves: string[];
      name?: string;
      playedAsBlack?: boolean;
    }[],
    public city?: string,
    public chessTitle?: string,
    public messagesId?: string[]
  ) {}
}
