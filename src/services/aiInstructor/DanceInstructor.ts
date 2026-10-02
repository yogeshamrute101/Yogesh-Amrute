export type DanceLevel =
  | 'beginner'
  | 'intermediate'
  | 'advanced';

export type DanceTask =
  | 'warmup'
  | 'basic-steps'
  | 'footwork'
  | 'hand-movements'
  | 'body-isolation'
  | 'turns'
  | 'balance'
  | 'rhythm'
  | 'choreography'
  | 'freestyle'
  | 'practice'
  | 'correction'
  | 'performance';

export interface DanceInstructorRequest {
  task: DanceTask;
  style?: string;
  level?: DanceLevel;
  music?: string;
  durationMinutes?: number;
  goal?: string;
  learnerDescription?: string;
}

export interface DanceStep {
  number: number;
  name: string;
  counts: string;
  instruction: string;
  practiceSeconds: number;
}

export interface DanceInstructorResponse {
  task: DanceTask;
  style: string;
  level: DanceLevel;
  steps: DanceStep[];
  safetyNotes: string[];
  practicePlan: string[];
}

const DEFAULT_STEPS: DanceStep[] = [
  {
    number: 1,
    name: 'Ready Position',
    counts: '1–8',
    instruction: 'Stand comfortably, align posture, relax shoulders and prepare your weight transfer.',
    practiceSeconds: 30,
  },
  {
    number: 2,
    name: 'Weight Transfer',
    counts: '1–8',
    instruction: 'Shift body weight slowly from one foot to the other while maintaining balance.',
    practiceSeconds: 45,
  },
  {
    number: 3,
    name: 'Basic Footwork',
    counts: '1–8',
    instruction: 'Practice the selected style’s basic foot pattern slowly, then repeat with a steady count.',
    practiceSeconds: 60,
  },
  {
    number: 4,
    name: 'Arm Coordination',
    counts: '1–8',
    instruction: 'Add simple arm movements while keeping the footwork controlled.',
    practiceSeconds: 60,
  },
  {
    number: 5,
    name: 'Body Coordination',
    counts: '1–8',
    instruction: 'Coordinate torso and body movement with the established rhythm without forcing range of motion.',
    practiceSeconds: 60,
  },
  {
    number: 6,
    name: 'Direction Change',
    counts: '1–8',
    instruction: 'Repeat the basic pattern while changing direction gradually.',
    practiceSeconds: 60,
  },
  {
    number: 7,
    name: 'Turn Preparation',
    counts: '1–8',
    instruction: 'Practice controlled spotting and preparation before attempting a full turn.',
    practiceSeconds: 45,
  },
  {
    number: 8,
    name: 'Combination',
    counts: '2 × 8',
    instruction: 'Join the practiced movements into a short combination at a comfortable speed.',
    practiceSeconds: 90,
  },
  {
    number: 9,
    name: 'Music Practice',
    counts: '2 × 8',
    instruction: 'Perform the combination with music, starting slowly and increasing speed only when controlled.',
    practiceSeconds: 120,
  },
  {
    number: 10,
    name: 'Performance Run',
    counts: '4 × 8',
    instruction: 'Perform the combination continuously and focus on timing, posture, transitions and expression.',
    practiceSeconds: 120,
  },
];

export function createDanceInstructorResponse(
  request: DanceInstructorRequest,
): DanceInstructorResponse {
  const level = request.level ?? 'beginner';

  return {
    task: request.task,
    style: request.style ?? 'general dance',
    level,
    steps: DEFAULT_STEPS.map((step) => ({ ...step })),
    safetyNotes: [
      'Warm up before vigorous movement.',
      'Practice on a suitable non-slip surface.',
      'Increase speed and range gradually.',
      'Stop if movement causes pain or dizziness.',
    ],
    practicePlan: [
      'Learn each movement slowly.',
      'Repeat each step until the timing is consistent.',
      'Combine steps in 8-count sections.',
      'Practice with music.',
      'Record a run for technique review.',
    ],
  };
}
