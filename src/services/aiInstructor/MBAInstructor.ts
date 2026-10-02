export type MBAInstructorTask =
  | 'teach'
  | 'explain'
  | 'case-study'
  | 'assignment'
  | 'quiz'
  | 'exam'
  | 'evaluate'
  | 'feedback'
  | 'study-plan'
  | 'presentation'
  | 'research'
  | 'business-analysis'
  | 'finance'
  | 'marketing'
  | 'operations'
  | 'strategy'
  | 'hr'
  | 'entrepreneurship'
  | 'economics'
  | 'business-law'
  | 'accounting'
  | 'analytics';

export interface MBAInstructorRequest {
  task: MBAInstructorTask;
  topic: string;
  level?: 'foundation' | 'intermediate' | 'advanced';
  language?: string;
  context?: string;
  learnerAnswer?: string;
  questionCount?: number;
}

export interface MBAInstructorResponse {
  task: MBAInstructorTask;
  topic: string;
  content: string;
  sections: string[];
  nextActions: string[];
}

const SUBJECTS = [
  'finance',
  'marketing',
  'operations',
  'strategy',
  'hr',
  'entrepreneurship',
  'economics',
  'business-law',
  'accounting',
  'analytics',
];

function buildSections(task: MBAInstructorTask): string[] {
  switch (task) {
    case 'case-study':
      return ['Situation', 'Problem', 'Analysis', 'Alternatives', 'Decision criteria', 'Implementation'];
    case 'assignment':
      return ['Objective', 'Requirements', 'Framework', 'Deliverables', 'Evaluation criteria'];
    case 'quiz':
    case 'exam':
      return ['Questions', 'Answer requirements', 'Evaluation criteria'];
    case 'evaluate':
      return ['Strengths', 'Gaps', 'Evidence', 'Improvement areas', 'Suggested answer'];
    case 'study-plan':
      return ['Learning goals', 'Topics', 'Practice', 'Assessment', 'Revision'];
    case 'presentation':
      return ['Objective', 'Slide structure', 'Key arguments', 'Evidence', 'Q&A preparation'];
    case 'research':
      return ['Research question', 'Background', 'Method', 'Evidence', 'Analysis', 'Limitations', 'References to verify'];
    default:
      return ['Concept', 'Business context', 'Example', 'Application', 'Key takeaways'];
  }
}

export function createMBAInstructorResponse(
  request: MBAInstructorRequest,
): MBAInstructorResponse {
  const sections = buildSections(request.task);

  return {
    task: request.task,
    topic: request.topic,
    content: [
      `MBA Instructor task: ${request.task}`,
      `Topic: ${request.topic}`,
      `Level: ${request.level ?? 'intermediate'}`,
      `Language: ${request.language ?? 'English'}`,
      '',
      ...sections.map((section) => `${section}:`),
    ].join('\n'),
    sections,
    nextActions: [
      'Generate the lesson or task content with the configured AI provider.',
      'Verify factual and numerical claims before submission.',
      'Create practice or assessment material when requested.',
      'Store learner/project progress when persistence is available.',
    ],
  };
}

export function getMBASubjects(): string[] {
  return [...SUBJECTS];
}
