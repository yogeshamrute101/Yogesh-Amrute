import {
  UniversalFormulationEngine,
  type FormulationSpecification
} from "./UniversalFormulationEngine";
import { FormulaModelRegistry } from "./FormulaModel";
import { ProcessManufacturingPlanner } from "./ProcessManufacturingPlanner";
import { ProductArchitectureEngine } from "./ProductArchitectureEngine";

export class UniversalProductionCenter {
  readonly formulation = new UniversalFormulationEngine();
  readonly formulas = new FormulaModelRegistry();
  readonly manufacturing = new ProcessManufacturingPlanner();
  readonly architecture = new ProductArchitectureEngine();

  createProductSpecification(
    input: Omit<FormulationSpecification, "requiresProfessionalValidation">
  ) {
    return this.formulation.createSpecification(input);
  }

  validateProductSpecification(
    specification: FormulationSpecification
  ) {
    return this.formulation.validateStructure(specification);
  }
}
