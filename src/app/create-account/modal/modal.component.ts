import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  @Input() dataToDisplay: {
    tagsId?: number[];
    tagsNames?: string[];
    name?: string;
    moves?: string[];
    playedAsBlack?: boolean;
    chessGame?: boolean;
  };
  @Input() selectedItemsInput: {
    tagsId?: number[];
    name?: string;
    moves?: string[];
    playedAsBlack?: boolean;
  };
  @Output() getSelectedItems = new EventEmitter<{
    tagsId?: number[];
    name?: string;
    moves?: string[];
    playedAsBlack?: boolean;
    fenCode?: string;
  }>();

  @ViewChild('rotate') rotateCheckbox;
  @ViewChild('inputText') inputName;

  selectedItems: {
    tagsId?: number[];
    name?: string;
    moves?: string[];
    playedAsBlack?: boolean;
    fenCode?: string;
  } = {
    tagsId: [],
    name: null,
    moves: [],
    playedAsBlack: false,
    fenCode: null,
  };
  moves: string[];

  chessModal: boolean = false;

  invalid: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.chessModal = this.dataToDisplay.chessGame;
    if (this.selectedItemsInput) {
      if (this.chessModal) this.selectedItems = this.selectedItemsInput;
      else
        this.selectedItems.tagsId = Array.from(
          this.selectedItemsInput as number[]
        );
    }

    if (this.chessModal) {
      if (!this.selectedItemsInput) {
        this.selectedItems = {
          moves: [],
          fenCode: null,
          playedAsBlack: false,
          name: '',
        };
        this.moves = [];
      }
      this.moves = this.selectedItems.moves;
    }

    this.checkValidity();
  }

  addSelectedItem(data: any) {
    if (this.chessModal) {
      this.selectedItems.moves = data[0];
      this.selectedItems.fenCode = data[1];
      this.checkValidity();
      return;
    }

    if (!this.selectedItems?.tagsId || this.selectedItems?.tagsId.length == 0) {
      this.selectedItems = { tagsId: [data] };
      this.checkValidity();
      return;
    }

    if (this.selectedItems.tagsId.includes(data)) {
      this.selectedItems.tagsId.splice(
        this.selectedItems.tagsId.indexOf(data),
        1
      );
    } else {
      this.selectedItems.tagsId.push(data);
    }
    this.checkValidity();
  }
  addGameMoves(gameData: [string[], string]) {
    this.selectedItems.moves = gameData[0];
    this.selectedItems.fenCode = gameData[1];
    this.checkValidity();
  }
  emitAndClose() {
    if (this.chessModal && this.selectedItems) {
      this.selectedItems.playedAsBlack =
        this.rotateCheckbox.nativeElement.checked;
      this.selectedItems.name = this.inputName.nativeElement.value;
    }

    this.getSelectedItems.emit(this.selectedItems);
  }

  checkValidity() {
    this.invalid = this.chessModal
      ? !this.selectedItems.moves || this.selectedItems.moves.length == 0
      : !this.selectedItems?.tagsId ||
        this.selectedItems.tagsId.length > 5 ||
        this.selectedItems.tagsId.length == 0;
  }
}
