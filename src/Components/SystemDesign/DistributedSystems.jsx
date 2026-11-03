import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function SystemDesignDistributed() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Distributed Systems</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">A distributed system is one app that runs on many machines that talk over the network. It can handle more users, but the network can be slow or break, and you must plan for that.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>CAP theorem:</strong> when the network breaks, you must pick between correct data and staying online.</li>
          <li className="com-list-item"><strong>ACID vs BASE:</strong> strict and safe data vs fast and "correct in a moment" data.</li>
          <li className="com-list-item"><strong>Message queues:</strong> a waiting line for work, so services don't have to wait for each other.</li>
          <li className="com-list-item"><strong>Cache write strategies:</strong> how and when you write to the cache and the database.</li>
          <li className="com-list-item"><strong>Rate limiting:</strong> stops one user from sending too many requests.</li>
        </ol>
      </div>

      <section id="cap" className="method-section">
        <h2 className="method-title">CAP Theorem</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">CAP says a distributed system can't give you all three of these at the same time when the network breaks. You get two.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>C - Consistency:</strong> every user reads the latest data. No old values.</li>
            <li className="com-list-item"><strong>A - Availability:</strong> every request gets an answer, even if the data might be a little old.</li>
            <li className="com-list-item"><strong>P - Partition tolerance:</strong> the system keeps working even when some machines can't talk to each other (a network split, also called a partition).</li>
            <li className="com-list-item"><strong>The real choice:</strong> network splits will happen, so P is a must. So the real question is: during a split, do you pick C or A?</li>
            <li className="com-list-item"><strong>CP:</strong> during a split, refuse or wait instead of giving wrong data.</li>
            <li className="com-list-item"><strong>AP:</strong> during a split, keep answering, and fix the data later.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Your bank balance on PhonePe or Paytm must be CP. If two servers can't agree on your balance, it is better to show "try again later" than to let you spend the same 500 rupees twice. Instagram likes are AP. If you see 1,203 likes and your friend sees 1,205 for a few seconds, nobody is hurt. The app stays online, and the count fixes itself soon.
          </p>
        </div>
        <CodeBlock language="text" style={atomDark}>
          {`   Server A  <--- X network broken X --->  Server B
   (balance = 500)                        (balance = 500)

User pays 500 on A. B does not know yet.
  CP: B says "sorry, try later"   -> correct, but not available
  AP: B says "balance is 500"     -> available, but old data`}
        </CodeBlock>
        <p className="com-text">
          When there is no network problem, a good system gives you both C and A. CAP only talks about what happens during a split.
        </p>
      </section>

      <section id="acid-vs-base" className="method-section">
        <h2 className="method-title">ACID vs BASE</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">ACID and BASE are two styles of handling data. ACID is strict and safe. BASE is relaxed and fast, and the data becomes correct after a short time.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>ACID:</strong> Atomic (all steps happen or none), Consistent (rules are never broken), Isolated (two transactions don't mess with each other), Durable (once saved, it stays saved even after a crash).</li>
            <li className="com-list-item"><strong>BASE:</strong> Basically Available (the system stays up), Soft state (data may change on its own while copies sync), Eventually consistent (all copies will match after a little time).</li>
            <li className="com-list-item"><strong>Eventual consistency:</strong> you write to one copy, and the other copies get the change a moment later. For a short time, different users may see different values.</li>
            <li className="com-list-item definition-default"><strong>Defaults:</strong> PostgreSQL's default isolation level is Read Committed. MySQL (InnoDB) uses Repeatable Read by default.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Booking an IRCTC ticket needs ACID. Taking your money and giving you a seat must happen together, or not at all. A WhatsApp "last seen" or a Swiggy restaurant rating can be BASE. If your friend sees your "last seen" a few seconds late, it is fine.
          </p>
        </div>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Point</th>
                <th>ACID</th>
                <th>BASE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Data correctness</td>
                <td>Always correct right away</td>
                <td>Correct after a short time</td>
              </tr>
              <tr>
                <td>Speed and scale</td>
                <td>Slower, harder to spread across many machines</td>
                <td>Faster, easy to spread across many machines</td>
              </tr>
              <tr>
                <td>Usually found in</td>
                <td>SQL databases: PostgreSQL, MySQL</td>
                <td>Many NoSQL databases: Cassandra, DynamoDB</td>
              </tr>
              <tr>
                <td>Good for</td>
                <td>Payments, orders, bookings, stock</td>
                <td>Likes, views, feeds, logs, chat status</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="com-text">
          This is not a hard line. MongoDB supports multi-document transactions, and many apps use both: PostgreSQL for orders and payments, and a NoSQL store for feeds and counters.
        </p>
      </section>

      <section id="message-queues" className="method-section">
        <h2 className="method-title">Message Queues</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">A message queue is a waiting line for work. One service puts a message (a small job) in the line, and another service picks it up and does it later.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Producer:</strong> the service that adds a message to the queue.</li>
            <li className="com-list-item"><strong>Queue:</strong> the line that safely holds messages until someone picks them up.</li>
            <li className="com-list-item"><strong>Consumer (worker):</strong> the service that takes a message and does the work.</li>
            <li className="com-list-item"><strong>Decouple:</strong> the producer does not wait for the consumer. If the consumer is down, messages just wait in the queue.</li>
            <li className="com-list-item"><strong>Smooth traffic spikes:</strong> 10,000 jobs come in one minute? The queue holds them and workers finish them at their own speed.</li>
            <li className="com-list-item"><strong>Retries:</strong> if a job fails, it can be tried again automatically.</li>
            <li className="com-list-item definition-default"><strong>Defaults:</strong> BullMQ tries a job only once (attempts: 1) unless you set attempts. AWS SQS hides a picked message for 30 seconds by default (visibility timeout); if the worker doesn't delete it in that time, another worker can get it again.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            When you place an order on Zomato, the app must save the order, send it to the restaurant, send you an SMS, send an email bill, and update reward points. If the API did all of this before answering, you would wait a long time. So it saves the order, puts an "order placed" message in a queue, and answers you right away. Separate workers send the SMS, the email and the points in the background.
          </p>
        </div>
        <CodeBlock language="text" style={atomDark}>
          {`Order API (producer)
     |
     |  "order 101 placed"
     v
[ Queue:  msg msg msg msg ]
     |
     v
Worker (consumer) -> send SMS, email, update points`}
        </CodeBlock>
        <p className="com-text">Queue vs pub/sub:</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Queue (point-to-point):</strong> each message goes to only one worker. Good for jobs like "send this email".</li>
          <li className="com-list-item"><strong>Pub/sub (publish/subscribe):</strong> one message goes to every service that subscribed. Good for events like "order placed", where the SMS service, the email service and the analytics service all need to know.</li>
        </ol>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Tool</th>
                <th>What it is</th>
                <th>Use it when</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Kafka</td>
                <td>A log of events. Messages are kept for days, and many consumers can read the same data.</td>
                <td>Huge event streams: clicks, tracking, logs, analytics.</td>
              </tr>
              <tr>
                <td>RabbitMQ</td>
                <td>A classic message broker with smart routing rules.</td>
                <td>Normal background jobs and routing messages between services.</td>
              </tr>
              <tr>
                <td>BullMQ</td>
                <td>A Node.js job queue built on Redis.</td>
                <td>Node apps that need jobs, retries and delayed jobs, and already use Redis.</td>
              </tr>
              <tr>
                <td>AWS SQS</td>
                <td>A fully managed queue from AWS. No server to run.</td>
                <td>You are on AWS and want a simple queue without managing anything.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="com-text">
          Most queues give at-least-once delivery. This means a message will be delivered, but sometimes it may be delivered twice (for example, the worker finished the job but crashed before saying "done"). So your consumer must be idempotent: running the same message twice must give the same result as running it once. A simple way is to save the message id or order id, and skip it if you already handled it. Otherwise a user might get two SMS, or worse, be charged twice.
        </p>
      </section>

      <section id="write-through-vs-write-back" className="method-section">
        <h2 className="method-title">Write-Through vs Write-Back (Cache Write Strategies)</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">When data changes, you have to decide: write to the cache, the database, or both, and in what order. Each way trades speed against safety.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Write-through:</strong> write to the cache and the database at the same time. The request finishes only when both are done. Safe, but every write is a bit slower.</li>
            <li className="com-list-item"><strong>Write-back (write-behind):</strong> write only to the cache and answer right away. The cache saves to the database later, in batches. Very fast, but if the cache crashes before saving, that data is lost.</li>
            <li className="com-list-item"><strong>Write-around:</strong> write only to the database and skip the cache. The cache gets the data later when someone reads it. Good when new data is rarely read soon.</li>
            <li className="com-list-item"><strong>Cache-aside (most common):</strong> your code reads from the cache, and on a miss reads the database and fills the cache. On a write, your code updates the database and deletes the cache key.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Hotstar's "views" counter on a live match changes all the time. Write-back fits well: add to the counter in Redis and save it to the database every few seconds. Losing a few views in a crash is fine. Your Paytm wallet balance is different. Losing a write is not okay, so it must go to the database first (write-through or cache-aside), never only to the cache.
          </p>
        </div>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Strategy</th>
                <th>Write speed</th>
                <th>Data safety</th>
                <th>Good for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Write-through</td>
                <td>Slower (two writes)</td>
                <td>High</td>
                <td>Data read soon after it is written, like a user profile</td>
              </tr>
              <tr>
                <td>Write-back</td>
                <td>Fastest</td>
                <td>Low (can lose data on crash)</td>
                <td>Counters, views, likes, metrics</td>
              </tr>
              <tr>
                <td>Write-around</td>
                <td>Normal (one DB write)</td>
                <td>High</td>
                <td>Logs, old orders, data rarely read again</td>
              </tr>
              <tr>
                <td>Cache-aside</td>
                <td>Normal (DB write + delete key)</td>
                <td>High</td>
                <td>Most read-heavy apps, the default choice</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="rate-limiting" className="method-section">
        <h2 className="method-title">Rate Limiting</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Rate limiting means putting a cap on how many requests a user (or IP, or API key) can send in a time window, like 100 requests per minute.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Why:</strong> stop bots and attacks, stop one user from slowing the app for everyone, protect costly APIs (like OTP SMS), and keep your servers from falling down.</li>
            <li className="com-list-item"><strong>When the limit is crossed:</strong> the server answers with HTTP 429 Too Many Requests, often with a Retry-After header that tells the client when to try again.</li>
            <li className="com-list-item"><strong>Where to put it:</strong> at the API gateway or Nginx (blocks traffic before it reaches your code), or inside your app using Redis, so all your servers share the same counter.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            On the Swiggy or Ola login screen, you can ask for an OTP only a few times, then it says "try after some time". Each OTP SMS costs money, and without a limit, a bot could send lakhs of SMS to random numbers. During IRCTC Tatkal, limits also stop bots from flooding the booking servers.
          </p>
        </div>
        <p className="com-text">The common algorithms:</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Fixed window:</strong> count requests in fixed blocks, like 10:00 to 10:01. Simple, but a user can send 100 at 10:00:59 and 100 more at 10:01:00, so 200 in two seconds.</li>
          <li className="com-list-item"><strong>Sliding window:</strong> always look at the last 60 seconds from now, not a fixed block. Fixes the edge problem above. Uses a bit more memory.</li>
          <li className="com-list-item"><strong>Token bucket:</strong> a bucket fills with tokens at a fixed speed (say 10 per second). Each request takes one token. No token, no entry. Allows short bursts if the bucket is full. Very popular.</li>
          <li className="com-list-item"><strong>Leaky bucket:</strong> requests go into a bucket that leaks (lets them out) at a fixed speed. If the bucket is full, new requests are dropped. Gives a smooth, steady flow. Nginx's limit_req works this way.</li>
        </ol>
        <p className="com-text">A simple fixed window limiter with Redis INCR and EXPIRE, as Express middleware:</p>
        <CodeBlock language="javascript" style={atomDark}>
          {`const LIMIT = 100;        // max requests
const WINDOW = 60;        // per 60 seconds

async function rateLimit(req, res, next) {
  const key = \`rate:\${req.ip}\`;
  const count = await redis.incr(key);      // +1, creates key at 1 if missing
  if (count === 1) {
    await redis.expire(key, WINDOW);        // start the 60s window
  }
  if (count > LIMIT) {
    const ttl = await redis.ttl(key);
    res.set('Retry-After', String(ttl));
    return res.status(429).json({ message: 'Too many requests' });
  }
  next();
}

app.use('/api', rateLimit);`}
        </CodeBlock>
        <p className="com-text">
          Because the counter lives in Redis and not in server memory, the limit works the same even when you run 10 servers behind a load balancer.
        </p>
      </section>
    </div>
  );
}

export default SystemDesignDistributed;
