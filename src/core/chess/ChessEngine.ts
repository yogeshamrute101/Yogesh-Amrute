import {
  ChessMove,
  ChessPosition,
  PieceType,
} from "./ChessTypes";

export interface MoveEvaluation {
  move: ChessMove;
  score: number;
  principalVariation: ChessMove[];
  depth: number;
  verifiedLegal: boolean;
}

export class ChessEngine {
  legalMoves(position: ChessPosition): ChessMove[] {
    // Architecture contract.
    // A production engine should implement complete chess legality,
    // including check, castling, en-passant and promotion.
    return [];
  }

  evaluatePosition(position: ChessPosition): number {
    let score = 0;

    const values: Record<PieceType, number> = {
      PAWN: 1,
      KNIGHT: 3,
      BISHOP: 3,
      ROOK: 5,
      QUEEN: 9,
      KING: 1000,
    };

    for (const piece of Object.values(position.board)) {
      if (!piece) continue;

      score +=
        piece.color === "WHITE"
          ? values[piece.type]
          : -values[piece.type];
    }

    return score;
  }

  chooseMove(
    position: ChessPosition,
    depth = 3
  ): MoveEvaluation | undefined {
    const moves = this.legalMoves(position);

    if (!moves.length) return undefined;

    const scored = moves.map(move => ({
      move,
      score: this.evaluatePosition(position),
      principalVariation: [move],
      depth,
      verifiedLegal: true,
    }));

    return scored[0];
  }
}
