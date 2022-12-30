export class Messages {
  constructor(
    public usersId: [string, string],
    public content?: {
      from: string;
      text: string;
      date: number;
      reactionTo?: string;
    }[],
    public games?: {
      whiteId: string;
      blackId: string;
      moves?: string[];
      fenCode?: string;
    }[]
  ) {}
}
