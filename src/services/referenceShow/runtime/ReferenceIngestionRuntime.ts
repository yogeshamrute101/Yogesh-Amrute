import { analyzeReference } from "../../../core/referenceShow/ReferenceAnalyzer";
import type { ReferenceAnalysis } from "../../../types/ReferenceShow";
import type {
  ReferenceContent,
  ReferenceSourceType,
} from "../../../types/referenceShow/ReferenceSource";
import { ReferenceProviderRegistry } from "../providers/ReferenceProviderRegistry";

function mapReferenceType(
  type: ReferenceAnalysis["type"],
): ReferenceSourceType {
  const normalized = String(type).toLowerCase();

  if (normalized.includes("youtube")) return "youtube";
  if (normalized.includes("news")) return "news";
  if (normalized === "play") return "web";

  return "unknown";
}

export class ReferenceIngestionRuntime {
  constructor(
    private readonly registry: ReferenceProviderRegistry,
    private readonly analyzer: (url: string) => ReferenceAnalysis = analyzeReference,
  ) {}

  async analyze(url: string): Promise<ReferenceContent> {
    const analysis = this.analyzer(url);

    const source = {
      url: analysis.sourceUrl,
      type: mapReferenceType(analysis.type),
      transcriptAvailable: false,
      metadataAvailable: false,
    };

    const provider = this.registry.resolve(source);

    return provider.ingest(source);
  }
}
