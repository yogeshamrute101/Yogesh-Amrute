export interface NavigationItem {
  id: string;
  label: string;
  path: string;
}

export const navigationModel: NavigationItem[] = [
  { id: "home", label: "Home", path: "/" },
  { id: "new-project", label: "New Project", path: "/new-project" },
  { id: "editor", label: "Editor", path: "/editor" },
  { id: "ai", label: "AI", path: "/ai" },
  { id: "captions", label: "Captions", path: "/captions" },
  { id: "audio", label: "Audio", path: "/audio" },
  { id: "settings", label: "Settings", path: "/settings" },
  { id: "projects", label: "Projects", path: "/projects" },
];
