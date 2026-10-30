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
        RAM is limited. So Redis gives you two ways to remove data:
          <br />1. Expiry: you decide that a key should disappear after some time.
          <br />2. Eviction: Redis itself deletes keys when memory is full.
      </p>

      <section className="method-section">
        <h2 className="method-title">TTL (Time To Live)</h2>
        <p className="com-text">
          TTL means how long a key should live. When the time is up, Redis deletes it for you. Think of milk with an expiry date: after that date, it gets thrown out. This is how cache entries, OTPs and sessions clean themselves up. The TTL command returns -1 if the key has no expiry, and -2 if the key does not exist.
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
          Watch out: SET removes the old TTL. If you overwrite a key with SET, its expiry is gone. Set the expiry again, or pass KEEPTTL to keep the old one.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">How Redis removes expired keys</h2>
        <p className="com-text">
          Redis uses two ways together.
          Lazy expiry: when you ask for a key, Redis first checks if it has expired. If yes, it deletes it right then.
          Active expiry: in the background, Redis keeps picking random keys that have a TTL and deletes the expired ones.
          So you will never get back an expired key. But it may stay in memory for a short time before it is really freed.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Eviction (when memory is full)</h2>
        <p className="com-text">
          You set a memory limit with maxmemory. When Redis hits that limit and needs space for a new write, it follows a rule called maxmemory-policy. The default rule is noeviction. That means Redis deletes nothing, and new writes fail with an error. For a cache, you usually pick allkeys-lru.
        </p>
        <CodeBlock language="bash" style={atomDark}>
          {`# redis.conf (or CONFIG SET at runtime)
maxmemory 512mb
maxmemory-policy allkeys-lru`}
        </CodeBlock>
        <p className="com-text">
          noeviction: delete nothing, and return errors on writes. This is the default. Good when Redis holds important data, like queues.
          allkeys-lru: delete the key that was used the longest time ago (Least Recently Used), from all keys. The best choice for a normal cache.
          volatile-lru: same as LRU, but only looks at keys that have a TTL.
          allkeys-lfu / volatile-lfu: delete the key that is used the least often (Least Frequently Used). Popular keys stay, even if nobody used them recently.
          allkeys-random / volatile-random: delete a random key.
          volatile-ttl: delete the key that has the least time left to live.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">LRU vs LFU in simple words</h2>
        <p className="com-text">
          LRU (Least Recently Used) removes what was used the longest time ago.
          LFU (Least Frequently Used) removes what is used the least often.
          Example: a product page was viewed 10,000 times last week, but not today. LRU may remove it. LFU keeps it, because it is popular overall.
          Redis does not track this perfectly. It looks at a few random keys and removes the best match from those. This is fast, and close enough.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Important: BullMQ and eviction</h2>
        <p className="com-text">
          If you use the same Redis for BullMQ queues, set maxmemory-policy to noeviction. With an LRU policy, Redis may quietly delete queue keys, and you lose jobs. A common setup is two separate Redis servers: one for cache (allkeys-lru) and one for queues (noeviction).
        </p>
      </section>
    </div>
  );
}

export default RedisExpiryEviction;
