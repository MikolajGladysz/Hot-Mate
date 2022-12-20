export interface Tile {
  row: number;
  column: number;
  darkTile: boolean;
  index: number;
  moved?: boolean;
  piece?: string;
  pieceUrl?: string;
  arrow?: { arrowIndex: number; arrowHeight: string; arrowTransform: string };
  attackedWhite?: boolean;
  attackedBlack?: boolean;
}
