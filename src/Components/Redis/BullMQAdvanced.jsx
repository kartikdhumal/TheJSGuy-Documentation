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
        This page covers scheduled (cron) jobs, rate limiting, de-duplication, parent-child flows, events, stalled jobs, graceful shutdown and NestJS. These are the things you need once you run BullMQ in production, not just in a demo. The examples use BullMQ v6.
      </p>

      <section className="method-section">
        <h2 className="method-title">Repeating jobs: Job Schedulers</h2>
        <p className="com-text">
          For jobs that run on a timetable (a daily report, a reminder every 15 minutes), use queue.upsertJobScheduler(id, repeat, template). "Upsert" means: if you call it again with the same id, it updates the schedule instead of making a copy. So it is safe to call every time your app starts. In BullMQ v6 the old repeat option in queue.add() is not allowed anymore. Job schedulers replace it.
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
          Sometimes a job calls an outside API that has limits. For example, an email provider that allows 100 emails per second. Then set limiter on the worker. The limit counts for all workers of that queue together, because the counter lives in Redis.
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
          A fixed jobId already blocks exact copies while that job exists. The deduplication option gives you more control. While a job with the same deduplication id is still around (or until ttl ends), new adds with that id are ignored. Handy when "the user clicked Sync 5 times, but we want to run it only once".
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
          With FlowProducer you add a tree of jobs. The parent waits in the waiting-children state until all its children are done. Then it runs, and it can read their results. Example: make 3 video sizes at the same time, then send one "video ready" notification.
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
          worker.on('completed' / 'failed' / 'progress') only fires for jobs handled by that one worker.
          QueueEvents hears events from the whole queue, from any worker on any server (it reads a Redis stream). So use it for a separate service that tells users "your report is ready" (for example over SSE or WebSocket).
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
          While a worker is working on a job, it holds a lock on it and keeps renewing that lock. Sometimes it can't renew it. Maybe the worker crashed. Or heavy CPU work blocked the event loop for too long. Then the job is marked stalled (stuck).
          BullMQ moves stalled jobs back to waiting, so another worker can try them. After maxStalledCount stalls (default 1), the job fails.
          To avoid stalls, don't block the event loop: use async code, lower the concurrency for CPU work, or run CPU-heavy processors in a separate process (a sandboxed processor).
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
          When you deploy or restart, close the worker first. It stops taking new jobs and waits for the current ones to finish. Like a shop that locks the door at closing time but still serves the people inside. If you skip this, running jobs get killed and later become stalled.
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
          Workers use blocking Redis commands (commands that sit and wait) to wait for jobs. So their ioredis connection must have maxRetriesPerRequest: null. If you forget, BullMQ warns you and sets it anyway.
          Use maxmemory-policy noeviction.
          In Redis Cluster, give queues a prefix with a hash tag, like {'{bull}'}, so all keys of one queue land in the same slot.
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
          @nestjs/bullmq lets you use BullMQ the NestJS way:
        </p>
        <ol className="com-list">
          <li className="com-list-item">Register the connection once.</li>
          <li className="com-list-item">Register each queue.</li>
          <li className="com-list-item">Inject the queue where you want to add jobs.</li>
          <li className="com-list-item">Write a processor class that extends WorkerHost.</li>
        </ol>
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
          Use Bull Board (a free web UI) or Taskforce.sh to see your queues, retry failed jobs and look at job data. In your own code, getJobCounts() gives you waiting / active / failed numbers. You can use them for alerts, for example "alert me if failed jobs keep growing".
        </p>
      </section>
    </div>
  );
}

export default BullMQAdvanced;
