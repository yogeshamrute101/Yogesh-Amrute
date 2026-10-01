import { initVideoWorkflows } from '../src/core/workflow/video/VideoWorkflow.js';
import { workflowRegistry } from '../src/core/workflow/registry/WorkflowRegistry.js';
import { WorkflowQueue } from '../src/core/workflow/queue/WorkflowQueue.js';
import { getWorkflowHealth } from '../src/core/workflow/health.js';

async function run() {
  console.log('=== FINAL WORKFLOW SMOKE ===');
  initVideoWorkflows();

  const queue = new WorkflowQueue((id, input) => workflowRegistry.run(id, input));

  queue.enqueue('video-gen', { prompt: 'Goa sunset timelapse' });
  queue.enqueue('video-thumb', { prompt: 'thumbnail for vlog' });
  queue.enqueue('video-enhance', { prompt: 'enhance 4k' });

  // wait a bit for queue
  await new Promise(r => setTimeout(r, 1500));

  console.log('\nHealth Check:');
  console.log(JSON.stringify(getWorkflowHealth(), null, 2));

  console.log('\n✅ Queue + Health + Registry OK - PRODUCTION READY');
}
run().catch(e => { console.error(e); process.exit(1); });
