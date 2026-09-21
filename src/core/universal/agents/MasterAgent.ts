import { ToolBus } from '../ToolBus';
import { PermissionManager } from '../security/PermissionManager';
import { VerificationEngine } from '../verification/VerificationEngine';
import { MemoryEngine } from '../memory/MemoryEngine';
import { ResearchEngine } from '../research/ResearchEngine';

export class MasterAgent {
  readonly tools = new ToolBus();
  readonly permissions = new PermissionManager();
  readonly verifier = new VerificationEngine();
  readonly memory = new MemoryEngine();
  readonly research = new ResearchEngine();

  async execute(request: string) {
    this.memory.log({
      type: 'request',
      data: request,
      source: 'MasterAgent'
    });

    const result = {
      status: 'received',
      request
    };

    const verification = this.verifier.verify(result);

    this.memory.log({
      type: 'verification',
      data: verification,
      source: 'MasterAgent'
    });

    return {
      ...result,
      verification
    };
  }
}
