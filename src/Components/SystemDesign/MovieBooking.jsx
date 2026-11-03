import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function LLDMovieBooking() {
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
      <h1 className="title">LLD: Movie Ticket Booking</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">We are building the booking part of an app like BookMyShow: you pick a movie, a show and seats, pay, and get a ticket, and two people must never get the same seat.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Easy part:</strong> classes like Movie, Theatre, Screen, Show, Seat, Booking and Payment.</li>
          <li className="com-list-item"><strong>Hard part:</strong> many people click the same seat at the same second. This is a race condition, and the interviewer mainly wants to see how you handle it.</li>
          <li className="com-list-item"><strong>Main idea:</strong> when you pick seats, they are locked for you for a short time (like 10 minutes). If you pay in time, they become yours. If not, the lock ends and others can book them.</li>
          <li className="com-list-item"><strong>Safety net:</strong> a unique rule in the database, so even if the code has a bug, one seat can be booked only once per show.</li>
        </ol>
      </div>

      <section id="requirements" className="method-section">
        <h2 className="method-title">Requirements</h2>
        <p className="com-text"><strong>Functional:</strong></p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Browse:</strong> see movies in a city, then theatres and show timings for a movie.</li>
          <li className="com-list-item"><strong>Seat map:</strong> see which seats are free, locked or booked for a show.</li>
          <li className="com-list-item"><strong>Select seats:</strong> pick one or more seats. They get locked for you for 10 minutes.</li>
          <li className="com-list-item"><strong>Pay:</strong> pay within the time. On success, the booking is confirmed and you get a ticket.</li>
          <li className="com-list-item"><strong>Fail or timeout:</strong> if payment fails or time runs out, the seats become free again.</li>
        </ol>
        <p className="com-text"><strong>Non-functional:</strong></p>
        <ol className="com-list">
          <li className="com-list-item"><strong>No double booking:</strong> this is the number one rule. Being correct matters more than being fast here.</li>
          <li className="com-list-item"><strong>Handles rush:</strong> a big movie's first day show can get thousands of users at once.</li>
          <li className="com-list-item"><strong>Safe retries:</strong> if the payment gateway calls us twice for the same payment, we must not book twice or charge twice.</li>
        </ol>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Bookings open for a big Rajinikanth movie at 9 AM. You and your friend in another city both tap seat F12 for the first show at the same moment. One of you must see "Seat locked, pick another". The other gets a 10 minute timer to pay. If that person closes the app without paying, F12 shows up as free again after 10 minutes.
          </p>
        </div>
      </section>

      <section id="entities" className="method-section">
        <h2 className="method-title">Entities (classes)</h2>
        <ol className="com-list">
          <li className="com-list-item"><strong>Movie:</strong> name, language, duration.</li>
          <li className="com-list-item"><strong>Theatre:</strong> name, city, and a list of screens.</li>
          <li className="com-list-item"><strong>Screen:</strong> one hall inside a theatre. Has a fixed list of seats.</li>
          <li className="com-list-item"><strong>Seat:</strong> row and number (like F12) and type (REGULAR, PREMIUM). It belongs to a screen, not to a show.</li>
          <li className="com-list-item"><strong>Show:</strong> one movie on one screen at one time. The same seat F12 is a different thing to book in the 3 PM show and the 6 PM show.</li>
          <li className="com-list-item"><strong>Booking:</strong> user, show, seats, amount and status (PENDING, CONFIRMED, FAILED, EXPIRED).</li>
          <li className="com-list-item"><strong>Payment:</strong> booking id, gateway payment id, amount, status.</li>
          <li className="com-list-item"><strong>BookingService:</strong> the class that does the work: lock seats, confirm booking, release seats.</li>
        </ol>
        <CodeBlock language="text" style={atomDark}>
          {`Theatre 1---* Screen 1---* Seat
                 |1
                 |*
Movie 1------* Show  (movie + screen + startTime)
                 |1
                 |*
              Booking *---* Seat   (via booked_seats)
                 |1
                 |1
              Payment

+--------------------------+
|      BookingService      |
| lockSeats(user, show,    |
|           seatIds)       |
| confirmBooking(bookingId,|
|           paymentId)     |
| releaseSeats(bookingId)  |
+--------------------------+`}
        </CodeBlock>
      </section>

      <section id="race-condition" className="method-section">
        <h2 className="method-title">The race condition (the key part)</h2>
        <p className="com-text">
          A race condition means the result depends on who is a few milliseconds faster. Look at this simple (wrong) code:
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`// WRONG: check, then write
const seat = await db.query('SELECT status FROM show_seats WHERE show_id = $1 AND seat_id = $2', [showId, seatId]);
if (seat.rows[0].status === 'FREE') {
  await db.query("UPDATE show_seats SET status = 'BOOKED' WHERE show_id = $1 AND seat_id = $2", [showId, seatId]);
}`}
        </CodeBlock>
        <ol className="com-list">
          <li className="com-list-item"><strong>User A</strong> reads F12: FREE.</li>
          <li className="com-list-item"><strong>User B</strong> reads F12: FREE (A has not written yet).</li>
          <li className="com-list-item"><strong>User A</strong> writes BOOKED.</li>
          <li className="com-list-item"><strong>User B</strong> also writes BOOKED. Now both think they have F12.</li>
        </ol>
        <p className="com-text">The fix is to make "check and take" one single step that only one person can win. Here are the ways:</p>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Seat locking at the database level means the database itself makes sure only one person can hold or book a seat at a time.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Temporary lock with Redis:</strong> SET seat_lock:show42:F12 userA NX EX 600. NX means "only set if the key does not exist", EX 600 means "delete it after 600 seconds (10 min)". Only one user gets OK back, everyone else gets null.</li>
            <li className="com-list-item"><strong>Temporary lock in the DB:</strong> a locked_until column. UPDATE show_seats SET locked_by = $user, locked_until = now() + interval '10 minutes' WHERE ... AND (locked_until IS NULL OR locked_until &lt; now()) AND status = 'FREE'. If 1 row changed, you got the seat. If 0, someone else has it.</li>
            <li className="com-list-item"><strong>SELECT ... FOR UPDATE:</strong> inside a transaction, this locks the rows you read. A second transaction that tries to read the same rows FOR UPDATE waits until the first one commits. So "check then write" becomes safe.</li>
            <li className="com-list-item"><strong>Unique constraint:</strong> UNIQUE (show_id, seat_id) on the booked seats table. The database refuses a second row for the same seat. This is the last safety net, even if all other code fails.</li>
            <li className="com-list-item"><strong>Release:</strong> on payment failure, delete the locks right away. On timeout, the Redis key expires by itself (or locked_until passes), so the seat is free again.</li>
            <li className="com-list-item definition-default"><strong>Defaults:</strong> PostgreSQL's default isolation level is Read Committed, so two transactions can both read a seat as free at the same time unless you lock the row (FOR UPDATE) or use an atomic conditional UPDATE. Redis keys never expire unless you set EX or PX (or call EXPIRE), so a lock set without EX would hold the seat forever.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            It is like the trial room in a clothes shop. When you go in, you hang the "occupied" sign (the lock). Others wait or pick another room. If you don't come out in 10 minutes, the staff removes the sign (the expiry). And the room has one door that only fits one person (the unique constraint), so two people can never be inside at once.
          </p>
        </div>
      </section>

      <section id="code" className="method-section">
        <h2 className="method-title">Code</h2>
        <p className="com-text"><strong>Part 1: the tables (PostgreSQL).</strong></p>
        <CodeBlock language="sql" style={atomDark}>
          {`CREATE TABLE bookings (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL,
  show_id     BIGINT NOT NULL REFERENCES shows(id),
  amount      NUMERIC(10, 2) NOT NULL,
  status      TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, CONFIRMED, FAILED, EXPIRED
  expires_at  TIMESTAMPTZ NOT NULL,            -- created_at + 10 minutes
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One row per seat in a booking
CREATE TABLE booked_seats (
  booking_id  BIGINT NOT NULL REFERENCES bookings(id),
  show_id     BIGINT NOT NULL,
  seat_id     BIGINT NOT NULL,
  UNIQUE (show_id, seat_id)   -- last safety net: a seat is sold only once per show
);

CREATE TABLE payments (
  id                  BIGSERIAL PRIMARY KEY,
  booking_id          BIGINT NOT NULL REFERENCES bookings(id),
  gateway_payment_id  TEXT NOT NULL UNIQUE,  -- makes the callback idempotent
  status              TEXT NOT NULL,          -- SUCCESS, FAILED
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);`}
        </CodeBlock>
        <p className="com-text"><strong>Part 2: types.</strong></p>
        <CodeBlock language="typescript" style={atomDark}>
          {`import Redis from 'ioredis';
import { Pool } from 'pg';

enum BookingStatus { PENDING = 'PENDING', CONFIRMED = 'CONFIRMED', FAILED = 'FAILED', EXPIRED = 'EXPIRED' }

interface Booking {
  id: number;
  userId: number;
  showId: number;
  seatIds: number[];
  status: BookingStatus;
}

const LOCK_SECONDS = 600; // 10 minutes
const lockKey = (showId: number, seatId: number) => \`seat_lock:\${showId}:\${seatId}\`;`}
        </CodeBlock>
        <p className="com-text"><strong>Part 3: lockSeats.</strong> Try to lock every seat. If even one fails, give back the ones you took (all or nothing).</p>
        <CodeBlock language="typescript" style={atomDark}>
          {`// Delete the key only if it still belongs to this user (so we never free someone else's lock)
const RELEASE_SCRIPT = \`
  if redis.call('GET', KEYS[1]) == ARGV[1] then
    return redis.call('DEL', KEYS[1])
  end
  return 0\`;

class BookingService {
  constructor(private redis: Redis, private db: Pool) {}

  async lockSeats(userId: number, showId: number, seatIds: number[]): Promise<number> {
    const taken: number[] = [];
    for (const seatId of seatIds) {
      // NX = only if free, EX = auto-expire after 10 min
      const ok = await this.redis.set(lockKey(showId, seatId), String(userId), 'EX', LOCK_SECONDS, 'NX');
      if (ok !== 'OK') {
        await this.releaseLocks(userId, showId, taken);
        throw new Error(\`Seat \${seatId} is already locked. Please pick another.\`);
      }
      taken.push(seatId);
    }

    // Create a PENDING booking that the payment will point to
    const res = await this.db.query(
      \`INSERT INTO bookings (user_id, show_id, amount, status, expires_at)
       VALUES ($1, $2, $3, 'PENDING', now() + interval '10 minutes') RETURNING id\`,
      [userId, showId, seatIds.length * 200],
    );
    const bookingId = res.rows[0].id;
    await this.redis.set(\`booking_seats:\${bookingId}\`, JSON.stringify(seatIds), 'EX', LOCK_SECONDS);
    return bookingId;
  }

  async releaseLocks(userId: number, showId: number, seatIds: number[]): Promise<void> {
    for (const seatId of seatIds) {
      await this.redis.eval(RELEASE_SCRIPT, 1, lockKey(showId, seatId), String(userId));
    }
  }`}
        </CodeBlock>
        <p className="com-text"><strong>Part 4: confirmBooking.</strong> Called by the payment gateway callback (webhook). It may be called twice, so it must be idempotent: calling it again gives the same result and does nothing extra.</p>
        <CodeBlock language="typescript" style={atomDark}>
          {`  async confirmBooking(bookingId: number, gatewayPaymentId: string, paid: boolean): Promise<BookingStatus> {
    const client = await this.db.connect();
    try {
      await client.query('BEGIN');
      // Lock the booking row: a second callback for the same booking waits here
      const { rows } = await client.query('SELECT * FROM bookings WHERE id = $1 FOR UPDATE', [bookingId]);
      const booking = rows[0];
      if (!booking) throw new Error('Booking not found');
      if (booking.status !== BookingStatus.PENDING) {
        await client.query('COMMIT');
        return booking.status; // already handled: idempotent, do nothing
      }

      // Save the payment once. UNIQUE gateway_payment_id blocks duplicates.
      await client.query(
        'INSERT INTO payments (booking_id, gateway_payment_id, status) VALUES ($1, $2, $3)',
        [bookingId, gatewayPaymentId, paid ? 'SUCCESS' : 'FAILED'],
      );

      const seatIds: number[] = JSON.parse((await this.redis.get(\`booking_seats:\${bookingId}\`)) ?? '[]');
      const late = new Date(booking.expires_at) < new Date();

      if (!paid || late || seatIds.length === 0) {
        const status = paid ? BookingStatus.EXPIRED : BookingStatus.FAILED; // EXPIRED + paid = refund
        await client.query('UPDATE bookings SET status = $1 WHERE id = $2', [status, bookingId]);
        await client.query('COMMIT');
        await this.releaseLocks(booking.user_id, booking.show_id, seatIds);
        return status;
      }

      for (const seatId of seatIds) {
        // If somehow the seat is already sold, the UNIQUE constraint throws and we roll back
        await client.query(
          'INSERT INTO booked_seats (booking_id, show_id, seat_id) VALUES ($1, $2, $3)',
          [bookingId, booking.show_id, seatId],
        );
      }
      await client.query("UPDATE bookings SET status = 'CONFIRMED' WHERE id = $1", [bookingId]);
      await client.query('COMMIT');
      await this.releaseLocks(booking.user_id, booking.show_id, seatIds); // DB now owns the seats
      return BookingStatus.CONFIRMED;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}`}
        </CodeBlock>
        <p className="com-text">
          A small cron job (a task that runs every minute) can mark old PENDING bookings as EXPIRED. The Redis locks free themselves because of EX, so the seats come back without any extra code.
        </p>
      </section>

      <section id="patterns" className="method-section">
        <h2 className="method-title">Patterns and ideas used</h2>
        <ol className="com-list">
          <li className="com-list-item"><strong>Distributed lock:</strong> a Redis key that all your servers can see, so the lock works even with 10 API servers behind a load balancer.</li>
          <li className="com-list-item"><strong>Defense in depth:</strong> Redis lock first, row lock (FOR UPDATE) next, UNIQUE constraint last. If one layer has a bug, the next one catches it.</li>
          <li className="com-list-item"><strong>Idempotency:</strong> the status check plus UNIQUE gateway_payment_id means a repeated callback changes nothing.</li>
          <li className="com-list-item"><strong>State machine:</strong> a booking moves only PENDING to CONFIRMED, FAILED or EXPIRED. Never back. This keeps the logic simple to reason about.</li>
          <li className="com-list-item"><strong>Strategy:</strong> pricing (weekend, premium seats) and payment methods (UPI, card, wallet) can each be a strategy interface, like in the Parking Lot.</li>
          <li className="com-list-item"><strong>Single Responsibility and Dependency Inversion:</strong> BookingService only handles booking. It gets Redis and the DB pool through the constructor, which is how NestJS injects providers, and it makes tests easy with fakes.</li>
        </ol>
      </section>

      <section id="follow-ups" className="method-section">
        <h2 className="method-title">Follow-up questions</h2>
        <ol className="com-list">
          <li className="com-list-item"><strong>Why lock for 10 minutes and not book directly?</strong> Payment takes time (OTP, UPI app). Without a hold, someone else could take the seat while you are paying.</li>
          <li className="com-list-item"><strong>What if Redis goes down?</strong> The DB constraint still stops double booking. You can also use the DB locked_until column instead of Redis, which is slower but needs one less system.</li>
          <li className="com-list-item"><strong>Payment succeeded but the lock already expired. What now?</strong> Mark the booking EXPIRED and refund the money automatically. Never give a seat that may already be sold to someone else.</li>
          <li className="com-list-item"><strong>Pessimistic vs optimistic locking?</strong> Pessimistic = lock first, then change (FOR UPDATE). Optimistic = add a version column and update only WHERE version = old version. If 0 rows change, retry. For hot seats, pessimistic or Redis locks work better.</li>
          <li className="com-list-item"><strong>How do users see seats change live?</strong> Push seat status over WebSockets, or poll the seat map every few seconds.</li>
          <li className="com-list-item"><strong>How do you handle a huge rush?</strong> Put users in a virtual waiting room (a queue) and let in a few thousand at a time. Cache the movie and show lists, since they rarely change.</li>
          <li className="com-list-item"><strong>Why loop SET NX for each seat? Is it atomic?</strong> No, it is not one step, which is why we release the taken seats if one fails. You can make it one step with a Lua script that checks all seats and sets them together.</li>
        </ol>
      </section>
    </div>
  );
}

export default LLDMovieBooking;
