import {
  CameraBackgroundMode,
  CameraMood,
  LiveCameraFrame,
  LiveCameraPlan,
  LiveCameraPrompt,
} from './LiveCameraTypes';

export class LiveCameraPlanner {
  plan(
    request: LiveCameraPrompt,
    frame?: LiveCameraFrame
  ): LiveCameraPlan {
    const text = request.prompt.toLowerCase();

    let background: CameraBackgroundMode =
      request.background ? 'replace' : 'original';

    if (
      text.includes('remove background') ||
      text.includes('background remove') ||
      text.includes('transparent background')
    ) {
      background = 'remove';
    }

    if (
      text.includes('blur background') ||
      text.includes('background blur') ||
      text.includes('portrait blur')
    ) {
      background = 'blur';
    }

    if (
      text.includes('virtual background') ||
      text.includes('change background') ||
      text.includes('replace background')
    ) {
      background = 'replace';
    }

    let mood: CameraMood = request.mood ?? 'natural';

    const moods: CameraMood[] = [
      'cinematic',
      'warm',
      'cool',
      'dramatic',
      'soft',
      'vibrant',
      'dark',
      'bright',
    ];

    for (const candidate of moods) {
      if (text.includes(candidate)) {
        mood = candidate;
        break;
      }
    }

    let edge = request.edge ?? 'auto';

    if (text.includes('glow edge') || text.includes('glowing edge')) {
      edge = 'glow';
    } else if (text.includes('sharp edge')) {
      edge = 'sharp';
    } else if (text.includes('soft edge')) {
      edge = 'soft';
    } else if (text.includes('outline')) {
      edge = 'outline';
    }

    const imageToVideo =
      request.imageToVideo === true ||
      text.includes('image to video') ||
      text.includes('animate') ||
      text.includes('make it move');

    const cinematic =
      request.cinematic === true ||
      text.includes('cinematic');

    const durationSeconds =
      request.durationSeconds ??
      (text.includes('10 second') ? 10 :
       text.includes('8 second') ? 8 :
       text.includes('5 second') ? 5 : 5);

    const actions: string[] = [
      'Analyze live camera frame',
      'Detect subject/background',
      `Apply ${background} background mode`,
      `Apply ${edge} subject edge`,
      `Apply ${mood} color mood`,
    ];

    if (imageToVideo) {
      actions.push('Prepare image-to-video motion direction');
    }

    if (cinematic) {
      actions.push('Prepare cinematic camera/motion treatment');
    }

    return {
      background,
      backgroundPrompt: request.background,
      edge,
      mood,
      imageToVideo,
      cinematic,
      durationSeconds,
      confidence: frame?.hasSubject ? 0.75 : 0.4,
      actions,
    };
  }
}
