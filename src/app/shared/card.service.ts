import { EventEmitter, Injectable, Output } from '@angular/core';
import { MessageService } from './message.service';
import { User } from './models/user.model';

@Injectable({ providedIn: 'root' })
export class CardService {
  users: User[] = [];
  currentUser: User;
  @Output() usersObs = new EventEmitter<boolean>();
  @Output() newMatchObs = new EventEmitter<User>();

  dummyUser: User[] = [];
  swipe: number;

  constructor(private messageService: MessageService) {}
  addUser(user: User) {
    this.users.push(user);
    this.emitUsersObs();
  }
  findUser(userId: string) {
    return this.users.find((user) => user.id == userId);
  }
  get swipeOnInit() {
    return this.swipe;
  }
  setSwipeOnInit(direction: number) {
    this.swipe = direction;
  }

  emitUsersObs() {
    this.usersObs.emit();
  }
  newMatch(user: User) {
    if (user) {
      setTimeout(() => {
        this.newMatchObs.emit(user);
      }, 1000);
    } else {
      this.newMatchObs.emit(user);
    }
  }

  //ONLY IN PRODUCTION
  generateUsers(num: number, newUser?: boolean) {
    const random = (min: number, max: number) =>
      Math.trunc(Math.random() * max) + min;
    for (let i = 0; i < num; i++) {
      const tags = [
        'Quick chess',
        'Bullet',
        'Classic',
        'E4 Enjoyer,',
        'Good tactic',
        'Outdor chess',
        'Chess online',
        'Tournament Player',
        'Begginer',
      ];
      const names = [
        'Anna',
        'Nikola',
        'Kundegunda',
        'Basia',
        'Anastazja',
        'Wiola',
        'Bogumiła',
        'Danusia',
        'Jolanta',
        'Ola',
        'Adam',
        'Jan',
        'Tomasz',
        'Mikołaj',
        'Krzystof',
        'Piorek',
        'Paweł',
      ];
      const lorem =
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis inventore blanditiis esse omnis earum similique deleniti quod incidunt quibusdam facere, rerum magni quaerat odit enim dolorem porro sequi, est odio?'.split(
          ' '
        );
      const openings = [
        'Karo Kann',
        'Gambit Sandomierski',
        'Bong Cloud',
        'Gamit Królowej',
        'Alfabetycznie',
        'Gamit Króla',
      ];
      const cities = [
        'Świdwin',
        'Rumia',
        'Toront',
        'Warszawa',
        'Poznan',
        'Kraków',
        'Zielona Góra',
        'London',
        'New York',
      ];
      const chessTitles = [
        'Grand Master',
        'International Master',
        'Country Master',
        'Master Wsi',
        '',
        '',
      ];
      const photos = [
        '../../assets/images/user1/360_F_224869519_aRaeLneqALfPNBzg0xxMZXghtvBXkfIA.jpg',
        '../../assets/images/user1/360_F_297245133_gBPfK0h10UM3y7vfoEiBC3ZXt559KZar.jpg',
        '../../assets/images/user1/gettyimages-1250238624-612x612.jpg',
        '../../assets/images/user1/istockphoto-1200677760-612x612.jpg',
        '../../assets/images/user1/istockphoto-544358212-612x612.jpg',
        '../../assets/images/user1/pexels-photo-2379004.jpeg',
        '../../assets/images/user2/315322228_893010698297406_4398924760375864210_n.jpg',
        '../../assets/images/user2/360_F_222106228_NP5f0gXi3JOCgmaTsEyg7RuyKgwDLGuY.jpg',
        '../../assets/images/user2/beauty-black-skin-woman-african-ethnic-female-face-young-african-american-model-long-afro-hair-smiling-model-isolated-163819588.jpg',
        '../../assets/images/user2/bizarre-hobbies-camel-dog.webp',
        '../../assets/images/user2/Christmas-Lights-Display-Credit-iStockphoto-152141168-630x420.jpg',
        '../../assets/images/user2/happy-young-woman-sitting-on-260nw-2018571389.webp',
        '../../assets/images/user2/fiolet.jpg',
        '../../assets/images/user2/farba-do-koloryzacji-na-20-kapieli-7229.jpg',
      ];

      const name = names[random(0, names.length - 1)];
      const age = random(18, 100);
      const distance = random(1, 200);

      const photo = new Set();
      Array(random(1, 8))
        .fill('')
        .forEach(() => {
          photo.add(photos[random(0, photos.length - 1)]);
        });
      const photoArr: string[] = <string[]>Array.from(photo);
      const id = Math.random().toString(36).slice(2, 10);

      const description = lorem.slice(0, random(3, lorem.length - 1)).join(' ');

      let tag = new Set();
      Array(random(1, 8))
        .fill('')
        .forEach(() => {
          tag.add(tags[random(0, tags.length - 1)]);
        });
      const tagArr: string[] = <string[]>Array.from(tag);
      const favOpening = {
        openingName: openings[random(0, openings.length - 1)],
        opening: 'laldaj',
      };
      const favGames = new Set();
      Array(random(1, 10))
        .fill('')
        .forEach(() => {
          favGames.add(openings[random(0, openings.length - 1)]);
        });
      let favGamesArr: { gameTitle: string; game: string }[] = [];
      favGamesArr.push({ gameTitle: 'chuj', game: 'pizda' });

      Array.from(favGames).forEach((v: string) => {
        favGamesArr.push({ gameTitle: v, game: 's' });
      });
      const city = cities[random(0, cities.length - 1)];
      const chessTitle = chessTitles[random(0, chessTitles.length - 1)];

      if (newUser) {
        return new User(
          id,
          name,
          age,
          photoArr,
          distance,
          description,
          tagArr,
          favOpening,
          favGamesArr,
          city,
          chessTitle
        );
      }
      this.users.push(
        new User(
          id,
          name,
          age,
          photoArr,
          distance,
          description,
          tagArr,
          favOpening,
          favGamesArr,
          city,
          chessTitle
        )
      );
    }
    this.currentUser = this.users[0];
    this.users.forEach((user, index) => {
      user.messagesId = [];
      const ids = new Set<string>();
      //i - amount of messages threads
      for (let i = 0; i < 15; i++) {
        ids.add(
          this.users[
            random(2, this.users.length) != index
              ? random(2, this.users.length)
              : null
          ]?.id
        );
      }
      user.messagesId = Array.from(ids).filter((val) => val != undefined);
      user.messagesId.forEach((id) => {
        this.messageService.generateFakeMessages([id, user.id]);
      });
    });

    return null;
  }
}
