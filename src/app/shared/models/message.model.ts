export class Messages {
  constructor(
    public usersId: [string, string],
    public content?: {
      from: string;
      text: string;
      date: number;
      reactionTo?: string;
      emojiId?: number;
    }[],
    public games?: {
      whiteId: string;
      blackId: string;
      status: number;
      date: number;
      moves?: string[];
    }[]
  ) {}
}
