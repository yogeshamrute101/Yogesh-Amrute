import {
  AutonomousInitiative,
  ImaginationCandidate,
  ImaginationKind,
  ImaginationMode,
  ImaginationPolicy,
  InstructorContext,
} from './InstructorImaginationTypes';

const DEFAULT_POLICY: ImaginationPolicy = {
  allowWhenInstructionMissing: true,
  allowExternalActions: false,
  allowUnverifiedCurrentFacts: false,
  allowInfiniteSelfTalk: false,
  maxAutonomousTurns: 1,
  cooldownTurns: 2,
};

const normalize = (value: unknown): string =>
  String(value ?? '')
    .trim()
    .toLowerCase();

const hasExplicitInstruction = (context: InstructorContext): boolean => {
  const message = normalize(context.userMessage);

  if (!message) return false;

  const instructionPatterns = [
    /^(please|can you|could you|tell me|explain|show me|write|create|make|build|find|search|compare|teach|ask|generate|fix|debug|translate|summarize|analyze|research)\b/,
    /\b(do this|do that|i want|i need|help me|give me|make me)\b/,
    /[?!]$/,
  ];

  return instructionPatterns.some((pattern) => pattern.test(message));
};

const containsCurrentFactIntent = (context: InstructorContext): boolean => {
  const text = normalize(
    `${context.userMessage ?? ''} ${context.topic ?? ''}`,
  );

  return /\b(today|latest|current|recent|news|breaking|now|this week|this month|2026)\b/.test(
    text,
  );
};

const chooseDomain = (context: InstructorContext): string => {
  const text = normalize(
    `${context.domain ?? ''} ${context.topic ?? ''} ${context.userMessage ?? ''}`,
  );

  if (/\b(ai|artificial intelligence|machine learning|llm|agent|software)\b/.test(text))
    return 'AI and technology';

  if (/\b(space|nasa|astronomy|planet|rocket|physics)\b/.test(text))
    return 'science and space';

  if (/\b(pharma|drug|medicine|clinical|protein|gene|disease)\b/.test(text))
    return 'pharma and life science';

  if (/\b(business|startup|market|company|industry|economy)\b/.test(text))
    return 'business and industry';

  if (/\b(code|coding|programming|typescript|javascript|python|software)\b/.test(text))
    return 'software development';

  if (/\b(english|marathi|language|grammar|vocabulary)\b/.test(text))
    return 'language learning';

  return context.topic || context.domain || 'general knowledge';
};

const buildCandidates = (
  context: InstructorContext,
  policy: ImaginationPolicy,
): ImaginationCandidate[] => {
  const domain = chooseDomain(context);
  const summary = context.conversationSummary?.trim();
  const currentFactIntent = containsCurrentFactIntent(context);

  const candidates: ImaginationCandidate[] = [
    {
      kind: 'question',
      content: `Let's explore one interesting question about ${domain}: what is the most surprising thing you would want to understand about it?`,
      rationale: 'Continue the conversation with a useful exploratory question.',
      relevance: 0.9,
      novelty: 0.8,
      learningValue: 0.9,
      safety: 1,
      repetitionPenalty: 0,
      requiresResearch: false,
      isFactualClaim: false,
      isHypothetical: false,
    },
    {
      kind: 'scenario',
      content: `Imagine a realistic future scenario involving ${domain}, then examine what would need to be true for that scenario to happen.`,
      rationale: 'Use bounded imagination to turn the topic into a learning scenario.',
      relevance: 0.85,
      novelty: 0.95,
      learningValue: 0.9,
      safety: 1,
      repetitionPenalty: 0,
      requiresResearch: false,
      isFactualClaim: false,
      isHypothetical: true,
    },
    {
      kind: 'explanation',
      content: `I can build a simple mental model of ${domain} from the context so far and use it to explain the next useful concept.`,
      rationale: 'Convert context into a structured teaching move.',
      relevance: 0.88,
      novelty: 0.7,
      learningValue: 0.95,
      safety: 1,
      repetitionPenalty: 0,
      requiresResearch: false,
      isFactualClaim: false,
      isHypothetical: false,
    },
    {
      kind: 'creative-connection',
      content: `Let's connect ${domain} with a different field and see whether that creates a useful new idea.`,
      rationale: 'Generate a cross-domain connection without claiming it is established fact.',
      relevance: 0.8,
      novelty: 1,
      learningValue: 0.82,
      safety: 1,
      repetitionPenalty: 0,
      requiresResearch: false,
      isFactualClaim: false,
      isHypothetical: false,
    },
    {
      kind: 'next-step',
      content: summary
        ? `Based on the conversation so far, I can propose the next useful step instead of waiting for another instruction.`
        : `I can propose a useful first step for exploring ${domain}.`,
      rationale: 'Keep the instructor useful when the user has not supplied a new instruction.',
      relevance: 0.92,
      novelty: 0.65,
      learningValue: 0.88,
      safety: 1,
      repetitionPenalty: 0,
      requiresResearch: currentFactIntent,
      isFactualClaim: false,
      isHypothetical: false,
    },
  ];

  if (!policy.allowExternalActions) {
    return candidates.filter((candidate) => candidate.safety > 0);
  }

  return candidates;
};

export class InstructorImaginationEngine {
  private readonly policy: ImaginationPolicy;

  constructor(policy: Partial<ImaginationPolicy> = {}) {
    this.policy = {
      ...DEFAULT_POLICY,
      ...policy,
      allowExternalActions: false,
      allowUnverifiedCurrentFacts: false,
      allowInfiniteSelfTalk: false,
    };
  }

  shouldImagine(context: InstructorContext): boolean {
    if (!this.policy.allowWhenInstructionMissing) return false;

    const explicit = hasExplicitInstruction(context);

    if (explicit) return false;

    const previous = normalize(context.lastInstructorAction);

    if (
      previous.includes('autonomous imagination') ||
      previous.includes('autonomous initiative')
    ) {
      return false;
    }

    return true;
  }

  generate(context: InstructorContext): AutonomousInitiative | null {
    if (!this.shouldImagine(context)) {
      return null;
    }

    const candidates = buildCandidates(context, this.policy);

    if (!candidates.length) return null;

    const ranked = candidates
      .map((candidate) => ({
        candidate,
        score:
          candidate.relevance * 0.35 +
          candidate.novelty * 0.2 +
          candidate.learningValue * 0.3 +
          candidate.safety * 0.15 -
          candidate.repetitionPenalty,
      }))
      .sort((a, b) => b.score - a.score);

    const selected = ranked[0].candidate;

    return {
      active: true,
      mode: 'autonomous',
      kind: selected.kind as ImaginationKind,
      content: selected.content,
      rationale: selected.rationale,
      isImagined: selected.isHypothetical,
      requiresResearch: selected.requiresResearch,
      researchRequiredBeforeFactClaim:
        !this.policy.allowUnverifiedCurrentFacts,
      externalActionAllowed: false,
    };
  }

  getPolicy(): ImaginationPolicy {
    return { ...this.policy };
  }
}

export default InstructorImaginationEngine;
