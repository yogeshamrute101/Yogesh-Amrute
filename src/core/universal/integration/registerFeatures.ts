import { featureRegistry } from "./FeatureRegistry";

let registered = false;

export function registerExistingFeatures() {
  if (registered) return;

  /*
   * The registry intentionally starts safely.
   * Existing feature implementations can register themselves here
   * without replacing the existing application.
   */

  featureRegistry.register("copilot", async input => ({
    intent: "copilot",
    command: input.command,
    status: "ready",
    message: "Command routed to AI Copilot.",
  }));

  featureRegistry.register("reel-maker", async input => ({
    intent: "reel-maker",
    command: input.command,
    status: "ready",
    message: "Command routed to Reel Maker.",
  }));

  featureRegistry.register("captions", async input => ({
    intent: "captions",
    command: input.command,
    status: "ready",
    message: "Command routed to Captions.",
  }));

  featureRegistry.register("audio", async input => ({
    intent: "audio",
    command: input.command,
    status: "ready",
    message: "Command routed to Audio.",
  }));

  featureRegistry.register("editor", async input => ({
    intent: "editor",
    command: input.command,
    status: "ready",
    message: "Command routed to Editor.",
  }));

  featureRegistry.register("export", async input => ({
    intent: "export",
    command: input.command,
    status: "ready",
    message: "Command routed to Export.",
  }));

  registered = true;
}
