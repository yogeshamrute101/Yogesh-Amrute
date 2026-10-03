export interface AppShellModel {
  title: string;
  navigation: string[];
  showAdvancedControls: boolean;
}

export const defaultAppShellModel: AppShellModel = {
  title: "VIDOAI Studio",
  navigation: [
    "Home",
    "New Project",
    "Editor",
    "AI",
    "Captions",
    "Audio",
    "Settings",
    "Projects",
  ],
  showAdvancedControls: true,
};
