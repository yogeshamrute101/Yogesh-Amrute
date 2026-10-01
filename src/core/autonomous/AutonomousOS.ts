import { MasterMediaInstructor } from '../master/MasterMediaInstructor';
import { AutoMediaInput, AutoMediaResult } from '../media';
import { MasterMultimodalInstructor } from '../master/MasterMultimodalInstructor';
import { MasterMultimodalInput, MasterMultimodalDecision } from '../master/MasterMultimodalTypes';
import { VisionFrameInput, VisionInstructorResult, VisionInstructor } from '../vision';
import {
  AutonomousTask,
} from './types';

import {
  AutonomousWorkflowEngine,
  TaskExecutor,
} from './workflow/AutonomousWorkflowEngine';

import { autonomousAgents } from './agents/AgentRegistry';
import { masterExecutionBridge } from '../master/execution';
import { masterToolRouter } from '../master/tools';

import {
  analyzeFullStackCommand,
  FullStackCommandResult,
  prepareExecution,
  ExecutionResult,
} from '../fullstack';

import {
  analyzeMediaOrText,
  ContentInput,
  ContentUnderstandingResult,
} from '../content';

import {
  orchestrateSmartMaster,
  SmartMasterResult,
} from '../master';

export class VidoAIAutonomousOS {
  private readonly masterMediaInstructor = new MasterMediaInstructor();
  private readonly masterMultimodalInstructor = new MasterMultimodalInstructor();
  private readonly visionInstructor = new VisionInstructor();

  readonly engine = new AutonomousWorkflowEngine();
  readonly agents = autonomousAgents;

  create(goal: string) {
    return this.engine.createWorkflow(goal);
  }

  async execute(executor: TaskExecutor) {
    return this.engine.run(executor);
  }

  preparePromptExecution(prompt: string): ExecutionResult {
    return prepareExecution(prompt);
  }

  analyzePrompt(prompt: string): FullStackCommandResult {
    return analyzeFullStackCommand(prompt);
  }

  analyzeContent(input: ContentInput): ContentUnderstandingResult {
    return analyzeMediaOrText(input);
  }

  master(prompt: string): SmartMasterResult {
    return orchestrateSmartMaster(prompt);
  }

  executeMasterInstruction(goal: string) {
    const plan = masterExecutionBridge.plan(goal);

    return {
      ...plan,
      completionRule: masterExecutionBridge.completionRule(),
      executionReady: masterExecutionBridge.canExecute(goal),
    };
  }

  async runMasterCapability(
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

  status() {
    return {
      agents: this.agents,
      workflows: this.engine.workflowsList(),
      tasks: this.engine.queue.all(),
    };
  }
}

export function createAutonomousOS(): VidoAIAutonomousOS {
  return new VidoAIAutonomousOS();
}
