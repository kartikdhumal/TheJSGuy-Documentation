import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function RedisExpiryEviction() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Expiry (TTL) &amp; Eviction</h1>
      <p className="com-text">
        RAM is limited, so Redis gives you two ways to get rid of data: expiry, where you decide a key should disappear after some time, and eviction, where Redis itself deletes keys when memory is full.
      </p>

      <section className="method-section">
        <h2 className="method-title">TTL (Time To Live)</h2>
        <p className="com-text">
          TTL is how long a key should live. After that, Redis deletes it automatically. This is how cache entries, OTPs and sessions clean themselves up. TTL returns -1 if the key has no expiry and -2 if the key does not exist.
        </p>
        <CodeBlock language="bash" style={atomDark}>
          {`SET session:abc123 "user:101" EX 3600   # expire in 1 hour
EXPIRE cart:101 600                     # add expiry to an existing key (10 min)
TTL cart:101                            # seconds left, e.g. 598
PTTL cart:101                           # milliseconds left
PERSIST cart:101                        # remove expiry (live forever)
TTL cart:101                            # -1 (no expiry)

SET otp:101 482913 EX 300 NX            # create only if not exists, 5 min`}
        </CodeBlock>
        <p className="com-text">
          Note: SET without KEEPTTL removes the old TTL. If you overwrite a key with SET, the expiry is gone unless you set it again (or pass KEEPTTL).
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">How Redis deletes expired keys</h2>
        <p className="com-text">
          Redis uses two methods together. Lazy expiry: when you access a key, Redis checks if it has expired and deletes it right then. Active expiry: in the background, Redis regularly picks random keys that have a TTL and deletes the expired ones. So an expired key is never returned to you, but it may sit in memory for a short time before it is actually freed.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Eviction (when memory is full)</h2>
        <p className="com-text">
          You set a memory limit with maxmemory. When Redis reaches it and needs space for a new write, it follows the maxmemory-policy. The default is noeviction, which means new writes fail with an error. For a cache, you usually choose allkeys-lru.
        </p>
        <CodeBlock language="bash" style={atomDark}>
          {`# redis.conf (or CONFIG SET at runtime)
maxmemory 512mb
maxmemory-policy allkeys-lru`}
        </CodeBlock>
        <p className="com-text">
          noeviction: do not delete anything, return errors on writes (default; good when Redis holds important data like queues).
          allkeys-lru: delete the Least Recently Used key from all keys (best general cache choice).
          volatile-lru: LRU, but only among keys that have a TTL.
          allkeys-lfu / volatile-lfu: delete the Least Frequently Used key (keeps popular keys even if not used recently).
          allkeys-random / volatile-random: delete a random key.
          volatile-ttl: delete the key with the shortest TTL left.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">LRU vs LFU in simple words</h2>
        <p className="com-text">
          LRU (Least Recently Used) removes what was used longest ago. LFU (Least Frequently Used) removes what is used least often. Example: a product page viewed 10,000 times last week but not today. LRU may remove it; LFU keeps it because it is popular overall. Redis does not track this perfectly. It samples a few keys and picks the best candidate, which is fast and close enough.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Important: BullMQ and eviction</h2>
        <p className="com-text">
          If the same Redis is used for BullMQ queues, use maxmemory-policy noeviction. With an LRU policy Redis may silently delete queue keys and you lose jobs. A common setup is two Redis instances: one for cache (allkeys-lru) and one for queues (noeviction).
        </p>
      </section>
    </div>
  );
}

export default RedisExpiryEviction;
