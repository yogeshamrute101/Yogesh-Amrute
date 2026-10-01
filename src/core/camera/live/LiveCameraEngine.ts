import {
  LiveCameraFrame,
  LiveCameraPrompt,
  LiveCameraResult,
} from './LiveCameraTypes';
import { LiveCameraAnalyzer } from './LiveCameraAnalyzer';
import { LiveCameraPlanner } from './LiveCameraPlanner';

export class LiveCameraEngine {
  private readonly analyzer = new LiveCameraAnalyzer();
  private readonly planner = new LiveCameraPlanner();

  analyzeFrame(
    video: HTMLVideoElement,
    request: LiveCameraPrompt
  ): LiveCameraResult {
    if (!video.srcObject || video.readyState < 2) {
      return {
        status: 'needs-camera',
        plan: this.planner.plan(request),
        verified: false,
        message: 'Camera feed is not ready.',
      };
    }

    const frame: LiveCameraFrame =
      this.analyzer.analyze(video);

    const plan = this.planner.plan(request, frame);

    return {
      status: 'ready',
      frame,
      plan,
      verified: frame.hasSubject,
      message: frame.hasSubject
        ? 'Live camera analysis is ready.'
        : 'Camera is active but no usable subject frame is detected.',
    };
  }
}
