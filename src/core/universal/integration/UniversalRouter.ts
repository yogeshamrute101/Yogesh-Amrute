import { featureRegistry } from "./FeatureRegistry";

const featureKeywords: Record<string, string[]> = {
  "reel-maker": ["reel", "short", "viral", "shorts"],
  captions: ["caption", "subtitle", "subtitles", "text"],
  audio: ["audio", "music", "sound", "voice"],
  editor: ["edit", "trim", "cut", "split", "timeline"],
  export: ["export", "render", "download"],
  copilot: ["ai", "copilot", "assistant"],
};

function detectFeature(command: string) {
  const text = command.toLowerCase();

  for (const [feature, keywords] of Object.entries(featureKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return feature;
    }
  }

  return "copilot";
}

export async function routeUniversalCommand(
  command: string,
  input: any = {}
) {
  const feature = detectFeature(command);

  const result = await featureRegistry.execute(feature, {
    command,
    ...input,
  });

  return {
    command,
    selectedFeature: feature,
    availableFeatures: featureRegistry.list(),
    ...result,
  };
}
