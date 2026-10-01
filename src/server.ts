import express from 'express';
import { initVideoWorkflows } from './core/workflow/video/VideoWorkflow.js';
import { workflowRegistry } from './core/workflow/registry/WorkflowRegistry.js';
import { getWorkflowHealth } from './core/workflow/health.js';
import { WorkflowQueue } from './core/workflow/queue/WorkflowQueue.js';

const app = express();
app.use(express.json());

// Init workflows on boot
initVideoWorkflows();
const queue = new WorkflowQueue((id, input) => workflowRegistry.run(id, input));

// Health check - Cloud Run ke liye must hai
app.get('/api/health', (req, res) => {
  res.json(getWorkflowHealth());
});

app.get('/health', (req, res) => {
  res.json(getWorkflowHealth());
});

// Video generate
app.post('/api/video/generate', async (req, res) => {
  const { workflowId = 'video-gen', prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'prompt required' });

  const jobId = queue.enqueue(workflowId, { prompt });
  res.json({ jobId, workflowId, status: 'queued' });
});

// List workflows
app.get('/api/workflows', (req, res) => {
  res.json(workflowRegistry.getAllStatus());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
  console.log('Health:', getWorkflowHealth());
});
