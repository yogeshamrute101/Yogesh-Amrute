import {
  ActivityConclusion,
  ActivityUnderstanding,
} from "./ActivityUnderstanding";
import { PerceptionInput } from "../perception/MultimodalPerception";

export class ActivityPipeline {
  private understanding = new ActivityUnderstanding();

  process(inputs: PerceptionInput[]): ActivityConclusion {
    return this.understanding.analyze(inputs);
  }
}
