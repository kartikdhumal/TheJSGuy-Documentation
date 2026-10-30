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
      { q: "What is Redis and why is it so fast?", a: "Redis is a key-value store that keeps all its data in memory (RAM). It's fast for a few simple reasons: reading from RAM is much faster than reading from disk, commands run one by one on a single main thread (so no locks and no thread switching), it uses non-blocking I/O with an event loop like Node.js, and most of its commands are O(1) or O(log n). A normal read usually takes less than 1 ms." },
      { q: "Is Redis single-threaded? Then how does it handle thousands of clients?", a: "Yes, commands run on one main thread, one at a time. That's actually nice, because it means every single command is atomic (it runs fully, nothing else gets in the middle). It still handles thousands of clients because it uses an event loop with non-blocking I/O, just like Node.js, and each command finishes very quickly. Since Redis 6, extra I/O threads can read and write network data, but running the commands is still single-threaded. The catch: one slow command (KEYS *, deleting a huge key with DEL, a long Lua script) makes everyone else wait." },
      { q: "What are the Redis data types and when do you use each?", a: "String: cached values, JSON, counters (INCR) and flags. Hash: an object where you read or change fields one by one, like a user profile. List: items in order, like a recent-items feed or a simple queue (LPUSH/BRPOP). Set: unique values and quick 'is it in there?' checks, like who liked a post or tags. Sorted Set: members sorted by a score, great for leaderboards, rankings and time-ordered data. There are also Streams (an event log with consumer groups), Bitmaps, HyperLogLog (rough count of unique items) and Geospatial (locations)." },
      { q: "Should I store an object as a JSON string or as a Hash?", a: "It depends on how you use it. A JSON string is simple: one GET or SET, good when you always read and write the whole object. A Hash lets you read or change just one field (HGET, HSET, HINCRBY) without loading and rewriting the whole thing, and it's safer when different requests update different fields at the same time. So use a Hash for objects whose fields change separately, and JSON for cached responses that you mostly just read.", code: `SET user:101 '{"name":"Kartik","city":"Surat"}'
HSET user:101 name "Kartik" city "Surat"
HSET user:101 city "Pune"     // update one field only` },
      { q: "Redis vs Memcached", a: "Both keep data in memory and are used as caches. Memcached only stores strings, is multi-threaded, and has no built-in persistence (saving to disk) or replication. Redis has many data types (lists, sets, sorted sets, streams), persistence (RDB/AOF), replication, Sentinel, Cluster, Pub/Sub, transactions and Lua scripts. Today Redis is the usual pick, unless you only need a very simple multi-threaded string cache." },
      { q: "How does key expiry (TTL) work and how are expired keys removed?", a: "You give a key a TTL (time to live) with EX/PX on SET or with EXPIRE, and Redis deletes it after that time. It removes expired keys in two ways together. Lazy expiry: when you touch a key, Redis checks it and deletes it if it's expired. Active expiry: a background job keeps checking random keys that have a TTL and deletes the expired ones. You will never get back an expired key, but its memory may be freed a bit later. TTL returns -1 if the key has no expiry and -2 if the key doesn't exist.", code: `SET otp:101 482913 EX 300
TTL otp:101        // 295
PERSIST otp:101    // remove expiry` },
      { q: "What happens when Redis runs out of memory? Explain eviction policies.", a: "If you set maxmemory, Redis follows the maxmemory-policy when it gets full. Eviction just means Redis deletes some keys to make room. noeviction (the default) doesn't delete anything, it just returns an error on writes. allkeys-lru removes the key that was used least recently (best for a cache). volatile-lru does the same, but only for keys that have a TTL. allkeys-lfu / volatile-lfu remove the key that is used least often. allkeys-random / volatile-random remove a random key. volatile-ttl removes the key that is closest to expiring. Use noeviction when Redis holds queues (like BullMQ), and an LRU or LFU policy when it's only a cache." },
      { q: "Explain the cache-aside pattern.", a: "The app checks Redis first. If the data is there (a hit), it returns it. If not (a miss), it reads from the database, saves the result in Redis with a TTL, and returns it. This way only data that people actually ask for gets cached, and if Redis goes down the app can still read from the database.", code: `const cached = await redis.get(key);
if (cached) return JSON.parse(cached);
const data = await db.find(id);
await redis.set(key, JSON.stringify(data), 'EX', 600);
return data;` },
      { q: "How do you keep the cache consistent with the database?", a: "When data changes, update the database first, then delete the cache key (don't update it). The next read will load fresh data. Deleting is safer because if two updates happen at the same time, they could write the cache in the wrong order. Always keep a TTL as a backup, so if you ever forget to clear a key, it fixes itself later. If you need it stricter, send change events so every service clears its own cache." },
      { q: "What are cache stampede, cache penetration and cache avalanche?", a: "Stampede: a popular key expires, and lots of requests miss at the same moment and all hit the database. Fix: let only one request rebuild it using a short lock, or refresh popular keys before they expire. Penetration: requests ask for data that doesn't exist, so they always miss and always hit the database. Fix: cache the 'not found' result for a short time and validate the input. Avalanche: lots of keys expire at the same time. Fix: add a small random value (jitter) to each TTL." },
      { q: "RDB vs AOF persistence", a: "Both are ways to save Redis data to disk. RDB takes a snapshot of all the data every so often (using a forked child process). The file is small and restarts are fast, but you can lose a few minutes of writes. AOF writes down every write command and replays them on restart. With appendfsync everysec you lose at most about 1 second, but the file is bigger and restarts are slower (Redis shrinks it with an AOF rewrite). In production, if you care about the data, you usually turn on both. A pure cache can run with no persistence at all." },
      { q: "Pub/Sub vs Streams", a: "Pub/Sub is like a live radio: messages are not saved, everyone listening right now gets them, and anyone offline misses them (at-most-once). Streams are a saved log: messages are stored, consumer groups split the work between workers, workers confirm with XACK, and messages that aren't confirmed stay pending so they can be retried (at-least-once). Use Pub/Sub for live notifications, and Streams for events you can't afford to lose." },
      { q: "How do transactions work in Redis? Is there a rollback?", a: "MULTI starts queueing commands and EXEC runs them all together, with no other client's command in between. There is no rollback: if one command fails while running, the others still run. You also can't use one command's result to decide the next one inside MULTI. WATCH adds optimistic locking: if a watched key changes before EXEC, the whole transaction is cancelled (EXEC returns null) and you try again.", code: `WATCH stock:5
MULTI
DECR stock:5
EXEC   // null if stock:5 changed after WATCH` },
      { q: "Pipelining vs transactions", a: "Pipelining is about speed, transactions are about running things together. Pipelining sends many commands in one network trip, but other clients' commands can still run in between, so it's not atomic. MULTI/EXEC runs the queued commands together without anything else in the middle. You can also use both at once: ioredis sends a MULTI block as one pipeline." },
      { q: "Why and when would you use Lua scripts in Redis?", a: "A Lua script (EVAL) runs inside Redis as one atomic step, so you can read a value, decide something, and write, with nothing else running in between, all in one network trip. It's simpler than using WATCH and retrying. Use it for 'check then change' logic like 'reduce stock only if enough is left', safely releasing a lock, or token-bucket rate limiting. Keep scripts short, because Redis can't do anything else while a script runs. BullMQ uses Lua scripts to move jobs between states safely." },
      { q: "How do you implement a distributed lock with Redis?", a: "Use SET lock:name <unique-token> NX PX 30000. NX means 'only set it if nobody has it', and PX makes it auto-release after a while in case the holder crashes. To release it, use a Lua script that deletes the key only if the value is still your token, so you never delete a lock that someone else took after yours expired. For locks across several Redis nodes there's Redlock, but people argue about whether it's safe. For money-critical stuff, add fencing tokens or use database locks instead.", code: `const ok = await redis.set('lock:report', token, 'PX', 30000, 'NX');
if (!ok) return;   // someone else has it
// release: delete only if value === token (Lua)` },
      { q: "How do you build a rate limiter with Redis?", a: "The simple way is a fixed window: INCR a key for each user for each time window, and set EXPIRE on the first request. If the count goes over the limit, block the request. INCR is atomic, so requests coming in at the same time are counted correctly, but someone can send double the limit around the edge of two windows. A sliding window fixes that: save each request's timestamp in a sorted set, remove the old ones (ZREMRANGEBYSCORE), and count what's left (ZCARD). Token bucket and leaky bucket are usually built with a Lua script.", code: `const count = await redis.incr(\`rate:\${ip}\`);
if (count === 1) await redis.expire(\`rate:\${ip}\`, 60);
if (count > 5) return res.status(429).end();` },
      { q: "How do you build a leaderboard?", a: "Use a sorted set. ZADD or ZINCRBY sets or increases a player's score, ZREVRANGE ... WITHSCORES gives you the top N, ZREVRANK gives a player's position, and ZSCORE gives their score. All of these are O(log n), so it stays fast even with millions of players.", code: `ZINCRBY leaderboard 50 "kartik"
ZREVRANGE leaderboard 0 9 WITHSCORES   // top 10
ZREVRANK leaderboard "kartik"          // position` },
      { q: "Replication vs Sentinel vs Cluster", a: "Replication: one master takes the writes, and replicas copy its data in the background (asynchronously) and can handle reads. Sentinel: a few watcher processes (at least 3) that notice when the master dies and automatically promote a replica to be the new master. That's high availability. Cluster: splits the data across several masters using 16,384 hash slots, with failover built in, for when your data or traffic is too big for one machine. So Replication + Sentinel = high availability, and Cluster = scaling out + high availability." },
      { q: "What are hash slots and hash tags in Redis Cluster?", a: "A cluster has 16,384 slots. Each key goes to slot CRC16(key) mod 16384, and each master owns a range of slots. Commands that use several keys (MGET, MULTI, Lua) only work if all those keys are in the same slot. A hash tag makes that happen: only the part inside {} is used for hashing, so user:{101}:cart and user:{101}:profile always land in the same slot." },
      { q: "Why should you not use KEYS * in production?", a: "KEYS goes through every key in one go and blocks the single command thread, so with millions of keys Redis freezes for everyone. Use SCAN instead. It walks through the keys in small batches using a cursor and never blocks for long. In the same way, delete big keys with UNLINK (it frees the memory in the background) instead of DEL." },
      { q: "What is BullMQ and why use a job queue?", a: "BullMQ is a job queue for Node.js that stores its jobs in Redis. Your API just adds a job (which is quick) and replies right away, and separate worker processes do the slow work in the background, like sending emails, making PDFs, processing files or provisioning. Jobs are saved in Redis so they survive restarts, failed jobs are retried automatically, and you can handle more load by adding more workers. Basically, slow work no longer blocks your API." },
      { q: "Explain Queue, Worker, Job and QueueEvents in BullMQ.", a: "Queue is the producer side: you call queue.add(name, data, options) to add work. Worker is the consumer: it runs your processor function for each job. Job is one piece of work, with a name, data, options, progress, return value and state. QueueEvents listens to completed, failed and progress events from all workers through a Redis stream, which is handy for notifying users. There's also FlowProducer, which lets you create parent-child job trees." },
      { q: "What are the states of a BullMQ job?", a: "waiting (ready to be picked up), delayed (scheduled for later, or waiting before a retry), prioritized (waiting, but sorted by priority), active (being worked on right now), completed, failed (no retries left), and waiting-children (a parent job waiting for its child jobs to finish). If the processor throws an error, the job goes back to delayed for a retry, or to failed if that was the last attempt." },
      { q: "How do retries and backoff work in BullMQ?", a: "attempts is the total number of tries, and backoff is how long to wait between them. Exponential backoff doubles the wait each time (5s, 10s, 20s), which gives a failing service time to recover. Fixed backoff waits the same amount every time. If retrying won't help (for example, the data is bad), throw an UnrecoverableError so the job fails right away.", code: `await queue.add('provision', { tenantId }, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 5000 },
});` },
      { q: "What is concurrency in a BullMQ worker and how do you choose it?", a: "concurrency is how many jobs one worker handles at the same time. For jobs that mostly wait on I/O (API calls, database, emails), a higher number like 10 to 50 works well. For CPU-heavy jobs, keep it low and run more worker processes, or use a sandboxed processor (it runs the job in a separate process). That's because Node.js runs JavaScript on one thread, so heavy work blocks everything else." },
      { q: "What are stalled jobs?", a: "When a job is active, the worker holds a lock on it and keeps renewing it. If the worker crashes, or blocks the event loop for so long that it can't renew the lock, the job is called stalled. BullMQ moves it back to waiting so another worker can try it. After maxStalledCount stalls (default 1), it's marked failed. To avoid it: keep your processor async, use low concurrency for CPU work, use sandboxed processors, and shut workers down gracefully." },
      { q: "Does BullMQ guarantee a job runs exactly once?", a: "No, it's at-least-once. A worker can finish the work and then crash before marking the job as completed, so the job runs again. That's why your processor should be idempotent (running it twice gives the same result as running it once). Check if the work was already done, use upserts, use idempotency keys with payment providers, and use a custom jobId or deduplication so the same job isn't added twice." },
      { q: "How do you schedule repeating (cron) jobs in BullMQ?", a: "Use queue.upsertJobScheduler(id, { pattern } or { every }, template). Upsert means if you call it again with the same id, it updates the schedule instead of creating a second one, so it's safe to call every time the app starts. In BullMQ v6 the old repeat option on queue.add() isn't allowed anymore. To remove one, use removeJobScheduler(id).", code: `await queue.upsertJobScheduler('daily-summary',
  { pattern: '0 8 * * *' },
  { name: 'send-summary', data: {} });` },
      { q: "How do you rate limit jobs in BullMQ?", a: "Pass limiter: { max, duration } to the Worker. For example, { max: 100, duration: 1000 } means 100 jobs per second. The limit is shared by all workers on that queue, because the counter lives in Redis. You use this when your jobs call third-party APIs that have their own rate limits." },
      { q: "What are flows in BullMQ?", a: "A flow is a tree of jobs that you add with FlowProducer. The parent job sits in waiting-children until all its children are done, then it runs and can read their results with job.getChildrenValues(). The children can even be in different queues. Example: convert a video into 3 sizes in parallel, then send one notification at the end." },
      { q: "Why does BullMQ need maxRetriesPerRequest: null and noeviction?", a: "Workers use blocking Redis commands to wait for new jobs. With ioredis's default retry limit, those commands would throw errors, so BullMQ needs maxRetriesPerRequest: null (it warns you and sets it anyway). noeviction makes sure Redis never deletes queue keys when memory gets full. With an LRU policy, you could quietly lose jobs without noticing." },
      { q: "How do delayed jobs work internally?", a: "A delayed job is saved in a sorted set, with the time it should run as its score. When that time comes, BullMQ moves it to the waiting list. So it never runs early, even if workers are free. Retry backoff works the same way." },
      { q: "How do you shut down BullMQ workers safely during a deploy?", a: "When you get SIGTERM, call await worker.close(). The worker stops picking up new jobs and waits for the active ones to finish. Then close your queues and Redis connections and exit. If you just kill the process, the active jobs get stuck, become stalled later, and run again." },
      { q: "How do you show a long job's progress to the user?", a: "The API returns the job id right away (HTTP 202). Inside the processor, call job.updateProgress(percent). Then either the client keeps polling an endpoint that returns job.getState() and job.progress, or the server listens to QueueEvents ('progress', 'completed', 'failed') and pushes updates to the client over SSE or WebSocket.", code: `await job.updateProgress(50);
// server
queueEvents.on('progress', ({ jobId, data }) => sendSSE(jobId, data));` },
    ],
  },
  {
    title: "NestJS",
    questions: [
      { q: "What is NestJS and why use it over Express?", a: "NestJS is a TypeScript framework that runs on top of Express (or Fastify). Express lets you put code anywhere, but Nest gives you a fixed structure: modules, controllers, providers and dependency injection. That keeps big apps organised and easy to test." },
      { q: "What are the 3 core building blocks of NestJS?", a: "Module, Controller and Provider. A Module groups one feature together. A Controller handles the HTTP request and sends the response. A Provider (usually a service) holds the business logic and gets injected wherever it's needed." },
      { q: "What is Dependency Injection in NestJS?", a: "Your class just asks for what it needs in the constructor, and Nest creates it and passes it in. So classes don't create each other with new, and in tests you can easily pass a fake (mock) instead of the real one. The part of Nest that does this is called the IoC container.", code: `@Injectable()
export class OrdersService {
  constructor(private readonly payments: PaymentService) {}
}` },
      { q: "What does @Injectable() do?", a: "It tells Nest 'this class is a provider'. Then Nest can manage it, create it, and pass in whatever its constructor needs." },
      { q: "What is the difference between providers and exports in a module?", a: "providers are the things a module creates and can use inside itself. exports is the list of those providers that other modules are allowed to use when they import this module. By default, providers are private to their module." },
      { q: "What is a global module?", a: "It's a module marked with @Global(). Whatever it exports is available everywhere, without importing the module each time. Only use it for things the whole app needs, like config, database or logger." },
      { q: "What is a dynamic module (forRoot / forFeature / forRootAsync)?", a: "It's a module that sets up its providers based on options you pass in at runtime. forRoot sets it up once for the whole app. forFeature registers things for one feature module (like which entities it uses). forRootAsync is like forRoot, but it gets its options from other providers, like ConfigService.", code: `TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (c: ConfigService) => ({ type: 'postgres', url: c.get('DATABASE_URL') }),
})` },
      { q: "What are the types of custom providers?", a: "There are four. useValue gives a fixed value. useClass lets you pick which class to use. useFactory builds the value with a function (it can be async and can inject other providers). useExisting makes an alias that points to another provider." },
      { q: "Why can't you inject an interface directly?", a: "Because interfaces disappear after TypeScript compiles to JavaScript, so at runtime Nest has nothing to look up. Instead, use a string or Symbol as a token and inject it with @Inject(TOKEN).", code: `providers: [{ provide: PAYMENT_GATEWAY, useClass: StripeGateway }]
constructor(@Inject(PAYMENT_GATEWAY) private gateway: PaymentGateway) {}` },
      { q: "What are provider scopes?", a: "Scope decides how many instances Nest creates. DEFAULT is a singleton: one instance shared by the whole app. REQUEST creates a new instance for every request, and anything that injects it also becomes request-scoped. TRANSIENT gives every class that injects it its own separate instance." },
      { q: "Explain the NestJS request lifecycle order.", a: "A request goes through these steps in order: Middleware → Guards → Interceptors (before) → Pipes → Controller → Service → Interceptors (after). If anything throws along the way, Exception Filters handle it." },
      { q: "Middleware vs Guard: which one for authentication?", a: "Use a guard. A guard gets the ExecutionContext (an object that tells it which handler and controller will run), so it can read metadata like @Public or @Roles on that route. Middleware runs earlier and doesn't know which handler is going to run." },
      { q: "What is a Guard?", a: "A guard is a class with a canActivate() method that decides if a request can go through. Return true to allow it, or false to block it with a 403. It's used for authentication and authorization (who you are, and what you're allowed to do)." },
      { q: "How do you implement role-based access control?", a: "Put the allowed roles on the route with a custom decorator (made with SetMetadata). Then in a guard, read those roles with Reflector.getAllAndOverride and compare them with req.user.roles.", code: `export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);

const required = this.reflector.getAllAndOverride<Role[]>('roles', [ctx.getHandler(), ctx.getClass()]);` },
      { q: "What is an Interceptor used for?", a: "An interceptor wraps around your handler, so it can run code before and after it (using RxJS). You use it to change the response, log how long a request took, add a timeout, or return a cached result." },
      { q: "What is a Pipe?", a: "A pipe runs right before the handler and works on the input. It can transform it (like ParseIntPipe turning '5' into 5) or validate it (like ValidationPipe). If the input is invalid, it throws a 400 error." },
      { q: "What is a DTO and why a class instead of an interface?", a: "A DTO (Data Transfer Object) describes the shape of the data coming in. It has to be a class, because class-validator needs a real class at runtime to read the validation decorators from. Interfaces disappear after compiling, so they can't do that." },
      { q: "What do whitelist, forbidNonWhitelisted and transform do in ValidationPipe?", a: "whitelist quietly removes any field that doesn't have a decorator in the DTO. forbidNonWhitelisted returns a 400 error for those extra fields instead of removing them. transform turns the plain payload into an actual DTO instance and converts the types (like a string '5' into a number)." },
      { q: "What is an Exception Filter?", a: "It's a class with @Catch() that catches errors that get thrown and builds the error response. You use it so your whole API sends errors back in one consistent format." },
      { q: "What happens if a service throws a normal Error?", a: "Nest's built-in filter catches it and returns a 500 Internal Server Error, without showing the real error message to the user. If you want a proper status code, throw an HttpException class like NotFoundException instead." },
      { q: "Why register global guards/pipes/filters with APP_GUARD etc. instead of app.useGlobal*()?", a: "Because then they can use dependency injection. If you register them in a module with APP_GUARD, APP_PIPE, APP_INTERCEPTOR or APP_FILTER, Nest creates them and can inject services into them. If you use app.useGlobal*() in main.ts, you create them yourself outside the DI container, so they can't inject anything." },
      { q: "What is ExecutionContext?", a: "It's an object Nest passes to guards, interceptors and filters. It gives you the request, plus which handler and which controller class are about to run. It works the same way for HTTP, WebSocket and microservices." },
      { q: "What is Reflector?", a: "It's a helper service that reads the metadata set by decorators (like @Roles) from a handler or controller. You usually use it inside guards and interceptors." },
      { q: "How do you create a custom param decorator like @CurrentUser()?", a: "Use createParamDecorator, and inside it, get the request and return the value you want, like the user.", code: `export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user,
);` },
      { q: "What is applyDecorators?", a: "It lets you combine several decorators into one that you can reuse. For example, @AdminOnly() can be @Roles + @UseGuards + @ApiBearerAuth all in one." },
      { q: "How does JWT authentication work in NestJS?", a: "On login, you create (sign) a JWT using JwtService. On every request after that, a Passport JwtStrategy checks the token, and whatever its validate() method returns becomes req.user. AuthGuard('jwt') is what makes sure the route actually needs a valid token." },
      { q: "How do you protect all routes by default?", a: "Register the JWT guard globally with APP_GUARD, so every route needs a login. For the routes that should be open, add a @Public() decorator, and have the guard check for it and let those requests through." },
      { q: "How do you hide the password field from responses?", a: "Put @Exclude() on the password field in the entity, and turn on ClassSerializerInterceptor. It removes the excluded fields from any class instance you return." },
      { q: "What are lifecycle hooks?", a: "They're methods Nest calls at certain moments in the app's life: onModuleInit, onApplicationBootstrap, onModuleDestroy, beforeApplicationShutdown and onApplicationShutdown. The shutdown ones only run if you call app.enableShutdownHooks()." },
      { q: "How do you handle circular dependencies?", a: "A circular dependency is when A needs B and B needs A. You can use forwardRef(() => X) on both sides, but the better fix is to move the shared logic into a third module or service." },
      { q: "How do you resolve 'Nest can't resolve dependencies of X'?", a: "It means Nest can't find something X needs. Check three things: the dependency is in its module's providers, it's exported from that module, and that module is imported in the module where X lives." },
      { q: "How do you use transactions with TypeORM in NestJS?", a: "Wrap your writes in dataSource.transaction(async (manager) => ...) and use that manager for every query inside it. That way they either all save together or all roll back together." },
      { q: "Why should synchronize be false in production?", a: "Because synchronize changes your tables automatically to match your entities, and it can drop columns and lose data. In production, use migrations that someone has reviewed instead." },
      { q: "How do you manage configuration in NestJS?", a: "Use ConfigModule.forRoot({ isGlobal: true, validationSchema }) to load your env variables and check them when the app starts. Then inject ConfigService wherever you need a value, instead of reading process.env all over the code." },
      { q: "How do you unit test a service that uses a repository?", a: "Create a testing module with Test.createTestingModule, and instead of the real repository, give a mock for getRepositoryToken(Entity) using useValue.", code: `providers: [UsersService, { provide: getRepositoryToken(User), useValue: { findOneBy: jest.fn() } }]` },
      { q: "@Cron runs multiple times when you scale to 3 instances. Why and how to fix?", a: "Because each instance has its own scheduler, so all 3 run the job. To fix it, use a BullMQ job scheduler or a Redis lock, so only one instance actually runs it." },
      { q: "Event emitter vs BullMQ queue?", a: "The event emitter lives in memory, so if the process crashes, the events are lost. A BullMQ queue saves jobs in Redis and retries them. So use BullMQ for work that must not be lost." },
      { q: "@MessagePattern vs @EventPattern in microservices?", a: "@MessagePattern is request-response: the caller uses send() and waits for a reply. @EventPattern is fire-and-forget: the caller uses emit() and doesn't wait for any reply." },
      { q: "Express vs Fastify adapter in NestJS?", a: "Express is the default and has the biggest set of middleware. Fastify can handle more requests per second, so it's a good choice if you don't rely on middleware that only works with Express." },
      { q: "Why avoid @Res() in controllers?", a: "If you inject @Res(), you have to send the response yourself, and things like interceptors stop working. If you only need to set cookies or headers, use @Res({ passthrough: true }) so Nest still sends the response for you." },
    ],
  },
  {
    title: "PostgreSQL",
    questions: [
      { q: "What is PostgreSQL?", a: "PostgreSQL is a free, open-source relational database. Data is stored in tables and you use SQL to work with it. It is known for being reliable (fully ACID), following the SQL standard closely, and having extra features like JSONB, arrays, full-text search, window functions and extensions." },
      { q: "Why would you choose PostgreSQL for a project?", a: "When data has relations (users, orders, payments), when correctness matters (money, bookings), when you need complex queries and reports, or when you want SQL plus some flexible JSON data in one database. It is also free, has a big community, and every cloud gives managed PostgreSQL." },
      { q: "Difference between PostgreSQL and MySQL", a: "Both are SQL databases with tables. PostgreSQL follows the SQL standard more strictly and has more features: JSONB with indexes, arrays, FULL OUTER JOIN, RETURNING, partial and expression indexes, better full-text search, custom types and extensions like PostGIS and pgvector. MySQL is simpler and very common for simple read-heavy web apps. For complex queries and data safety, PostgreSQL is usually preferred.", code: `-- auto increment
MySQL:      id INT AUTO_INCREMENT PRIMARY KEY
PostgreSQL: id SERIAL PRIMARY KEY

-- upsert
MySQL:      ON DUPLICATE KEY UPDATE qty = VALUES(qty)
PostgreSQL: ON CONFLICT (product_id) DO UPDATE SET qty = EXCLUDED.qty` },
      { q: "Difference between PostgreSQL and MongoDB", a: "PostgreSQL is relational: fixed tables, strong joins, foreign keys and ACID transactions. MongoDB is a NoSQL document database: each record is a JSON-like document, the shape can change freely, and sharding across servers is built in, but joins are weak. PostgreSQL with JSONB can also store flexible JSON, so it covers many cases where people used MongoDB before." },
      { q: "What are the ACID properties?", a: "Atomicity: all queries in a transaction succeed or none do. Consistency: data always follows the rules (keys, NOT NULL, CHECK). Isolation: transactions running together do not see each other's half-done work. Durability: after COMMIT the data is safe even if the server crashes, because it is first written to the WAL (write-ahead log)." },
      { q: "What is MVCC?", a: "Multi-Version Concurrency Control. On UPDATE, PostgreSQL does not overwrite the row; it writes a new version and marks the old one dead. Each transaction sees the version that was valid for its snapshot. So readers do not block writers and writers do not block readers. Dead rows are later cleaned by VACUUM." },
      { q: "What is VACUUM and why is it needed?", a: "Because of MVCC, updates and deletes leave dead rows behind. VACUUM marks that space as free to reuse, and ANALYZE refreshes statistics for the planner. Autovacuum does this automatically and should stay on. VACUUM FULL rewrites the table and returns space to the disk, but it locks the table. Without vacuum, tables bloat and queries get slow." },
      { q: "What are the isolation levels in PostgreSQL?", a: "Read Committed (default): each query sees data committed before it started. Repeatable Read: the whole transaction sees one snapshot; a conflicting update fails and must be retried. Serializable: transactions behave as if run one by one; PostgreSQL may throw a serialization error (40001) and the app retries. Read Uncommitted behaves like Read Committed in PostgreSQL, so dirty reads never happen." },
      { q: "SERIAL vs IDENTITY vs UUID for primary keys", a: "SERIAL is the old shortcut for an auto-increment integer using a sequence. GENERATED ALWAYS AS IDENTITY is the modern SQL-standard way and is recommended for new tables. UUID (gen_random_uuid()) is a random 128-bit id: good when ids should not be guessable or are created on many servers, but bigger and a bit slower for indexes.", code: `id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
id UUID PRIMARY KEY DEFAULT gen_random_uuid()` },
      { q: "JSON vs JSONB", a: "JSON stores the exact text, so inserting is fast but searching is slow. JSONB stores a binary version (no extra spaces, no duplicate keys, key order not kept), so it is much faster to query and supports GIN indexes. Use JSONB in almost all cases." },
      { q: "How do you query a JSONB column?", a: "-> returns JSON, ->> returns text, #>> reads a nested path, @> checks if it contains some JSON, ? checks if a key exists. Add a GIN index for fast @> and ? searches.", code: `SELECT attributes->>'brand' FROM products;
SELECT * FROM products WHERE attributes @> '{"brand": "Apple"}';
CREATE INDEX ON products USING GIN (attributes);` },
      { q: "What is an index and when should you NOT add one?", a: "An index is a separate structure that helps PostgreSQL find rows without reading the whole table. Do not add one on small tables, on columns you rarely filter by, or on columns with very few different values (like a boolean) unless it is a partial index. Every index slows down INSERT/UPDATE/DELETE and uses disk space." },
      { q: "What types of indexes does PostgreSQL have?", a: "B-tree (default, for =, <, >, BETWEEN, ORDER BY), Hash (only =), GIN (JSONB, arrays, full-text search), GiST (geometry, ranges, PostGIS), SP-GiST (special tree data) and BRIN (tiny index for huge tables stored in natural order, like logs by time)." },
      { q: "What is a partial index and an expression index?", a: "A partial index covers only rows matching a WHERE, so it is smaller and faster. An expression index stores the result of a function, so queries using that same function can use it.", code: `CREATE INDEX ON orders (created_at) WHERE status = 'pending';
CREATE INDEX ON users (LOWER(email));` },
      { q: "How does a composite index work?", a: "An index on (a, b) is sorted by a, then by b. It helps queries filtering on a, or on a and b together, but not on b alone (leftmost prefix rule). Put the column used with = first and the range or sort column after it." },
      { q: "How do you find and fix a slow query?", a: "Run EXPLAIN ANALYZE to see the real plan and time. Look for Seq Scan on big tables, bad row estimates and expensive sorts. Fixes: add the right index, select fewer columns, rewrite the query, run ANALYZE to refresh statistics, use keyset pagination instead of big OFFSET. pg_stat_statements helps find the slowest queries overall." },
      { q: "Difference between WHERE and HAVING", a: "WHERE filters single rows before GROUP BY. HAVING filters groups after GROUP BY, so it can use aggregate functions like COUNT or SUM.", code: `SELECT department, COUNT(*)
FROM employees
WHERE salary > 30000
GROUP BY department
HAVING COUNT(*) > 5;` },
      { q: "Explain the types of JOINs.", a: "INNER JOIN: only matching rows from both tables. LEFT JOIN: all rows from the left table, NULL where the right has no match. RIGHT JOIN: the opposite. FULL OUTER JOIN: all rows from both, NULL where no match (MySQL does not support it). CROSS JOIN: every combination. SELF JOIN: a table joined with itself, like employee and manager." },
      { q: "What is a CTE and a recursive CTE?", a: "A CTE (WITH ...) is a named temporary result used in the next query, which makes long SQL easier to read. A recursive CTE refers to itself and is used for tree data like categories, comment replies or org charts.", code: `WITH RECURSIVE tree AS (
  SELECT id, name, parent_id FROM categories WHERE parent_id IS NULL
  UNION ALL
  SELECT c.id, c.name, c.parent_id FROM categories c JOIN tree t ON c.parent_id = t.id
)
SELECT * FROM tree;` },
      { q: "What are window functions?", a: "Functions that calculate over a set of related rows but still return every row, unlike GROUP BY which collapses rows. Examples: ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, and SUM/AVG with OVER(). Used for rankings, running totals and top N per group.", code: `SELECT name, department, salary,
       RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk
FROM employees;` },
      { q: "RANK vs DENSE_RANK vs ROW_NUMBER", a: "For salaries 100, 90, 90, 80: ROW_NUMBER gives 1, 2, 3, 4 (always unique). RANK gives 1, 2, 2, 4 (same rank for ties, then skips). DENSE_RANK gives 1, 2, 2, 3 (same rank for ties, no skip)." },
      { q: "How do you find the second (or Nth) highest salary?", a: "Use DENSE_RANK so ties are handled correctly, or ORDER BY with OFFSET on distinct values.", code: `SELECT salary FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS r FROM employees
) t WHERE r = 2 LIMIT 1;` },
      { q: "How do you delete duplicate rows?", a: "Use DELETE ... USING to join the table with itself and delete the row with the bigger id where the duplicate column matches. Then add a UNIQUE constraint so it does not happen again.", code: `DELETE FROM users a USING users b
WHERE a.email = b.email AND a.id > b.id;` },
      { q: "What does RETURNING do?", a: "It returns rows changed by INSERT, UPDATE or DELETE in the same query, so you get the new id or updated values without a second SELECT. MySQL does not have it.", code: `INSERT INTO users (name) VALUES ('Kartik') RETURNING id;` },
      { q: "How do you do an UPSERT in PostgreSQL?", a: "Use INSERT ... ON CONFLICT on a unique column. DO UPDATE changes the existing row (EXCLUDED holds the new values), DO NOTHING skips it. PostgreSQL 15+ also has MERGE.", code: `INSERT INTO stock (product_id, qty) VALUES (1, 10)
ON CONFLICT (product_id) DO UPDATE SET qty = stock.qty + EXCLUDED.qty;` },
      { q: "View vs materialized view", a: "A view is a saved query that runs every time you select from it, so data is always fresh. A materialized view stores the result on disk, so reading is fast, but you must run REFRESH MATERIALIZED VIEW to update it. Use materialized views for heavy reports and dashboards." },
      { q: "What is SELECT ... FOR UPDATE and SKIP LOCKED?", a: "FOR UPDATE locks the selected rows until the transaction ends, so no one else can change them in between (prevents race conditions like double booking). SKIP LOCKED skips rows already locked by others, which lets many workers pick different jobs from a table-based queue without waiting." },
      { q: "What is a deadlock and how do you avoid it?", a: "Two transactions each hold a lock the other needs, so both wait forever. PostgreSQL detects it and cancels one with error 40P01. Avoid it by locking rows in the same order everywhere, keeping transactions short, and retrying the cancelled one." },
      { q: "How do you prevent SQL injection in Node.js with pg?", a: "Always use parameterized queries ($1, $2) and pass values in an array. pg sends the values separately from the SQL, so user input can never change the query. Never build SQL with template literals or string concatenation.", code: `pool.query('SELECT * FROM users WHERE email = $1', [email]);` },
      { q: "Why use a connection pool?", a: "Opening a PostgreSQL connection is slow and each one uses server memory (each connection is a separate process). A pool keeps a few connections open and reuses them. In Node.js use pg.Pool; for many app servers or serverless, put PgBouncer in front so total connections stay low." },
      { q: "How do you run a transaction with node-postgres?", a: "Take one client with pool.connect(), run BEGIN, your queries and COMMIT on that same client, ROLLBACK in catch, and client.release() in finally. Using pool.query() for each step may use different connections, which breaks the transaction." },
      { q: "What is normalization?", a: "Organizing tables to remove repeated data. 1NF: one value per cell, no repeating groups. 2NF: every column depends on the whole primary key. 3NF: no column depends on another non-key column. It avoids update mistakes. Sometimes we denormalize on purpose for faster reads." },
      { q: "What is WAL?", a: "Write-Ahead Log. Every change is first written to the WAL file on disk, and only then to the data files. If the server crashes, PostgreSQL replays the WAL to recover. WAL is also used for streaming replication and point-in-time recovery." },
      { q: "How does replication work in PostgreSQL?", a: "Streaming replication sends WAL records from the primary to replicas, which apply them and stay almost up to date. Replicas can serve read-only queries and can be promoted to primary if it fails. It is asynchronous by default; synchronous replication waits for a replica before COMMIT returns. Logical replication copies selected tables instead of the whole server." },
      { q: "What is table partitioning?", a: "Splitting one big table into smaller child tables by range (like month), list (like country) or hash. Queries that filter on the partition key read only the needed partitions, and old data can be removed by dropping a partition instead of a slow DELETE." },
      { q: "DELETE vs TRUNCATE vs DROP", a: "DELETE removes rows one by one, can use WHERE, fires triggers and can be rolled back. TRUNCATE removes all rows at once, very fast, no WHERE (in PostgreSQL it can also be rolled back inside a transaction). DROP TABLE removes the whole table including its structure." },
      { q: "What are schemas in PostgreSQL?", a: "A schema is a folder inside a database that holds tables, views and functions. The default is public. Schemas help separate things like app tables and reporting tables, or one schema per tenant. In MySQL, schema and database mean the same thing; in PostgreSQL they are different levels." },
      { q: "How do you take a backup and restore?", a: "pg_dump makes a logical backup of one database and pg_restore loads it. For the whole server with point-in-time recovery, use pg_basebackup plus WAL archiving, or the managed backups of your cloud provider.", code: `pg_dump -U postgres -d shopdb -F c -f shopdb.dump
pg_restore -U postgres -d shopdb_new shopdb.dump` },
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
