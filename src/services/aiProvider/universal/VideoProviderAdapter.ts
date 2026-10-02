import {
  VideoGenerationRequest,
  VideoGenerationResult,
} from '../VideoGenerationProvider';

export async function executeVideoGeneration(
  _request: VideoGenerationRequest,
): Promise<VideoGenerationResult> {
  throw new Error(
    'Universal video execution adapter is not connected to a verified video-generation contract yet.',
  );
}
