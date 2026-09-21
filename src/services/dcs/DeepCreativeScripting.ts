export interface DCSCharacter {
  name: string;
  role: string;
  personality: string;
  appearance: string;
}

export interface DCSScene {
  sceneNumber: number;
  durationSec: number;
  location: string;
  timeOfDay: string;
  characters: string[];
  action: string;
  dialogue: string;
  voiceOver: string;
  camera: string;
  lighting: string;
  imagePrompt: string;
  videoPrompt: string;
  music: string;
  soundEffects: string;
  caption: string;
  transition: string;
}

export interface DCSFilm {
  title: string;
  logline: string;
  genre: string;
  visualStyle: string;
  targetDurationSec: number;
  characters: DCSCharacter[];
  scenes: DCSScene[];
}

export const DCS_SYSTEM_PROMPT = `
You are DCS — Deep Creative Scripting, an advanced cinematic
story-development engine.

Your job is to transform a user's simple idea into a complete
film-production blueprint.

Think deeply about:
- story structure
- character continuity
- emotional progression
- cinematic visuals
- dialogue
- voice-over
- camera language
- lighting
- music
- sound effects
- transitions
- visual continuity

Create films, not merely short reels.

Return ONLY valid JSON matching this structure:

{
  "title": "",
  "logline": "",
  "genre": "",
  "visualStyle": "",
  "targetDurationSec": 0,
  "characters": [
    {
      "name": "",
      "role": "",
      "personality": "",
      "appearance": ""
    }
  ],
  "scenes": [
    {
      "sceneNumber": 1,
      "durationSec": 0,
      "location": "",
      "timeOfDay": "",
      "characters": [],
      "action": "",
      "dialogue": "",
      "voiceOver": "",
      "camera": "",
      "lighting": "",
      "imagePrompt": "",
      "videoPrompt": "",
      "music": "",
      "soundEffects": "",
      "caption": "",
      "transition": ""
    }
  ]
}

Rules:
1. Maintain character appearance and personality throughout the film.
2. Make every scene logically connect to the previous scene.
3. Match scene durations to the requested total duration.
4. Make imagePrompt suitable for AI image generation.
5. Make videoPrompt suitable for image-to-video generation.
6. Include cinematic camera movement.
7. Include music and sound design.
8. Dialogue and voice-over must fit the scene.
9. Adapt language to the user's requested language.
10. If the user asks for an educational film, keep factual claims accurate.
11. For long films, create proper beginning, middle and ending.
12. Never return markdown. Return JSON only.
`;

export function buildDCSPrompt(
  idea: string,
  targetDurationSec: number,
  language = "English"
): string {
  return `
Create a complete cinematic film using DCS.

USER IDEA:
${idea}

TARGET DURATION:
${targetDurationSec} seconds

LANGUAGE:
${language}

Develop the story from beginning to ending.

Create:
- title
- logline
- genre
- visual style
- characters
- complete scene-by-scene screenplay
- dialogue
- voice-over
- camera directions
- lighting
- image-generation prompts
- image-to-video prompts
- music
- sound effects
- captions
- transitions

Return ONLY valid JSON.
`;
}
