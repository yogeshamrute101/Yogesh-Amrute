export interface SymbolDefinition {
  symbol: string;
  meaning: string;
  domain?: string;
  units?: string;
  aliases?: string[];
}

export class SymbolUnderstandingEngine {
  private symbols = new Map<string, SymbolDefinition>();

  register(item: SymbolDefinition) {
    this.symbols.set(item.symbol, { ...item });
    return item;
  }

  lookup(symbol: string) {
    return this.symbols.get(symbol);
  }

  list() {
    return [...this.symbols.values()];
  }
}
