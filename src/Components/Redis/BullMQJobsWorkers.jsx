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
        Most of what BullMQ can do comes from two places. First, the options you pass when you add a job (retries, delay, priority, cleanup). Second, how you set up the worker (concurrency, error handling).
      </p>

      <section className="method-section">
        <h2 className="method-title">The life of a job (states)</h2>
        <p className="com-text">
          A job moves through a few states:
          waiting: in the queue, ready to be picked up.
          delayed: waiting for a time in the future (a delay, or a pause before a retry).
          prioritized: waiting, but sorted by priority.
          active: a worker is working on it right now.
          completed: finished fine.
          failed: it threw an error and has no retries left.
          waiting-children: a parent job waiting for its child jobs (flows).
          The usual path: add() puts it in waiting (or delayed), then active, then completed. If it throws an error, it goes back to delayed for a retry, or to failed after the last try.
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
          attempts + backoff: try again by itself. Exponential backoff waits longer each time, so a service that is having trouble gets time to recover. A fixed backoff waits the same time before every retry.
          delay: run it later (reminders, "send email in 1 hour").
          priority: a lower number runs first.
          jobId: if a job with the same id already exists, the new add is ignored. This is an easy way to avoid duplicates.
          removeOnComplete / removeOnFail: without these, every finished job stays in Redis forever and memory keeps growing. Always set them.
          lifo: true runs the newest job first (like a stack of plates instead of a line).
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Worker and concurrency</h2>
        <p className="com-text">
          A worker runs your processor function for each job. concurrency means how many jobs one worker runs at the same time.
          For work that mostly waits (API calls, emails, DB queries), a higher number like 10 to 50 is fine.
          For work that keeps the CPU busy (image processing), keep it low and run more worker processes instead. This is because Node.js runs JavaScript on one thread.
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
          To fail a job, just throw an error inside the processor. BullMQ catches it, saves the reason in job.failedReason, and tries again if there are attempts left. If trying again won't help (for example, the data is wrong), throw UnrecoverableError. Then the job fails right away and does not waste the remaining retries.
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
          BullMQ makes sure a job runs at least once. It does not promise exactly once. A worker can crash after doing the work but before marking it done, so the job runs again.
          So write your processors so that running twice is safe. Check "was this invoice already created?" before creating it. Use upserts (update if it exists, insert if not). Pass a unique key to payment APIs.
          This is called making the job idempotent: running it twice gives the same result as running it once. Like pressing a lift button twice, the lift still comes only once.
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
