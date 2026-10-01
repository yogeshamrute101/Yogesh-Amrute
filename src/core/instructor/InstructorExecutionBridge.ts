import {
  ImaginationExecutionContext,
  RealWorldActionResult,
} from './InstructorRealWorldActionTypes';
import InstructorRealWorldExecutor from './InstructorRealWorldExecutor';

export interface ExistingExecutionAdapters {
  toolBus?: unknown;
  permissionManager?: unknown;
  verificationEngine?: unknown;
  researchEngine?: unknown;
  autonomousExecutionEngine?: unknown;
}

export class InstructorExecutionBridge {
  private readonly planner = new InstructorRealWorldExecutor();

  constructor(private readonly adapters: ExistingExecutionAdapters = {}) {}

  plan(
    context: ImaginationExecutionContext,
  ): RealWorldActionResult[] {
    return this.planner.buildExecutionPlan(context);
  }

  adapterStatus(): Record<string, boolean> {
    return {
      toolBus: Boolean(this.adapters.toolBus),
      permissionManager: Boolean(this.adapters.permissionManager),
      verificationEngine: Boolean(this.adapters.verificationEngine),
      researchEngine: Boolean(this.adapters.researchEngine),
      autonomousExecutionEngine: Boolean(
        this.adapters.autonomousExecutionEngine,
      ),
    };
  }

  canExecuteThroughExistingGraph(): boolean {
    return Boolean(
      this.adapters.toolBus || this.adapters.autonomousExecutionEngine,
    );
  }

  getPlanner(): InstructorRealWorldExecutor {
    return this.planner;
  }
}

export default InstructorExecutionBridge;
