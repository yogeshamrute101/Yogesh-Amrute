import { InstructorContext, ImaginationMode } from './InstructorImaginationTypes';

export interface AutonomyDecision {
  mode: ImaginationMode;
  instructionPresent: boolean;
  mayImagine: boolean;
  mayResearch: boolean;
  mayActExternally: false;
  reason: string;
}

const instructionPattern =
  /\b(please|can you|could you|tell me|explain|show me|create|make|build|find|search|write|generate|fix|debug|teach|compare|analyze|research|translate|summarize)\b/i;

export function decideInstructorAutonomy(
  context: InstructorContext,
): AutonomyDecision {
  const message = String(context.userMessage ?? '').trim();
  const instructionPresent = Boolean(message && instructionPattern.test(message));

  if (instructionPresent) {
    return {
      mode: 'instruction-following',
      instructionPresent: true,
      mayImagine: false,
      mayResearch: /\b(latest|current|news|recent|today|now)\b/i.test(message),
      mayActExternally: false,
      reason: 'An explicit user instruction has priority over autonomous imagination.',
    };
  }

  return {
    mode: 'autonomous',
    instructionPresent: false,
    mayImagine: true,
    mayResearch: false,
    mayActExternally: false,
    reason:
      'No clear instruction was detected, so the Instructor may generate one bounded useful next conversational move.',
  };
}
