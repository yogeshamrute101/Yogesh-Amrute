export class AIProviderUnavailableError extends Error {
  readonly code = 'AI_PROVIDER_UNAVAILABLE';

  constructor(
    message: string,
    readonly capability?: string,
  ) {
    super(message);
    this.name = 'AIProviderUnavailableError';
  }
}

export class AIModelUnavailableError extends Error {
  readonly code = 'AI_MODEL_UNAVAILABLE';

  constructor(message: string) {
    super(message);
    this.name = 'AIModelUnavailableError';
  }
}
