export type Color = "WHITE" | "BLACK";

export type PieceType =
  | "KING"
  | "QUEEN"
  | "ROOK"
  | "BISHOP"
  | "KNIGHT"
  | "PAWN";

export interface ChessPiece {
  type: PieceType;
  color: Color;
}

export interface ChessMove {
  from: string;
  to: string;
  promotion?: PieceType;
  notation?: string;
}

export interface ChessPosition {
  board: Record<string, ChessPiece | null>;
  turn: Color;
  castling?: string;
  enPassant?: string | null;
  halfmove?: number;
  fullmove?: number;
}
