import type {
  DocumentaryPlan,
  DocumentaryScene,
  DocumentaryTopic,
} from '../../types/DocumentaryMode';

const environments: Record<DocumentaryTopic, string> = {
  science: 'realistic scientific laboratory, research facility and relevant experimental environment',
  space: 'space mission control, observatory, spacecraft environment and scientifically accurate space imagery',
  wildlife: 'authentic wildlife habitat with natural animal behavior and environmental context',
  nature: 'authentic natural landscape with realistic weather, terrain and ecosystems',
  history: 'historically appropriate locations, architecture, clothing and objects',
  technology: 'modern technology laboratory, data center, engineering workspace or relevant environment',
  engineering: 'real engineering facility, machinery, infrastructure and technical workspace',
  pharma: 'realistic pharmaceutical research laboratory and clinical research environment',
  energy: 'realistic energy facility, infrastructure and environmental context',
  environment: 'authentic environmental location with scientifically grounded visuals',
  business: 'realistic corporate and industrial environment',
  general: 'authentic real-world documentary environment',
};

const cameraLanguage = [
  'cinematic establishing shot',
  'slow controlled tracking shot',
  'macro detail shot',
  'aerial establishing shot where appropriate',
  'natural handheld documentary shot where appropriate',
  'close-up observational shot',
];

export function createDocumentaryPlan(input: {
  title?: string;
  topic: DocumentaryTopic;
  prompt: string;
  durationSeconds?: number;
}): DocumentaryPlan {
  const duration = input.durationSeconds ?? 300;
  const sceneDuration = 20;
  const count = Math.max(8, Math.ceil(duration / sceneDuration));
  const environment = environments[input.topic];

  const scenes: DocumentaryScene[] = [];

  for (let i = 0; i < count; i += 1) {
    let segment: DocumentaryScene['segment'];

    if (i === 0) segment = 'cold_open';
    else if (i === 1) segment = 'host_intro';
    else if (i % 7 === 0) segment = 'chapter_transition';
    else if (i % 6 === 0) segment = 'data_visualization';
    else if (i % 5 === 0) segment = 'explainer';
    else segment = 'cinematic_broll';

    scenes.push({
      id: `doc-scene-${i + 1}`,
      segment,
      topic: input.topic,
      durationSeconds: sceneDuration,
      location: environment,
      background: environment,
      visualPrompt:
        `${input.prompt}. Create premium factual documentary visuals. ` +
        `Use realistic environments, physically coherent lighting, natural motion, ` +
        `cinematic composition and subject-appropriate B-roll.`,
      narration:
        i === 0
          ? `Open with a strong factual hook about: ${input.prompt}`
          : `Explain the next factual aspect of: ${input.prompt}`,
      cameraDirection:
        cameraLanguage[i % cameraLanguage.length],
      soundDirection:
        'natural location ambience with restrained cinematic documentary sound design',
      graphicsDirection:
        segment === 'data_visualization'
          ? 'clean scientific data visualization with readable labels'
          : undefined,
      factualNotes: [
        'Separate verified facts from interpretation.',
        'Do not invent scientific measurements, quotations or events.',
        'Use uncertainty markers where evidence is incomplete.',
      ],
    });
  }

  return {
    id: `documentary-${Date.now()}`,
    title: input.title ?? 'AI Documentary',
    topic: input.topic,
    hook: input.prompt,
    synopsis: input.prompt,
    visualStyle:
      'premium cinematic factual documentary, photorealistic environments, natural motion and professional broadcast composition',
    narratorStyle:
      'calm authoritative documentary narration with natural pacing',
    musicStyle:
      'cinematic documentary score supporting the subject without overpowering narration',
    scenes,
  };
}
