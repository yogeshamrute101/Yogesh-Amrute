import type {
  ReferenceContent,
  ReferenceSource,
} from "../../../types/referenceShow/ReferenceSource";

export interface ReferenceIngestionProvider {
  readonly name: string;
  canHandle(source: ReferenceSource): boolean;
  ingest(source: ReferenceSource): Promise<ReferenceContent>;
}

export class UnconfiguredReferenceIngestionProvider
  implements ReferenceIngestionProvider
{
  readonly name = "unconfigured-reference-provider";

  canHandle(): boolean {
    return false;
  }

  async ingest(): Promise<ReferenceContent> {
    throw new Error(
      "Reference ingestion provider is not configured. No source content was fetched."
    );
  }
}
