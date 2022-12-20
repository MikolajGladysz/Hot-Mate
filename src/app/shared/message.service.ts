import { Injectable } from '@angular/core';
import { find } from 'rxjs';
import { Messages } from './models/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  public messages: Messages[] = [];

  public createMessage(
    usersId: [string, string],
    from: string,
    text: string,
    reactionTo: string = null,
    fakeMessage = null
  ) {
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
    this.messages.push(new Messages(usersId));
  }

  public findMessage(userId: [string, string]) {
    return this.messages.find(
      (message) =>
        JSON.stringify(userId.sort()) === JSON.stringify(message.usersId.sort())
    );
  }

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

  _sortMessages(usersId: [string, string]) {
    this.findMessage(usersId).content.sort((a, b) => a.date - b.date);
  }
  constructor() {}
}
