import { InstructorDomain } from './UniversalInstructorTypes';

export interface InterviewState {
  id: string;
  topic: string;
  domain: InstructorDomain;
  questionNumber: number;
  totalQuestions: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  previousAnswer?: string;
}

export class InstructorInterviewEngine {
  start(
    topic: string,
    domain: InstructorDomain,
    totalQuestions = 10,
  ): InterviewState {
    return {
      id: `interview_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      topic,
      domain,
      questionNumber: 1,
      totalQuestions: Math.max(1, Math.min(totalQuestions, 50)),
      difficulty: 'intermediate',
    };
  }

  nextQuestion(state: InterviewState): string {
    const followUp = Boolean(state.previousAnswer);

    if (followUp) {
      return `Based on your previous answer about ${state.topic}, explain one important limitation, trade-off, or real-world implication.`;
    }

    return `What is ${state.topic}, how does it work, and where would you apply it in practice?`;
  }

  recordAnswer(state: InterviewState, answer: string): InterviewState {
    const next = {
      ...state,
      previousAnswer: answer,
      questionNumber: state.questionNumber + 1,
    };

    if (answer.trim().length < 60) {
      next.difficulty = 'beginner';
    } else if (answer.trim().length > 250) {
      next.difficulty = 'advanced';
    }

    return next;
  }
}
