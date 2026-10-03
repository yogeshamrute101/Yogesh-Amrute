import {
  InstructorEngine,
} from "../../services/instructor/InstructorEngine";
import {
  TrendingVideoEngine,
} from "../../services/trending/TrendingVideoEngine";
import {
  PromptAppBuilder,
} from "../../services/appBuilder/PromptAppBuilder";
import {
  ReferenceLiveRuntime,
} from "../../services/referenceShow/runtime/ReferenceLiveRuntime";

export class VidoCapabilityOrchestrator {
  readonly instructor = new InstructorEngine();
  readonly trending = new TrendingVideoEngine();
  readonly appBuilder = new PromptAppBuilder();
  readonly referenceLive = new ReferenceLiveRuntime();
}
