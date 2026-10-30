import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function RedisIntroduction() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Introduction to Redis</h1>
      <p className="com-text">
        Redis (REmote DIctionary Server) is an in-memory key-value data store. In-memory means the data lives in RAM, not on disk, so reading and writing is extremely fast (usually under 1 millisecond). You use it next to your main database (MongoDB, MySQL, PostgreSQL) for things that need speed: caching, sessions, rate limiting, leaderboards, queues and real-time messaging.
      </p>

      <section className="method-section">
        <h2 className="method-title">Why is Redis so fast?</h2>
        <p className="com-text">
          1. Data is in RAM, so there is no disk read for every request.
          2. Commands run on a single main thread, so there are no locks and no context switching between threads.
          3. It uses an event loop with non-blocking I/O (same idea as Node.js), so one thread can serve thousands of clients.
          4. Its data structures (hash tables, skip lists, compact lists) are designed so most commands are O(1) or O(log n).
          Since Redis 6, network reading and writing can use extra I/O threads, but the commands themselves still run one by one on the main thread.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Single-threaded means atomic</h2>
        <p className="com-text">
          Because commands run one at a time, every single command is atomic. If 100 users call INCR on the same counter at the same moment, Redis runs them one after another and the final value is exactly 100. You never get a half-updated value. This is why Redis is great for counters, locks and rate limiting.
        </p>
        <CodeBlock language="bash" style={atomDark}>
          {`# Start the CLI and try it
redis-cli

SET page:views 0
INCR page:views      # 1
INCR page:views      # 2
GET page:views       # "2"`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Redis vs a normal database</h2>
        <p className="com-text">
          A database like PostgreSQL or MongoDB stores data on disk, supports complex queries, joins and indexes, and is the source of truth. Redis keeps data in memory, supports simple key-based lookups and special data structures, and is much faster but limited by RAM. So we usually do not replace the database with Redis. We put Redis in front of it: read from Redis first, and only go to the database when Redis does not have the data.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Common use cases</h2>
        <p className="com-text">
          Caching (API responses, DB query results), Session storage (logged-in users), Rate limiting (max 5 login attempts per minute), Leaderboards (sorted sets), Counters (likes, views), Distributed locks (only one server runs a job), Pub/Sub (chat, notifications), Job queues (BullMQ is built on Redis), and Real-time analytics.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Quick setup</h2>
        <p className="com-text">The easiest way to run Redis locally is Docker. Then connect from Node.js with ioredis (or the official node-redis client).</p>
        <CodeBlock language="bash" style={atomDark}>
          {`# Run Redis in Docker
docker run -d --name redis -p 6379:6379 redis

# Check it is alive
redis-cli PING        # PONG

# Install a Node.js client
npm install ioredis`}
        </CodeBlock>
        <CodeBlock language="javascript" style={atomDark}>
          {`import Redis from 'ioredis';

const redis = new Redis({ host: '127.0.0.1', port: 6379 });

await redis.set('greeting', 'Hello Redis');
const value = await redis.get('greeting');
console.log(value); // Hello Redis`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Key naming convention</h2>
        <p className="com-text">
          Redis has no tables, only keys. So we use a colon to group keys like folders: user:101, user:101:cart, session:abc123, rate:login:192.168.1.10. This keeps keys readable and makes it easy to find related data. Keep keys short but meaningful, because every key takes memory.
        </p>
      </section>
    </div>
  );
}

export default RedisIntroduction;
