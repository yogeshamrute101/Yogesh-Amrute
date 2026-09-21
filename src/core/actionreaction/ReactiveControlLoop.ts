import {
  ActionReactionEngine,
  ActionRecord,
  ReactionAssessment,
} from "./ActionReactionEngine";

export class ReactiveControlLoop {
  private readonly engine = new ActionReactionEngine();

  process(record: ActionRecord): ReactionAssessment {
    const assessment = this.engine.assess(record);

    switch (assessment.nextAction) {
      case "CONTINUE":
        return assessment;

      case "ADAPT":
        return {
          ...assessment,
          reason:
            assessment.reason +
            " Re-plan using the new observed state.",
        };

      case "CORRECT":
        return {
          ...assessment,
          reason:
            assessment.reason +
            " Apply a controlled correction before continuing.",
        };

      default:
        return assessment;
    }
  }
}
