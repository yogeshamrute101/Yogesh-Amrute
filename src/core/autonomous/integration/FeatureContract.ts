export type FeatureResult =
  | {
      success: true;
      data?: unknown;
      message?: string;
    }
  | {
      success: false;
      error: string;
    };

export interface VidoAIFeature {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  execute?: (
    input: Record<string, unknown>
  ) => Promise<FeatureResult>;
}

export class FeatureRegistry {
  private features = new Map<string, VidoAIFeature>();

  register(feature: VidoAIFeature) {
    this.features.set(feature.id, feature);
  }

  get(id: string) {
    return this.features.get(id);
  }

  all() {
    return [...this.features.values()];
  }

  find(command: string) {
    const text = command.toLowerCase();

    return this.all()
      .map((feature) => ({
        feature,
        score: feature.keywords.reduce(
          (score, keyword) =>
            score +
            (text.includes(keyword.toLowerCase()) ? 1 : 0),
          0
        ),
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.feature);
  }
}

export const featureRegistry = new FeatureRegistry();
