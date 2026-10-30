import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function RedisCaching() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Caching with Redis</h1>
      <p className="com-text">
        Caching means keeping a copy of slow data in a fast place. It is like keeping a water bottle on your desk, so you don't walk to the kitchen every time you are thirsty. Say your database query takes 200 ms. Reading the same result from Redis takes about 1 ms. So you save the result in Redis once. The next thousand requests read it from Redis, and the database can relax.
      </p>

      <section className="method-section">
        <h2 className="method-title">Cache-aside (lazy loading) - the one you will use most</h2>
        <p className="com-text">
          1. The app looks in Redis first.
          <br />2. If the data is there (a cache hit), return it.
          <br />3. If not (a cache miss), read it from the database, save it in Redis with a TTL (an expiry time), and return it.
          This way the cache only fills up with data that people really ask for.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`async function getProduct(id) {
  const key = \`product:\${id}\`;

  // 1. Try the cache
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);          // cache hit

  // 2. Cache miss: read from the database
  const product = await db.product.findById(id);
  if (!product) return null;

  // 3. Save in cache for 10 minutes, then return
  await redis.set(key, JSON.stringify(product), 'EX', 600);
  return product;
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Invalidation: keeping the cache up to date</h2>
        <p className="com-text">
          When the data changes, the copy in the cache becomes stale (old). Here is the simple, safe rule: update the database first, then delete the cache key. The next read will load the fresh value.
          Why delete instead of updating the cache? Because two updates at the same time could write to the cache in the wrong order.
          The TTL is your safety net. Even if you forget a delete, the old data goes away when the TTL runs out.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`async function updateProduct(id, changes) {
  const product = await db.product.update(id, changes); // 1. source of truth first
  await redis.del(\`product:\${id}\`);                    // 2. then remove the stale copy
  return product;
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Other caching patterns</h2>
        <p className="com-text">
          Write-through: every write goes to the cache and the database together. The cache is always fresh. But writes are slower, and you may cache data that nobody reads.
          Write-behind (write-back): write to the cache now, and save to the database later in batches. Writes are very fast. But if Redis crashes before saving, you lose that data.
          Read-through: on a miss, the cache layer itself loads from the database. The app only talks to the cache. Cache-aside is the same idea, but there the app does the loading.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">3 common cache problems</h2>
        <p className="com-text">
          Cache stampede (dog-pile): a popular key expires. 1,000 requests miss at the same time, and they all hit the database. Fix: use a short lock so only one request rebuilds the cache. Or refresh popular keys before they expire.
          Cache penetration: people ask for data that does not exist (for example id = -1). It is never in the cache, so every request hits the database. Fix: cache the "not found" answer too, with a short TTL, and check the input.
          Cache avalanche: lots of keys expire at the same moment (for example, all were set with the same TTL at startup). Fix: add a little random time (jitter) to each TTL, so they expire at different times.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`// Jitter: 600s +/- up to 60s so keys don't all expire together
const ttl = 600 + Math.floor(Math.random() * 60);
await redis.set(key, value, 'EX', ttl);

// Penetration: cache "not found" for a short time
if (!product) {
  await redis.set(key, 'null', 'EX', 60);
  return null;
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">What to cache (and what not to)</h2>
        <p className="com-text">
          Good to cache: data that is read a lot and changes rarely. For example product lists, settings, user profiles, heavy calculations, and responses from other companies' APIs.
          Don't cache: data that must always be 100% correct right now (like an account balance during a payment), data that is different for every request, and huge objects that waste memory.
          And always set a TTL on cache keys.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Session storage</h2>
        <p className="com-text">
          If you keep sessions in Redis, any of your servers can read them. So you can run many app servers behind a load balancer, and a user does not have to stick to one server (no sticky sessions needed). Each session is a key with a TTL. Every time the user does something, the TTL is pushed forward.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`await redis.set(\`session:\${sessionId}\`, JSON.stringify({ userId: 101 }), 'EX', 1800);
// on every request: slide the expiry forward
await redis.expire(\`session:\${sessionId}\`, 1800);`}
        </CodeBlock>
      </section>
    </div>
  );
}

export default RedisCaching;
