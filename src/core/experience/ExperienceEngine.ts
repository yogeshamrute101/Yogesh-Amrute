export type ExperienceOutcome =
  | "SUCCESS"
  | "PARTIAL_SUCCESS"
  | "FAILURE"
  | "UNKNOWN";

export interface ExperienceRecord {
  id: string;
  timestamp: number;
  domain: string;
  situation: string;
  action: string;
  outcome: ExperienceOutcome;
  result?: string;
  verified: boolean;
  errors?: string[];
  lessons?: string[];
  metadata?: Record<string, unknown>;
}

export interface ExperiencePattern {
  domain: string;
  situationPattern: string;
  successfulActions: string[];
  failedActions: string[];
  evidenceCount: number;
  confidence: number;
}

export class ExperienceEngine {
  private records: ExperienceRecord[] = [];

  remember(record: ExperienceRecord) {
    this.records.push({ ...record });
    return record;
  }

  recall(domain: string, situation: string) {
    return this.records.filter(record =>
      record.domain === domain &&
      record.situation.toLowerCase().includes(
        situation.toLowerCase()
      )
    );
  }

  learn(record: ExperienceRecord) {
    if (!record.verified) {
      return {
        learned: false,
        reason: "Unverified experience cannot become trusted experience.",
      };
    }

    return {
      learned: true,
      lesson:
        record.lessons?.length
          ? record.lessons
          : [`Observed ${record.outcome} after ${record.action}.`],
    };
  }

  buildPattern(
    domain: string,
    situation: string
  ): ExperiencePattern {
    const matches = this.recall(domain, situation);
    const verified = matches.filter(x => x.verified);

    const successfulActions = [
      ...new Set(
        verified
          .filter(x =>
            x.outcome === "SUCCESS" ||
            x.outcome === "PARTIAL_SUCCESS"
          )
          .map(x => x.action)
      ),
    ];

    const failedActions = [
      ...new Set(
        verified
          .filter(x => x.outcome === "FAILURE")
          .map(x => x.action)
      ),
    ];

    return {
      domain,
      situationPattern: situation,
      successfulActions,
      failedActions,
      evidenceCount: verified.length,
      confidence: Math.min(1, verified.length / 10),
    };
  }
}
