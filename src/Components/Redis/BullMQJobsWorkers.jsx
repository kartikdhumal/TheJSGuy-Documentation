import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function BullMQJobsWorkers() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">BullMQ Jobs, Options &amp; Workers</h1>
      <p className="com-text">
        Most of BullMQ's power is in the options you pass when adding a job (retries, delay, priority, cleanup) and in how you configure the worker (concurrency, error handling).
      </p>

      <section className="method-section">
        <h2 className="method-title">Job lifecycle (states)</h2>
        <p className="com-text">
          waiting: in the queue, ready to be picked.
          delayed: waiting until a future time (delay or backoff before a retry).
          prioritized: waiting, but ordered by priority.
          active: a worker is processing it right now.
          completed: finished successfully.
          failed: threw an error and has no retries left.
          waiting-children: a parent job waiting for its child jobs (flows).
          Flow: add() goes to waiting (or delayed), then active, then completed. If it throws, it goes back to delayed for a retry, or to failed after the last attempt.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Job options</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`await queue.add('generate-invoice', { orderId: 501 }, {
  attempts: 3,                                    // try up to 3 times
  backoff: { type: 'exponential', delay: 5000 },  // wait 5s, 10s, 20s between tries
  delay: 60_000,                                  // start after 1 minute
  priority: 1,                                    // 1 = highest priority
  jobId: 'invoice-501',                           // custom id (duplicate ids are ignored)
  removeOnComplete: { count: 1000 },              // keep only the last 1000 completed
  removeOnFail: { age: 7 * 24 * 3600 },           // keep failed jobs 7 days (seconds)
});`}
        </CodeBlock>
        <p className="com-text">
          attempts + backoff: automatic retries; exponential backoff waits longer each time so a struggling service can recover. A fixed backoff waits the same time every retry.
          delay: run later (reminders, "send email in 1 hour").
          priority: a lower number runs first.
          jobId: if a job with the same id already exists, the new add is ignored, which gives you simple de-duplication.
          removeOnComplete / removeOnFail: without them, every finished job stays in Redis forever and memory grows. Always set them.
          lifo: true processes the newest job first (stack instead of queue).
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Worker and concurrency</h2>
        <p className="com-text">
          A worker runs your processor function for each job. concurrency is how many jobs one worker runs at the same time. For I/O work (API calls, emails, DB queries), a higher concurrency like 10 to 50 is fine. For CPU-heavy work (image processing), keep it low and run more worker processes instead, because Node.js runs JavaScript on one thread.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`const worker = new Worker('images', async (job) => {
  await job.updateProgress(10);
  const thumb = await makeThumbnail(job.data.path);
  await job.updateProgress(100);
  return { thumb };
}, {
  connection,
  concurrency: 5,
});`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Failing a job the right way</h2>
        <p className="com-text">
          To fail a job, just throw an error inside the processor. BullMQ catches it, stores the reason in job.failedReason, and retries if attempts are left. If retrying is pointless (for example invalid data), throw UnrecoverableError so it fails immediately without using up the remaining retries.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`import { Worker, UnrecoverableError } from 'bullmq';

new Worker('payments', async (job) => {
  if (!job.data.amount) {
    throw new UnrecoverableError('Amount missing, retry will not help');
  }
  const res = await chargeCard(job.data);   // network error -> throw -> retried
  return res.id;
}, { connection });`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Idempotent jobs (very important)</h2>
        <p className="com-text">
          BullMQ guarantees a job runs at least once, not exactly once. A worker can crash after doing the work but before marking it done, so the job runs again. Write processors so running twice is safe: check "was this invoice already created?" before creating it, use upserts, and pass a unique key to payment APIs. This is called making the job idempotent.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Reading job status from the API</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`// API: start work and return the job id
app.post('/reports', async (req, res) => {
  const job = await reportQueue.add('monthly', { userId: req.user.id });
  res.status(202).json({ jobId: job.id });
});

// API: check progress
app.get('/reports/:id', async (req, res) => {
  const job = await reportQueue.getJob(req.params.id);
  if (!job) return res.status(404).end();
  res.json({ state: await job.getState(), progress: job.progress, result: job.returnvalue });
});

// Queue health numbers (for a dashboard)
await reportQueue.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed');`}
        </CodeBlock>
      </section>
    </div>
  );
}

export default BullMQJobsWorkers;
