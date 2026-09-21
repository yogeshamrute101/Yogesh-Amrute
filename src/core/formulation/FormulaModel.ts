/**
 * Universal Formula Model
 *
 * Stores symbolic equations/relationships without pretending that an
 * equation alone is a validated production recipe.
 */

export interface FormulaVariable {
  symbol: string;
  meaning: string;
  unit?: string;
}

export interface FormulaModel {
  id: string;
  name: string;
  category: string;
  equation: string;
  variables: FormulaVariable[];
  assumptions: string[];
  validityDomain: string[];
  validationStatus:
    | "UNVERIFIED"
    | "REVIEW_REQUIRED"
    | "VALIDATED";
}

export class FormulaModelRegistry {
  private formulas = new Map<string, FormulaModel>();

  register(formula: FormulaModel): void {
    this.formulas.set(formula.id, formula);
  }

  get(id: string): FormulaModel | undefined {
    return this.formulas.get(id);
  }

  list(category?: string): FormulaModel[] {
    const values = [...this.formulas.values()];
    return category
      ? values.filter(x => x.category === category)
      : values;
  }
}
