export type SingingLevel =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'professional';

export type SingingTask =
  | 'warmup'
  | 'breathing'
  | 'pitch'
  | 'scale'
  | 'sur'
  | 'rhythm'
  | 'voice-control'
  | 'resonance'
  | 'pronunciation'
  | 'range'
  | 'song-practice'
  | 'performance'
  | 'vocal-analysis'
  | 'practice-plan';

export interface SingingInstructorRequest {
  task: SingingTask;
  level?: SingingLevel;
  style?: string;
  language?: string;
  song?: string;
  goal?: string;
  durationMinutes?: number;
  audioReference?: string;
}

export interface SingingExercise {
  number: number;
  name: string;
  counts: string;
  instruction: string;
  durationSeconds: number;
}

export interface SingingInstructorResponse {
  task: SingingTask;
  level: SingingLevel;
  exercises: SingingExercise[];
  coachingAreas: string[];
  practicePlan: string[];
  safetyNotes: string[];
}

const EXERCISES: SingingExercise[] = [
  {
    number: 1,
    name: 'Posture Reset',
    counts: '30 seconds',
    instruction: 'Stand comfortably with relaxed shoulders, balanced posture and an easy jaw position.',
    durationSeconds: 30,
  },
  {
    number: 2,
    name: 'Breath Control',
    counts: '4–4–8',
    instruction: 'Inhale comfortably, pause briefly, then release the breath steadily without forcing it.',
    durationSeconds: 60,
  },
  {
    number: 3,
    name: 'Gentle Vocal Warm-up',
    counts: '5 repetitions',
    instruction: 'Use comfortable humming or lip-trill exercises at an easy pitch before higher or louder singing.',
    durationSeconds: 90,
  },
  {
    number: 4,
    name: 'Pitch Matching',
    counts: '5 notes',
    instruction: 'Listen to a reference note and reproduce it comfortably. Repeat only within a comfortable range.',
    durationSeconds: 120,
  },
  {
    number: 5,
    name: 'Scale Practice',
    counts: '1–2–3–4–5–4–3–2–1',
    instruction: 'Sing the scale slowly and evenly, maintaining consistent tone and accurate pitch.',
    durationSeconds: 120,
  },
  {
    number: 6,
    name: 'Rhythm Practice',
    counts: '4 × 8',
    instruction: 'Speak or sing short phrases against a steady beat before adding the complete melody.',
    durationSeconds: 90,
  },
  {
    number: 7,
    name: 'Vowel Clarity',
    counts: '5 repetitions',
    instruction: 'Sing simple vowel patterns clearly while keeping the throat and jaw relaxed.',
    durationSeconds: 90,
  },
  {
    number: 8,
    name: 'Dynamic Control',
    counts: 'soft → medium → soft',
    instruction: 'Gradually change volume while maintaining stable pitch and comfortable vocal production.',
    durationSeconds: 120,
  },
  {
    number: 9,
    name: 'Song Section',
    counts: '1 phrase at a time',
    instruction: 'Practice the song phrase-by-phrase, then connect phrases while maintaining timing and pitch.',
    durationSeconds: 180,
  },
  {
    number: 10,
    name: 'Performance Run',
    counts: 'complete section',
    instruction: 'Perform the practiced section while focusing on timing, expression, diction and controlled breathing.',
    durationSeconds: 180,
  },
];

export function createSingingInstructorResponse(
  request: SingingInstructorRequest,
): SingingInstructorResponse {
  return {
    task: request.task,
    level: request.level ?? 'beginner',
    exercises: EXERCISES.map((exercise) => ({ ...exercise })),
    coachingAreas: [
      'Pitch accuracy',
      'Sur and tonal stability',
      'Rhythm and timing',
      'Breath management',
      'Vocal coordination',
      'Diction and pronunciation',
      'Dynamics and expression',
      'Performance consistency',
    ],
    practicePlan: [
      'Warm up gently.',
      'Practice pitch and scale exercises.',
      'Work on rhythm separately.',
      'Practice the song in short phrases.',
      'Record a practice take when appropriate.',
      'Use verified audio analysis for objective feedback when available.',
    ],
    safetyNotes: [
      'Never force high or low notes.',
      'Stop if singing causes pain or persistent discomfort.',
      'Increase vocal intensity and range gradually.',
      'Stay hydrated and allow adequate rest between demanding sessions.',
    ],
  };
}
