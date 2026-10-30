import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function RedisDataTypes() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Redis Data Types</h1>
      <p className="com-text">
        Redis is not just "key = string". Every key holds a value of a specific type, and each type has its own commands. Picking the right type is the most important Redis skill, because it decides how fast and how simple your code will be.
      </p>

      <section className="method-section">
        <h2 className="method-title">1. String</h2>
        <p className="com-text">
          The simplest type. A string can hold text, a number, or even JSON (up to 512 MB). Numbers stored as strings can be incremented atomically. Use it for caching, counters and simple flags.
        </p>
        <CodeBlock language="bash" style={atomDark}>
          {`SET user:101:name "Kartik"
GET user:101:name              # "Kartik"

SET product:5 '{"name":"Helmet","price":450}'   # store JSON as string

INCR post:9:likes              # 1  (atomic counter)
INCRBY post:9:likes 10         # 11
DECR stock:5                   # decrease by 1

SET otp:9876543210 482913 EX 300    # value that expires in 300 seconds
SET lock:job "server-1" NX EX 30    # set only if it does NOT exist`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">2. Hash</h2>
        <p className="com-text">
          A hash is like a small object inside one key: field-value pairs. Use it to store an object when you want to read or update one field without loading the whole thing (unlike a JSON string, where you must read, parse, change and write back).
        </p>
        <CodeBlock language="bash" style={atomDark}>
          {`HSET user:101 name "Kartik" city "Surat" age 24
HGET user:101 city             # "Surat"
HGETALL user:101               # all fields and values
HINCRBY user:101 age 1         # age becomes 25
HDEL user:101 city`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">3. List</h2>
        <p className="com-text">
          A list is an ordered collection of strings (a linked list). You can push and pop from both ends in O(1). Use it for recent items (last 10 notifications), simple queues, or activity feeds.
        </p>
        <CodeBlock language="bash" style={atomDark}>
          {`LPUSH notifications:101 "New message"    # add to the left (start)
RPUSH queue:emails "email-1"              # add to the right (end)
LPOP queue:emails                         # take from the left (FIFO with RPUSH)
LRANGE notifications:101 0 9              # first 10 items
LTRIM notifications:101 0 9               # keep only latest 10

BRPOP queue:emails 5      # blocking pop: wait up to 5s for an item`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">4. Set</h2>
        <p className="com-text">
          A set is an unordered collection of unique strings. Adding the same value twice keeps only one. Use it for unique visitors, tags, "who liked this post", and set operations like common friends.
        </p>
        <CodeBlock language="bash" style={atomDark}>
          {`SADD post:9:likes user:1 user:2 user:1    # user:1 stored once
SISMEMBER post:9:likes user:2              # 1 = yes
SCARD post:9:likes                         # count = 2
SMEMBERS post:9:likes

SADD friends:a 1 2 3
SADD friends:b 2 3 4
SINTER friends:a friends:b                 # common friends: 2, 3
SUNION friends:a friends:b                 # 1, 2, 3, 4`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">5. Sorted Set (ZSET)</h2>
        <p className="com-text">
          A sorted set is like a set, but every member has a score, and members are always kept sorted by score. Add/update is O(log n). This is the perfect type for leaderboards, rankings, priority queues and time-based data (score = timestamp).
        </p>
        <CodeBlock language="bash" style={atomDark}>
          {`ZADD leaderboard 1500 "kartik" 1200 "amit" 1800 "riya"
ZINCRBY leaderboard 100 "amit"             # amit = 1300
ZREVRANGE leaderboard 0 2 WITHSCORES       # top 3 (highest first)
ZREVRANK leaderboard "kartik"              # kartik's position (0-based)
ZRANGEBYSCORE leaderboard 1300 1600        # members with score in range`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">6. Special types (know the names)</h2>
        <p className="com-text">
          Streams: an append-only log with consumer groups, used for event processing (covered in Pub/Sub &amp; Streams).
          Bitmaps: store true/false per bit, for example "did user N log in today" for millions of users using very little memory.
          HyperLogLog: counts unique items approximately (about 0.81% error) using only 12 KB, for example unique visitors per day.
          Geospatial: store longitude/latitude and find "shops within 5 km".
        </p>
        <CodeBlock language="bash" style={atomDark}>
          {`SETBIT login:2026-10-28 101 1      # user 101 logged in today
GETBIT login:2026-10-28 101        # 1

PFADD visitors:today user1 user2 user1
PFCOUNT visitors:today             # 2 (approximate unique count)

GEOADD shops 72.8311 21.1702 "surat-store"
GEOSEARCH shops FROMLONLAT 72.83 21.17 BYRADIUS 5 km`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">How to choose (quick guide)</h2>
        <p className="com-text">
          Single value or cached JSON: String. Object with fields you update separately: Hash. Ordered list or simple queue: List. Unique values / membership check: Set. Ranking or anything sorted by a number or time: Sorted Set. Event log with multiple consumers: Stream. Approximate unique count: HyperLogLog.
        </p>
      </section>
    </div>
  );
}

export default RedisDataTypes;
