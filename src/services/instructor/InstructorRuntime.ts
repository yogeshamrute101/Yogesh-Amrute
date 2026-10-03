import {
  InstructorEngine,
} from "./InstructorEngine";
import type {
  InstructorProfile,
} from "../../types/instructor/InstructorProfile";

export interface InstructorRuntimeResult {
  verified: boolean;
  profile: InstructorProfile;
  continuityKey: string;
  appearance: string;
  environment: string;
  voice: string;
  mimicryAuthorized: boolean;
}

export class InstructorRuntime {
  private readonly engine = new InstructorEngine();

  prepare(
    profile: InstructorProfile,
  ): InstructorRuntimeResult {
    const plan = this.engine.createPlan(profile);

    return {
      verified: true,
      profile,
      continuityKey: plan.continuityKey,
      appearance: plan.appearance,
      environment: plan.environment,
      voice: plan.voice,
      mimicryAuthorized:
        this.engine.canUseMimicry(profile),
    };
  }
}
