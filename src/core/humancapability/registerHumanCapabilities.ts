import {
  HumanCapabilityOrchestrator,
  HumanCapability,
} from "./HumanCapabilityOrchestrator";

export function createHumanCapabilitySystem() {
  const system = new HumanCapabilityOrchestrator();

  const domains = [
    "THINK",
    "LEARN",
    "RESEARCH",
    "WRITE",
    "READ",
    "COMMUNICATE",
    "CODE",
    "CREATE",
    "ANALYZE",
    "PLAN",
    "ORGANIZE",
    "MANAGE_FILES",
    "MANAGE_PROJECTS",
    "SCHEDULE",
    "TRANSLATE",
    "CALCULATE",
    "TEACH",
    "ACCESSIBILITY",
    "MEDIA",
    "SOFTWARE",
    "WEB",
    "AUTOMATION",
    "DEVICE",
    "PHYSICAL_WORLD",
  ] as const;

  for (const domain of domains) {
    const capability: HumanCapability = {
      id: `human-${domain.toLowerCase()}`,
      domain,
      description: `Capability layer for ${domain.toLowerCase()} operations.`,
      enabled: true,
      executionMode:
        domain === "DEVICE" || domain === "PHYSICAL_WORLD"
          ? "REQUEST_APPROVAL"
          : "EXECUTE",
      risk:
        domain === "PHYSICAL_WORLD"
          ? "CRITICAL"
          : domain === "DEVICE"
            ? "HIGH"
            : "LOW",
      dependencies: [],
    };

    system.register(capability);
  }

  return system;
}
