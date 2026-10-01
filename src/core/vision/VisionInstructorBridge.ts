import { VisionFrameInput, VisionInstructorResult } from './VisionInstructorTypes';
import { VisionInstructor } from './VisionInstructor';
import { LipSyncEngine, LipSyncInput, LipSyncResult } from './lipsync';

export interface VisionInstructorAnalysis {
  vision: VisionInstructorResult;
  lipSync: LipSyncResult;
}

export class VisionInstructorBridge {
  private readonly vision = new VisionInstructor();
  private readonly lipSync = new LipSyncEngine();

  analyze(
    visionInput: VisionFrameInput,
    lipSyncInput: LipSyncInput
  ): VisionInstructorAnalysis {
    return {
      vision: this.vision.process(visionInput),
      lipSync: this.lipSync.analyze(lipSyncInput),
    };
  }
}
