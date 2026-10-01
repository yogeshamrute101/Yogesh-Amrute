export type InterviewDifficulty =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert';

export type InterviewMode =
  | 'learning'
  | 'technical'
  | 'behavioral'
  | 'mock'
  | 'oral_exam'
  | 'rapid_fire';

export interface InterviewRequest {
  topic: string;
  difficulty?: InterviewDifficulty;
  mode?: InterviewMode;
  questionCount?: number;
  language?: string;
  candidateName?: string;
  context?: string;
}

export interface InterviewQuestion {
  id: string;
  topic: string;
  question: string;
  difficulty: InterviewDifficulty;
  mode: InterviewMode;
  expectedConcepts: string[];
  followUpHints: string[];
}

export interface InterviewAnswerEvaluation {
  questionId: string;
  answer: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  missingConcepts: string[];
  factualConcerns: string[];
  followUpRequired: boolean;
  feedback: string;
}

export interface InterviewSession {
  id: string;
  topic: string;
  difficulty: InterviewDifficulty;
  mode: InterviewMode;
  language: string;
  questionNumber: number;
  totalQuestions: number;
  currentQuestion?: InterviewQuestion;
  evaluations: InterviewAnswerEvaluation[];
  startedAt: number;
  completedAt?: number;
  status: 'created' | 'active' | 'completed' | 'paused';
}
