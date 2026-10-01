import {
  InterviewDifficulty,
  InterviewMode,
  InterviewQuestion,
} from './InterviewTypes';

const difficultyGuidance: Record<InterviewDifficulty, string> = {
  beginner: 'Use foundational concepts and simple explanations.',
  intermediate: 'Test understanding, application, and practical reasoning.',
  advanced: 'Test tradeoffs, edge cases, architecture, and deeper reasoning.',
  expert: 'Test rigorous reasoning, assumptions, edge cases, synthesis, and novel scenarios.',
};

export class InterviewQuestionEngine {
  createQuestion(
    topic: string,
    difficulty: InterviewDifficulty,
    mode: InterviewMode,
    questionNumber: number,
    previousAnswer?: string,
  ): InterviewQuestion {
    const followUp = Boolean(previousAnswer);

    const question = followUp
      ? `Based on your previous answer, explain the most important limitation, trade-off, or real-world implication of ${topic}.`
      : `Explain ${topic} and describe how you would apply it in a real-world situation.`;

    return {
      id: `interview_q_${Date.now()}_${questionNumber}`,
      topic,
      question,
      difficulty,
      mode,
      expectedConcepts: [
        topic,
        difficultyGuidance[difficulty],
        mode,
      ],
      followUpHints: followUp
        ? ['clarify assumptions', 'give an example', 'explain trade-offs']
        : ['define the concept', 'explain reasoning', 'give a practical example'],
    };
  }
}
