import {
  LiveReferenceFrame,
  ReferenceFeatures,
  ReferenceMatchCandidate,
  ReferenceMatchResult,
  ReferencePhoto,
} from './ReferenceMatchTypes';
import { ReferenceAnalyzer } from './ReferenceAnalyzer';
import { ReferenceMatchPlanner } from './ReferenceMatchPlanner';

export interface ReferenceMatchProvider {
  available: boolean;

  generateCandidate(input: {
    reference: ReferencePhoto;
    referenceFeatures: ReferenceFeatures;
    liveFrame: LiveReferenceFrame;
    candidateIndex: number;
  }): Promise<{
    outputUri?: string;
    scores: {
      dimension:
        | 'identity'
        | 'face'
        | 'pose'
        | 'framing'
        | 'composition'
        | 'scale'
        | 'position'
        | 'lighting'
        | 'color'
        | 'background'
        | 'edge'
        | 'clothing'
        | 'style';
      score: number;
      reason: string;
    }[];
  }>;
}

export class ReferenceMatchEngine {
  private readonly analyzer = new ReferenceAnalyzer();
  private readonly planner = new ReferenceMatchPlanner();
  private provider: ReferenceMatchProvider | null = null;

  setProvider(provider: ReferenceMatchProvider): void {
    this.provider = provider;
  }

  async match(
    reference: ReferencePhoto,
    liveFrame: LiveReferenceFrame,
    resultCount = 4
  ): Promise<ReferenceMatchResult> {
    const features = await this.analyzer.analyze(reference);

    const plan = this.planner.createPlan(
      reference,
      features,
      resultCount
    );

    if (!this.provider?.available) {
      return {
        status: 'needs-provider',
        candidates: [],
        verified: false,
        message:
          'Reference matching requires a connected vision/image editing provider.',
      };
    }

    const candidates: ReferenceMatchCandidate[] = [];

    for (let i = 0; i < plan.multipleResults; i++) {
      try {
        const generated =
          await this.provider.generateCandidate({
            reference,
            referenceFeatures: features,
            liveFrame,
            candidateIndex: i,
          });

        const scores = generated.scores.map(score => ({
          dimension: score.dimension,
          score: score.score,
          verified: score.score >= plan.minimumScore,
          reason: score.reason,
        }));

        const overallScore =
          scores.length > 0
            ? scores.reduce(
                (sum, score) => sum + score.score,
                0
              ) / scores.length
            : 0;

        const verified =
          scores.length > 0 &&
          scores.every(score => score.verified) &&
          overallScore >= plan.minimumScore;

        candidates.push({
          id: `reference-match-${Date.now()}-${i}`,
          sourceReferenceId: reference.id,
          outputUri: generated.outputUri,
          scores,
          overallScore,
          verified,
          status: verified
            ? 'verified'
            : 'needs-review',
          message: verified
            ? 'Candidate passed reference-match verification.'
            : 'Candidate did not pass the configured similarity threshold.',
        });
      } catch (error) {
        candidates.push({
          id: `reference-match-failed-${Date.now()}-${i}`,
          sourceReferenceId: reference.id,
          scores: [],
          overallScore: 0,
          verified: false,
          status: 'failed',
          message:
            error instanceof Error
              ? error.message
              : 'Candidate generation failed.',
        });
      }
    }

    const verifiedCandidates =
      candidates.filter(candidate => candidate.verified);

    verifiedCandidates.sort(
      (a, b) => b.overallScore - a.overallScore
    );

    const best = verifiedCandidates[0];

    if (best) {
      return {
        status: 'verified',
        candidates,
        bestCandidateId: best.id,
        verified: true,
        message:
          'One or more live-camera results passed reference verification.',
      };
    }

    return {
      status: candidates.some(
        candidate => candidate.status === 'failed'
      )
        ? 'partial'
        : 'needs-review',
      candidates,
      verified: false,
      message:
        'No candidate passed the required reference-match threshold.',
    };
  }
}
