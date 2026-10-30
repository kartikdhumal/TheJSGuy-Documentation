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
        BullMQ is a job queue library for Node.js, built on top of Redis. A job queue lets your API say "do this work later, in the background" and answer the user right away. Separate worker processes then do the slow work. For example: sending emails, making PDFs, resizing images, processing an uploaded file, or creating a new tenant's database. Think of the token line at a bank: you take a token and sit down, and the counters call people one by one.
      </p>

      <section className="method-section">
        <h2 className="method-title">Why do we need a queue?</h2>
        <p className="com-text">
          Without a queue, the user waits while the API sends 500 emails. And if the server restarts in the middle, the work is lost.
          With a queue:
        </p>
        <ol className="com-list">
          <li className="com-list-item">The API adds a job (it takes milliseconds) and replies "Processing started".</li>
          <li className="com-list-item">The job is saved in Redis, so a restart does not lose it.</li>
          <li className="com-list-item">Workers pick it up and try again if it fails.</li>
          <li className="com-list-item">When there is more work, you just run more workers.</li>
        </ol>
        <p className="com-text">
          The heavy work never slows down your API.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">The 4 main pieces</h2>
        <p className="com-text">
          Queue: where you add jobs. This is the producer side, usually your API.
          Worker: a process that takes jobs from the queue and runs your function. This is the consumer side.
          Job: one piece of work. It has a name, data (JSON), and options (retries, delay, priority).
          QueueEvents: listens to events from all workers (completed, failed, progress). Handy for dashboards or for telling users what happened.
          There is also FlowProducer, for parent-child job trees (covered in BullMQ Advanced).
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
          Each queue is just a group of Redis keys (lists, sorted sets and hashes) that start with a prefix like bull:emails:.
          Waiting jobs sit in a list. Delayed jobs sit in a sorted set, sorted by the time they should run. Each job's data is in a hash.
          Every state change (waiting to active to completed) is done with a Lua script, so it is atomic (all in one step, nothing in between). That is why two workers can never take the same job.
          BullMQ needs Redis with maxmemory-policy noeviction, so Redis never deletes queue data.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Bull vs BullMQ</h2>
        <p className="com-text">
          Bull is the older library. BullMQ is the same team's rewrite in TypeScript. It has a cleaner API, separate Queue and Worker classes, flows (parent-child jobs), job schedulers, better rate limiting and better speed. Bull now only gets fixes, no new features. So for new projects, use BullMQ.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Real-life example</h2>
        <p className="com-text">
          Adding a new customer in a SaaS app:
        </p>
        <ol className="com-list">
          <li className="com-list-item">The API saves the customer with status PENDING, adds a "provision" job, and replies right away.</li>
          <li className="com-list-item">A worker creates the database, runs migrations, adds default data, and sets the status to ACTIVE.</li>
          <li className="com-list-item">If any step fails, BullMQ tries the job again by itself, waiting a bit longer each time (exponential backoff).</li>
          <li className="com-list-item">The frontend keeps asking for the status (or listens with SSE) to show progress.</li>
        </ol>
      </section>
    </div>
  );
}

export default BullMQIntroduction;
