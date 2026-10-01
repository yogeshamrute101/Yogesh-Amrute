import {
  InterviewAnswerEvaluation,
  InterviewQuestion,
} from './InterviewTypes';

export class InterviewEvaluationEngine {
  evaluate(
    question: InterviewQuestion,
    answer: string,
  ): InterviewAnswerEvaluation {
    const normalized = answer.trim();

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const missingConcepts: string[] = [];

    if (normalized.length >= 80) {
      strengths.push('Provides enough detail for meaningful evaluation.');
    } else {
      weaknesses.push('Answer may need more explanation or supporting detail.');
    }

    if (/\b(example|because|therefore|trade[- ]?off|however)\b/i.test(normalized)) {
      strengths.push('Shows explanatory or reasoning structure.');
    } else {
      weaknesses.push('Consider explaining the reasoning behind the answer.');
    }

    if (!normalized) {
      weaknesses.push('No answer was provided.');
      missingConcepts.push(...question.expectedConcepts);
    }

    const score = normalized.length === 0
      ? 0
      : Math.min(
          100,
          45 +
            Math.min(25, Math.floor(normalized.length / 20)) +
            (strengths.length * 10) -
            (weaknesses.length * 5),
        );

    return {
      questionId: question.id,
      answer,
      score,
      strengths,
      weaknesses,
      missingConcepts,
      factualConcerns: [],
      followUpRequired: score < 70,
      feedback:
        score >= 80
          ? 'Strong response. Continue by testing deeper reasoning.'
          : score >= 60
            ? 'Reasonable response. A deeper explanation would strengthen it.'
            : 'The response needs clarification and stronger supporting reasoning.',
    };
  }
}
