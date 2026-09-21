export interface SpreadsheetCell {
  address: string;
  value?: unknown;
  formula?: string;
  format?: Record<string, unknown>;
}

export interface SpreadsheetSheet {
  name: string;
  cells: SpreadsheetCell[];
}

export class SpreadsheetEngine {
  inspect(sheet: SpreadsheetSheet) {
    return {
      name: sheet.name,
      cellCount: sheet.cells.length,
      formulas: sheet.cells.filter(x => Boolean(x.formula)),
      values: sheet.cells.filter(x => x.value !== undefined),
    };
  }
}
