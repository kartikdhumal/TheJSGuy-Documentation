import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function BullMQAdvanced() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">BullMQ Advanced</h1>
      <p className="com-text">
        Scheduled (cron) jobs, rate limiting, de-duplication, parent-child flows, events, stalled jobs, graceful shutdown and NestJS. These are the topics that separate "I used BullMQ once" from "I run BullMQ in production". Examples follow BullMQ v6.
      </p>

      <section className="method-section">
        <h2 className="method-title">Repeating jobs: Job Schedulers</h2>
        <p className="com-text">
          For jobs that run on a schedule (daily report, reminder every 15 minutes), use queue.upsertJobScheduler(id, repeat, template). "Upsert" means calling it again with the same id updates the schedule instead of creating a duplicate, so it is safe to call on every app start. In BullMQ v6 the old repeat option in queue.add() is no longer allowed; job schedulers replace it.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`// Every day at 08:00 (cron pattern)
await reportQueue.upsertJobScheduler(
  'daily-summary',
  { pattern: '0 8 * * *' },
  { name: 'send-summary', data: { type: 'daily' } },
);

// Every 15 minutes (fixed interval in ms)
await reminderQueue.upsertJobScheduler('reminders', { every: 15 * 60 * 1000 });

// Stop it
await reportQueue.removeJobScheduler('daily-summary');`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Rate limiting the worker</h2>
        <p className="com-text">
          When a job calls an external API with limits (for example an email provider allowing 100 emails per second), set limiter on the worker. The limit is global across all workers of that queue, because the counter lives in Redis.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`new Worker('emails', processEmail, {
  connection,
  limiter: { max: 100, duration: 1000 },   // at most 100 jobs per second
});`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">De-duplication</h2>
        <p className="com-text">
          A fixed jobId already blocks exact duplicates while that job exists. The deduplication option is more flexible: while a job with the same deduplication id is still around (or until ttl ends), new adds with that id are ignored. Useful for "user clicked Sync 5 times, run it only once".
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`await syncQueue.add('sync-contacts', { userId: 101 }, {
  deduplication: { id: 'sync-101', ttl: 60_000 },   // ignore repeats for 60s
});`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Flows (parent and child jobs)</h2>
        <p className="com-text">
          With FlowProducer you add a tree of jobs. The parent waits in state waiting-children until all its children complete, then runs, and it can read their results. Example: process 3 video sizes in parallel, then send one "video ready" notification.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`import { FlowProducer } from 'bullmq';

const flow = new FlowProducer({ connection });

await flow.add({
  name: 'notify-ready',
  queueName: 'notifications',
  data: { videoId: 7 },
  children: [
    { name: 'transcode', queueName: 'video', data: { videoId: 7, size: '1080p' } },
    { name: 'transcode', queueName: 'video', data: { videoId: 7, size: '720p' } },
    { name: 'transcode', queueName: 'video', data: { videoId: 7, size: '480p' } },
  ],
});

// In the parent's worker: results of all children
const childResults = await job.getChildrenValues();`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Events: Worker events vs QueueEvents</h2>
        <p className="com-text">
          worker.on('completed' / 'failed' / 'progress') fires only for jobs processed by that worker instance. QueueEvents listens to events of the whole queue from any worker on any server (it reads a Redis stream), so it is the right choice for a separate service that tells users "your report is ready" (for example over SSE or WebSocket).
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`import { QueueEvents } from 'bullmq';

const events = new QueueEvents('reports', { connection });

events.on('progress', ({ jobId, data }) => console.log(jobId, 'progress', data));
events.on('completed', ({ jobId, returnvalue }) => notifyUser(jobId, returnvalue));
events.on('failed', ({ jobId, failedReason }) => console.error(jobId, failedReason));`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Stalled jobs</h2>
        <p className="com-text">
          While a worker processes a job, it holds a lock that it renews regularly. If the worker crashes, or blocks the event loop so long that it cannot renew the lock (heavy synchronous CPU work), the job is marked stalled. BullMQ moves stalled jobs back to waiting so another worker retries them; after maxStalledCount stalls (default 1) the job fails. Fix stalls by not blocking the event loop: use async code, lower concurrency for CPU work, or run CPU-heavy processors in a separate process (sandboxed processor).
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`// Sandboxed processor: the job runs in a separate child process
// (or a worker thread with useWorkerThreads: true), so heavy CPU work
// cannot block the main worker or cause stalls.
const worker = new Worker('images', \`\${__dirname}/image.processor.js\`, { connection });`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Graceful shutdown</h2>
        <p className="com-text">
          When you deploy or restart, close the worker so it stops taking new jobs and waits for the current ones to finish. Otherwise running jobs get killed and later become stalled.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`process.on('SIGTERM', async () => {
  await worker.close();   // finish active jobs, take no new ones
  await queue.close();
  process.exit(0);
});`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Connection rules</h2>
        <p className="com-text">
          Workers use blocking Redis commands to wait for jobs, so their ioredis connection must have maxRetriesPerRequest: null (BullMQ warns and forces it if you do not). Use maxmemory-policy noeviction. In Redis Cluster, give queues a prefix with a hash tag, like {'{bull}'}, so all keys of a queue are in the same slot.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null });
const worker = new Worker('emails', processEmail, { connection });`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">BullMQ in NestJS</h2>
        <p className="com-text">
          @nestjs/bullmq wraps BullMQ in NestJS style: register the connection once, register each queue, inject the queue to add jobs, and write a processor class that extends WorkerHost.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`// app.module.ts
BullModule.forRoot({ connection: { host: 'localhost', port: 6379 } }),
BullModule.registerQueue({ name: 'tenant-provisioning' }),

// tenants.service.ts (producer)
constructor(@InjectQueue('tenant-provisioning') private readonly queue: Queue) {}

await this.queue.add('provision', { tenantId }, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 5000 },
  removeOnComplete: false,
});

// tenant-provisioning.processor.ts (consumer)
@Processor('tenant-provisioning')
export class TenantProvisioningProcessor extends WorkerHost {
  async process(job: Job<{ tenantId: string }>): Promise<void> {
    await createDatabase(job.data.tenantId);
    await runMigrations(job.data.tenantId);
  }
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Monitoring</h2>
        <p className="com-text">
          Use Bull Board (a free web UI) or Taskforce.sh to see queues, retry failed jobs and inspect job data. In your own code, getJobCounts() gives waiting / active / failed numbers for alerts, for example "alert if failed jobs grow".
        </p>
      </section>
    </div>
  );
}

export default BullMQAdvanced;
