import {
  LiveCameraFrame,
} from './LiveCameraTypes';

export class LiveCameraAnalyzer {
  analyze(video: HTMLVideoElement): LiveCameraFrame {
    const width = video.videoWidth || 0;
    const height = video.videoHeight || 0;

    return {
      timestamp: Date.now(),
      width,
      height,
      hasSubject: width > 0 && height > 0,
      subjectConfidence: width > 0 ? 0.5 : 0,
      backgroundConfidence: width > 0 ? 0.5 : 0,
      faceDetected: false,
      motionScore: 0,
      brightness: 0.5,
    };
  }
}
