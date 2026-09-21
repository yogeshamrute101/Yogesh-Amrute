export interface UniversalPluginContract {
  id: string;
  name: string;
  version: string;
  inputTypes: string[];
  outputTypes: string[];
  capabilities: string[];
  permissions: string[];
  safetyRequirements: string[];
  verificationRequirements: string[];
}

export class UniversalPluginContractRegistry {
  private contracts = new Map<string, UniversalPluginContract>();

  register(contract: UniversalPluginContract) {
    this.contracts.set(contract.id, { ...contract });
    return contract;
  }

  get(id: string) {
    return this.contracts.get(id);
  }

  all() {
    return [...this.contracts.values()];
  }
}
