import { getUniversalRuntime } from '../aiProvider/universal/UniversalRuntimeHub';
import { registerCapabilityExecution } from '../aiProvider/universal/CapabilityExecution';

export interface InstructorGoogleRequest {
  prompt: string;
  capability?: 'text' | 'reasoning' | 'vision' | 'image' | 'video' | 'audio' | 'speechToText' | 'textToSpeech';
  model?: string;
}

export interface InstructorGoogleResult {
  provider: string;
  capability: string;
  model?: string;
  result: unknown;
}

let registered = false;

export function registerGoogleInstructorRuntime(): void {
  if (registered) return;

  const runtime = getUniversalRuntime();

  registerCapabilityExecution(runtime, {
    capability: 'text',
    provider: 'google-instructor',
    execute: async (input: unknown) => {
      /*
       * Deliberately does not fabricate a Google API call.
       * Existing verified Google/Gemini provider implementations remain
       * the source of truth for real network execution.
       */
      throw new Error(
        'Google Instructor execution adapter is not connected to a verified Google provider method.',
      );
    },
    configured: () => Boolean(process.env.GEMINI_API_KEY),
  });

  registered = true;
}

export async function executeGoogleInstructor(
  request: InstructorGoogleRequest,
): Promise<InstructorGoogleResult> {
  if (!request.prompt.trim()) {
    throw new Error('Instructor requires a non-empty prompt.');
  }

  registerGoogleInstructorRuntime();

  throw new Error(
    `Google Instructor execution is unavailable until a verified provider adapter is connected for capability "${request.capability ?? 'text'}".`,
  );
}
