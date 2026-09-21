import { ChessEngine, MoveEvaluation } from "./ChessEngine";
import { ChessMove, ChessPosition } from "./ChessTypes";

export class ChessGameManager {
  private readonly engine = new ChessEngine();
  private history: ChessMove[] = [];

  getHistory() {
    return [...this.history];
  }

  analyze(position: ChessPosition, depth = 3) {
    return this.engine.chooseMove(position, depth);
  }

  play(position: ChessPosition, depth = 3): MoveEvaluation | undefined {
    const selected = this.engine.chooseMove(position, depth);

    if (!selected || !selected.verifiedLegal) {
      return undefined;
    }

    this.history.push(selected.move);
    return selected;
  }
}
