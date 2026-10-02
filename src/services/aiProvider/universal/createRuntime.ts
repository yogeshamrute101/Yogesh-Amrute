import { RuntimeProviderManager } from './RuntimeProviderManager';

export function createUniversalAIRuntime(): RuntimeProviderManager {
  return new RuntimeProviderManager();
}
