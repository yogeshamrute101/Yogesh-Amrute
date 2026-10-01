type Job = {
  id: string;
  workflowId: string;
  input: unknown;
  retries: number;
  maxRetries: number;
};

export class WorkflowQueue {
  private queue: Job[] = [];
  private running = false;

  constructor(private runner: (workflowId: string, input: unknown) => Promise<unknown>) {}

  enqueue(workflowId: string, input: unknown, maxRetries = 2) {
    const job: Job = {
      id: `job_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      workflowId,
      input,
      retries: 0,
      maxRetries,
    };
    this.queue.push(job);
    console.log(`[Queue] Enqueued ${job.id} -> ${workflowId}`);
    this.process();
    return job.id;
  }

  private async process() {
    if (this.running) return;
    this.running = true;

    while (this.queue.length > 0) {
      const job = this.queue.shift()!;
      try {
        console.log(`[Queue] Running ${job.id} (attempt ${job.retries + 1})`);
        const result = await this.runner(job.workflowId, job.input);
        console.log(`[Queue] ✅ ${job.id} Done:`, result);
      } catch (e) {
        console.error(`[Queue] ❌ ${job.id} Failed:`, (e as Error).message);
        if (job.retries < job.maxRetries) {
          job.retries++;
          console.log(`[Queue] Retrying ${job.id}...`);
          this.queue.push(job);
        }
      }
    }
    this.running = false;
  }

  getPendingCount() {
    return this.queue.length;
  }
}
