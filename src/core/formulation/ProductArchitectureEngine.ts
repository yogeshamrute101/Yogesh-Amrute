export type ArchitectureDomain =
  | "CHEMICAL"
  | "PHARMACEUTICAL"
  | "ELECTRONIC"
  | "MECHANICAL"
  | "AUTOMOTIVE"
  | "AEROSPACE"
  | "ENERGY"
  | "SOFTWARE"
  | "CONSUMER"
  | "INDUSTRIAL"
  | "CUSTOM";

export interface ProductArchitecture {
  id: string;
  name: string;
  domain: ArchitectureDomain;
  subsystems: string[];
  interfaces: string[];
  constraints: string[];
  tests: string[];
  verificationRequirements: string[];
}

export class ProductArchitectureEngine {
  create(
    input: ProductArchitecture
  ): ProductArchitecture {
    return { ...input };
  }
}
