export interface ChemicalReaction {
  reactants: string[];
  products: string[];
  conditions?: string[];
  observations?: string[];
}

export class ChemistryReactionEngine {
  analyze(reaction: ChemicalReaction) {
    return {
      reactants: reaction.reactants,
      products: reaction.products,
      conditions: reaction.conditions ?? [],
      observations: reaction.observations ?? [],
      requiresDomainValidation: true,
    };
  }
}
