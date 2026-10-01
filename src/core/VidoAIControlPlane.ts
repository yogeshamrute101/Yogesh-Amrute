import { LiveReferenceMatchController } from './camera/match';
import { LiveCameraEngine } from './camera';
import { MasterMediaInstructor } from './master/MasterMediaInstructor';
import { AutoMediaInput, AutoMediaResult } from './media';
import { MasterMultimodalInstructor } from './master/MasterMultimodalInstructor';
import { MasterMultimodalInput, MasterMultimodalDecision } from './master/MasterMultimodalTypes';
import { VisionFrameInput, VisionInstructorResult, VisionInstructor } from './vision';
import { masterExecutionBridge } from './master/execution';
import { masterToolRouter } from './master/tools';

import {
  createAutonomousOS,
  TaskExecutor,
} from './autonomous';

import {
  executeVidoAICommand,
} from './universal/FinalCommandBridge';

import {
  FullStackCommandResult,
  ExecutionResult,
} from './fullstack';

import {
  ContentInput,
  ContentUnderstandingResult,
} from './content';

import {
  SmartMasterResult,
} from './master';

export class VidoAIControlPlane {
  private readonly referenceMatchController = new LiveReferenceMatchController();

  private readonly liveCameraEngine = new LiveCameraEngine();

  private readonly masterMediaInstructor = new MasterMediaInstructor();

  private readonly masterMultimodalInstructor = new MasterMultimodalInstructor();

  private readonly visionInstructor = new VisionInstructor();

  readonly autonomous = createAutonomousOS();





  master(prompt: string): SmartMasterResult {
    return this.autonomous.master(prompt);
  }

  analyzeContent(
    input: ContentInput
  ): ContentUnderstandingResult {
    return this.autonomous.analyzeContent(input);
  }

  prepareExecution(prompt: string): ExecutionResult {
    return this.autonomous.preparePromptExecution(prompt);
  }

  analyze(prompt: string): FullStackCommandResult {
    return this.autonomous.analyzePrompt(prompt);
  }

  async runCapability(
    capability: Parameters<typeof masterToolRouter.execute>[0],
    goal: string,
    input?: unknown
  ) {
    return masterToolRouter.execute(
      capability,
      goal,
      input
    );
  }

  executeInstruction(goal: string) {
    return masterExecutionBridge.plan(goal);
  }

  async command(
    goal: string,
    executor?: TaskExecutor
  ) {
    if (executor) {
      const workflow = this.autonomous.create(goal);
      return this.autonomous.execute(executor);
    }

    return executeVidoAICommand(goal);
  }
  analyzeVision(input: VisionFrameInput): VisionInstructorResult {
    return this.visionInstructor.process(input);
  }

  analyzeMultimodal(
    input: MasterMultimodalInput
  ): MasterMultimodalDecision {
    return this.masterMultimodalInstructor.decide(input);
  }

  async processMedia(input: AutoMediaInput): Promise<AutoMediaResult> {
    return this.masterMediaInstructor.processMedia(input);
  }

  analyzeLiveCamera(
    video: HTMLVideoElement,
    prompt: string
  ) {
    return this.liveCameraEngine.analyzeFrame(
      video,
      { prompt }
    );
  }

  setReferencePhoto(reference: import('./camera/match').ReferencePhoto): void {
    this.referenceMatchController.setReference(reference);
  }

  async matchLiveCameraToReference(
    frame: import('./camera/match').LiveReferenceFrame,
    resultCount = 4
  ) {
    return this.referenceMatchController.processLiveFrame(
      frame,
      resultCount
    );
  }

}
