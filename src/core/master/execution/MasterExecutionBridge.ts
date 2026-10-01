import {
  createExecutionPlan,
  understandInstructorRequest,
} from './MasterInstructor';
import { InstructorExecutionPlan } from './MasterExecutionTypes';

export class MasterExecutionBridge {
  understand(goal: string) {
    return understandInstructorRequest(goal);
  }

  plan(goal: string): InstructorExecutionPlan {
    return createExecutionPlan(goal);
  }

  canExecute(goal: string): boolean {
    const intent = understandInstructorRequest(goal);

    return intent.confidence >= 0.55;
  }

  completionRule(): string {
    return [
      'A task is not complete when a plan is generated.',
      'A task is complete only after execution produces a result.',
      'The result must be verified.',
      'If execution fails, recovery must be attempted safely.',
      'Never claim success without verification.',
    ].join(' ');
  }
}

export const masterExecutionBridge = new MasterExecutionBridge();
