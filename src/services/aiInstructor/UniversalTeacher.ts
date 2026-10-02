export type EducationLevel =
  | 'primary'
  | 'middle-school'
  | 'secondary'
  | 'higher-secondary'
  | 'undergraduate'
  | 'postgraduate'
  | 'professional'
  | 'lifelong';

export type TeacherTask =
  | 'teach'
  | 'explain'
  | 'simplify'
  | 'example'
  | 'solve'
  | 'practice'
  | 'worksheet'
  | 'quiz'
  | 'test'
  | 'exam'
  | 'evaluate'
  | 'feedback'
  | 'revision'
  | 'study-plan'
  | 'lesson-plan'
  | 'homework'
  | 'project'
  | 'research'
  | 'presentation'
  | 'oral-practice'
  | 'language-practice'
  | 'coding-practice';

export type Subject =
  | 'mathematics'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'computer-science'
  | 'programming'
  | 'artificial-intelligence'
  | 'data-science'
  | 'english'
  | 'languages'
  | 'literature'
  | 'history'
  | 'geography'
  | 'civics'
  | 'political-science'
  | 'economics'
  | 'accounting'
  | 'business'
  | 'finance'
  | 'marketing'
  | 'management'
  | 'law'
  | 'psychology'
  | 'sociology'
  | 'philosophy'
  | 'statistics'
  | 'environmental-science'
  | 'engineering'
  | 'medicine'
  | 'arts'
  | 'music'
  | 'dance'
  | 'physical-education'
  | 'general-knowledge'
  | 'custom';

export interface UniversalTeacherRequest {
  task: TeacherTask;
  subject: Subject;
  topic: string;
  level?: EducationLevel;
  language?: string;
  learnerQuestion?: string;
  learnerAnswer?: string;
  curriculum?: string;
  durationMinutes?: number;
  questionCount?: number;
  customInstructions?: string;
}

export interface LessonSection {
  title: string;
  purpose: string;
}

export interface UniversalTeacherResponse {
  subject: Subject;
  topic: string;
  task: TeacherTask;
  level: EducationLevel;
  sections: LessonSection[];
  workflow: string[];
  verification: string[];
}

const SUBJECTS: Subject[] = [
  'mathematics',
  'physics',
  'chemistry',
  'biology',
  'computer-science',
  'programming',
  'artificial-intelligence',
  'data-science',
  'english',
  'languages',
  'literature',
  'history',
  'geography',
  'civics',
  'political-science',
  'economics',
  'accounting',
  'business',
  'finance',
  'marketing',
  'management',
  'law',
  'psychology',
  'sociology',
  'philosophy',
  'statistics',
  'environmental-science',
  'engineering',
  'medicine',
  'arts',
  'music',
  'dance',
  'physical-education',
  'general-knowledge',
  'custom',
];

function sectionsFor(task: TeacherTask): LessonSection[] {
  switch (task) {
    case 'quiz':
    case 'test':
    case 'exam':
      return [
        { title: 'Questions', purpose: 'Assess understanding.' },
        { title: 'Answer requirements', purpose: 'Define what a complete answer should contain.' },
        { title: 'Evaluation', purpose: 'Provide a consistent marking framework.' },
      ];

    case 'evaluate':
    case 'feedback':
      return [
        { title: 'What is correct', purpose: 'Identify demonstrated understanding.' },
        { title: 'Gaps', purpose: 'Identify missing or incorrect concepts.' },
        { title: 'Correction', purpose: 'Explain how to improve.' },
        { title: 'Practice', purpose: 'Provide targeted follow-up exercises.' },
      ];

    case 'study-plan':
      return [
        { title: 'Learning goals', purpose: 'Define measurable outcomes.' },
        { title: 'Learning sequence', purpose: 'Order concepts from prerequisite to advanced.' },
        { title: 'Practice', purpose: 'Build retrieval and application skills.' },
        { title: 'Assessment', purpose: 'Check progress.' },
        { title: 'Revision', purpose: 'Revisit weak areas.' },
      ];

    case 'lesson-plan':
      return [
        { title: 'Objectives', purpose: 'Define what the learner should know or do.' },
        { title: 'Prerequisites', purpose: 'Identify required prior knowledge.' },
        { title: 'Instruction', purpose: 'Present the new material.' },
        { title: 'Activity', purpose: 'Apply the concept.' },
        { title: 'Assessment', purpose: 'Check understanding.' },
      ];

    case 'solve':
      return [
        { title: 'Given information', purpose: 'Identify the known facts.' },
        { title: 'Method', purpose: 'Choose an appropriate method.' },
        { title: 'Steps', purpose: 'Work through the solution.' },
        { title: 'Verification', purpose: 'Check the result.' },
      ];

    case 'research':
      return [
        { title: 'Research question', purpose: 'Define the question.' },
        { title: 'Evidence', purpose: 'Identify information that needs verification.' },
        { title: 'Analysis', purpose: 'Compare and interpret evidence.' },
        { title: 'Limitations', purpose: 'Identify uncertainty and missing evidence.' },
      ];

    default:
      return [
        { title: 'Concept', purpose: 'Introduce the topic.' },
        { title: 'Explanation', purpose: 'Explain it at the learner’s level.' },
        { title: 'Examples', purpose: 'Connect theory to examples.' },
        { title: 'Practice', purpose: 'Apply the concept.' },
        { title: 'Check understanding', purpose: 'Test comprehension.' },
        { title: 'Recap', purpose: 'Summarize key points.' },
      ];
  }
}

export function createUniversalTeacherResponse(
  request: UniversalTeacherRequest,
): UniversalTeacherResponse {
  const task = request.task;

  return {
    subject: request.subject,
    topic: request.topic,
    task,
    level: request.level ?? 'secondary',
    sections: sectionsFor(task),
    workflow: [
      'Understand the learner’s question and current level.',
      'Identify prerequisites and misconceptions.',
      'Explain using an appropriate teaching method.',
      'Give examples and practical applications.',
      'Generate guided practice.',
      'Check the learner’s answer when provided.',
      'Give corrective feedback.',
      'Adapt the next lesson to demonstrated progress.',
    ],
    verification: [
      'Verify factual claims when external knowledge is required.',
      'Show calculation steps for quantitative subjects.',
      'Distinguish established facts from interpretation.',
      'Do not claim an answer was graded unless an evaluation was actually performed.',
      'Do not claim an external source was consulted unless it was actually accessed.',
    ],
  };
}

export function getUniversalTeacherSubjects(): Subject[] {
  return [...SUBJECTS];
}

export function supportsUniversalTeaching(subject: Subject): boolean {
  return SUBJECTS.includes(subject);
}
