import {
  AutoMediaInput,
  AutoMediaResult,
  AutoMediaExecutor,
} from '../media';

export class MasterMediaInstructor {
  private readonly executor = new AutoMediaExecutor();

  async processMedia(input: AutoMediaInput): Promise<AutoMediaResult> {
    return this.executor.execute(input);
  }

  getExecutor(): AutoMediaExecutor {
    return this.executor;
  }
}
