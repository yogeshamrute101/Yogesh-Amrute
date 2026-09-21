import { ChessMove } from "./ChessTypes";

export interface ChessGameResult {
  moves: ChessMove[];
  result: "WIN" | "LOSS" | "DRAW" | "UNKNOWN";
  errors?: string[];
}

export class ChessLearningEngine {
  learn(game: ChessGameResult) {
    return {
      result: game.result,
      moveCount: game.moves.length,
      lessons: [
        ...(game.errors ?? []).map(error => ({
          type: "ERROR",
          lesson: error,
        })),
        {
          type: "GAME_RESULT",
          lesson: `Game ended with result: ${game.result}`,
        },
      ],
    };
  }
}
