import type { MoviePlan, MovieCharacter, MovieScene } from '../../../types/CinematicPipeline';

const subjectWorlds: Record<string, string> = {
  news: 'professional television newsroom, broadcast screens, teleprompter, newsroom desk',
  education: 'modern classroom or educational studio with interactive displays',
  science: 'realistic scientific laboratory with research equipment',
  pharma: 'realistic pharmaceutical research laboratory and clinical research environment',
  business: 'modern corporate office, boardroom or industry workplace',
  documentary: 'authentic real-world documentary location',
  history: 'period-appropriate historical environment and architecture',
  entertainment: 'professionally designed cinematic production environment',
  general: 'story-appropriate realistic cinematic environment',
};

const roleDirection: Record<string, string> = {
  anchor: 'professional broadcast anchor presentation',
  teacher: 'clear educational instructor presentation',
  reporter: 'field reporter presentation',
  interviewer: 'natural interview communication',
  actor: 'cinematic character performance',
  presenter: 'professional presenter communication',
  narrator: 'cinematic narration',
  character: 'story-driven character performance',
};

export function createMoviePlan(input: {
  prompt: string;
  subject?: string;
  role?: string;
  durationSeconds?: number;
  aspectRatio?: string;
}): MoviePlan {
  const subject = input.subject ?? 'general';
  const role = input.role ?? 'character';

  const character: MovieCharacter = {
    id: 'main-character',
    name: 'Main Character',
    role,
    appearance: 'AI-generated appearance defined by the story prompt',
    wardrobe: 'story-appropriate wardrobe',
    personality: 'consistent with the screenplay',
    voiceDescription: 'natural human voice appropriate to character and role',
    continuityKey: 'main-character-v1',
  };

  const sceneCount = Math.max(
    3,
    Math.ceil((input.durationSeconds ?? 120) / 30),
  );

  const scenes: MovieScene[] = Array.from(
    { length: sceneCount },
    (_, index) => ({
      id: `scene-${index + 1}`,
      number: index + 1,
      title: `Scene ${index + 1}`,
      location: subjectWorlds[subject] ?? subjectWorlds.general,
      timeOfDay: 'story appropriate',
      background: subjectWorlds[subject] ?? subjectWorlds.general,
      lighting: 'physically coherent cinematic lighting',
      camera: 'cinematic camera movement appropriate to the scene',
      action: input.prompt,
      dialogue: '',
      characters: ['main-character'],
      audio: roleDirection[role] ?? roleDirection.character,
      durationSeconds: Math.max(
        10,
        Math.round((input.durationSeconds ?? 120) / sceneCount),
      ),
      continuityKey: `scene-${index + 1}-continuity-v1`,
    }),
  );

  return {
    id: `movie-${Date.now()}`,
    title: 'AI Generated Movie',
    genre: 'cinematic',
    subject,
    role,
    visualStyle:
      'photorealistic cinematic, realistic materials, natural human motion, coherent lighting',
    aspectRatio: input.aspectRatio ?? '16:9',
    targetDurationSeconds: input.durationSeconds ?? 120,
    synopsis: input.prompt,
    characters: [character],
    scenes,
    musicDirection: 'scene-aware cinematic score',
    soundDirection: 'scene-aware realistic sound design',
  };
}
