export type Integration = {
  id: string;
  name: string;
  type: "api" | "app" | "browser" | "device" | "plugin";
  enabled: boolean;
};

export class IntegrationLayer {
  private integrations = new Map<string, Integration>();

  register(integration: Integration) {
    this.integrations.set(integration.id, integration);
    return integration;
  }

  list() {
    return [...this.integrations.values()];
  }
}
