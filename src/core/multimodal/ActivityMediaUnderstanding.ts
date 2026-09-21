export interface MediaSegment {
  startMs: number;
  endMs: number;
  label?: string;
  confidence?: number;
}

export interface MediaUnderstanding {
  modality: "CAMERA" | "AUDIO" | "VIDEO";
  segments: MediaSegment[];
  objects: string[];
  actions: string[];
  speech?: string;
  sounds: string[];
}

export class ActivityMediaUnderstanding {
  analyze(input: MediaUnderstanding) {
    return {
      modality: input.modality,
      durationSegments: input.segments.length,
      objects: [...input.objects],
      actions: [...input.actions],
      speech: input.speech ?? "",
      sounds: [...input.sounds],
    };
  }
}
