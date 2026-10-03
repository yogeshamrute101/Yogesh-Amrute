export interface VideoEffect {
  id: string;
  name: string;
  enabled: boolean;
  parameters?: Record<string, number | string | boolean>;
}

export class EffectsService {
  list(): VideoEffect[] {
    return [
      { id: "none", name: "None", enabled: true },
      { id: "fade", name: "Fade", enabled: false },
      { id: "zoom", name: "Zoom", enabled: false },
      { id: "blur", name: "Blur", enabled: false },
      { id: "cinematic", name: "Cinematic", enabled: false },
    ];
  }

  validate(effect: VideoEffect): boolean {
    return Boolean(effect.id && effect.name);
  }
}
