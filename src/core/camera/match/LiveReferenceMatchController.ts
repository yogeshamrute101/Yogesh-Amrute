import {
  LiveReferenceFrame,
  ReferenceMatchResult,
  ReferencePhoto,
} from './ReferenceMatchTypes';
import { ReferenceMatchEngine } from './ReferenceMatchEngine';

export class LiveReferenceMatchController {
  private readonly engine =
    new ReferenceMatchEngine();

  private reference: ReferencePhoto | null = null;

  setReference(reference: ReferencePhoto): void {
    this.reference = reference;
  }

  getReference(): ReferencePhoto | null {
    return this.reference;
  }

  setProvider(
    provider: Parameters<
      ReferenceMatchEngine['setProvider']
    >[0]
  ): void {
    this.engine.setProvider(provider);
  }

  async processLiveFrame(
    frame: LiveReferenceFrame,
    resultCount = 4
  ): Promise<ReferenceMatchResult> {
    if (!this.reference) {
      return {
        status: 'failed',
        candidates: [],
        verified: false,
        message: 'Select a reference photo first.',
      };
    }

    return this.engine.match(
      this.reference,
      frame,
      resultCount
    );
  }
}
