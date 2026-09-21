import { MasterAgent } from './agents/MasterAgent';

export const universalCore = new MasterAgent();

export async function runUniversalAgent(request: string) {
  return universalCore.execute(request);
}
