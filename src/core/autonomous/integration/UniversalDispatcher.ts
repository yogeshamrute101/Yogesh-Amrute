import {
  featureRegistry,
  FeatureResult,
} from "./FeatureContract";
import { getBuiltInFeatures } from "./registerBuiltInFeatures";

getBuiltInFeatures();

export async function dispatchCommand(
  command: string,
  input: Record<string, unknown> = {}
): Promise<FeatureResult> {
  const matches = featureRegistry.find(command);

  if (!matches.length) {
    return {
      success: false,
      error:
        "No registered feature matched this command.",
    };
  }

  const feature = matches[0];

  if (!feature.execute) {
    return {
      success: true,
      data: {
        feature: feature.id,
        matched: true,
        requiresHandler: true,
        command,
        input,
      },
      message:
        `${feature.name} selected. ` +
        "Connect its existing execution handler.",
    };
  }

  return feature.execute(input);
}
