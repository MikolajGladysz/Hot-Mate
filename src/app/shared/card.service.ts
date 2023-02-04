import { EventEmitter, Injectable, Output } from '@angular/core';
import { MessageService } from './message.service';
import { User } from './models/user.model';

@Injectable({ providedIn: 'root' })
export class CardService {
  users: User[] = [];
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
      }, 10);
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
      const favGame: { fenCode: string; moves: string[] }[] = [
        {
          fenCode: 'rnbqkbnr/ppppp2p/5p2/6pQ/4P3/2N5/PPPP1PPP/R1B1KBNR',
          moves: ['e2e4', 'f7f6', 'b1c3', 'g7g5', 'd1h5'],
        },

        {
          fenCode: 'rnb2bnr/pppp1k1p/8/8/4P3/3p1P2/PPP2P1P/RNB1KBNR',
          moves: [
            'e2e4',
            'e7e5',
            'd2d4',
            'e5d4',
            'd1g4',
            'd8f6',
            'g4g7',
            'f6f3',
            'g7f7',
            'e8f7',
            'g2f3',
            'd4d3',
          ],
        },
        {
          fenCode: 'rnb1kbnr/ppp2ppp/8/3pp3/4P3/8/PPPP1PBP/RNBQK1NR',
          moves: [
            'e2e4',
            'e7e5',
            'g1f3',
            'd8e7',
            'f3g5',
            'e7d8',
            'g5f3',
            'd8g5',
            'f3g1',
            'g5g2',
            'f1g2',
            'd7d5',
          ],
        },
        {
          fenCode: 'rnb1kbnr/ppp2ppp/8/3pp3/4P3/8/PPPP1PBP/RNBQK1NR',
          moves: [
            'e2e4',
            'e7e5',
            'g1f3',
            'd8e7',
            'f3g5',
            'e7d8',
            'g5f3',
            'd8g5',
            'f3g1',
            'g5g2',
            'f1g2',
            'd7d5',
          ],
        },
        {
          fenCode: 'rnb1kbnr/ppp2ppp/8/3pp3/4P3/8/PPPP1PBP/RNBQK1NR',
          moves: [
            'e2e4',
            'e7e5',
            'g1f3',
            'd8e7',
            'f3g5',
            'e7d8',
            'g5f3',
            'd8g5',
            'f3g1',
            'g5g2',
            'f1g2',
            'd7d5',
          ],
        },
        {
          fenCode: 'rnb1kbnr/ppp2ppp/8/3pp3/4P3/8/PPPP1PBP/RNBQK1NR',
          moves: [
            'e2e4',
            'e7e5',
            'g1f3',
            'd8e7',
            'f3g5',
            'e7d8',
            'g5f3',
            'd8g5',
            'f3g1',
            'g5g2',
            'f1g2',
            'd7d5',
          ],
        },
        {
          fenCode: 'rnbqkb1r/pppp2pp/8/6N1/4Pn2/8/PPPP1PPP/RNBQKB1R',
          moves: [
            'e2e4',
            'e7e5',
            'g1f3',
            'g8f6',
            'f3g5',
            'f6g4',
            'g5e6',
            'g4e3',
            'e6g5',
            'e3f5',
            'g5f3',
            'f5g3',
            'f3e5',
            'g3f5',
            'e5f7',
            'f5d6',
            'f7g5',
            'd6f5',
            'g5f3',
            'f5e7',
            'f3e5',
            'e7g6',
            'e5f7',
            'g6f4',
            'f7g5',
          ],
        },
        {
          fenCode: 'rnbqkbnr/8/p7/1ppppppp/1PPPPPP1/P6P/8/RNBQKBNR',
          moves: [
            'a2a3',
            'a7a6',
            'b2b4',
            'b7b5',
            'c2c4',
            'c7c5',
            'd2d4',
            'd7d5',
            'e2e4',
            'e7e5',
            'f2f4',
            'f7f5',
            'g2g4',
            'g7g5',
            'h2h3',
            'h7h5',
          ],
        },
        {
          fenCode: 'rnbqkb1r/pppp1Npp/8/5P2/5p2/8/PPPP1nPP/RNBQKB1R',
          moves: [
            'e2e4',
            'e7e5',
            'f2f4',
            'f7f5',
            'e4f5',
            'e5f4',
            'g1f3',
            'g8f6',
            'f3e5',
            'f6e4',
            'e5f7',
            'e4f2',
          ],
        },
        {
          fenCode: 'rnbqkb1r/pppp1Npp/8/5P2/5p2/8/PPPP1nPP/RNBQKB1R',
          moves: [
            'e2e4',
            'e7e5',
            'f2f4',
            'f7f5',
            'e4f5',
            'e5f4',
            'g1f3',
            'g8f6',
            'f3e5',
            'f6e4',
            'e5f7',
            'e4f2',
          ],
        },
        {
          fenCode: 'rnbqkb1r/pppp1Npp/8/5P2/5p2/8/PPPP1nPP/RNBQKB1R',
          moves: [
            'e2e4',
            'e7e5',
            'f2f4',
            'f7f5',
            'e4f5',
            'e5f4',
            'g1f3',
            'g8f6',
            'f3e5',
            'f6e4',
            'e5f7',
            'e4f2',
          ],
        },
        {
          fenCode: 'rnbqkbnr/pppp2pp/8/4p3/4PP2/8/PPPPK2P/RNB2B1R',
          moves: [
            'e2e4',
            'e7e5',
            'f2f4',
            'f7f5',
            'g2g4',
            'f5g4',
            'g1f3',
            'g4f3',
            'd1e2',
            'f3e2',
            'e1e2',
          ],
        },
        {
          fenCode: 'rnbqkbnr/pppp2pp/8/4p3/4PP2/8/PPPPK2P/RNB2B1R',
          moves: [
            'e2e4',
            'e7e5',
            'f2f4',
            'f7f5',
            'g2g4',
            'f5g4',
            'g1f3',
            'g4f3',
            'd1e2',
            'f3e2',
            'e1e2',
          ],
        },
        {
          fenCode: 'rnbqkbnr/pppp2pp/8/4p3/4PP2/8/PPPPK2P/RNB2B1R',
          moves: [
            'e2e4',
            'e7e5',
            'f2f4',
            'f7f5',
            'g2g4',
            'f5g4',
            'g1f3',
            'g4f3',
            'd1e2',
            'f3e2',
            'e1e2',
          ],
        },
      ];

      const name = names[random(0, names.length - 1)];
      const age = random(18, 100);
      const distance = random(1, 200);

      const photo = new Set();
      Array(random(1, 9))
        .fill('')
        .forEach(() => {
          photo.add('../../assets/images/userPfp/pfp' + random(1, 9) + '.jpg');
        });
      const photoArr: string[] = <string[]>Array.from(photo);
      const id = Math.random().toString(36).slice(2, 10);

      const description = lorem.slice(0, random(3, lorem.length - 1)).join(' ');

      let tag = new Set();
      Array(random(1, 8))
        .fill('')
        .forEach(() => {
          tag.add(random(0, 5));
        });
      const tagArr: number[] = <number[]>Array.from(tag);
      const favOpening = tagArr;

      const favGamesArr: {
        name: string;
        fenCode: string;
        moves: string[];
      }[] = Array(random(0, 8))
        .fill('')
        .map(() => {
          const game = favGame[random(0, 8)];
          return {
            name: tags[random(0, tags.length - 1)],
            fenCode: game['fenCode'],
            moves: game['moves'],
          };
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
