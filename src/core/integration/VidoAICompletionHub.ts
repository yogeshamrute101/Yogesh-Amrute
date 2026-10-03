import {
  InstructorRuntime,
} from "../../services/instructor/InstructorRuntime";
import {
  ReferenceShowBridge,
} from "../../services/referenceShow/runtime/ReferenceShowBridge";
import {
  TrendingRuntime,
} from "../../services/trending/TrendingRuntime";
import {
  KnowledgeRuntime,
} from "../../services/knowledge/KnowledgeRuntime";
import {
  AppBuilderRuntime,
} from "../../services/appBuilder/AppBuilderRuntime";

export class VidoAICompletionHub {
  readonly instructor = new InstructorRuntime();
  readonly referenceShow = new ReferenceShowBridge();
  readonly trending = new TrendingRuntime();
  readonly knowledge = new KnowledgeRuntime();
  readonly appBuilder = new AppBuilderRuntime();
}
