/**
 * Universal Formulation & Product Design Engine
 *
 * General framework for converting requirements into a structured
 * formulation/design specification.
 *
 * Domain-specific scientific models, validated databases, standards,
 * simulations and professional review are required for real production.
 */

export type ProductState =
  | "LIQUID"
  | "SOLID"
  | "SEMISOLID"
  | "GAS"
  | "POWDER"
  | "COMPOSITE"
  | "ELECTRONIC"
  | "MECHANICAL"
  | "SOFTWARE"
  | "BIOLOGICAL"
  | "CUSTOM";

export type FormulationStage =
  | "REQUIREMENTS"
  | "MATERIAL_SELECTION"
  | "COMPOSITION"
  | "PROCESS_DESIGN"
  | "MANUFACTURING"
  | "QUALITY_CONTROL"
  | "VALIDATION"
  | "PACKAGING"
  | "SCALE_UP"
  | "PRODUCTION"
  | "MONITORING";

export interface IngredientOrComponent {
  id: string;
  name: string;
  quantity?: number;
  unit?: string;
  function: string;
  constraints: string[];
}

export interface FormulationSpecification {
  id: string;
  productName: string;
  category: string;
  state: ProductState;
  objective: string;
  components: IngredientOrComponent[];
  stages: FormulationStage[];
  qualityRequirements: string[];
  safetyRequirements: string[];
  standards: string[];
  assumptions: string[];
  unknowns: string[];
  requiresProfessionalValidation: boolean;
}

export class UniversalFormulationEngine {
  createSpecification(
    input: Omit<FormulationSpecification, "requiresProfessionalValidation">
  ): FormulationSpecification {
    return {
      ...input,
      requiresProfessionalValidation: true
    };
  }

  validateStructure(
    specification: FormulationSpecification
  ): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (!specification.productName.trim()) {
      issues.push("Product name is required.");
    }

    if (!specification.category.trim()) {
      issues.push("Product category is required.");
    }

    if (!specification.components.length) {
      issues.push("At least one component/material must be specified.");
    }

    if (!specification.stages.length) {
      issues.push("Manufacturing/design stages are required.");
    }

    if (!specification.qualityRequirements.length) {
      issues.push("Quality requirements are required.");
    }

    if (!specification.safetyRequirements.length) {
      issues.push("Safety requirements are required.");
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }
}
