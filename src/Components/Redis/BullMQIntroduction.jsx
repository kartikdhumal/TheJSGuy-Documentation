import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function BullMQIntroduction() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Introduction to BullMQ</h1>
      <p className="com-text">
        BullMQ is a job queue library for Node.js built on top of Redis. A job queue lets your API say "do this work later, in the background" and reply to the user immediately, while separate worker processes do the slow work: sending emails, generating PDFs, resizing images, processing an uploaded file, or creating a new tenant's database.
      </p>

      <section className="method-section">
        <h2 className="method-title">Why do we need a queue?</h2>
        <p className="com-text">
          Without a queue, the user waits while the API sends 500 emails, and if the server restarts in the middle, the work is lost. With a queue: the API adds a job (takes milliseconds) and returns "Processing started". The job is stored in Redis, so it survives restarts. Workers pick it up, retry it if it fails, and you can run more workers when there is more work. The heavy work never blocks your API.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">The 4 main pieces</h2>
        <p className="com-text">
          Queue: where you add jobs (the producer side, usually your API).
          Worker: a process that takes jobs from the queue and runs your function (the consumer side).
          Job: one unit of work, with a name, data (JSON), and options (retries, delay, priority).
          QueueEvents: listens to events from all workers (completed, failed, progress), useful for dashboards or notifying users.
          Plus FlowProducer for parent-child job trees (covered in BullMQ Advanced).
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">First example</h2>
        <CodeBlock language="bash" style={atomDark}>
          {`npm install bullmq   # needs a running Redis`}
        </CodeBlock>
        <CodeBlock language="javascript" style={atomDark}>
          {`import { Queue, Worker } from 'bullmq';

const connection = { host: '127.0.0.1', port: 6379 };

// Producer (in your API)
const emailQueue = new Queue('emails', { connection });

await emailQueue.add('welcome', { to: 'kartik@example.com', name: 'Kartik' });

// Consumer (usually a separate process)
const worker = new Worker(
  'emails',
  async (job) => {
    console.log(\`Sending \${job.name} email to \${job.data.to}\`);
    await sendEmail(job.data);          // your real work
    return { sentAt: Date.now() };      // saved as job.returnvalue
  },
  { connection },
);

worker.on('completed', (job) => console.log(\`Job \${job.id} done\`));
worker.on('failed', (job, err) => console.error(\`Job \${job?.id} failed:\`, err.message));`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">How BullMQ uses Redis</h2>
        <p className="com-text">
          Each queue is a set of Redis keys (lists, sorted sets and hashes) under a prefix like bull:emails:. Waiting jobs sit in a list, delayed jobs in a sorted set scored by run time, and each job's data in a hash. All state changes (waiting to active to completed) are done with Lua scripts, so they are atomic: two workers can never take the same job. That is why BullMQ needs Redis with maxmemory-policy noeviction, so Redis never deletes queue data.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Bull vs BullMQ</h2>
        <p className="com-text">
          Bull is the older library. BullMQ is its rewrite in TypeScript by the same team, with a cleaner API, separate Queue/Worker classes, flows (parent-child jobs), job schedulers, better rate limiting and better performance. Bull is in maintenance mode, so new projects should use BullMQ.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Real-life example</h2>
        <p className="com-text">
          Onboarding a new customer in a SaaS app: the API saves the customer with status PENDING, adds a "provision" job and replies right away. A worker creates the database, runs migrations, seeds default data and sets status ACTIVE. If any step fails, BullMQ retries the job automatically with exponential backoff. The frontend can poll the status (or listen with SSE) to show progress.
        </p>
      </section>
    </div>
  );
}

export default BullMQIntroduction;
