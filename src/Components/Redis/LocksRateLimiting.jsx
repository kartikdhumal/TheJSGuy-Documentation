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
        When your app runs on many servers, a normal variable in one server's memory is not seen by the others. But all servers can talk to the same Redis, and its commands are atomic (they happen fully, with nothing in between). So Redis is the usual place to build locks ("only one server does this") and rate limits ("max 5 tries per minute").
      </p>

      <section className="method-section">
        <h2 className="method-title">Distributed lock with SET NX PX</h2>
        <p className="com-text">
          SET key value NX PX 30000 means: create the key only if it does not exist yet, and delete it by itself after 30 seconds. The first server to run it gets the lock. Think of a single bathroom key at a cafe: whoever holds it goes in, everyone else waits. The expiry makes sure the lock is freed even if that server crashes. The value must be a unique token. That way a server only deletes its own lock, never someone else's.
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
          Why not just call DEL? If your work takes longer than the TTL, the lock expires and another server takes it. Then your DEL would delete their lock. Checking the token stops that from happening.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Redlock (multi-node lock)</h2>
        <p className="com-text">
          A lock on one Redis server is lost if that server fails. Redlock takes the lock on most of several separate Redis servers (for example 3 out of 5), so one failure does not break it. But people argue about it: clocks that drift and long pauses can still break it. For work that must be 100% correct (like money), add a fencing token or use the database's own locking. If you only want to "avoid doing the same work twice", a lock on one Redis server is usually enough.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Rate limiting: fixed window (INCR + EXPIRE)</h2>
        <p className="com-text">
          Count the requests in a key for each time window (for example, each minute). INCR is atomic, so requests that come at the same time are still counted correctly. It is simple and cheap. The weak spot: a user can send double the limit around the edge of the window (at the end of one minute and the start of the next).
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
          Save each request with its time as the score. Remove entries older than the window, then count what is left. This gives a correct "last 60 seconds" limit, with no edge problem. It uses more memory than a simple counter.
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
        <h2 className="method-title">Other ways to rate limit (just know the names)</h2>
        <p className="com-text">
          Token bucket: a bucket fills up with tokens at a steady speed. Each request takes one token. It allows short bursts.
          Leaky bucket: requests go out at a steady speed, which smooths out the traffic.
          Both are usually built with a small Lua script, so the read-and-update happens in one atomic step.
          In NestJS, @nestjs/throttler can keep its counters in Redis, so the limits work across all your servers.
        </p>
      </section>
    </div>
  );
}

export default RedisLocksRateLimiting;
