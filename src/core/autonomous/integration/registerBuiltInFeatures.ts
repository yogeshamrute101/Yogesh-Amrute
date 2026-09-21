import { featureRegistry } from "./FeatureContract";

const features = [
  {
    id: "copilot",
    name: "AI Copilot",
    description: "AI-assisted editing commands.",
    keywords: ["copilot", "ai", "edit", "command"],
  },
  {
    id: "reel-maker",
    name: "AI Reel Maker",
    description: "Creates reel-oriented editing plans.",
    keywords: ["reel", "short", "viral", "reel-maker"],
  },
  {
    id: "captions",
    name: "Captions",
    description: "Caption creation and editing.",
    keywords: ["caption", "subtitle", "subtitles", "captions"],
  },
  {
    id: "audio",
    name: "Audio",
    description: "Audio and music workflows.",
    keywords: ["audio", "music", "sound", "volume"],
  },
  {
    id: "editor",
    name: "Editor",
    description: "General video editing workflow.",
    keywords: ["editor", "edit", "video", "clip", "timeline"],
  },
  {
    id: "export",
    name: "Export",
    description: "Final media export workflow.",
    keywords: ["export", "render", "save", "download"],
  },
];

for (const feature of features) {
  featureRegistry.register(feature);
}

export function getBuiltInFeatures() {
  return featureRegistry.all();
}
