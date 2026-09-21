import { getBuiltInFeatures } from "./integration/registerBuiltInFeatures";

export function getSystemHealth() {
  const features = getBuiltInFeatures();

  return {
    healthy: true,
    timestamp: new Date().toISOString(),
    featureCount: features.length,
    features: features.map((f) => ({
      id: f.id,
      name: f.name,
      registered: true,
      executable: Boolean(f.execute),
    })),
  };
}
