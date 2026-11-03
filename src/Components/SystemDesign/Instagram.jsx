import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function SystemDesignInstagram() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Design Instagram</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">We are designing an app where people upload photos and videos, follow each other, and scroll a home feed of posts from the people they follow.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Files and data live in different places:</strong> the photo itself goes to object storage (like S3) and is served by a CDN. Only small details (who, when, caption) go to the database.</li>
          <li className="com-list-item"><strong>The feed is the hard part:</strong> you build it ahead of time and keep it ready in Redis, so opening the app is fast.</li>
          <li className="com-list-item"><strong>Celebrities are special:</strong> a user with crores of followers needs a different feed trick (the hybrid model).</li>
          <li className="com-list-item"><strong>Slow work goes to a queue:</strong> making thumbnails and encoding videos happens in the background, not while the user waits.</li>
          <li className="com-list-item"><strong>Reads are much more than writes:</strong> people scroll far more than they post, so we design for fast reads.</li>
        </ol>
      </div>

      <section id="requirements" className="method-section">
        <h2 className="method-title">Step 1: Ask Questions (Requirements)</h2>
        <p className="com-text">First, agree with the interviewer on what you are building. Don't try to build all of Instagram. Pick the main features.</p>
        <h3 className="com-subtitle">What the app must do (functional)</h3>
        <ol className="com-list">
          <li className="com-list-item"><strong>Upload a post:</strong> a photo or a video with a caption.</li>
          <li className="com-list-item"><strong>Follow:</strong> follow and unfollow other users.</li>
          <li className="com-list-item"><strong>Home feed:</strong> see recent posts from people you follow.</li>
          <li className="com-list-item"><strong>Likes and comments:</strong> like a post, comment on it, and see the counts.</li>
          <li className="com-list-item"><strong>Stories:</strong> a photo or video that disappears after 24 hours.</li>
        </ol>
        <h3 className="com-subtitle">How well it must work (non-functional)</h3>
        <ol className="com-list">
          <li className="com-list-item"><strong>Fast feed:</strong> the feed should open in well under a second.</li>
          <li className="com-list-item"><strong>Always up:</strong> high availability. It is fine if a new post shows up in your friend's feed a few seconds late. This is called eventual consistency (data becomes the same everywhere after a short delay).</li>
          <li className="com-list-item"><strong>Never lose a photo:</strong> uploaded media must be stored safely.</li>
          <li className="com-list-item"><strong>Read heavy:</strong> many more feed views than uploads.</li>
        </ol>
        <p className="com-text">Out of scope (say this out loud): search, reels recommendations, direct messages, ads.</p>
      </section>

      <section id="estimation" className="method-section">
        <h2 className="method-title">Step 2: Rough Numbers (Estimation)</h2>
        <p className="com-text">These are made-up round numbers for the interview, not real Instagram numbers. The goal is to see where the load is.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Users:</strong> say 500 million daily active users.</li>
          <li className="com-list-item"><strong>Uploads:</strong> say 1 in 5 users posts once a day = 100 million posts a day. A day has about 100,000 seconds, so about 1,000 uploads per second (more at peak).</li>
          <li className="com-list-item"><strong>Feed reads:</strong> say each user opens the feed 20 times a day = 10 billion feed loads a day, about 100,000 per second.</li>
          <li className="com-list-item"><strong>Read vs write:</strong> 100,000 reads vs 1,000 writes, so about 100 reads for every write. Clearly read heavy.</li>
          <li className="com-list-item"><strong>Storage:</strong> say an average post (after compression) is 1 MB. 100 million MB = about 100 TB of new media every day. That is why media goes to object storage, not the database.</li>
          <li className="com-list-item"><strong>Metadata:</strong> one post row is maybe 1 KB, so 100 million KB = about 100 GB a day. Big, but a normal database can handle it when sharded.</li>
        </ol>
        <div className="example-box">
          <p className="example-label">What the numbers tell you</p>
          <p className="com-text">
            Reads are 100 times more than writes, so do extra work at write time to make reads cheap. And media is huge, so keep it out of the database and serve it from a CDN.
          </p>
        </div>
      </section>

      <section id="apis" className="method-section">
        <h2 className="method-title">Step 3: APIs</h2>
        <p className="com-text">Keep the list short. Each API is one main action from the requirements.</p>
        <CodeBlock language="text" style={atomDark}>
          {`POST   /media/upload-url        -> get a signed URL to upload the file straight to S3
POST   /posts                   -> create a post { mediaIds, caption }
GET    /feed?cursor=abc&limit=20 -> home feed, page by page
POST   /users/:id/follow        -> follow a user
DELETE /users/:id/follow        -> unfollow
POST   /posts/:id/like          -> like (DELETE to unlike)
POST   /posts/:id/comments      -> add a comment { text }
GET    /posts/:id/comments?cursor=...
POST   /stories                 -> create a story { mediaId }
GET    /stories/feed            -> stories from people you follow`}
        </CodeBlock>
        <ol className="com-list">
          <li className="com-list-item"><strong>Signed upload URL:</strong> a short-lived link that lets the phone upload the file straight to S3. So big files don't pass through your API servers.</li>
          <li className="com-list-item"><strong>Cursor pagination:</strong> the feed sends a cursor (a bookmark, like the id of the last post you saw). Better than page numbers, because new posts keep coming at the top and page numbers would show duplicates.</li>
        </ol>
        <CodeBlock language="javascript" style={atomDark}>
          {`// GET /feed?limit=2 response
{
  "posts": [
    { "id": "p9", "author": "riya", "mediaUrl": "https://cdn.example.com/p9_1080.jpg",
      "caption": "Goa!", "likeCount": 120, "commentCount": 8 },
    { "id": "p7", "author": "aman", "mediaUrl": "https://cdn.example.com/p7_1080.jpg",
      "caption": "Chai time", "likeCount": 45, "commentCount": 2 }
  ],
  "nextCursor": "p7"
}`}
        </CodeBlock>
      </section>

      <section id="database" className="method-section">
        <h2 className="method-title">Step 4: Database</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Store the photo file in object storage, and store only the small details about it in the database.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Object storage (S3):</strong> a cheap, huge store for files. You save a file and get back a key (like a path).</li>
            <li className="com-list-item"><strong>Users, posts, follows:</strong> can go in SQL (PostgreSQL/MySQL) sharded by user_id, or a wide-column NoSQL store like Cassandra. Both work; say why you pick one.</li>
            <li className="com-list-item"><strong>Feed:</strong> a ready list of post ids per user, kept in Redis.</li>
            <li className="com-list-item"><strong>Sharding by user_id:</strong> sharding means splitting one big table across many database servers. Using user_id as the key keeps all of one user's posts on the same server, so "get posts of user X" hits only one shard.</li>
          </ol>
        </div>
        <CodeBlock language="sql" style={atomDark}>
          {`CREATE TABLE users (
  id          BIGINT PRIMARY KEY,
  username    VARCHAR(30) UNIQUE NOT NULL,
  name        VARCHAR(100),
  created_at  TIMESTAMP NOT NULL
);

CREATE TABLE posts (
  id            BIGINT PRIMARY KEY,      -- time-sortable id (like Snowflake)
  user_id       BIGINT NOT NULL,         -- shard key
  caption       TEXT,
  media_keys    TEXT[],                  -- S3 keys, not the files
  like_count    INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  created_at    TIMESTAMP NOT NULL
);
CREATE INDEX idx_posts_user_time ON posts (user_id, created_at DESC);

CREATE TABLE follows (
  follower_id  BIGINT NOT NULL,
  followee_id  BIGINT NOT NULL,
  created_at   TIMESTAMP NOT NULL,
  PRIMARY KEY (follower_id, followee_id)
);

CREATE TABLE likes (
  post_id    BIGINT NOT NULL,
  user_id    BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  PRIMARY KEY (post_id, user_id)          -- one like per user per post
);

CREATE TABLE comments (
  id         BIGINT PRIMARY KEY,
  post_id    BIGINT NOT NULL,
  user_id    BIGINT NOT NULL,
  text       TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE stories (
  id          BIGINT PRIMARY KEY,
  user_id     BIGINT NOT NULL,
  media_key   TEXT NOT NULL,
  created_at  TIMESTAMP NOT NULL,
  expires_at  TIMESTAMP NOT NULL          -- created_at + 24 hours
);`}
        </CodeBlock>
        <ol className="com-list">
          <li className="com-list-item"><strong>Time-sortable id:</strong> an id that grows with time (like Twitter's Snowflake id). Sorting by id is the same as sorting by time, which makes the feed cursor easy.</li>
          <li className="com-list-item"><strong>Primary key on likes (post_id, user_id):</strong> the database itself stops the same user from liking twice.</li>
          <li className="com-list-item"><strong>Follows both ways:</strong> you need "who do I follow" and "who follows me". Keep a second copy of the table keyed by followee_id so both questions are fast on a sharded setup.</li>
        </ol>
      </section>

      <section id="architecture" className="method-section">
        <h2 className="method-title">Step 5: Draw the Boxes (Architecture)</h2>
        <CodeBlock language="text" style={atomDark}>
          {`                          +-----------------+
   Mobile / Web  -------->|      CDN        |<----- media files (read)
        |                 +-----------------+               ^
        |                                                   |
        v                                                   |
 +---------------+                                  +---------------+
 | Load Balancer |                                  |  S3 (object   |
 +---------------+                                  |   storage)    |
        |                                           +---------------+
        v                                              ^        ^
 +----------------+                                    |        |
 |  API Gateway   |  (auth, rate limit)    1. upload   |        |
 +----------------+     straight to S3 with signed URL |        |
   |     |     |     \\                                           |
   v     v     v      v                                         |
 Post  Feed  User   Like/Comment                                |
 Svc   Svc   Svc    Service                                     |
   |     |     |        |                                       |
   |     |     |        +--> Redis counters (likes)             |
   |     |     |                                                |
   |     |     +--> Users + Follows DB (sharded by user_id)     |
   |     |                                                      |
   |     +--> Redis Feed Cache  (user_id -> [post ids])         |
   |                 ^                                          |
   v                 |                                          |
 Posts DB      Fan-out Workers                                  |
 (sharded)           ^                                          |
   |                 |                                          |
   +----> Queue (Kafka / SQS) ----> Media Workers --------------+
          "post created"            (thumbnails, video encoding)`}
        </CodeBlock>
        <h3 className="com-subtitle">Flow: posting a photo</h3>
        <ol className="com-list">
          <li className="com-list-item">The app asks for a signed upload URL and uploads the photo straight to S3.</li>
          <li className="com-list-item">The app calls POST /posts with the S3 key and caption. The Post Service saves a row in the Posts DB.</li>
          <li className="com-list-item">The Post Service puts a "post created" message on the queue and replies to the user right away.</li>
          <li className="com-list-item">Media workers pick it up and make smaller sizes (thumbnail, 480p, 1080p). Videos get encoded into different qualities.</li>
          <li className="com-list-item">Fan-out workers add the post id to the feed lists of the followers in Redis.</li>
        </ol>
        <h3 className="com-subtitle">Flow: opening the home feed</h3>
        <ol className="com-list">
          <li className="com-list-item">The Feed Service reads your list of post ids from Redis (one fast read).</li>
          <li className="com-list-item">It fetches the post details for those ids (from a post cache, falling back to the DB).</li>
          <li className="com-list-item">It sends back post details with CDN links. The phone loads images from the CDN, not from your servers.</li>
        </ol>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            When you post on Instagram, the post shows up on your profile right away, but you may see "processing" on a video for a moment. That is the background work (encoding) happening in a queue, while the app has already said "done" to you.
          </p>
        </div>
      </section>

      <section id="deep-dive" className="method-section">
        <h2 className="method-title">Step 6: Make It Scale (Deep Dive)</h2>
        <p className="com-text">These are the hardest problems in this design. Interviewers usually spend most of the time here.</p>

        <h3 className="com-subtitle">1. Building the feed: fan-out on write vs fan-out on read</h3>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Fan-out means "spreading one post to many followers". The question is: do you spread it when the post is made, or when someone opens the feed?</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Fan-out on write (push):</strong> when Riya posts, you add the post id to the feed list of each of her followers right away. Opening the feed is just one Redis read. Fast reads, more work on write.</li>
            <li className="com-list-item"><strong>Fan-out on read (pull):</strong> you do nothing on post. When Aman opens the feed, you fetch the latest posts of everyone he follows and merge them. Cheap writes, slow reads.</li>
            <li className="com-list-item"><strong>Hybrid:</strong> push for normal users, pull for celebrities. This is the usual answer.</li>
          </ol>
        </div>
        <CodeBlock language="text" style={atomDark}>
          {`Fan-out on write (push)                Fan-out on read (pull)

Riya posts p9                          Aman opens feed
   |                                       |
   v                                       v
for each follower f:                   get list of people Aman follows
   LPUSH feed:f  p9                    get latest posts of each one
   LTRIM feed:f 0 499                  merge + sort by time
                                       return top 20
Aman opens feed:
   LRANGE feed:aman 0 19  (fast)`}
        </CodeBlock>
        <p className="com-text">
          The problem with push: a celebrity with 10 crore followers posts once, and you must do 10 crore Redis writes. That takes a long time and wastes work on followers who may not open the app today.
        </p>
        <p className="com-text"><strong>The hybrid fix:</strong></p>
        <ol className="com-list">
          <li className="com-list-item">Mark users with a very large number of followers (say over 1 million) as celebrities.</li>
          <li className="com-list-item">Normal users: fan-out on write, as usual.</li>
          <li className="com-list-item">Celebrities: no fan-out. Their posts stay only in their own post list.</li>
          <li className="com-list-item">When you open the feed: read your ready list from Redis, then fetch recent posts of the few celebrities you follow, merge both and sort.</li>
          <li className="com-list-item">Skip fan-out for inactive users (not opened the app in 30 days). Build their feed by pull when they come back.</li>
        </ol>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            You follow 300 friends and 5 cricketers. Your friends' posts were already pushed into your Redis feed list. The 5 cricketers' latest posts are pulled when you open the app. You just see one mixed feed and never know two methods were used.
          </p>
        </div>
        <p className="com-text">
          Keep only the latest few hundred post ids per user in Redis (LTRIM). Older posts are rarely seen, and you can fetch them from the DB if someone scrolls that far. Feed ranking (showing the "best" posts first, not just the newest) is a separate ranking service on top; mention it, don't go deep.
        </p>

        <h3 className="com-subtitle">2. Media upload and processing</h3>
        <ol className="com-list">
          <li className="com-list-item"><strong>Upload direct to S3:</strong> with a signed URL. Your API servers never carry big files, so they stay light.</li>
          <li className="com-list-item"><strong>Queue for slow work:</strong> making thumbnails and encoding video can take seconds or minutes. Put a job on a queue (Kafka, SQS, RabbitMQ). Workers do it in the background. If a worker crashes, the job is retried.</li>
          <li className="com-list-item"><strong>Many sizes:</strong> store small, medium and large versions. A phone on slow 4G gets the small one. This saves data and time.</li>
          <li className="com-list-item"><strong>CDN for reads:</strong> files are served from CDN edge servers near the user. Most image requests never reach S3.</li>
          <li className="com-list-item"><strong>File names never change:</strong> a photo never changes after upload, so the CDN can cache it for a very long time.</li>
        </ol>

        <h3 className="com-subtitle">3. Likes and counters on viral posts</h3>
        <p className="com-text">
          A viral post may get thousands of likes per second. If each like runs <code>UPDATE posts SET like_count = like_count + 1</code> on the same row, that row becomes a hot spot. Every update waits for the one before it.
        </p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Save the like itself:</strong> insert into the likes table (or a likes store). This is the truth of who liked what.</li>
          <li className="com-list-item"><strong>Count in Redis:</strong> <code>INCR likes:p9</code> is atomic (no two updates mix up) and very fast. The app shows this number.</li>
          <li className="com-list-item"><strong>Sync in batches:</strong> a background job copies the Redis count to the DB every few seconds, as one update instead of thousands.</li>
          <li className="com-list-item"><strong>Approximate is fine:</strong> nobody cares if a count shows 10,241 instead of 10,243 for a few seconds.</li>
        </ol>

        <h3 className="com-subtitle">4. Stories that expire in 24 hours</h3>
        <ol className="com-list">
          <li className="com-list-item"><strong>Store expires_at:</strong> every query adds <code>WHERE expires_at &gt; now()</code>, so expired stories are hidden right away.</li>
          <li className="com-list-item"><strong>Redis with TTL:</strong> keep active story ids in Redis with a 24 hour TTL (time to live). Redis deletes them by itself.</li>
          <li className="com-list-item"><strong>Clean up later:</strong> a daily job deletes old story files from S3, or an S3 lifecycle rule does it. (Instagram also keeps an archive for the owner; that is a product choice.)</li>
        </ol>

        <h3 className="com-subtitle">Other scaling points to mention</h3>
        <ol className="com-list">
          <li className="com-list-item"><strong>Read replicas:</strong> copies of the database that only serve reads, for profile pages and comments.</li>
          <li className="com-list-item"><strong>Post cache:</strong> keep hot post details in Redis so the feed doesn't hit the DB for every post.</li>
          <li className="com-list-item"><strong>Stateless API servers:</strong> no user data kept in server memory, so you can add more servers behind the load balancer any time.</li>
        </ol>
      </section>

      <section id="tradeoffs" className="method-section">
        <h2 className="method-title">Step 7: Wrap Up (Trade-offs)</h2>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr><th>Choice</th><th>What you gain</th><th>What you give up</th></tr>
            </thead>
            <tbody>
              <tr><td>Fan-out on write</td><td>Very fast feed reads</td><td>Heavy writes, bad for celebrities</td></tr>
              <tr><td>Fan-out on read</td><td>Cheap, simple writes</td><td>Slow feed, lots of work on every open</td></tr>
              <tr><td>Hybrid feed</td><td>Fast feed and no celebrity problem</td><td>More code, two paths to maintain</td></tr>
              <tr><td>Eventual consistency</td><td>High availability, speed</td><td>A new post may show up a few seconds late</td></tr>
              <tr><td>Counters in Redis</td><td>No hot row in the DB</td><td>Count may be slightly off for a moment</td></tr>
              <tr><td>Shard by user_id</td><td>A user's posts sit on one shard</td><td>A very big user can make one shard busy (hot shard)</td></tr>
            </tbody>
          </table>
        </div>
        <p className="com-text">What you would do next, if there was more time:</p>
        <ol className="com-list">
          <li className="com-list-item">A ranking service so the feed shows interesting posts, not only the newest.</li>
          <li className="com-list-item">Search for users and hashtags (Elasticsearch).</li>
          <li className="com-list-item">Notifications ("Riya liked your post") using the same queue.</li>
          <li className="com-list-item">Multi-region setup so users in other countries are served from nearby data centers.</li>
        </ol>
      </section>
    </div>
  );
}

export default SystemDesignInstagram;
