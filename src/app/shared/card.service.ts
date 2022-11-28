import { EventEmitter, Injectable, Output } from '@angular/core';
import { single } from 'rxjs';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class CardService {
  users: User[] = [];
  @Output() usersObs = new EventEmitter<boolean>();
  @Output() newMatchObs = new EventEmitter<User>();

  dummyUser: User[] = [];
  swipe: number;

  addUser(user: User) {
    this.users.push(user);
    this.emitUsersObs();
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
    for (let i = 0; i < num; i++) {
      const random = (min: number, max: number) =>
        Math.trunc(Math.random() * max) + min;
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
      let messangeArr: User['messages'] = [];
      if (!newUser) {
        Array(random(1, 8))
          .fill('')
          .forEach(() => {
            messangeArr.push({
              fromUser: random(0, 2) ? true : false,
              message: {
                date: '10.11.22',
                content: lorem.slice(0, random(3, lorem.length - 1)).join(' '),
              },
            });
          });
      } else {
        messangeArr = undefined;
      }

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
          chessTitle,
          random(0, 2) ? messangeArr : undefined
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
          chessTitle,
          random(0, 2) ? messangeArr : undefined
        )
      );
    }
    return null;
  }
}
