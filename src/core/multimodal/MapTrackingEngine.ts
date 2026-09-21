export interface TrackPoint {
  timestamp: number;
  x: number;
  y: number;
  z?: number;
  label?: string;
}

export interface Track {
  id: string;
  points: TrackPoint[];
}

export class MapTrackingEngine {
  analyze(track: Track) {
    const points = track.points;

    return {
      trackId: track.id,
      pointCount: points.length,
      start: points[0] ?? null,
      end: points[points.length - 1] ?? null,
      movementDetected: points.length > 1,
    };
  }
}
