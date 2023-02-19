import { Injectable } from '@angular/core';
import { Messages } from './models/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  //  Messages and also saved games between users.

  public messages: Messages[] = [];

  // =====Message functionality ======================================
  public createMessage(
    usersId: [string, string],
    from: string,
    text: string,
    reactionTo: string = null,
    fakeMessage = null
  ) {
    // create message, add date to message, create message thread if needed

    const date = fakeMessage
      ? new Date().getTime() - fakeMessage
      : new Date().getTime();

    let findMessage = this.findMessage(usersId);
    if (!findMessage) {
      this.createNewMessageThread(usersId);
      findMessage = this.findMessage(usersId);
    }

    if (!findMessage['content']) {
      findMessage['content'] = [];
    }

    findMessage['content'].push({ from, text, date, reactionTo });
  }

  public createNewMessageThread(usersId: [string, string]) {
    this.messages.push(new Messages(usersId, []));
    return this.messages.at(-1);
  }

  public findMessage(userId: [string, string]) {
    return this.messages.find(
      (message) =>
        JSON.stringify(userId.sort()) === JSON.stringify(message.usersId.sort())
    );
  }

  private _sortMessages(usersId: [string, string]) {
    this.findMessage(usersId).content.sort((a, b) => a.date - b.date);
  }
  // ==================================================================================
  // ======= games functionality ====================================================
  public updateGame(userId: [string, string], move: string) {
    const messageThread = this.findMessage(userId);

    // get latest game and update moves
    const game = messageThread.games.at(-1);
    if (!game.moves) game.moves = [];
    game.moves.push(move);
  }

  public createGame(whiteId: string, blackId: string) {
    let messageThread = this.findMessage([whiteId, blackId]);

    if (!messageThread)
      messageThread = this.createNewMessageThread([whiteId, blackId]);

    if (!messageThread.games) messageThread.games = [];

    const date = new Date().getTime();

    messageThread.games.push({
      whiteId: whiteId,
      blackId: blackId,
      status: 0,
      date: date,
    });
  }

  public getCurrentGame(userId: [string, string]) {
    const messageThread = this.findMessage(userId);

    if (!messageThread?.games) this.createGame(userId[0], userId[1]);

    return messageThread.games[messageThread.games.length - 1];
  }

  // ONLY IN PRODUCTION
  public generateFakeMessages(usersId: [string, string]) {
    this.createNewMessageThread(usersId);

    for (let i = 0; i < 10; i++) {
      const random = (min: number, max: number) =>
        Math.trunc(Math.random() * max) + min;
      const findMessage = this.messages.find(
        (message) => message.usersId == usersId
      );
      if (!findMessage['content']) findMessage['content'] = [];
      const lorem =
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis inventore blanditiis esse omnis earum similique deleniti quod incidunt quibusdam facere, rerum magni quaerat odit enim dolorem porro sequi, est odio?'.split(
          ' '
        );
      const from = random(0, 10) == 0 ? 'system' : usersId[random(0, 2)];
      const text =
        from == 'system'
          ? 'You have been invited to chess Match!'
          : lorem.slice(0, random(3, lorem.length - 1)).join(' ');
      const reactionTo =
        random(0, 5) == 0
          ? random(0, findMessage['content'].length).toString()
          : null;
      this.createMessage(usersId, from, text, reactionTo, random(0, 600000000));
    }
    this._sortMessages(usersId);
  }

  constructor() {}
}
