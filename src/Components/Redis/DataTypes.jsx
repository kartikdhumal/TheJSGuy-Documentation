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
        Redis is not only "key = string". Every key holds a value of a certain type, and each type has its own commands. Picking the right type is the most important Redis skill. It decides how fast and how simple your code will be. Think of it like choosing the right box: a shoe box for shoes, a jewellery box for rings.
      </p>

      <section className="method-section">
        <h2 className="method-title">1. String</h2>
        <p className="com-text">
          This is the simplest type. A string can hold text, a number, or even JSON (up to 512 MB). If you store a number, Redis can add to it atomically (in one safe step, nobody can change it in between). Use strings for caching, counters and simple on/off flags.
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
          A hash is like a small object inside one key. It holds field-value pairs. Use it when you want to read or change one field without loading the whole object. With a JSON string you can't do that. You must read it, parse it, change it and write it all back.
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
          A list is a group of strings kept in order (a linked list). You can add or remove items at both ends, and it is very fast (O(1), the same speed no matter how long the list is). Use it for recent items (last 10 notifications), simple queues, or activity feeds.
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
          A set is a group of unique strings, in no special order. If you add the same value twice, it is kept only once. Use it for unique visitors, tags, and "who liked this post". You can also compare sets, for example to find common friends.
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
          A sorted set is like a set, but every member also has a score. Redis always keeps the members sorted by that score. Adding or updating is O(log n), which means it stays fast even with lots of members. Think of a game scoreboard that re-orders itself every time a score changes. It is perfect for leaderboards, rankings, priority queues and time-based data (score = timestamp).
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
        <h2 className="method-title">6. Special types (just know the names)</h2>
        <p className="com-text">
          You don't need these every day, but it is good to know they exist.
          Streams: a log where you can only add to the end, with consumer groups. Used for event processing (covered in Pub/Sub &amp; Streams).
          Bitmaps: store true/false in single bits. For example "did user N log in today" for millions of users, using very little memory.
          HyperLogLog: counts unique items, but only roughly (about 0.81% error). It uses only 12 KB. For example, unique visitors per day.
          Geospatial: store longitude/latitude and ask "which shops are within 5 km?".
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
        <h2 className="method-title">Which type should I pick?</h2>
        <p className="com-text">
          One value or cached JSON: String.
          An object where you change fields one by one: Hash.
          An ordered list or a simple queue: List.
          Unique values, or "is this in the group?" checks: Set.
          Ranking, or anything sorted by a number or time: Sorted Set.
          An event log read by many consumers: Stream.
          A rough count of unique items: HyperLogLog.
        </p>
      </section>
    </div>
  );
}

export default RedisDataTypes;
