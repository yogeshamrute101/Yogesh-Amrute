export interface AppScreenSpecification {
  id: string;
  title: string;
  purpose: string;
  actions: string[];
}

export interface AppSpecification {
  name: string;
  description: string;
  screens: AppScreenSpecification[];
  capabilities: string[];
}

export function validateAppSpecification(
  spec: AppSpecification,
): void {
  if (!spec.name.trim()) {
    throw new Error("App name is required.");
  }

  if (!spec.description.trim()) {
    throw new Error("App description is required.");
  }

  if (spec.screens.length === 0) {
    throw new Error("At least one app screen is required.");
  }

  for (const screen of spec.screens) {
    if (!screen.id.trim() || !screen.title.trim()) {
      throw new Error("Every app screen requires an id and title.");
    }
  }
}
