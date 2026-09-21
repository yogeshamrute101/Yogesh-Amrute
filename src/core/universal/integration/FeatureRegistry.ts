export type FeatureHandler = (input: any) => Promise<any> | any;

class FeatureRegistry {
  private handlers = new Map<string, FeatureHandler>();

  register(name: string, handler: FeatureHandler) {
    this.handlers.set(name, handler);
  }

  has(name: string) {
    return this.handlers.has(name);
  }

  async execute(name: string, input: any) {
    const handler = this.handlers.get(name);

    if (!handler) {
      return {
        success: false,
        error: `Feature '${name}' is not connected yet.`,
      };
    }

    try {
      return {
        success: true,
        data: await handler(input),
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
      };
    }
  }

  list() {
    return [...this.handlers.keys()];
  }
}

export const featureRegistry = new FeatureRegistry();
