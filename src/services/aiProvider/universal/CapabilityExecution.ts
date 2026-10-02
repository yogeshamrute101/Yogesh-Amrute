import { RuntimeProviderManager } from './RuntimeProviderManager';
import { AIExecutionRequest } from './UniversalAIExecutor';

export interface CapabilityExecutionAdapter<TInput = unknown, TOutput = unknown> {
  capability: AIExecutionRequest['capability'];
  provider: string;
  execute: (input: TInput) => Promise<TOutput>;
  configured?: () => boolean;
}

export function registerCapabilityExecution<TInput, TOutput>(
  runtime: RuntimeProviderManager,
  adapter: CapabilityExecutionAdapter<TInput, TOutput>,
): void {
  runtime.register(
    {
      provider: adapter.provider,
      models: [],
      capabilities: [adapter.capability],
    },
    async ({ request }) => {
      return adapter.execute(request.input as TInput);
    },
  );

  if (adapter.configured && !adapter.configured()) {
    runtime.markUnavailable(
      adapter.provider,
      'Provider configuration is unavailable.',
    );
  }
}
