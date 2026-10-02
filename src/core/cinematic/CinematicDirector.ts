import type {
  CinematicMoviePlan,
  CinematicScene,
  CinematicSubject,
  PerformanceRole,
} from '../../types/CinematicMovie';

const WORLD_PRESETS: Record<CinematicSubject, {
  environment: string;
  background: string;
  lighting: string;
  atmosphere: string;
  props: string[];
}> = {
  news: {
    environment: 'professional television newsroom',
    background: 'live news wall, broadcast graphics, newsroom desks and screens',
    lighting: 'professional broadcast studio lighting',
    atmosphere: 'live newsroom energy',
    props: ['teleprompter', 'desk', 'broadcast monitors', 'microphones'],
  },
  education: {
    environment: 'modern educational studio or classroom',
    background: 'interactive display, learning materials and relevant subject visuals',
    lighting: 'clean soft educational lighting',
    atmosphere: 'focused instructional environment',
    props: ['display', 'whiteboard', 'teaching materials'],
  },
  documentary: {
    environment: 'authentic real-world documentary location',
    background: 'location-specific natural environment',
    lighting: 'naturalistic documentary lighting',
    atmosphere: 'observational and realistic',
    props: ['documentary camera equipment where appropriate'],
  },
  business: {
    environment: 'modern corporate environment',
    background: 'office, boardroom or industry-specific workplace',
    lighting: 'cinematic professional lighting',
    atmosphere: 'credible corporate environment',
    props: ['laptop', 'documents', 'presentation display'],
  },
  science: {
    environment: 'realistic scientific laboratory or research facility',
    background: 'scientific instruments and research displays',
    lighting: 'clean laboratory lighting',
    atmosphere: 'research-focused',
    props: ['lab equipment', 'displays', 'scientific instruments'],
  },
  pharma: {
    environment: 'realistic pharmaceutical research facility',
    background: 'laboratory, microscopy, molecular visualization and research equipment',
    lighting: 'clean clinical cinematic lighting',
    atmosphere: 'high-tech scientific research',
    props: ['lab instruments', 'sample containers', 'research displays'],
  },
  history: {
    environment: 'historically appropriate location',
    background: 'period-appropriate architecture, objects and environment',
    lighting: 'period-appropriate cinematic lighting',
    atmosphere: 'historically immersive',
    props: ['period-appropriate objects'],
  },
  entertainment: {
    environment: 'cinematic production environment',
    background: 'story-specific production design',
    lighting: 'cinematic lighting',
    atmosphere: 'dramatic entertainment production',
    props: [],
  },
  general: {
    environment: 'story-appropriate cinematic environment',
    background: 'context-aware production design',
    lighting: 'cinematic naturalistic lighting',
    atmosphere: 'story-appropriate',
    props: [],
  },
};

const ROLE_PRESETS: Record<PerformanceRole, string> = {
  anchor: 'professional broadcast-anchor communication, controlled delivery and natural teleprompter-style eye contact',
  teacher: 'clear instructional communication with demonstrations and explanatory gestures',
  reporter: 'field-reporting communication with concise factual delivery and location interaction',
  interviewer: 'natural interview pacing with attentive listening and responsive questions',
  actor: 'cinematic character performance with natural dialogue and emotional continuity',
  documentarian: 'observational documentary narration and restrained presentation',
  presenter: 'confident professional presentation with natural audience engagement',
  narrator: 'cinematic voice narration synchronized to visual storytelling',
  character: 'story-driven character performance with consistent personality and behavior',
};

export function createCinematicWorld(
  subject: CinematicSubject,
  role: PerformanceRole,
  storyContext: string,
) {
  const world = WORLD_PRESETS[subject] ?? WORLD_PRESETS.general;

  return {
    ...world,
    visualStyle: 'photorealistic cinematic production, physically coherent lighting, realistic materials, natural human motion',
    roleDirection: ROLE_PRESETS[role],
    storyContext,
  };
}

export function buildCinematicScene(
  scene: CinematicScene,
  subject: CinematicSubject,
  role: PerformanceRole,
) {
  return {
    ...scene,
    world: {
      ...scene.world,
      ...createCinematicWorld(subject, role, scene.action),
    },
    performanceDirection: ROLE_PRESETS[role],
    continuityRequirements: [
      'preserve character identity and appearance',
      'preserve wardrobe unless explicitly changed',
      'preserve spatial and temporal continuity',
      'preserve props and scene state',
      'maintain consistent lighting direction',
      'maintain natural facial motion and lip synchronization',
    ],
  };
}

export function validateCinematicPlan(plan: CinematicMoviePlan): string[] {
  const errors: string[] = [];

  if (!plan.title.trim()) errors.push('Movie title is required');
  if (!plan.premise.trim()) errors.push('Movie premise is required');
  if (!plan.scenes.length) errors.push('At least one scene is required');

  plan.scenes.forEach((scene, index) => {
    if (!scene.location.trim()) errors.push(`Scene ${index + 1}: location missing`);
    if (!scene.action.trim()) errors.push(`Scene ${index + 1}: action missing`);
    if (scene.durationSeconds <= 0) {
      errors.push(`Scene ${index + 1}: invalid duration`);
    }
  });

  return errors;
}
