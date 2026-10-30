# Redis & BullMQ - Copy Guide

How to add the new **Redis & BullMQ** section to another copy of this project.
There are **2 things to copy** and **3 files to edit**.

---

## Step 1: Copy the new folder

Copy this whole folder into the same place in the other project:

```
src/Components/Redis/
```

It contains 14 files:

```
Introduction.jsx          DataTypes.jsx            ExpiryEviction.jsx
Caching.jsx               Persistence.jsx          PubSubStreams.jsx
TransactionsLua.jsx       LocksRateLimiting.jsx    Scaling.jsx
RedisNodeJS.jsx           BullMQIntroduction.jsx   BullMQJobsWorkers.jsx
BullMQAdvanced.jsx        Questions.jsx
```

## Step 2: Copy this guide (optional)

```
REDIS_BULLMQ.md   (project root)
```

---

## Step 3: Edit `src/index.js` (2 places)

**3a.** Find this line:

```javascript
import TypeScriptConfig from './Components/TypeScript/Config';
```

Paste this **right below it**:

```javascript
// Redis & BullMQ
import RedisIntroduction from './Components/Redis/Introduction';
import RedisDataTypes from './Components/Redis/DataTypes';
import RedisExpiryEviction from './Components/Redis/ExpiryEviction';
import RedisCaching from './Components/Redis/Caching';
import RedisPersistence from './Components/Redis/Persistence';
import RedisPubSubStreams from './Components/Redis/PubSubStreams';
import RedisTransactionsLua from './Components/Redis/TransactionsLua';
import RedisLocksRateLimiting from './Components/Redis/LocksRateLimiting';
import RedisScaling from './Components/Redis/Scaling';
import RedisNodeJS from './Components/Redis/RedisNodeJS';
import BullMQIntroduction from './Components/Redis/BullMQIntroduction';
import BullMQJobsWorkers from './Components/Redis/BullMQJobsWorkers';
import BullMQAdvanced from './Components/Redis/BullMQAdvanced';
import RedisQuestions from './Components/Redis/Questions';
```

**3b.** Find this line (inside `createBrowserRouter([...])`):

```javascript
  { path: '/typescript-config', element: <TypeScriptConfig /> },
```

Paste this **right below it**:

```javascript
  { path: '/redis', element: <RedisIntroduction /> },
  { path: '/redis-introduction', element: <RedisIntroduction /> },
  { path: '/redis-data-types', element: <RedisDataTypes /> },
  { path: '/redis-expiry-eviction', element: <RedisExpiryEviction /> },
  { path: '/redis-caching', element: <RedisCaching /> },
  { path: '/redis-persistence', element: <RedisPersistence /> },
  { path: '/redis-pubsub-streams', element: <RedisPubSubStreams /> },
  { path: '/redis-transactions-lua', element: <RedisTransactionsLua /> },
  { path: '/redis-locks-rate-limiting', element: <RedisLocksRateLimiting /> },
  { path: '/redis-scaling', element: <RedisScaling /> },
  { path: '/redis-nodejs', element: <RedisNodeJS /> },
  { path: '/bullmq-introduction', element: <BullMQIntroduction /> },
  { path: '/bullmq-jobs-workers', element: <BullMQJobsWorkers /> },
  { path: '/bullmq-advanced', element: <BullMQAdvanced /> },
  { path: '/redis-questions', element: <RedisQuestions /> },
```

---

## Step 4: Edit `src/utils/navbarData.js` (1 place)

Find the last card:

```javascript
  {
    title: 'Interview Questions',
```

Paste this **right above it** (so Redis & BullMQ is the card before the last one):

```javascript
    title: 'Redis & BullMQ',
    version: 'BullMQ v6.5.0',
    versionDate: '26 Oct 2026',
    links: [
      { to: '/redis-introduction', label: 'Introduction to Redis' },
      { to: '/redis-data-types', label: 'Data Types' },
      { to: '/redis-expiry-eviction', label: 'Expiry (TTL) & Eviction' },
      { to: '/redis-caching', label: 'Caching Patterns' },
      { to: '/redis-persistence', label: 'Persistence (RDB & AOF)' },
      { to: '/redis-pubsub-streams', label: 'Pub/Sub & Streams' },
      { to: '/redis-transactions-lua', label: 'Transactions, Pipelining & Lua' },
      { to: '/redis-locks-rate-limiting', label: 'Distributed Locks & Rate Limiting' },
      { to: '/redis-scaling', label: 'Replication, Sentinel & Cluster' },
      { to: '/redis-nodejs', label: 'Redis with Node.js & NestJS' },
      { to: '/bullmq-introduction', label: 'Introduction to BullMQ' },
      { to: '/bullmq-jobs-workers', label: 'BullMQ Jobs & Workers' },
      { to: '/bullmq-advanced', label: 'BullMQ Advanced' },
      { to: '/redis-questions', label: 'Redis & BullMQ Questions' },
    ],
  },
  {
```

---

## Step 5: Edit `src/data/interviewData.js` (1 place)

Find this line:

```javascript
  {
    title: "DSA - Array",
```

Paste this **right above it**:

```javascript
    title: "Redis & BullMQ",
    questions: [
      { q: "What is Redis and why is it so fast?", a: "Redis is an in-memory key-value data store. It is fast because the data lives in RAM (no disk read per request), commands run one by one on a single main thread (no locks, no thread switching), it uses non-blocking I/O with an event loop, and its data structures make most commands O(1) or O(log n). Typical reads take under 1 ms." },
      { q: "Is Redis single-threaded? Then how does it handle thousands of clients?", a: "Commands are executed on one main thread, one at a time, which makes every single command atomic. It still serves thousands of clients because it uses an event loop with non-blocking I/O, like Node.js, and each command is very short. Since Redis 6, reading and writing network data can use extra I/O threads, but command execution stays single-threaded. The downside: one slow command (KEYS *, a huge DEL, a long Lua script) blocks everyone." },
      { q: "What are the Redis data types and when do you use each?", a: "String: cached values, JSON, counters (INCR), flags. Hash: an object whose fields you read or update separately (user profile). List: ordered items, recent-items feeds, simple queues (LPUSH/BRPOP). Set: unique values and membership checks (who liked a post, tags). Sorted Set: members ordered by a score, for leaderboards, rankings, time-ordered data. Plus Streams (event log with consumer groups), Bitmaps, HyperLogLog (approximate unique counts) and Geospatial." },
      { q: "Should I store an object as a JSON string or as a Hash?", a: "JSON string: one GET/SET, easy when you always read and write the whole object. Hash: you can read or update one field (HGET, HSET, HINCRBY) without loading and rewriting everything, and it is safer for concurrent field updates. Use a Hash for objects with independently changing fields, JSON for read-mostly cached responses.", code: `SET user:101 '{"name":"Kartik","city":"Surat"}'
HSET user:101 name "Kartik" city "Surat"
HSET user:101 city "Pune"     // update one field only` },
      { q: "Redis vs Memcached", a: "Both are in-memory caches. Memcached only stores strings, is multi-threaded and has no built-in persistence or replication. Redis has rich data types (lists, sets, sorted sets, streams), persistence (RDB/AOF), replication, Sentinel, Cluster, Pub/Sub, transactions and Lua scripting. Redis is the default choice today unless you only need a very simple multi-threaded string cache." },
      { q: "How does key expiry (TTL) work and how are expired keys removed?", a: "You set a TTL with EX/PX on SET or with EXPIRE, and Redis deletes the key after that time. Removal uses two methods together: lazy expiry (when you access a key, Redis checks and deletes it if expired) and active expiry (a background job samples keys with a TTL and deletes the expired ones). An expired key is never returned, but its memory may be freed a little later. TTL returns -1 for no expiry and -2 for a missing key.", code: `SET otp:101 482913 EX 300
TTL otp:101        // 295
PERSIST otp:101    // remove expiry` },
      { q: "What happens when Redis runs out of memory? Explain eviction policies.", a: "With maxmemory set, Redis follows maxmemory-policy when full. noeviction (default) rejects writes with an error. allkeys-lru removes the least recently used key (best for a cache). volatile-lru does the same only for keys with a TTL. allkeys-lfu / volatile-lfu remove the least frequently used key. allkeys-random / volatile-random remove a random key. volatile-ttl removes the key closest to expiring. Use noeviction for Redis that holds queues (BullMQ), an LRU/LFU policy for a pure cache." },
      { q: "Explain the cache-aside pattern.", a: "The application checks Redis first. On a hit it returns the cached value. On a miss it reads the database, stores the result in Redis with a TTL and returns it. Only requested data gets cached, and if Redis is down the app can still read the database.", code: `const cached = await redis.get(key);
if (cached) return JSON.parse(cached);
const data = await db.find(id);
await redis.set(key, JSON.stringify(data), 'EX', 600);
return data;` },
      { q: "How do you keep the cache consistent with the database?", a: "On update, write the database first, then delete the cache key (do not update it), so the next read loads fresh data. Deleting avoids two parallel updates writing the cache in the wrong order. Always keep a TTL as a safety net so any missed invalidation fixes itself. For stricter needs, publish change events so all services invalidate their caches." },
      { q: "What are cache stampede, cache penetration and cache avalanche?", a: "Stampede: a hot key expires and many requests miss at once and all hit the database. Fix: let one request rebuild with a short lock, or refresh hot keys early. Penetration: requests for data that does not exist always miss and always hit the database. Fix: cache the 'not found' result briefly and validate input. Avalanche: many keys expire together. Fix: add random jitter to TTLs." },
      { q: "RDB vs AOF persistence", a: "RDB saves a snapshot of all data at intervals (forked child process): small file and fast restart, but you can lose minutes of writes. AOF logs every write command and replays it on restart: with appendfsync everysec you lose at most about 1 second, but the file is bigger and restarts are slower (Redis compacts it with an AOF rewrite). Production setups that care about data usually enable both. A pure cache can run with no persistence." },
      { q: "Pub/Sub vs Streams", a: "Pub/Sub is fire-and-forget broadcast: messages are not stored, every current subscriber gets them, offline subscribers miss them (at-most-once). Streams are an append-only log: messages are stored, consumer groups split work between workers, workers acknowledge with XACK, and unacknowledged messages stay pending for retry (at-least-once). Use Pub/Sub for live notifications, Streams for events that must not be lost." },
      { q: "How do transactions work in Redis? Is there a rollback?", a: "MULTI queues commands and EXEC runs them all together with no other client's command in between. There is no rollback: if one command fails at runtime, the others still run. You also cannot use one command's result to decide the next inside MULTI. WATCH adds optimistic locking: if a watched key changes before EXEC, the transaction is cancelled (EXEC returns null) and you retry.", code: `WATCH stock:5
MULTI
DECR stock:5
EXEC   // null if stock:5 changed after WATCH` },
      { q: "Pipelining vs transactions", a: "Pipelining sends many commands in one network round trip to save time, but other clients' commands can run in between, so it is about speed, not atomicity. MULTI/EXEC runs the queued commands together without interruption. You can also combine them: ioredis sends a MULTI block as one pipeline." },
      { q: "Why and when would you use Lua scripts in Redis?", a: "A Lua script (EVAL) runs inside Redis as one atomic step, so you can read a value, decide, and write, with no other command in between and in one round trip. It is simpler than WATCH with retries. Use it for check-and-set logic like 'decrease stock only if enough is left', safe lock release, or token-bucket rate limiting. Keep scripts short because they block Redis while running. BullMQ relies on Lua scripts to move jobs between states atomically." },
      { q: "How do you implement a distributed lock with Redis?", a: "SET lock:name <unique-token> NX PX 30000: NX creates it only if nobody holds it, PX auto-releases it if the holder crashes. Release with a Lua script that deletes the key only if the value is still your token, so you never delete a lock someone else took after yours expired. For locks across several Redis nodes there is Redlock, but it is debated; for money-critical correctness add fencing tokens or use database locks.", code: `const ok = await redis.set('lock:report', token, 'PX', 30000, 'NX');
if (!ok) return;   // someone else has it
// release: delete only if value === token (Lua)` },
      { q: "How do you build a rate limiter with Redis?", a: "Fixed window: INCR a key per user per window and set EXPIRE on the first request; block when the count exceeds the limit. INCR is atomic, so parallel requests are counted correctly, but bursts can double at window borders. Sliding window: store each request timestamp in a sorted set, remove entries older than the window (ZREMRANGEBYSCORE), and count (ZCARD). Token bucket and leaky bucket are usually built with a Lua script.", code: `const count = await redis.incr(\`rate:\${ip}\`);
if (count === 1) await redis.expire(\`rate:\${ip}\`, 60);
if (count > 5) return res.status(429).end();` },
      { q: "How do you build a leaderboard?", a: "Use a sorted set: ZADD or ZINCRBY to set or increase a score, ZREVRANGE ... WITHSCORES for the top N, ZREVRANK for a user's position, ZSCORE for their score. All of these are O(log n), so it stays fast with millions of players.", code: `ZINCRBY leaderboard 50 "kartik"
ZREVRANGE leaderboard 0 9 WITHSCORES   // top 10
ZREVRANK leaderboard "kartik"          // position` },
      { q: "Replication vs Sentinel vs Cluster", a: "Replication: one master takes writes, replicas copy it asynchronously and can serve reads. Sentinel: watcher processes (at least 3) that detect a failed master and promote a replica automatically (high availability). Cluster: shards data across several masters using 16,384 hash slots, with built-in failover, for data or load bigger than one machine. Replication + Sentinel = high availability; Cluster = horizontal scaling + high availability." },
      { q: "What are hash slots and hash tags in Redis Cluster?", a: "The cluster has 16,384 slots; a key goes to slot CRC16(key) mod 16384, and each master owns a range of slots. Commands with several keys (MGET, MULTI, Lua) only work if all keys are in the same slot. A hash tag forces that: only the part inside {} is hashed, so user:{101}:cart and user:{101}:profile always share a slot." },
      { q: "Why should you not use KEYS * in production?", a: "KEYS scans every key in one go and blocks the single command thread, so with millions of keys Redis freezes for everyone. Use SCAN, which walks the keyspace in small batches with a cursor and never blocks for long. Similarly, delete big keys with UNLINK (frees memory in the background) instead of DEL." },
      { q: "What is BullMQ and why use a job queue?", a: "BullMQ is a Redis-based job queue for Node.js. Your API adds a job (fast) and replies immediately; worker processes do the slow work in the background (emails, PDFs, file processing, provisioning). Jobs are stored in Redis so they survive restarts, failed jobs are retried automatically, and you can scale by adding workers. It keeps slow work from blocking your API." },
      { q: "Explain Queue, Worker, Job and QueueEvents in BullMQ.", a: "Queue: the producer side, you call queue.add(name, data, options). Worker: the consumer that runs your processor function for each job. Job: one unit of work with name, data, options, progress, return value and state. QueueEvents: listens to completed/failed/progress events from all workers via a Redis stream, useful for notifying users. FlowProducer adds parent-child job trees." },
      { q: "What are the states of a BullMQ job?", a: "waiting (ready), delayed (scheduled for later or waiting for a retry backoff), prioritized (waiting, ordered by priority), active (being processed), completed, failed (no retries left), and waiting-children (a parent waiting for its child jobs). A thrown error moves the job back to delayed for a retry, or to failed after the last attempt." },
      { q: "How do retries and backoff work in BullMQ?", a: "Set attempts for the total tries and backoff for the wait between them. Exponential backoff doubles the wait each time (5s, 10s, 20s), giving a failing service time to recover; fixed waits the same each time. If retrying is pointless (bad data), throw UnrecoverableError to fail immediately.", code: `await queue.add('provision', { tenantId }, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 5000 },
});` },
      { q: "What is concurrency in a BullMQ worker and how do you choose it?", a: "concurrency is how many jobs one worker processes at the same time. For I/O-bound jobs (API calls, DB, emails) a higher value like 10 to 50 works well. For CPU-heavy jobs keep it low and run more worker processes, or use a sandboxed processor, because Node.js runs JavaScript on one thread and heavy work blocks everything else." },
      { q: "What are stalled jobs?", a: "An active job holds a lock that the worker renews regularly. If the worker crashes, or blocks the event loop so long it cannot renew the lock, the job is considered stalled. BullMQ moves it back to waiting so another worker retries it; after maxStalledCount stalls (default 1) it is failed. Prevent it by keeping processors async, lowering concurrency for CPU work, using sandboxed processors, and shutting workers down gracefully." },
      { q: "Does BullMQ guarantee a job runs exactly once?", a: "No, it guarantees at-least-once. A worker can finish the work and crash before marking the job completed, so the job runs again. So processors must be idempotent: running twice should be safe. Check if the work was already done, use upserts, use idempotency keys with payment providers, and use a custom jobId or deduplication to avoid adding the same job twice." },
      { q: "How do you schedule repeating (cron) jobs in BullMQ?", a: "Use queue.upsertJobScheduler(id, { pattern } or { every }, template). Upsert means calling it again with the same id updates the schedule rather than duplicating it, so it is safe to run on every startup. In BullMQ v6 the old repeat option on queue.add() is no longer allowed. Remove with removeJobScheduler(id).", code: `await queue.upsertJobScheduler('daily-summary',
  { pattern: '0 8 * * *' },
  { name: 'send-summary', data: {} });` },
      { q: "How do you rate limit jobs in BullMQ?", a: "Pass limiter: { max, duration } to the Worker, for example { max: 100, duration: 1000 } for 100 jobs per second. The limit is shared by all workers of the queue because the counter is in Redis. It is used when jobs call third-party APIs with rate limits." },
      { q: "What are flows in BullMQ?", a: "With FlowProducer you add a tree of jobs: the parent waits in waiting-children until all children complete, then runs and can read their results with job.getChildrenValues(). Children can be in different queues. Example: transcode a video into 3 sizes in parallel, then send one notification." },
      { q: "Why does BullMQ need maxRetriesPerRequest: null and noeviction?", a: "Workers use blocking Redis commands to wait for jobs; with ioredis's default retry limit those commands would error out, so BullMQ requires maxRetriesPerRequest: null (it warns and overrides it). noeviction makes sure Redis never deletes queue keys under memory pressure; with an LRU policy you could silently lose jobs." },
      { q: "How do delayed jobs work internally?", a: "A delayed job is stored in a sorted set with the run time as its score. BullMQ moves jobs whose time has come back to the waiting list, so they are not processed early even if workers are idle. Retry backoff uses the same mechanism." },
      { q: "How do you shut down BullMQ workers safely during a deploy?", a: "On SIGTERM call await worker.close(): the worker stops taking new jobs and waits for active ones to finish. Then close queues and Redis connections and exit. Killing the process instead leaves active jobs that later become stalled and run again." },
      { q: "How do you show a long job's progress to the user?", a: "Return the job id from the API (HTTP 202). In the processor call job.updateProgress(percent). The client either polls an endpoint that returns job.getState() and job.progress, or the server listens to QueueEvents ('progress', 'completed', 'failed') and pushes updates over SSE or WebSocket.", code: `await job.updateProgress(50);
// server
queueEvents.on('progress', ({ jobId, data }) => sendSSE(jobId, data));` },
    ],
  },
  {
```

This adds the Redis & BullMQ questions to the last box (`/improvement` page). The section's own **Redis & BullMQ Questions** page reads the same list, so you only add it once.

---

## Step 6: Check

```bash
npm start
```

- The home page shows a new **Redis & BullMQ** card with 14 links.
- Every link opens its page.
- The last box shows a new **Redis & BullMQ** group with 35 questions.

**Nothing else changed.** No new packages to install.
