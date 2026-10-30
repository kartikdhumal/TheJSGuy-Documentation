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
        Redis (REmote DIctionary Server) is a key-value store. You save a value under a key, and you get it back with that key. It keeps all the data in memory (RAM), not on disk. That is why it is very fast. Most reads and writes take less than 1 millisecond. You don't use Redis instead of your main database (MongoDB, MySQL, PostgreSQL). You use it next to it, for things that need speed: caching, sessions, rate limiting, leaderboards, queues and live messages.
      </p>

      <section className="method-section">
        <h2 className="method-title">Why is Redis so fast?</h2>
        <ol className="com-list">
          <li className="com-list-item">The data is in RAM. Redis does not have to read the disk for every request.</li>
          <li className="com-list-item">Commands run on one main thread. So there are no locks, and no time is lost switching between threads.</li>
          <li className="com-list-item">It uses an event loop that never sits and waits (the same idea as Node.js). One thread can serve thousands of clients.</li>
          <li className="com-list-item">Its data structures (hash tables, skip lists, compact lists) are built so most commands take O(1) or O(log n) time. In simple words: they stay fast even when you have lots of data.</li>
        </ol>
        <p className="com-text">
          Since Redis 6, extra threads can help with reading and writing network data. But the commands themselves still run one by one on the main thread.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">One thread means every command is atomic</h2>
        <p className="com-text">
          Redis runs commands one at a time. So every single command is atomic. Atomic means it happens fully or not at all, and nothing can sneak in between. Say 100 users call INCR on the same counter at the same moment. Redis runs them one after another, and the final value is exactly 100. You never get a half-updated value. Think of one cashier serving a line of people: one person at a time, no mix-ups. This is why Redis is great for counters, locks and rate limiting.
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
          A database like PostgreSQL or MongoDB keeps data on disk. It can run complex queries, joins and indexes. It is the source of truth, the place where the real data lives.
          Redis keeps data in memory. It is great at simple "get by key" lookups and has some special data structures. It is much faster, but it can only hold as much as your RAM.
          So we usually don't replace the database with Redis. We put Redis in front of it. First we look in Redis. Only if Redis does not have the data do we go to the database.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Common use cases</h2>
        <p className="com-text">
          Here is where people use Redis most:
          Caching (API responses, DB query results). Session storage (logged-in users). Rate limiting (max 5 login attempts per minute). Leaderboards (sorted sets). Counters (likes, views). Distributed locks (only one server runs a job). Pub/Sub (chat, notifications). Job queues (BullMQ is built on Redis). Real-time analytics.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Quick setup</h2>
        <p className="com-text">The easiest way to run Redis on your own computer is Docker. Then you connect to it from Node.js with ioredis (or the official node-redis client).</p>
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
        <h2 className="method-title">How to name your keys</h2>
        <p className="com-text">
          Redis has no tables. It only has keys. So we use a colon to group keys, like folders: user:101, user:101:cart, session:abc123, rate:login:192.168.1.10. This keeps keys easy to read, and related data is easy to find. Keep keys short but clear, because every key uses some memory.
        </p>
      </section>
    </div>
  );
}

export default RedisIntroduction;
