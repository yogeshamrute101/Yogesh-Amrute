import type {
  AppSpecification,
  AppScreenSpecification,
} from "../../types/appBuilder/AppSpecification";
import {
  validateAppSpecification,
} from "../../types/appBuilder/AppSpecification";

export class PromptAppBuilder {
  normalizePrompt(prompt: string): string {
    const normalized = prompt.trim();

    if (!normalized) {
      throw new Error("App builder prompt is required.");
    }

    return normalized.replace(/\s+/g, " ");
  }

  createSpecification(prompt: string): AppSpecification {
    const normalized = this.normalizePrompt(prompt);

    const screen: AppScreenSpecification = {
      id: "home",
      title: "Home",
      purpose: normalized,
      actions: ["create", "view", "settings"],
    };

    const specification: AppSpecification = {
      name: "Prompt App",
      description: normalized,
      screens: [screen],
      capabilities: ["prompt-defined"],
    };

    validateAppSpecification(specification);

    return specification;
  }
}
