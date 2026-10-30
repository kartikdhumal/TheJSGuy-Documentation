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
        Caching means keeping a copy of slow-to-get data in a fast place. Your database query takes 200 ms; reading the same result from Redis takes about 1 ms. So you save the result in Redis once, and the next thousand requests read from Redis instead of hitting the database.
      </p>

      <section className="method-section">
        <h2 className="method-title">Cache-aside (lazy loading) - the most common pattern</h2>
        <p className="com-text">
          The app checks Redis first. If the data is there (cache hit), return it. If not (cache miss), read from the database, save it in Redis with a TTL, then return it. The cache only fills with data that is actually requested.
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
        <h2 className="method-title">Invalidation: keep the cache correct</h2>
        <p className="com-text">
          When the data changes, the cached copy becomes stale (old). The simplest safe rule: update the database first, then delete the cache key. The next read will load the fresh value. Deleting is safer than updating the cache, because two parallel updates could write the cache in the wrong order. The TTL is your safety net: even if a delete is missed, stale data disappears after the TTL.
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
          Write-through: every write goes to the cache and the database at the same time, so the cache is always fresh, but writes are slower and you cache data nobody may read.
          Write-behind (write-back): write to the cache now and save to the database later in batches. Very fast writes, but you can lose data if Redis crashes before saving.
          Read-through: the cache layer itself loads from the database on a miss (the app only talks to the cache). Cache-aside is the same idea but the app does the loading.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">3 classic cache problems</h2>
        <p className="com-text">
          Cache stampede (dog-pile): a popular key expires and 1,000 requests all miss at the same time and all hit the database. Fix: a short lock so only one request rebuilds the cache, or refresh popular keys before they expire.
          Cache penetration: requests for data that does not exist (for example id = -1) always miss and always hit the database. Fix: cache the "not found" result too, with a short TTL, and validate input.
          Cache avalanche: many keys expire at the same moment (all set with the same TTL at startup). Fix: add a random jitter to the TTL so expiries spread out.
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
          Good to cache: data read often and changed rarely (product lists, settings, user profiles, expensive aggregations, third-party API responses). Avoid caching: data that must always be 100% up to date (account balance during payment), data that is different for every request, and huge objects that waste memory. Always set a TTL on cache keys.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Session storage</h2>
        <p className="com-text">
          Storing sessions in Redis lets any server read them, so you can run many app servers behind a load balancer (sticky sessions are not needed). Each session is a key with a TTL that is refreshed on activity.
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
