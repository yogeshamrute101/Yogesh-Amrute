import { TemporalIntelligenceEngine } from './temporal/TemporalIntelligenceEngine';
import { TemporalContext } from './temporal/TemporalTypes';
import { InstructorExecutionBridge } from './InstructorExecutionBridge';
import { ImaginationExecutionContext, RealWorldActionResult } from './InstructorRealWorldActionTypes';
import { InstructorImaginationEngine } from './InstructorImaginationEngine';
import { InstructorContext, AutonomousInitiative } from './InstructorImaginationTypes';
import { InstructorRegistry } from './InstructorRegistry';
import { InstructorIntentRouter } from './InstructorIntentRouter';
import { InstructorInterviewEngine } from './InstructorInterviewEngine';
import { InstructorResearchBridge } from './InstructorResearchBridge';
import {
  InstructorRequest,
  InstructorResponse,
} from './UniversalInstructorTypes';

export class UniversalInstructor {
  private readonly temporalEngine = new TemporalIntelligenceEngine();

  public analyzePastAndForecast(
    context: TemporalContext,
  ) {
    return this.temporalEngine.analyze(context);
  }


  private readonly executionBridge = new InstructorExecutionBridge();

  public planRealWorldAction(
    context: ImaginationExecutionContext,
  ): RealWorldActionResult[] {
    return this.executionBridge.plan(context);
  }


  private readonly imaginationEngine = new InstructorImaginationEngine();

  public generateAutonomousInitiative(context: InstructorContext): AutonomousInitiative | null {
    return this.imaginationEngine.generate(context);
  }

  private readonly registry = new InstructorRegistry();
  private readonly router = new InstructorIntentRouter();
  private readonly interview = new InstructorInterviewEngine();
  private readonly research = new InstructorResearchBridge();

  handle(request: InstructorRequest): InstructorResponse {
    const routed = this.router.route(request);

    const instructor = this.registry.match(
      routed.domain,
      routed.mode,
    );

    const response: InstructorResponse = {
      instructor,
      intent: routed.mode,
      domain: routed.domain,
      topic: routed.topic,
      language: request.language ?? 'auto',
      responsePlan: [],
      requiresOnlineResearch: routed.requiresOnlineResearch,
      requiresInterview: routed.requiresInterview,
      requiresMemory: true,
      sources: [],
    };

    if (routed.requiresOnlineResearch) {
      const researchRequest = this.research.createRequest({
        topic: routed.topic,
        language: request.language,
        depth: request.depth,
      });

      response.responsePlan.push(
        ...researchRequest.instructions,
      );
    }

    if (routed.requiresInterview) {
      response.responsePlan.push(
        'Start adaptive interview.',
        'Evaluate each answer.',
        'Ask follow-up questions.',
        'Adjust difficulty.',
        'Produce final assessment.',
      );
    }

    if (!routed.requiresOnlineResearch && !routed.requiresInterview) {
      response.responsePlan.push(
        'Explain the topic.',
        'Use examples.',
        'Check understanding.',
        'Offer deeper follow-up.',
      );
    }

    return response;
  }

  createInterview(
    topic: string,
    domain = 'general',
    count = 10,
  ) {
    return this.interview.start(
      topic,
      domain as never,
      count,
    );
  }
}
