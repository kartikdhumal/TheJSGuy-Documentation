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
        In Node.js there are two main libraries (clients) to talk to Redis:
          ioredis: very popular, works well with Cluster and Sentinel, and BullMQ uses it.
          node-redis: the official client made by Redis.
          Both work with promises, so you can use await. The examples here use ioredis.
      </p>

      <section className="method-section">
        <h2 className="method-title">One shared connection</h2>
        <p className="com-text">
          Make the client once and use it everywhere. Don't make a new connection for every request. Connections are costly to open. And one connection is enough for thousands of commands per second, because commands are sent in batches over it for you (pipelined).
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
          In NestJS, you set up the client once (as a provider). Then Nest hands it to any class that asks for it (injection). For simple caching, @nestjs/cache-manager can keep its data in Redis. For background jobs, @nestjs/bullmq connects BullMQ to the same Redis.
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
        <h2 className="method-title">Good habits for production</h2>
        <p className="com-text">
          1. Never use KEYS * in production. It looks at every key, and Redis is stuck until it finishes. Use SCAN instead. It goes through keys in small batches.
          <br />2. Always set a TTL on cache keys. Also set maxmemory with a good eviction policy (the rule for what to delete when memory is full).
          <br />3. Avoid big keys, like a hash with millions of fields or a 50 MB string. Reading or deleting them blocks Redis. For big keys, use UNLINK instead of DEL (it frees the memory in the background).
          <br />4. Keep Redis safe: set a password (or ACL users), never open port 6379 to the internet, and use TLS for remote connections.
          <br />5. Plan for Redis being down. For a cache, read from the database instead of crashing.
          <br />6. Keep an eye on memory (INFO memory), slow commands (SLOWLOG GET) and hit rate (how often the cache had the answer).
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
