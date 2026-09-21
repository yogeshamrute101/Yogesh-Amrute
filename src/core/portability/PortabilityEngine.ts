import {
  ContinuityEngine,
  SystemSnapshot,
  TransferPackage,
} from "../continuity/ContinuityEngine";

export interface RuntimeCapabilities {
  name: string;
  version?: string;
  features: string[];
  storageAvailable?: boolean;
  networkAvailable?: boolean;
}

export interface MigrationResult {
  compatible: boolean;
  transferable: boolean;
  missingCapabilities: string[];
  package?: TransferPackage;
}

export class PortabilityEngine {
  private continuity = new ContinuityEngine();

  inspectRuntime(
    requiredCapabilities: string[],
    runtime: RuntimeCapabilities
  ): MigrationResult {
    const missingCapabilities = requiredCapabilities.filter(
      (capability) => !runtime.features.includes(capability)
    );

    return {
      compatible: missingCapabilities.length === 0,
      transferable: true,
      missingCapabilities,
    };
  }

  createMigrationPackage(snapshot: SystemSnapshot): TransferPackage {
    return this.continuity.packageSnapshot(snapshot, "portable-runtime");
  }
}
