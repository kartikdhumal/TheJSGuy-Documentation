import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function RedisLocksRateLimiting() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Distributed Locks &amp; Rate Limiting</h1>
      <p className="com-text">
        When your app runs on many servers, normal in-memory variables do not work across them. Redis is shared by all servers, and its commands are atomic, so it is the standard place to build locks ("only one server does this") and rate limits ("max 5 tries per minute").
      </p>

      <section className="method-section">
        <h2 className="method-title">Distributed lock with SET NX PX</h2>
        <p className="com-text">
          SET key value NX PX 30000 means: create the key only if it does not exist, and auto-delete it after 30 seconds. The first server to run it gets the lock. The expiry makes sure the lock is released even if that server crashes. The value must be a unique token, so a server only deletes its own lock, never someone else's.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`import { randomUUID } from 'node:crypto';

async function withLock(name, ttlMs, work) {
  const key = \`lock:\${name}\`;
  const token = randomUUID();

  const ok = await redis.set(key, token, 'PX', ttlMs, 'NX');
  if (!ok) return false;                  // someone else holds the lock

  try {
    await work();
    return true;
  } finally {
    // Delete ONLY if it is still our token (atomic check-and-delete with Lua)
    await redis.eval(
      "if redis.call('GET', KEYS[1]) == ARGV[1] then return redis.call('DEL', KEYS[1]) end return 0",
      1, key, token,
    );
  }
}

await withLock('daily-report', 30000, generateDailyReport);`}
        </CodeBlock>
        <p className="com-text">
          Why not just DEL? If your work takes longer than the TTL, the lock expires, another server takes it, and then your DEL would delete their lock. The token check prevents that.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Redlock (multi-node lock)</h2>
        <p className="com-text">
          A lock on one Redis server is lost if that server fails. Redlock takes the lock on a majority of independent Redis servers (for example 3 of 5) to survive one failure. It is debated: clock drift and long pauses can still break it. For correctness-critical work (money), add a fencing token or use the database's own locking. For "avoid duplicate work" cases, a single-node lock is usually enough.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Rate limiting: fixed window (INCR + EXPIRE)</h2>
        <p className="com-text">
          Count requests in a key per time window. INCR is atomic, so parallel requests are counted correctly. Simple and cheap, but a user can send double the limit around the window border (end of one minute plus start of the next).
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`async function isAllowed(ip, limit = 5, windowSec = 60) {
  const key = \`rate:login:\${ip}\`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, windowSec); // start the window
  return count <= limit;
}

if (!(await isAllowed(req.ip))) {
  return res.status(429).json({ message: 'Too many attempts. Try again later.' });
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Rate limiting: sliding window (Sorted Set)</h2>
        <p className="com-text">
          Store each request with its timestamp as the score. Remove entries older than the window, then count. This gives an accurate "last 60 seconds" limit with no border problem. Uses more memory than a counter.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`async function slidingWindow(userId, limit = 100, windowMs = 60000) {
  const key = \`rate:api:\${userId}\`;
  const now = Date.now();

  const [, , [, count]] = await redis
    .multi()
    .zremrangebyscore(key, 0, now - windowMs)   // drop old requests
    .zadd(key, now, \`\${now}-\${Math.random()}\`)  // add this request
    .zcard(key)                                 // count in window
    .pexpire(key, windowMs)
    .exec();

  return count <= limit;
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Other algorithms (know the names)</h2>
        <p className="com-text">
          Token bucket: a bucket refills at a fixed rate; each request takes a token. It allows short bursts. Leaky bucket: requests leave at a fixed rate, smoothing traffic. Both are usually built with a small Lua script so the read-and-update is atomic. In NestJS, @nestjs/throttler can store its counters in Redis so limits work across all servers.
        </p>
      </section>
    </div>
  );
}

export default RedisLocksRateLimiting;
