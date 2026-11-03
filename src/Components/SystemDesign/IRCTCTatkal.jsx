import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function SystemDesignIRCTC() {
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
      <h1 className="title">Design IRCTC Tatkal Booking</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">We are designing a train ticket booking system where, at exactly 10 AM, lakhs of people rush to book a small number of Tatkal seats, and no seat may ever be sold twice.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>The spike is the problem:</strong> almost all traffic comes in the first few minutes. You can't just "add servers" at 10:00:05.</li>
          <li className="com-list-item"><strong>Waiting room:</strong> let users in a few at a time, like a token system at a bank, so the booking system is never flooded.</li>
          <li className="com-list-item"><strong>No double booking:</strong> the seat count must be strongly consistent. Use row locks or atomic updates.</li>
          <li className="com-list-item"><strong>Hold, then pay:</strong> a seat is held for a few minutes while you pay. If payment fails or times out, the seat goes back.</li>
          <li className="com-list-item"><strong>Stop bots:</strong> rate limiting and CAPTCHA, so real people get a fair chance.</li>
        </ol>
      </div>

      <section id="requirements" className="method-section">
        <h2 className="method-title">Step 1: Ask Questions (Requirements)</h2>
        <p className="com-text">Note: this is a good design for this kind of problem, not the real internal design of IRCTC.</p>
        <h3 className="com-subtitle">What the system must do (functional)</h3>
        <ol className="com-list">
          <li className="com-list-item"><strong>Search trains:</strong> between two stations on a date, with seat availability.</li>
          <li className="com-list-item"><strong>Book Tatkal seats:</strong> booking opens at a fixed time (10 AM for AC, 11 AM for non-AC). Add passengers, pick class, book.</li>
          <li className="com-list-item"><strong>Pay:</strong> through a payment gateway (UPI, card, net banking).</li>
          <li className="com-list-item"><strong>Waiting list:</strong> when seats are gone, give a waiting list ticket.</li>
          <li className="com-list-item"><strong>Cancel:</strong> cancel a ticket and move waiting list people up.</li>
        </ol>
        <h3 className="com-subtitle">How well it must work (non-functional)</h3>
        <ol className="com-list">
          <li className="com-list-item"><strong>Correct above all:</strong> never sell one seat to two people. Here consistency is more important than speed.</li>
          <li className="com-list-item"><strong>Survive the spike:</strong> the site must not crash at 10 AM. Being slow but fair is better than crashing.</li>
          <li className="com-list-item"><strong>Fair:</strong> real users first, bots blocked.</li>
          <li className="com-list-item"><strong>No lost money:</strong> if money is cut but no ticket is made, refund it.</li>
        </ol>
      </section>

      <section id="estimation" className="method-section">
        <h2 className="method-title">Step 2: Rough Numbers (Estimation)</h2>
        <p className="com-text">Made-up round numbers to understand the shape of the load, not real IRCTC numbers.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Users at 10 AM:</strong> say 10 lakh (1 million) people try to book in the first 5 minutes.</li>
          <li className="com-list-item"><strong>Requests:</strong> each user makes maybe 10 requests (login, search, pick train, add passengers, pay). 1 crore requests in 300 seconds = about 33,000 requests per second, with the first minute much higher.</li>
          <li className="com-list-item"><strong>Normal time:</strong> maybe a few hundred requests per second. So the peak is 100 times normal or more.</li>
          <li className="com-list-item"><strong>Seats:</strong> say a popular train has only a few hundred Tatkal seats. Lakhs of people fight for them.</li>
          <li className="com-list-item"><strong>Storage:</strong> small. A booking row is about 1 KB. Even lakhs of bookings a day is only a few GB. Storage is not the problem. The spike and correctness are.</li>
        </ol>
        <div className="example-box">
          <p className="example-label">What the numbers tell you</p>
          <p className="com-text">
            Most users will not get a seat no matter what you build. So the job is not "let everyone book". The job is: don't crash, don't double book, be fair, and tell people quickly when seats are gone.
          </p>
        </div>
      </section>

      <section id="apis" className="method-section">
        <h2 className="method-title">Step 3: APIs</h2>
        <CodeBlock language="text" style={atomDark}>
          {`GET  /trains?from=NDLS&to=BCT&date=2026-11-10   -> list trains + rough availability
POST /queue/join   { trainId, date, class }        -> get a queue token and your position
GET  /queue/status?token=...                       -> "position 5,231" or "your turn"
POST /bookings/hold                                -> hold seats for a few minutes
     Header: Idempotency-Key: 7f3a-...
     Body:   { queueToken, trainId, date, class, passengers: [...] }
POST /payments     { holdId }                      -> start payment, returns gateway URL
POST /payments/webhook                             -> payment gateway tells us success / fail
GET  /bookings/:pnr                                -> ticket status (CONFIRMED / WL 12 / FAILED)
POST /bookings/:pnr/cancel`}
        </CodeBlock>
        <ol className="com-list">
          <li className="com-list-item"><strong>Queue token:</strong> you can only call /bookings/hold with a valid token from the waiting room. Without it, the request is rejected at the gateway.</li>
          <li className="com-list-item"><strong>Idempotency-Key:</strong> a unique id the app makes for one booking attempt. If the user clicks "Book" twice, or the network retries, the server sees the same key and returns the first result instead of booking again.</li>
          <li className="com-list-item"><strong>Webhook:</strong> the payment gateway calls your server back to say how the payment went. Don't trust only the browser redirect, because the user may close the tab.</li>
        </ol>
        <CodeBlock language="javascript" style={atomDark}>
          {`// POST /bookings/hold  response
{
  "holdId": "H-88213",
  "status": "HELD",
  "seats": ["B2-34", "B2-36"],
  "amount": 3420,
  "expiresAt": "2026-11-09T10:07:00+05:30"   // pay before this, or seats go back
}`}
        </CodeBlock>
      </section>

      <section id="database" className="method-section">
        <h2 className="method-title">Step 4: Database</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Seat counts and bookings go in a SQL database with transactions, because money and seats must never go wrong.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Why SQL:</strong> you need ACID transactions (all steps happen together or none do) and row locks. PostgreSQL or MySQL fit well.</li>
            <li className="com-list-item"><strong>Inventory table:</strong> one row per train + date + class with the number of free seats. This row is the hot spot at 10 AM.</li>
            <li className="com-list-item"><strong>Search data:</strong> train timetables and routes change rarely, so put them in a cache or search index. Search never touches the inventory row.</li>
            <li className="com-list-item"><strong>Partitioning:</strong> split the inventory by train and date, so different trains don't fight over the same database server.</li>
            <li className="com-list-item definition-default"><strong>Defaults:</strong> PostgreSQL's default isolation level is Read Committed, and MySQL InnoDB's is Repeatable Read. Neither stops two plain SELECT-then-UPDATE requests from both seeing "1 seat left". So use SELECT ... FOR UPDATE or a single atomic UPDATE with a check.</li>
          </ol>
        </div>
        <CodeBlock language="sql" style={atomDark}>
          {`CREATE TABLE seat_inventory (
  train_id     INT  NOT NULL,
  journey_date DATE NOT NULL,
  class        VARCHAR(5) NOT NULL,       -- 3A, 2A, SL ...
  quota        VARCHAR(10) NOT NULL,      -- TATKAL, GENERAL ...
  total_seats  INT  NOT NULL,
  free_seats   INT  NOT NULL CHECK (free_seats >= 0),
  PRIMARY KEY (train_id, journey_date, class, quota)
);

CREATE TABLE seats (
  train_id     INT  NOT NULL,
  journey_date DATE NOT NULL,
  seat_no      VARCHAR(10) NOT NULL,      -- B2-34
  class        VARCHAR(5) NOT NULL,
  status       VARCHAR(10) NOT NULL,      -- FREE, HELD, BOOKED
  hold_id      BIGINT,
  PRIMARY KEY (train_id, journey_date, seat_no)
);

CREATE TABLE bookings (
  id              BIGINT PRIMARY KEY,
  pnr             VARCHAR(10) UNIQUE,
  user_id         BIGINT NOT NULL,
  train_id        INT NOT NULL,
  journey_date    DATE NOT NULL,
  status          VARCHAR(15) NOT NULL,  -- HELD, CONFIRMED, WAITLIST, EXPIRED, CANCELLED
  waitlist_no     INT,
  amount          NUMERIC(10,2) NOT NULL,
  idempotency_key VARCHAR(64) UNIQUE NOT NULL,
  hold_expires_at TIMESTAMP,
  created_at      TIMESTAMP NOT NULL
);

CREATE TABLE payments (
  id          BIGINT PRIMARY KEY,
  booking_id  BIGINT NOT NULL REFERENCES bookings(id),
  gateway_ref VARCHAR(64) UNIQUE,
  status      VARCHAR(10) NOT NULL,      -- PENDING, SUCCESS, FAILED
  created_at  TIMESTAMP NOT NULL
);`}
        </CodeBlock>
        <ol className="com-list">
          <li className="com-list-item"><strong>CHECK (free_seats &gt;= 0):</strong> a safety net. Even if the code has a bug, the database will refuse to go below zero.</li>
          <li className="com-list-item"><strong>UNIQUE idempotency_key:</strong> the same booking attempt can never create two rows.</li>
        </ol>
      </section>

      <section id="architecture" className="method-section">
        <h2 className="method-title">Step 5: Draw the Boxes (Architecture)</h2>
        <CodeBlock language="text" style={atomDark}>
          {`  Users (web / app)
        |
        v
 +-------------+        static pages, JS, images
 |    CDN      |-------------------------------------+
 +-------------+                                     |
        |                                            |
        v                                            |
 +--------------------------------+                  |
 |  WAF + Rate Limiter + CAPTCHA  |  blocks bots,    |
 +--------------------------------+  too many hits   |
        |                                            |
        v                                            |
 +------------------+      +-------------------+     |
 |  Load Balancer   |----->| Waiting Room /    |     |
 +------------------+      | Queue Service     |     |
        |                  | (Redis: position) |     |
        |                  +-------------------+     |
        |                    | lets N users/sec in   |
        v                    v                       |
 +--------------+    +-------------------+           |
 | Search Svc   |    |  Booking Service  |           |
 +--------------+    +-------------------+           |
   |       |            |        |      \\            |
   v       v            v        v       \\           |
 Redis  Read        Inventory  Bookings   +--> Payment Service --> Payment Gateway
 cache  replicas    (primary DB, strong        |          ^             |
 (trains,           consistency, row lock)     |          |  webhook    |
 routes)                                       |          +-------------+
                                               v
                                  Queue (Kafka) --> Workers:
                                    - expire unpaid holds
                                    - move waiting list up
                                    - send SMS / email ticket`}
        </CodeBlock>
        <h3 className="com-subtitle">Flow: booking a Tatkal ticket</h3>
        <ol className="com-list">
          <li className="com-list-item">Before 10 AM, the user logs in and fills passenger details (so the 10 AM requests are small).</li>
          <li className="com-list-item">At 10 AM the user joins the waiting room and gets a token and a position.</li>
          <li className="com-list-item">When it is their turn, the Booking Service checks the token and tries to hold seats in one database transaction.</li>
          <li className="com-list-item">If seats are held, the user has a few minutes to pay. The Payment Service sends them to the gateway.</li>
          <li className="com-list-item">The gateway calls the webhook. On success: mark booking CONFIRMED, seats BOOKED, generate PNR, send SMS.</li>
          <li className="com-list-item">On failure or timeout: a worker releases the seats back to the pool.</li>
        </ol>
      </section>

      <section id="deep-dive" className="method-section">
        <h2 className="method-title">Step 6: Make It Scale (Deep Dive)</h2>

        <h3 className="com-subtitle">1. Surviving the 10 AM spike: the virtual waiting room</h3>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">A virtual waiting room is a line outside the shop. Everyone gets a number, and only a fixed number of people are let inside each second.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Why:</strong> the booking database can do only so many safe transactions per second. If 10 lakh requests hit it at once, everything slows down and times out, and nobody gets a ticket.</li>
            <li className="com-list-item"><strong>How:</strong> keep a counter in Redis. Each user who joins gets the next number (INCR). Another counter says "now serving up to number X". X moves forward at a speed the booking system can handle.</li>
            <li className="com-list-item"><strong>The page:</strong> the user sees "You are number 5,231. About 2 minutes left." and the page checks status every few seconds.</li>
            <li className="com-list-item"><strong>Early exit:</strong> once the seats are sold out, tell everyone in the line right away so they can try another train.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            When big concert tickets or iPhone pre-orders go live, many sites show a "You are in the queue" page. That is a virtual waiting room. Being in a line for 2 minutes feels much better than a page that keeps showing "Service Unavailable".
          </p>
        </div>
        <p className="com-text"><strong>Stopping bots:</strong></p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Rate limiting:</strong> allow only a few requests per user, per IP and per device each second. Extra requests get HTTP 429 (too many requests).</li>
          <li className="com-list-item"><strong>CAPTCHA:</strong> a small puzzle that is easy for people and hard for scripts. Put it at login and at the booking step.</li>
          <li className="com-list-item"><strong>One active booking per user:</strong> one account can't hold seats on 10 tabs at once.</li>
          <li className="com-list-item"><strong>Pre-scaling:</strong> auto-scaling takes minutes, and the spike lasts minutes. So add servers at 9:30 AM, warm up caches, and keep them till the rush is over. The time is known, so plan for it.</li>
        </ol>

        <h3 className="com-subtitle">2. No double booking: locking the seat count</h3>
        <p className="com-text">
          The classic bug: two users read "1 seat left" at the same time, both think they got it, and both get a ticket. This is called a race condition (two requests racing to change the same data).
        </p>
        <CodeBlock language="text" style={atomDark}>
          {`WRONG (race condition)
User A: SELECT free_seats  -> 1
User B: SELECT free_seats  -> 1
User A: UPDATE free_seats = 0   -> books seat
User B: UPDATE free_seats = 0   -> ALSO books seat   (double booking!)`}
        </CodeBlock>
        <p className="com-text"><strong>Fix 1: atomic update with a check.</strong> One single statement checks and changes the number. The database runs it safely, one at a time per row.</p>
        <CodeBlock language="sql" style={atomDark}>
          {`UPDATE seat_inventory
SET    free_seats = free_seats - 2
WHERE  train_id = 12951 AND journey_date = '2026-11-10'
  AND  class = '3A' AND quota = 'TATKAL'
  AND  free_seats >= 2;
-- 1 row updated  -> you got the seats
-- 0 rows updated -> not enough seats, give waiting list`}
        </CodeBlock>
        <p className="com-text"><strong>Fix 2: lock the row first</strong> (when you need to pick exact seat numbers too).</p>
        <CodeBlock language="sql" style={atomDark}>
          {`BEGIN;
SELECT free_seats FROM seat_inventory
WHERE  train_id = 12951 AND journey_date = '2026-11-10'
  AND  class = '3A' AND quota = 'TATKAL'
FOR UPDATE;               -- other requests wait here until we COMMIT

-- pick 2 FREE seats and mark them HELD
UPDATE seats SET status = 'HELD', hold_id = 88213
WHERE  (train_id, journey_date, seat_no) IN (
  SELECT train_id, journey_date, seat_no FROM seats
  WHERE  train_id = 12951 AND journey_date = '2026-11-10'
    AND  class = '3A' AND status = 'FREE'
  LIMIT 2
  FOR UPDATE SKIP LOCKED  -- skip seats someone else is taking right now
);

UPDATE seat_inventory SET free_seats = free_seats - 2 WHERE ...;
INSERT INTO bookings (...) VALUES (...);   -- status HELD
COMMIT;`}
        </CodeBlock>
        <ol className="com-list">
          <li className="com-list-item"><strong>Hot row problem:</strong> every request for one train waits on the same row lock. The waiting room helps a lot here, because it controls how many requests reach this row.</li>
          <li className="com-list-item"><strong>Redis option:</strong> keep the free count in Redis and use <code>DECRBY</code> (or a small Lua script that checks and decrements in one step). Redis runs commands one at a time, so it is atomic and very fast. If the result is below zero, add it back and say "sold out". Then write the booking to the DB. The DB stays the final truth, and you must handle Redis and DB getting out of sync.</li>
          <li className="com-list-item"><strong>Never trust a cache for the final count:</strong> the "Available 45" on the search page can come from a cache or replica and be a little old. The real check always happens in the primary database (or the single atomic Redis counter) at booking time.</li>
        </ol>

        <h3 className="com-subtitle">3. Seat hold, payment, and what happens when payment fails</h3>
        <p className="com-text">
          Payment takes time (OTP, UPI app, slow bank). You can't keep a database lock open for 3 minutes. So you hold the seat instead.
        </p>
        <CodeBlock language="text" style={atomDark}>
          {`             hold seats (DB txn)
   [FREE] ------------------------------> [HELD]  (expires in ~5 min)
     ^                                    |   |
     |       payment failed / timed out   |   |  payment success (webhook)
     +------------------------------------+   v
                                          [BOOKED] -> PNR + SMS`}
        </CodeBlock>
        <ol className="com-list">
          <li className="com-list-item"><strong>Hold with expiry:</strong> the seat is HELD with hold_expires_at = now + 5 minutes. Nobody else can take it during this time.</li>
          <li className="com-list-item"><strong>Payment success:</strong> the webhook marks the booking CONFIRMED and the seats BOOKED in one transaction.</li>
          <li className="com-list-item"><strong>Payment failed:</strong> mark the booking FAILED and put the seats back to FREE (free_seats + 2).</li>
          <li className="com-list-item"><strong>User just leaves:</strong> a background worker runs every few seconds and releases holds where hold_expires_at is in the past.</li>
          <li className="com-list-item"><strong>Money cut but webhook late:</strong> the hard case. The payment may succeed after the hold expired. Before releasing a hold, ask the gateway for the payment status. If money came after the seat was gone, book from waiting list or auto-refund. Never keep money without a ticket.</li>
          <li className="com-list-item"><strong>Idempotency everywhere:</strong> the gateway may send the same webhook twice. Use gateway_ref as UNIQUE and check the current status before changing it, so the second webhook does nothing.</li>
        </ol>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            You may have seen this on many booking sites: "Money deducted but ticket not booked. Amount will be refunded in a few days." That is the system safely handling a late or failed payment: it did not give a seat it no longer had, and it sends the money back.
          </p>
        </div>

        <h3 className="com-subtitle">4. Waiting list</h3>
        <ol className="com-list">
          <li className="com-list-item">When the atomic update returns 0 rows, create the booking with status WAITLIST and the next waiting number for that train, date and class.</li>
          <li className="com-list-item">When someone cancels, a worker (using the queue) gives the free seat to WL 1, then WL 2 moves up, and so on, all in a transaction.</li>
          <li className="com-list-item">Send an SMS when the waiting list ticket gets confirmed.</li>
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
              <tr><td>Strong consistency for seats</td><td>Never a double booking</td><td>Slower, the hot row becomes a bottleneck</td></tr>
              <tr><td>Virtual waiting room</td><td>System never floods, fair order</td><td>Users wait, an extra service to run</td></tr>
              <tr><td>Atomic SQL update</td><td>Simple and safe</td><td>Every request waits on one row</td></tr>
              <tr><td>Redis counter</td><td>Very fast</td><td>Must keep Redis and DB in sync</td></tr>
              <tr><td>Seat hold with timeout</td><td>No long DB locks during payment</td><td>Seats are stuck for a few minutes if users leave</td></tr>
              <tr><td>Cache / replicas for search</td><td>Search stays fast in the spike</td><td>Shown availability can be a little old</td></tr>
              <tr><td>Pre-scaling at 9:30</td><td>Ready before the spike</td><td>Paying for extra servers for a while</td></tr>
            </tbody>
          </table>
        </div>
        <p className="com-text">
          The main line to say in the interview: "For this system I pick consistency over availability for the seat count. It is better to show 'please wait' than to sell one seat twice."
        </p>
        <p className="com-text">What you would do next:</p>
        <ol className="com-list">
          <li className="com-list-item">Split the seat inventory by train and date across more database servers.</li>
          <li className="com-list-item">Better bot detection (device fingerprint, booking patterns).</li>
          <li className="com-list-item">A reconciliation job that matches every payment with a ticket or a refund at the end of the day.</li>
        </ol>
      </section>
    </div>
  );
}

export default SystemDesignIRCTC;
