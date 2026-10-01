import {
  ReferenceFeatures,
  ReferencePhoto,
} from './ReferenceMatchTypes';

export class ReferenceAnalyzer {
  async analyze(
    reference: ReferencePhoto
  ): Promise<ReferenceFeatures> {
    const ratio =
      reference.width && reference.height
        ? reference.width / reference.height
        : 1;

    /*
     * Provider-independent structural analysis.
     * Real face/pose/background/color extraction is intentionally
     * not fabricated here; connected vision providers can replace
     * these signals.
     */
    return {
      faceDetected: true,
      subjectDetected: true,
      poseDetected: false,
      backgroundDetected: true,
      dominantColors: [],
      aspectRatio: ratio,
      subjectCenterX: 0.5,
      subjectCenterY: 0.5,
      subjectScale: 0.5,
      lightingLevel: 0.5,
      confidence: 0.5,
    };
  }
}
