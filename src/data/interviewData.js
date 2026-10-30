// Technical Interview Q&A: answers in simple English, JavaScript examples where needed

export const interviewSections = [
  {
    title: "JavaScript",
    questions: [
      {
        q: "What is the difference between null and undefined?",
        a: "undefined means a variable was declared but no value was given yet, or a function returned nothing. null is a value you set on purpose to mean 'no value' or 'empty'. So undefined is 'not assigned'; null is 'explicitly empty'.",
        code: `let a;\nconsole.log(a);        // undefined\nlet b = null;\nconsole.log(b);        // null`
      },
      {
        q: "Explain the difference between var, let, and const",
        a: "var is function-scoped and can be redeclared; it is also hoisted. let and const are block-scoped (only inside {}). let can be reassigned; const cannot be reassigned (but you can still change properties of an object). Prefer const by default, use let when you need to reassign, avoid var in new code.",
        code: `let y = 1;\ny = 2;       // allowed\nconst z = 1;\nconst obj = { a: 1 };\nobj.a = 2;   // allowed`
      },
      {
        q: "What is temporal dead zone in JavaScript?",
        a: "The temporal dead zone (TDZ) is the time between when a block starts and when a let or const variable is declared. In that zone you cannot use the variable—accessing it throws a ReferenceError.",
        code: `console.log(a);  // ReferenceError (TDZ)\nlet a = 10;`
      },
      {
        q: "What is hoisting in JavaScript?",
        a: "Hoisting means that variable and function declarations are moved to the top of their scope by the engine before code runs. So you can call a function before its declaration in the code. var is hoisted (and initialized with undefined); let and const are hoisted but not initialized until their line (TDZ).",
        code: `sayHi();  // works: "Hi"\nfunction sayHi() { console.log("Hi"); }`
      },
      {
        q: "Explain event bubbling and capturing",
        a: "When you click an element, the event can be handled in two phases. Capturing: the event goes from the root down to the target. Bubbling: the event goes from the target back up to the root. By default handlers run in the bubbling phase.",
        code: `divInner.addEventListener('click', (e) => {\n  e.stopPropagation(); // stop bubbling\n});`
      },
      {
        q: "What is event delegation and why is it useful?",
        a: "Event delegation means you attach one listener to a parent and handle events from children. Because events bubble, the parent sees clicks on its children. This way you don't need a listener on every child—useful for dynamic lists.",
        code: `document.getElementById('list').addEventListener('click', (e) => {\n  if (e.target.matches('li')) console.log(e.target.textContent);\n});`
      },
      {
        q: "What are closures and how do they work?",
        a: "A closure is when a function remembers the variables from where it was created, even after that outer function has finished. The inner function 'closes over' those variables.",
        code: `function makeCounter() {\n  let count = 0;\n  return function () { return ++count; };\n}\nconst counter = makeCounter();\ncounter(); // 1\ncounter(); // 2`
      },
      {
        q: "Explain the 'this' keyword and its behavior",
        a: "this is the context in which a function runs. In a method it is the object. In a normal function call it is the global (or undefined in strict mode). Arrow functions don't have their own this—they use the this from the surrounding scope.",
        code: `const obj = {\n  name: 'Kartik',\n  greet() { console.log(this.name); }\n};\nobj.greet();  // Kartik\nconst g = obj.greet;\ng();  // undefined - this is lost`
      },
      {
        q: "What is function currying?",
        a: "Currying is when a function that takes multiple arguments is turned into a sequence of functions that each take one argument. So instead of f(a, b, c) you get f(a)(b)(c).",
        code: `function add(a) {\n  return function (b) { return a + b; };\n}\nconst add5 = add(5);\nadd5(3);  // 8`
      },
      {
        q: "Difference between arrow functions and regular functions",
        a: "Arrow functions don't have their own this (they use the outer this), don't have arguments, and can't be used as constructors (no new). Regular functions have their own this and arguments.",
        code: `const obj = {\n  regular: function () { console.log(this); },\n  arrow: () => console.log(this)\n};\nobj.regular();  // obj\nobj.arrow();   // outer this`
      },
      {
        q: "Difference between map, forEach, filter, and reduce",
        a: "map returns a new array by transforming each element. forEach runs a function on each element but returns undefined. filter returns a new array with only elements that pass a test. reduce turns the array into a single value.",
        code: `[1,2,3].map(x => x * 2);     // [2,4,6]\n[1,2,3].filter(x => x > 1);  // [2,3]\n[1,2,3].reduce((a,b) => a + b, 0);  // 6`
      },
      {
        q: "Explain shallow copy vs deep copy",
        a: "Shallow copy copies the top level only. Nested objects or arrays are still shared. Deep copy copies every level so nothing is shared. Use spread for shallow; use JSON.parse(JSON.stringify(obj)) or structuredClone(obj) for deep (when safe).",
        code: `const shallow = { ...original };\nconst deep = structuredClone(original);`
      },
      {
        q: "What is the difference between Promise and async/await?",
        a: "Both handle asynchronous work. Promises use .then() and .catch(). async/await lets you write async code like normal code: you await a Promise and use try/catch for errors. Under the hood async/await uses Promises.",
        code: `async function getData() {\n  try {\n    const res = await fetch(url);\n    return await res.json();\n  } catch (err) { console.error(err); }\n}`
      },
      {
        q: "Explain Promise.all(), Promise.race(), Promise.allSettled()",
        a: "Promise.all waits for all to succeed; if any fails, it rejects. Promise.race settles when the first Promise settles. Promise.allSettled waits for all and returns an array of { status, value/reason } for each.",
        code: `Promise.all([p1, p2]).then(([a,b]) => console.log(a,b));\nPromise.race([p1, p2]).then(r => r);`
      },
      {
        q: "What is callback hell and how to avoid it?",
        a: "Callback hell is when you nest many callbacks, making code hard to read. Avoid it by using Promises and async/await, or by using named functions instead of nesting.",
        code: `async function run() {\n  const a = await getData();\n  const b = await getMore(a);\n  return b;\n}`
      },
      {
        q: "How does event loop work in JavaScript?",
        a: "JavaScript runs in a single thread. When you start an async task, the browser or Node does it in the background. When it finishes, the callback is put in a queue. The event loop runs callbacks when the call stack is empty. Microtasks (Promises) run before macrotasks (setTimeout).",
        code: `console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');\n// Output: 1, 4, 3, 2`
      },
      {
        q: "What are microtasks and macrotasks?",
        a: "Macrotasks are setTimeout, setInterval, I/O. Microtasks are Promise callbacks and queueMicrotask. The event loop runs all microtasks after each macrotask before the next macrotask.",
      },
      {
        q: "How to check if an object is empty?",
        a: "Check that the object has no own keys: Object.keys(obj).length === 0.",
        code: `function isEmpty(obj) {\n  return Object.keys(obj).length === 0;\n}`
      },
      {
        q: "What is object destructuring?",
        a: "Destructuring lets you take properties from an object and assign them to variables in one line. You can rename with colon and set defaults with =.",
        code: `const { name, age } = user;\nconst { name: n, city = 'Mumbai' } = user;`
      },
      {
        q: "Implement debounce function",
        a: "Debounce returns a function that waits for a delay. If it is called again before the delay ends, the timer resets. Only after the user stops calling for that delay does the original function run.",
        code: `function debounce(fn, delay) {\n  let timerId;\n  return function (...args) {\n    clearTimeout(timerId);\n    timerId = setTimeout(() => fn.apply(this, args), delay);\n  };\n}`
      },
      {
        q: "What is Virtual DOM?",
        a: "The Virtual DOM is a lightweight copy of the real DOM kept in memory (as plain JavaScript objects). When state changes, the library builds a new virtual DOM, compares it with the previous one (diffing), and updates only the changed parts in the real DOM. This reduces expensive DOM operations."
      },
      {
        q: "Explain createElement vs innerHTML",
        a: "createElement creates real DOM nodes step by step; it is safe from XSS because you don't inject raw HTML. innerHTML sets HTML as a string; it is faster for big chunks but dangerous if the string comes from users (XSS). Use createElement or textContent for safe content."
      },
      {
        q: "What is memoization?",
        a: "Memoization means storing the result of an expensive function for given inputs and returning that stored result when the same inputs come again. It avoids repeating the same work. Often done with a cache object keyed by arguments."
      },
      {
        q: "How to handle memory leaks?",
        a: "Avoid keeping references to DOM nodes or large data when you don't need them. Clear intervals and timeouts in cleanup. Remove event listeners when the component unmounts. In React, clear subscriptions and timers in useEffect's return function."
      },
      {
        q: "Different types of errors in JavaScript",
        a: "SyntaxError (invalid syntax), ReferenceError (variable not found), TypeError (wrong type, e.g. calling undefined), RangeError (e.g. invalid array length). You can also throw your own errors with throw new Error('message')."
      },
      {
        q: "What are template literals?",
        a: "Template literals use backticks and ${} to embed expressions in a string. They support multi-line strings and are easier to read than concatenation.",
        code: `const name = 'Kartik';\nconst msg = \`Hello, \${name}!\`;\nconst multi = \`Line 1\nLine 2\`;`
      },
      {
        q: "What are Sets and Maps?",
        a: "Set stores unique values (no duplicates). Map stores key-value pairs; keys can be any type (unlike objects where keys are strings/symbols). Both preserve insertion order.",
        code: `const set = new Set([1, 2, 2, 3]);  // Set(3) { 1, 2, 3 }\nconst map = new Map([['a', 1], ['b', 2]]);\nmap.get('a');  // 1`
      },
      {
        q: "What is the Fetch API?",
        a: "Fetch is a browser API to make HTTP requests. It returns a Promise that resolves to the Response. You call .json() or .text() on the response to get the body. Use try/catch or .catch() for errors.",
        code: `const res = await fetch(url);\nconst data = await res.json();`
      },
      {
        q: "What is CORS?",
        a: "CORS (Cross-Origin Resource Sharing) is a browser rule: a page on one origin (domain/port) can only call an API on another origin if the server sends the right headers (e.g. Access-Control-Allow-Origin). Without it, the browser blocks the response for security."
      },
      {
        q: "What are cookies? How to set/get them?",
        a: "Cookies are small pieces of data the server asks the browser to store and send back with every request to that domain. You can set them via Set-Cookie header (server) or document.cookie (client). Get with document.cookie (returns a string of all cookies)."
      },
    ],
  },
  {
    title: "React.js",
    questions: [
      { q: "Functional vs Class Components", a: "Functional components are plain functions that take props and return JSX. Class components extend React.Component and can have state and lifecycle methods. React now prefers functional components with Hooks (useState, useEffect) instead of class state and lifecycles." },
      { q: "useMemo in React", a: "useMemo lets you remember a computed value. You pass a function and a dependency array; React recomputes only when a dependency changes. Use it to avoid expensive calculations on every render." },
      { q: "React Performance Optimization", a: "Use React.memo for components that re-render often with the same props. Use useMemo for expensive computations and useCallback for callbacks passed to memoized children. Use code splitting (lazy) for big chunks." },
      { q: "Props in React", a: "Props are inputs passed from parent to child. They are read-only; the child must not change them. You pass props as attributes in JSX and receive them as the first argument in a function component." },
      { q: "Error Boundaries", a: "Error boundaries are class components that use getDerivedStateFromError and componentDidCatch to catch JavaScript errors in the tree below them. They show a fallback UI instead of crashing the whole app. They don't catch errors in event handlers or async code." },
      { q: "Server-Side Rendering", a: "SSR means the server generates HTML for each request so the user sees content sooner. In React you use a framework like Next.js or renderToString from react-dom/server. Then the client 'hydrates' the page to make it interactive." },
      { q: "React Children Props", a: "children is a special prop: whatever you put between the opening and closing tags of a component is passed as props.children. So <Card>Hello</Card> gives Card props.children === 'Hello'." },
      { q: "What is a Reference in React?", a: "A ref (useRef or createRef) holds a mutable value that persists across renders. Often ref.current is set to a DOM node so you can focus it or call imperative methods. Refs don't trigger re-renders when they change." },
      { q: "useRef in React", a: "useRef(initialValue) returns an object { current: initialValue }. Updating .current does not cause a re-render. Common uses: storing a DOM node, keeping a previous value, or holding a timer/id for cleanup." },
      { q: "What is Flux?", a: "Flux is an architecture pattern: data flows in one direction. Actions go to a Dispatcher, then to Stores, then the View updates. Redux is inspired by Flux but with a single store and reducers." },
    ],
  },
  {
    title: "Node.js & Express",
    questions: [
      { q: "Cluster in Node.js", a: "The cluster module lets you run multiple processes that share the same server port so you use more than one CPU core. The primary process forks workers; each worker runs your app. If one crashes, you can restart it." },
      { q: "Middleware in Express", a: "Middleware is a function that runs between receiving the request and sending the response. It has access to req, res, and next. It can change req/res, end the request, or call next() to pass control to the next middleware. Examples: body parser, auth check, logging." },
      { q: "Async/Await in Node.js", a: "Node supports async/await. Use it in route handlers and other async code. Always use try/catch or .catch() so Promise rejections don't crash the process." },
      { q: "Event Loop", a: "Node's event loop handles I/O without blocking. When you start an async operation, Node runs it in the background and runs your callback when it's done. So one thread can serve many requests." },
    ],
  },
  {
    title: "MongoDB & MySQL",
    questions: [
      { q: "LEFT JOIN in SQL", a: "LEFT JOIN returns all rows from the left table and matching rows from the right table. If there is no match on the right, those columns are NULL. Use it when you want to keep all records from the left table." },
      { q: "Inner Join vs Left Join", a: "INNER JOIN returns only rows where there is a match in both tables. LEFT JOIN returns all rows from the left table and matching rows from the right (NULLs when no match)." },
      { q: "Indexes in MySQL", a: "An index speeds up search and sort on a column. Without an index the database scans the whole table. Create indexes on columns you filter or join on. Too many indexes slow down writes." },
      { q: "MongoDB Aggregate Functions", a: "Aggregation in MongoDB processes documents in stages (pipeline). You use $match, $group, $sort, $project. $group often uses $sum, $avg, $min, $max. So you can do 'group by category and count' or 'average price per region'." },
      { q: "ACID Properties in Database", a: "ACID means: Atomicity (transaction is all or nothing), Consistency (rules stay valid), Isolation (concurrent transactions don't see uncommitted data), Durability (once committed, data survives a crash)." },
      { q: "Difference between MongoDB and MySQL", a: "MongoDB is a NoSQL document store; data is in JSON-like documents. MySQL is a relational database with tables and rows. MongoDB is flexible for changing schemas; MySQL is good for structured data and complex queries with JOINs." },
    ],
  },
  {
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
    title: "NestJS",
    questions: [
      { q: "What is NestJS and why use it over Express?", a: "NestJS is a TypeScript framework on top of Express (or Fastify) that gives a fixed architecture of modules, controllers, providers and dependency injection, so large apps stay organised and testable." },
      { q: "What are the 3 core building blocks of NestJS?", a: "Module groups a feature, Controller handles HTTP requests and responses, Provider (service) holds the business logic and is injected where needed." },
      { q: "What is Dependency Injection in NestJS?", a: "A class declares what it needs in its constructor and Nest's IoC container creates and passes those instances, so classes are loosely coupled and dependencies can be swapped with mocks in tests.", code: `@Injectable()
export class OrdersService {
  constructor(private readonly payments: PaymentService) {}
}` },
      { q: "What does @Injectable() do?", a: "It marks a class as a provider so Nest can manage it and inject its constructor dependencies." },
      { q: "What is the difference between providers and exports in a module?", a: "providers are created and available inside the module; exports is the subset other modules can use when they import it, because providers are private by default." },
      { q: "What is a global module?", a: "A module marked @Global() whose exported providers are available everywhere without importing it; use it only for app-wide things like config, database or logger." },
      { q: "What is a dynamic module (forRoot / forFeature / forRootAsync)?", a: "A module that builds its providers from options at runtime: forRoot configures once, forFeature registers per feature module, forRootAsync gets its options from other providers like ConfigService.", code: `TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (c: ConfigService) => ({ type: 'postgres', url: c.get('DATABASE_URL') }),
})` },
      { q: "What are the types of custom providers?", a: "useValue (a fixed value), useClass (choose a class), useFactory (build with a function, can be async and inject others) and useExisting (an alias for another provider)." },
      { q: "Why can't you inject an interface directly?", a: "Interfaces are removed after TypeScript compiles, so Nest has no runtime token; use a string or Symbol token with @Inject(TOKEN).", code: `providers: [{ provide: PAYMENT_GATEWAY, useClass: StripeGateway }]
constructor(@Inject(PAYMENT_GATEWAY) private gateway: PaymentGateway) {}` },
      { q: "What are provider scopes?", a: "DEFAULT is a singleton for the whole app, REQUEST creates a new instance per request (and makes everything that injects it request-scoped), TRANSIENT gives each consumer its own instance." },
      { q: "Explain the NestJS request lifecycle order.", a: "Middleware → Guards → Interceptors (before) → Pipes → Controller → Service → Interceptors (after) → Exception Filters if anything throws." },
      { q: "Middleware vs Guard: which one for authentication?", a: "A guard, because it runs with the ExecutionContext and knows the target handler and its metadata (@Public, @Roles), while middleware does not know which handler will run." },
      { q: "What is a Guard?", a: "A class with canActivate() that returns true to allow the request or false to block it with 403; used for authentication and authorization." },
      { q: "How do you implement role-based access control?", a: "Attach roles to routes with a custom decorator (SetMetadata) and read them in a guard with Reflector.getAllAndOverride, comparing them to req.user.roles.", code: `export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);

const required = this.reflector.getAllAndOverride<Role[]>('roles', [ctx.getHandler(), ctx.getClass()]);` },
      { q: "What is an Interceptor used for?", a: "It wraps the handler with before and after logic using RxJS, so it can transform responses, log timing, add timeouts or serve from cache." },
      { q: "What is a Pipe?", a: "A class that runs just before the handler to transform input (ParseIntPipe) or validate it (ValidationPipe), throwing 400 if it is invalid." },
      { q: "What is a DTO and why a class instead of an interface?", a: "A DTO describes incoming data; it must be a class because class-validator needs a runtime class to read the validation decorators from." },
      { q: "What do whitelist, forbidNonWhitelisted and transform do in ValidationPipe?", a: "whitelist strips fields without decorators, forbidNonWhitelisted returns 400 for them instead, and transform turns the payload into a DTO instance with converted types." },
      { q: "What is an Exception Filter?", a: "A class with @Catch() that catches thrown exceptions and builds the error response, used to give the whole API one consistent error format." },
      { q: "What happens if a service throws a normal Error?", a: "Nest's built-in filter returns 500 Internal Server Error without leaking the message; throw an HttpException subclass like NotFoundException for a proper status." },
      { q: "Why register global guards/pipes/filters with APP_GUARD etc. instead of app.useGlobal*()?", a: "Registering through APP_GUARD, APP_PIPE, APP_INTERCEPTOR or APP_FILTER in a module lets the class use dependency injection; app.useGlobal*() in main.ts is created outside the DI container." },
      { q: "What is ExecutionContext?", a: "An object passed to guards, interceptors and filters that gives the request plus the handler and class, and works the same for HTTP, WebSocket and microservice contexts." },
      { q: "What is Reflector?", a: "A helper service to read metadata set by decorators (like @Roles) from the handler or controller inside guards and interceptors." },
      { q: "How do you create a custom param decorator like @CurrentUser()?", a: "Use createParamDecorator and return the value from the request inside it.", code: `export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user,
);` },
      { q: "What is applyDecorators?", a: "It combines several decorators into one reusable decorator, like @AdminOnly() = @Roles + @UseGuards + @ApiBearerAuth." },
      { q: "How does JWT authentication work in NestJS?", a: "Login signs a JWT with JwtService; on each request a Passport JwtStrategy verifies the token and its validate() return value becomes req.user, enforced by AuthGuard('jwt')." },
      { q: "How do you protect all routes by default?", a: "Register the JWT guard globally with APP_GUARD and skip it on open routes with a @Public() metadata decorator checked in the guard." },
      { q: "How do you hide the password field from responses?", a: "Mark it @Exclude() on the entity and enable ClassSerializerInterceptor, which strips excluded fields from returned class instances." },
      { q: "What are lifecycle hooks?", a: "Methods Nest calls at fixed moments: onModuleInit, onApplicationBootstrap, onModuleDestroy, beforeApplicationShutdown and onApplicationShutdown (the shutdown ones need app.enableShutdownHooks())." },
      { q: "How do you handle circular dependencies?", a: "Use forwardRef(() => X) on both sides, but the better fix is moving the shared logic into a third module or service." },
      { q: "How do you resolve 'Nest can't resolve dependencies of X'?", a: "Make sure the dependency is in its module's providers, is exported from that module, and that module is imported where X lives." },
      { q: "How do you use transactions with TypeORM in NestJS?", a: "Wrap the writes in dataSource.transaction(async (manager) => ...) and use that manager for every query so they all commit or roll back together." },
      { q: "Why should synchronize be false in production?", a: "It auto-alters tables to match entities and can drop columns or data; use reviewed migrations instead." },
      { q: "How do you manage configuration in NestJS?", a: "Use ConfigModule.forRoot({ isGlobal: true, validationSchema }) to load and validate env at startup, then inject ConfigService instead of reading process.env everywhere." },
      { q: "How do you unit test a service that uses a repository?", a: "Build a testing module with Test.createTestingModule and provide a mock for getRepositoryToken(Entity) with useValue.", code: `providers: [UsersService, { provide: getRepositoryToken(User), useValue: { findOneBy: jest.fn() } }]` },
      { q: "@Cron runs multiple times when you scale to 3 instances. Why and how to fix?", a: "Each instance runs its own scheduler; use a BullMQ job scheduler or a Redis lock so only one instance runs the job." },
      { q: "Event emitter vs BullMQ queue?", a: "Event emitter is in-memory and loses events if the process crashes; a BullMQ queue stores jobs in Redis with retries, so use it for work that must not be lost." },
      { q: "@MessagePattern vs @EventPattern in microservices?", a: "@MessagePattern is request-response (caller uses send() and waits for a reply); @EventPattern is fire-and-forget (caller uses emit(), no reply)." },
      { q: "Express vs Fastify adapter in NestJS?", a: "Express is the default with the biggest middleware ecosystem; Fastify gives higher throughput if you do not depend on Express-only middleware." },
      { q: "Why avoid @Res() in controllers?", a: "Injecting @Res() makes you responsible for sending the response and breaks interceptors; use @Res({ passthrough: true }) if you only need to set cookies or headers." },
    ],
  },
  {
    title: "DSA - Array",
    questions: [
      { q: "Reverse an array", a: "Swap elements from both ends moving inward using two pointers (left and right).", code: `function reverse(arr) {\n  let left = 0, right = arr.length - 1;\n  while (left < right) {\n    [arr[left], arr[right]] = [arr[right], arr[left]];\n    left++; right--;\n  }\n  return arr;\n}` },
      { q: "Find the maximum element in an array", a: "Loop through and keep the largest value seen. Or use Math.max(...arr).", code: `let m = arr[0];\nfor (const n of arr) if (n > m) m = n;\nreturn m;` },
      { q: "Find the minimum element in an array", a: "Same as max but keep the smallest. Or use Math.min(...arr)." },
      { q: "Find the sum of all elements in an array", a: "Use reduce to add all numbers.", code: `const sum = arr.reduce((acc, n) => acc + n, 0);` },
      { q: "Remove duplicates from an array", a: "Use a Set to keep unique values.", code: `const unique = [...new Set(arr)];` },
      { q: "Two-sum: two numbers that add up to a target", a: "Use a Map: for each number, check if (target - number) is already seen; if yes return true.", code: `function twoSum(arr, target) {\n  const seen = new Map();\n  for (const n of arr) {\n    if (seen.has(target - n)) return true;\n    seen.set(n, true);\n  }\n  return false;\n}` },
      { q: "Maximum sum of contiguous subarray (Kadane's Algorithm)", a: "Keep current sum and max sum. For each element, either add it to current or start fresh. Update max when current is larger.", code: `let maxSum = arr[0], curr = arr[0];\nfor (let i = 1; i < arr.length; i++) {\n  curr = Math.max(arr[i], curr + arr[i]);\n  maxSum = Math.max(maxSum, curr);\n}\nreturn maxSum;` },
      { q: "Binary search on a sorted array", a: "Keep left and right. Compare target with mid; if equal return mid; if target < mid search left, else search right.", code: `function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (target < arr[mid]) right = mid - 1;\n    else left = mid + 1;\n  }\n  return -1;\n}` },
      { q: "Rotate an array by k positions", a: "Reverse the whole array, then reverse first k elements, then reverse the rest.", code: `const reverse = (a, i, j) => { while (i < j) [a[i], a[j]] = [a[j], a[i]], i++, j--; };\nreverse(arr, 0, arr.length - 1);\nreverse(arr, 0, k - 1);\nreverse(arr, k, arr.length - 1);` },
      { q: "Find the occurrence of an integer in the array", a: "Loop and count how many times the number appears, or use reduce.", code: `arr.filter(x => x === target).length;` },
      { q: "Merge two sorted arrays", a: "Use two pointers; at each step pick the smaller of the two current elements and push to result.", code: `const merge = (a, b) => {\n  const out = []; let i = 0, j = 0;\n  while (i < a.length && j < b.length)\n    out.push(a[i] <= b[j] ? a[i++] : b[j++]);\n  return out.concat(a.slice(i), b.slice(j));\n};` },
      { q: "Sort array of 0s, 1s, and 2s (Dutch National Flag)", a: "Use three pointers: low, mid, high. Keep 0s at left, 2s at right, 1s in middle. Swap based on value at mid." },
      { q: "Find the missing number in an array of n-1 integers (1 to n)", a: "Sum of 1 to n is n*(n+1)/2. Subtract the sum of the array to get the missing number.", code: `const n = arr.length + 1;\nconst total = (n * (n + 1)) / 2;\nreturn total - arr.reduce((a, b) => a + b, 0);` },
      { q: "Check if an array is sorted", a: "Loop and check that every element is less than or equal to the next (for ascending).", code: `for (let i = 0; i < arr.length - 1; i++)\n  if (arr[i] > arr[i + 1]) return false;\nreturn true;` },
      { q: "Find the average of all elements in an array", a: "Sum all elements and divide by length.", code: `arr.reduce((a, b) => a + b, 0) / arr.length` },
      { q: "Move all negative elements to one side of the array", a: "Use two pointers or partition like in Quick Sort: keep a pointer for the position where the next negative should go; swap when you find a negative." },
      { q: "Find duplicates in an array", a: "Use a Set: if you've seen the number before, it's a duplicate. Or sort and check adjacent pairs.", code: `const seen = new Set();\nconst dupes = [];\nfor (const n of arr) {\n  if (seen.has(n)) dupes.push(n);\n  else seen.add(n);\n}` },
      { q: "Find the first repeating element", a: "Loop and keep a Set of seen elements. The first time you see an element that's already in the Set, return it." },
      { q: "Find the first non-repeating element", a: "Count frequency of each element (object or Map). Then loop again and return the first element with count 1." },
      { q: "Find Kth largest and Kth smallest", a: "Sort the array and pick the kth from the end (largest) or start (smallest). For better time, use a heap or quick-select." },
      { q: "Subarray with given sum", a: "Sliding window or prefix sum + Map. For positive numbers only, expand window when sum is less than target, shrink when more." },
      { q: "Find all pairs that sum to a specific value", a: "Use a Map: for each element, check if (target - element) exists in the Map; if yes you have a pair. Store each number in the Map as you go." },
      { q: "Flatten a nested array", a: "Use recursion or flat(). For one level: arr.flat(). For any depth: arr.flat(Infinity) or a recursive function that concatenates flattened children." },
      { q: "Shuffle an array randomly", a: "Fisher-Yates: for i from end to 1, pick a random index j from 0 to i, swap arr[i] and arr[j].", code: `for (let i = arr.length - 1; i > 0; i--) {\n  const j = Math.floor(Math.random() * (i + 1));\n  [arr[i], arr[j]] = [arr[j], arr[i]];\n}` },
    ],
  },
  {
    title: "DSA - String",
    questions: [
      { q: "Reverse a string", a: "Split into array, reverse, join.", code: `str.split('').reverse().join('');` },
      { q: "Check if a string is a palindrome", a: "Compare characters from both ends moving inward. Ignore non-alphanumeric if required.", code: `s = s.replace(/[^a-z0-9]/gi, '').toLowerCase();\nlet left = 0, right = s.length - 1;\nwhile (left < right) {\n  if (s[left] !== s[right]) return false;\n  left++; right--;\n}\nreturn true;` },
      { q: "Find the first non-repeating character", a: "Count frequency of each character, then loop and return the first with count 1.", code: `const count = {};\nfor (const c of str) count[c] = (count[c] || 0) + 1;\nfor (const c of str) if (count[c] === 1) return c;\nreturn null;` },
      { q: "Check if two strings are anagrams", a: "Count frequency of each character in both strings and compare counts.", code: `if (a.length !== b.length) return false;\nconst count = {};\nfor (const c of a) count[c] = (count[c] || 0) + 1;\nfor (const c of b) {\n  if (!count[c]) return false;\n  count[c]--;\n}\nreturn true;` },
      { q: "Count vowels and consonants in a string", a: "Loop and check each character; use a set of vowels and increment vowel or consonant counter.", code: `const vowels = new Set('aeiouAEIOU');\nlet v = 0, c = 0;\nfor (const ch of str)\n  if (ch.match(/[a-z]/i)) vowels.has(ch) ? v++ : c++;` },
      { q: "Reverse the words in a string", a: "Split by spaces, reverse the array of words, join back with space.", code: `str.split(' ').filter(Boolean).reverse().join(' ');` },
      { q: "Longest substring without repeating characters", a: "Use a sliding window and a Set. Expand right; if you see a duplicate, move left until the duplicate is removed. Track max length.", code: `let max = 0, set = new Set(), left = 0;\nfor (let right = 0; right < s.length; right++) {\n  while (set.has(s[right])) set.delete(s[left++]);\n  set.add(s[right]);\n  max = Math.max(max, right - left + 1);\n}\nreturn max;` },
      { q: "Check if a string contains only digits", a: "Use regex or loop and check each character.", code: `const onlyDigits = /^\\d+$/.test(str);` },
      { q: "Longest common prefix of an array of strings", a: "Take the first string as initial prefix. For each next string, shorten the prefix until it matches the start of that string. Return the final prefix." },
      { q: "Find first occurrence of a substring (strstr)", a: "Loop through the main string; at each position check if the substring matches starting there. Or use indexOf.", code: `str.indexOf(substr);  // returns -1 if not found` },
      { q: "Count occurrences of a character in a string", a: "Loop and count, or split by the character and use length - 1.", code: `str.split('a').length - 1` },
      { q: "Check if two strings are rotations of each other", a: "If s2 is a rotation of s1, then s2 will be a substring of s1 + s1. So return (s1 + s1).includes(s2) && s1.length === s2.length." },
      { q: "Remove white spaces from a string", a: "Use replace with a regex that matches spaces, or split by spaces and join.", code: `str.replace(/\\s/g, '');` },
      { q: "Capitalize first letter of each word", a: "Split by space, map each word to word[0].toUpperCase() + word.slice(1).toLowerCase(), join.", code: `str.split(' ').map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ');` },
    ],
  },
];
