import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function RedisNodeJS() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Redis with Node.js &amp; NestJS</h1>
      <p className="com-text">
        In Node.js there are two main clients: ioredis (very popular, great cluster and Sentinel support, used by BullMQ) and node-redis (the official client from Redis). Both are promise-based. The examples here use ioredis.
      </p>

      <section className="method-section">
        <h2 className="method-title">One shared connection</h2>
        <p className="com-text">
          Create the client once and reuse it everywhere. Do not create a new connection per request: connections are expensive, and one Redis connection can handle thousands of commands per second because commands are pipelined over it automatically.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`// redis.js
import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL, {
  // e.g. redis://:password@localhost:6379/0
  retryStrategy: (times) => Math.min(times * 200, 5000), // reconnect with backoff
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis error', err));`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Cache middleware in Express</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`function cache(ttlSeconds) {
  return async (req, res, next) => {
    const key = \`cache:\${req.originalUrl}\`;
    const hit = await redis.get(key);
    if (hit) return res.json(JSON.parse(hit));

    // Wrap res.json to store the response before sending it
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      redis.set(key, JSON.stringify(body), 'EX', ttlSeconds).catch(console.error);
      return originalJson(body);
    };
    next();
  };
}

app.get('/api/products', cache(300), getProducts);`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Redis in NestJS</h2>
        <p className="com-text">
          In NestJS you provide the client once (as a provider) and inject it where needed. For simple caching, @nestjs/cache-manager can use Redis as its store. For background jobs, @nestjs/bullmq connects BullMQ to the same Redis.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`// redis.module.ts
@Global()
@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory: (config: ConfigService) => new Redis(config.get('REDIS_URL')),
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS'],
})
export class RedisModule {}

// any.service.ts
@Injectable()
export class ProductsService {
  constructor(@Inject('REDIS') private readonly redis: Redis) {}

  async getCount(): Promise<number> {
    return Number(await this.redis.get('products:count'));
  }
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Production best practices</h2>
        <p className="com-text">
          1. Never use KEYS * in production: it scans every key and blocks Redis. Use SCAN, which goes through keys in small batches.
          2. Always set a TTL on cache keys, and set maxmemory with a suitable eviction policy.
          3. Avoid big keys (a hash with millions of fields, a 50 MB string): reading or deleting them blocks Redis. Use UNLINK instead of DEL for big keys (it frees memory in the background).
          4. Protect Redis: set a password (or ACL users), never expose port 6379 to the internet, and use TLS for remote connections.
          5. Handle Redis being down: for a cache, fall back to the database instead of crashing.
          6. Monitor memory (INFO memory), slow commands (SLOWLOG GET) and hit rate.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`// SCAN instead of KEYS: delete all cache keys safely in batches
const stream = redis.scanStream({ match: 'cache:*', count: 100 });
stream.on('data', (keys) => {
  if (keys.length) redis.unlink(...keys);
});`}
        </CodeBlock>
      </section>
    </div>
  );
}

export default RedisNodeJS;
