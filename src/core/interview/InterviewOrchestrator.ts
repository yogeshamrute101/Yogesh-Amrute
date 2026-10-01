import {
  InterviewRequest,
  InterviewSession,
} from './InterviewTypes';
import { InterviewQuestionEngine } from './InterviewQuestionEngine';
import { InterviewEvaluationEngine } from './InterviewEvaluationEngine';

export class InterviewOrchestrator {
  private readonly questions = new InterviewQuestionEngine();
  private readonly evaluator = new InterviewEvaluationEngine();

  createSession(request: InterviewRequest): InterviewSession {
    const difficulty = request.difficulty ?? 'intermediate';
    const mode = request.mode ?? 'mock';
    const language = request.language ?? 'English';
    const totalQuestions = Math.max(
      1,
      Math.min(request.questionCount ?? 10, 50),
    );

    const session: InterviewSession = {
      id: `interview_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      topic: request.topic.trim(),
      difficulty,
      mode,
      language,
      questionNumber: 1,
      totalQuestions,
      evaluations: [],
      startedAt: Date.now(),
      status: 'active',
    };

    session.currentQuestion = this.questions.createQuestion(
      session.topic,
      difficulty,
      mode,
      1,
    );

    return session;
  }

  answer(
    session: InterviewSession,
    answer: string,
  ): InterviewSession {
    if (!session.currentQuestion) {
      return session;
    }

    const evaluation = this.evaluator.evaluate(
      session.currentQuestion,
      answer,
    );

    session.evaluations.push(evaluation);

    if (
      session.questionNumber >= session.totalQuestions &&
      !evaluation.followUpRequired
    ) {
      session.status = 'completed';
      session.completedAt = Date.now();
      return session;
    }

    session.questionNumber += 1;

    session.currentQuestion = this.questions.createQuestion(
      session.topic,
      session.difficulty,
      session.mode,
      session.questionNumber,
      answer,
    );

    return session;
  }

  summary(session: InterviewSession) {
    const scores = session.evaluations.map((item) => item.score);
    const average =
      scores.length === 0
        ? 0
        : Math.round(
            scores.reduce((a, b) => a + b, 0) / scores.length,
          );

    return {
      sessionId: session.id,
      topic: session.topic,
      questionsAnswered: session.evaluations.length,
      averageScore: average,
      strengths: [
        ...new Set(
          session.evaluations.flatMap((item) => item.strengths),
        ),
      ],
      improvementAreas: [
        ...new Set(
          session.evaluations.flatMap((item) => item.weaknesses),
        ),
      ],
      completed: session.status === 'completed',
    };
  }
}
