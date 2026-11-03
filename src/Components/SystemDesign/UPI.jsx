import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function SystemDesignUPI() {
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
      <h1 className="title">Design UPI Payments</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">We are designing a system that lets you send money from your bank account to anyone else's bank account in a few seconds, using just a UPI ID or a QR code.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Many players:</strong> your app (like PhonePe or GPay), NPCI in the middle, your bank and the receiver's bank. The app does not hold your money; banks do.</li>
          <li className="com-list-item"><strong>UPI ID is an address:</strong> riya@okbank points to a real bank account, so you never share account numbers.</li>
          <li className="com-list-item"><strong>PIN is checked by your bank:</strong> the app never sees your UPI PIN in plain text.</li>
          <li className="com-list-item"><strong>Money first leaves, then arrives:</strong> debit from your bank, then credit to the receiver's bank. If the credit fails, the debit is reversed.</li>
          <li className="com-list-item"><strong>Correctness over speed:</strong> every payment has a unique id and moves through clear states, so money is never lost or sent twice.</li>
        </ol>
      </div>

      <section id="requirements" className="method-section">
        <h2 className="method-title">Step 1: Ask Questions (Requirements)</h2>
        <p className="com-text">
          Note: this page explains a good design based on how UPI is publicly described. It is not the internal design of NPCI or any bank or app. In an interview, you are usually asked to design the payment app side (the PSP) plus how it talks to the switch and banks.
        </p>
        <h3 className="com-subtitle">What the system must do (functional)</h3>
        <ol className="com-list">
          <li className="com-list-item"><strong>Link bank account:</strong> link your bank account to the app and create a UPI ID.</li>
          <li className="com-list-item"><strong>Pay:</strong> send money to a UPI ID, a phone number, or by scanning a QR code.</li>
          <li className="com-list-item"><strong>Collect request:</strong> a shop or friend can request money; you approve with your PIN.</li>
          <li className="com-list-item"><strong>Status and history:</strong> see if a payment is success, failed or pending, and see past payments.</li>
          <li className="com-list-item"><strong>Refund:</strong> if money is cut but not received, it must come back.</li>
        </ol>
        <h3 className="com-subtitle">How well it must work (non-functional)</h3>
        <ol className="com-list">
          <li className="com-list-item"><strong>Never lose money:</strong> no double debit, no debit without credit (or refund). This is the most important rule.</li>
          <li className="com-list-item"><strong>Strong consistency:</strong> balances must always be correct. Eventual consistency is not OK for money.</li>
          <li className="com-list-item"><strong>Fast:</strong> a payment should finish in a few seconds.</li>
          <li className="com-list-item"><strong>Highly available:</strong> people pay for tea and groceries all day. Downtime means people can't pay.</li>
          <li className="com-list-item"><strong>Secure:</strong> PIN never exposed, every message signed and encrypted.</li>
        </ol>
      </section>

      <section id="estimation" className="method-section">
        <h2 className="method-title">Step 2: Rough Numbers (Estimation)</h2>
        <p className="com-text">UPI handles billions of transactions every month across India. For the interview, use your own round numbers for one payment app:</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Payments:</strong> say your app does 30 crore (300 million) payments a day. A day has about 1 lakh (100,000) seconds, so about 3,000 payments per second on average.</li>
          <li className="com-list-item"><strong>Peak:</strong> evenings, salary days and festivals can be several times higher. Plan for maybe 10,000+ per second.</li>
          <li className="com-list-item"><strong>Each payment is many messages:</strong> app to switch, switch to both banks, replies back. So internal calls are many times the payment count.</li>
          <li className="com-list-item"><strong>Storage:</strong> say one transaction record with its history is about 2 KB. 30 crore x 2 KB = about 600 GB a day. Payment records must be kept for years, so this grows into hundreds of TB.</li>
          <li className="com-list-item"><strong>Reads:</strong> history and status checks. Lower than payments in importance, but must not slow payments down.</li>
        </ol>
        <div className="example-box">
          <p className="example-label">What the numbers tell you</p>
          <p className="com-text">
            Writes are as important as reads here, and every write is money. So you need a database with transactions, split across many servers, and history reads moved to separate replicas so they don't slow down payments.
          </p>
        </div>
      </section>

      <section id="apis" className="method-section">
        <h2 className="method-title">Step 3: APIs</h2>
        <p className="com-text">These are the APIs your payment app's backend gives to the mobile app. The calls to NPCI and banks use their own fixed formats, so here we only show their idea.</p>
        <CodeBlock language="text" style={atomDark}>
          {`POST /vpa/resolve        { vpa: "riya@okbank" }        -> name of the receiver ("Riya Sharma")
POST /payments                                         -> start a payment
     Body: { txnId, payerVpa, payeeVpa, amount, note, encryptedPinBlock }
GET  /payments/:txnId                                  -> PENDING / SUCCESS / FAILED
GET  /payments?cursor=...                              -> history
POST /collect-requests   { fromVpa, amount }           -> ask someone to pay you

Calls between systems (idea only):
App backend (PSP) -> NPCI switch : Pay request (txnId, payer, payee, amount, encrypted PIN)
NPCI -> payer bank               : Debit request
NPCI -> payee bank               : Credit request
NPCI -> PSP                      : Final response
PSP  -> NPCI                     : Check status (txnId)   when no reply comes in time`}
        </CodeBlock>
        <ol className="com-list">
          <li className="com-list-item"><strong>txnId made by the app:</strong> the app makes a unique transaction id before sending. If the request is retried, the same id is sent, so the money is never sent twice. This is idempotency (doing the same thing twice has the same effect as doing it once).</li>
          <li className="com-list-item"><strong>encryptedPinBlock:</strong> the PIN is typed into a secure screen and encrypted for the bank. The backend only passes it along; it can't read it.</li>
          <li className="com-list-item"><strong>Resolve first:</strong> showing "Riya Sharma" before paying lets the user catch a wrong UPI ID.</li>
        </ol>
        <CodeBlock language="javascript" style={atomDark}>
          {`// GET /payments/TXN8f21c9  response
{
  "txnId": "TXN8f21c9",
  "status": "PENDING",            // PENDING -> SUCCESS or FAILED
  "amount": 250.00,
  "payee": { "vpa": "chaiwala@okbank", "name": "Ramesh Tea Stall" },
  "message": "Waiting for bank confirmation",
  "createdAt": "2026-11-03T18:42:10+05:30"
}`}
        </CodeBlock>
      </section>

      <section id="database" className="method-section">
        <h2 className="method-title">Step 4: Database</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Every payment is stored as a row that moves through states, and every money movement is written as a pair of entries that always add up to zero.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Why SQL:</strong> money needs ACID transactions. A = all or nothing, C = rules always hold, I = two payments don't mix up, D = once saved, never lost even if power goes.</li>
            <li className="com-list-item"><strong>Transactions table:</strong> one row per payment with its state. Shard by txnId or by payer, so load is spread across servers.</li>
            <li className="com-list-item"><strong>Ledger:</strong> an append-only list (you only add rows, never edit or delete) of every debit and credit. Balances can always be rebuilt from it.</li>
            <li className="com-list-item"><strong>VPA mapping:</strong> UPI ID to bank account mapping. Read very often, changes rarely, so cache it.</li>
            <li className="com-list-item definition-default"><strong>Defaults:</strong> PostgreSQL's default isolation level is Read Committed. For balance checks, update the balance with one atomic statement (or lock the row with SELECT ... FOR UPDATE) instead of reading it and writing it back later.</li>
          </ol>
        </div>
        <CodeBlock language="sql" style={atomDark}>
          {`-- In the payment app (PSP)
CREATE TABLE vpas (
  vpa            VARCHAR(100) PRIMARY KEY,   -- riya@okbank
  user_id        BIGINT NOT NULL,
  bank_code      VARCHAR(20) NOT NULL,
  account_ref    VARCHAR(64) NOT NULL,       -- a token / masked ref, not the full account number
  is_active      BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE transactions (
  txn_id        VARCHAR(40) PRIMARY KEY,     -- unique id, also the idempotency key
  payer_vpa     VARCHAR(100) NOT NULL,
  payee_vpa     VARCHAR(100) NOT NULL,
  amount        NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  status        VARCHAR(20) NOT NULL,        -- INITIATED, PENDING, SUCCESS, FAILED, REVERSED
  bank_ref      VARCHAR(40),                 -- reference number from the bank
  error_code    VARCHAR(20),
  created_at    TIMESTAMP NOT NULL,
  updated_at    TIMESTAMP NOT NULL
);

CREATE TABLE transaction_events (            -- full history of state changes
  id         BIGSERIAL PRIMARY KEY,
  txn_id     VARCHAR(40) NOT NULL REFERENCES transactions(txn_id),
  from_state VARCHAR(20),
  to_state   VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL
);

-- Inside a bank: double-entry ledger
CREATE TABLE ledger_entries (
  id          BIGSERIAL PRIMARY KEY,
  txn_id      VARCHAR(40) NOT NULL,
  account_id  BIGINT NOT NULL,
  direction   VARCHAR(6) NOT NULL,          -- DEBIT or CREDIT
  amount      NUMERIC(12,2) NOT NULL,
  created_at  TIMESTAMP NOT NULL,
  UNIQUE (txn_id, account_id, direction)    -- same txn can't debit twice
);`}
        </CodeBlock>
        <ol className="com-list">
          <li className="com-list-item"><strong>NUMERIC, not FLOAT:</strong> floats can't store 0.1 exactly, and money must be exact. (Many systems store paise as an integer instead.)</li>
          <li className="com-list-item"><strong>txn_id as PRIMARY KEY:</strong> the same payment can't be saved twice, even if the request comes twice.</li>
          <li className="com-list-item"><strong>transaction_events:</strong> an audit trail. When a user complains, you can see every step the payment went through.</li>
        </ol>
      </section>

      <section id="architecture" className="method-section">
        <h2 className="method-title">Step 5: Draw the Boxes (Architecture)</h2>
        <CodeBlock language="text" style={atomDark}>
          {`  Payer phone (PhonePe / GPay / any UPI app)
        |  pay riya@okbank Rs 250 + encrypted PIN
        v
 +------------------------------+
 |  PSP backend (payer's app)   |   API gateway, auth, rate limit,
 |  Payment Service             |   fraud check, saves txn as INITIATED
 +------------------------------+
        |  (1) pay request (txnId)
        v
 +------------------------------+
 |        NPCI UPI switch       |   central router: finds banks from VPA,
 |                              |   sends messages, keeps txn status
 +------------------------------+
     |  (2) debit             ^               |  (4) credit           ^
     v                        | (3) ok        v                       | (5) ok
 +----------------+           |        +----------------+             |
 |  Payer's bank  |-----------+        |  Payee's bank  |-------------+
 |  checks PIN,   |                    |  adds Rs 250   |
 |  balance,      |                    |  to Riya's     |
 |  debits Rs 250 |                    |  account       |
 +----------------+                    +----------------+
        |
        |  (6) final status: SUCCESS / FAILED
        v
 NPCI ---> PSP backend ---> payer phone ("Payment successful")
       \\
        +--> payee's PSP ---> Riya gets "Rs 250 received" notification`}
        </CodeBlock>
        <h3 className="com-subtitle">Flow: paying Rs 250 at a tea stall</h3>
        <ol className="com-list">
          <li className="com-list-item">You scan the QR. It holds the shop's UPI ID, name and maybe the amount.</li>
          <li className="com-list-item">You enter the amount and your UPI PIN on a secure screen. The PIN is encrypted right there on the phone.</li>
          <li className="com-list-item">Your app's backend (PSP) makes a txnId, saves the payment as INITIATED, and sends it to the NPCI switch.</li>
          <li className="com-list-item">NPCI finds your bank from your UPI ID and asks it to debit. Your bank checks the PIN and the balance, then takes out Rs 250.</li>
          <li className="com-list-item">NPCI then asks the shop's bank to credit Rs 250 to the shop's account.</li>
          <li className="com-list-item">Both say OK, so NPCI marks it SUCCESS and tells both apps. You see the green tick, and the shop's speaker says "Rs 250 received".</li>
        </ol>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Sometimes you see "Payment pending. Don't retry. We will update you." This means your bank took the money but no final answer came back in time. The app does not ask you to pay again. It keeps checking the status and later shows success, or a refund.
          </p>
        </div>
      </section>

      <section id="deep-dive" className="method-section">
        <h2 className="method-title">Step 6: Make It Scale (Deep Dive)</h2>

        <h3 className="com-subtitle">1. Never pay twice: idempotency</h3>
        <p className="com-text">
          The network is not reliable. Your app sends "pay Rs 250", the reply is lost, and the app retries. Without care, Rs 500 leaves your account.
        </p>
        <ol className="com-list">
          <li className="com-list-item"><strong>One payment = one txnId:</strong> made once, before the first try. Every retry uses the same id.</li>
          <li className="com-list-item"><strong>Check before doing:</strong> every system (PSP, switch, banks) first looks up the txnId. If it was already handled, it just returns the old result.</li>
          <li className="com-list-item"><strong>The database enforces it:</strong> txn_id is a PRIMARY KEY or UNIQUE, so even two requests at the same moment can't both insert it.</li>
        </ol>
        <CodeBlock language="javascript" style={atomDark}>
          {`async function debit(txnId, accountId, amount) {
  const existing = await db.ledger.find({ txnId, accountId, direction: 'DEBIT' });
  if (existing) return { status: 'SUCCESS', note: 'already done' };  // retry, do nothing

  // one DB transaction: reduce balance only if enough money, and write the ledger row
  return db.transaction(async (tx) => {
    const updated = await tx.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND balance >= $1',
      [amount, accountId]
    );
    if (updated.rowCount === 0) return { status: 'FAILED', reason: 'INSUFFICIENT_FUNDS' };
    await tx.ledger.insert({ txnId, accountId, direction: 'DEBIT', amount }); // UNIQUE key blocks duplicates
    return { status: 'SUCCESS' };
  });
}`}
        </CodeBlock>

        <h3 className="com-subtitle">2. Transaction states, timeouts and reversal</h3>
        <p className="com-text">A payment is a small state machine (a fixed set of states, and fixed rules for moving between them).</p>
        <CodeBlock language="text" style={atomDark}>
          {`INITIATED --> PENDING --> SUCCESS
                  |
                  +--> FAILED            (debit failed: wrong PIN, low balance)
                  |
                  +--> DEBITED_NOT_CREDITED --> REVERSED  (money goes back to payer)
                  |
                  +--> (no reply in time) --> check status again and again
                                              until SUCCESS / FAILED / REVERSED`}
        </CodeBlock>
        <ol className="com-list">
          <li className="com-list-item"><strong>Debit fails:</strong> wrong PIN or low balance. Nothing moved, so just mark FAILED.</li>
          <li className="com-list-item"><strong>Debit OK, credit fails:</strong> say the receiver's bank is down. Your money is out but not in. The system sends a reversal: a new credit back to your account with the same txnId as reference. Status becomes REVERSED.</li>
          <li className="com-list-item"><strong>Timeout (no reply):</strong> the worst case, because you don't know what happened. Never assume failure and never retry the debit blindly. Mark it PENDING and poll: ask "what is the status of txnId X?" every few seconds, then every few minutes.</li>
          <li className="com-list-item"><strong>Background jobs:</strong> a worker picks up all PENDING payments older than some time and checks their status, so nothing stays stuck forever.</li>
          <li className="com-list-item"><strong>Reconciliation:</strong> at the end of the day, banks and the switch match their records. Any mismatch (debited here, not credited there) is fixed with a refund.</li>
        </ol>

        <h3 className="com-subtitle">3. Strong consistency and the double-entry ledger</h3>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Double-entry means every rupee that leaves one account must enter another account. For every DEBIT row there is a matching CREDIT row, so the total always adds up to zero.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Why:</strong> money is never created or lost by a bug. If the sums don't match, you know something is wrong right away.</li>
            <li className="com-list-item"><strong>Never edit, only add:</strong> to undo a payment, you add a new reverse entry. You don't delete the old one. So the full history is always there.</li>
            <li className="com-list-item"><strong>Balance:</strong> is just the sum of an account's credits minus debits. Banks also keep a balance column for speed, updated in the same transaction as the ledger row.</li>
          </ol>
        </div>
        <CodeBlock language="text" style={atomDark}>
          {`txnId TXN8f21c9: Riya pays Ramesh Rs 250

account            DEBIT    CREDIT
Riya (savings)      250
UPI settlement               250      <- payer's bank side

UPI settlement      250               <- payee's bank side
Ramesh (current)             250
                   -----    ------
                    500      500      always equal`}
        </CodeBlock>
        <ol className="com-list">
          <li className="com-list-item"><strong>Why ACID matters here:</strong> "reduce balance" and "write ledger row" must happen together. If the server crashes in between, the transaction is rolled back (undone), so there is no half-done payment.</li>
          <li className="com-list-item"><strong>Isolation:</strong> two payments from the same account at the same moment must not both see "Rs 300 balance" and both take Rs 250. The atomic UPDATE with "balance &gt;= amount" stops this.</li>
          <li className="com-list-item"><strong>CAP choice:</strong> for money, you pick consistency. If the bank can't be sure, it says "failed" or "pending", never a wrong "success".</li>
        </ol>

        <h3 className="com-subtitle">4. High availability</h3>
        <ol className="com-list">
          <li className="com-list-item"><strong>No single point of failure:</strong> many copies of every service behind load balancers, in more than one data center.</li>
          <li className="com-list-item"><strong>Database replicas:</strong> a primary with synchronous replicas (the write is saved on a replica before saying OK), so a crash does not lose a confirmed payment.</li>
          <li className="com-list-item"><strong>Timeouts and circuit breakers:</strong> if one bank is slow, stop sending to it for a short time and show "bank is down, try another account", instead of making all payments slow. A circuit breaker is like a home fuse: it cuts off a failing part so the rest keeps working.</li>
          <li className="com-list-item"><strong>Separate history from payments:</strong> history and search read from replicas or a separate store, so a heavy "show my last 6 months" query never slows down live payments.</li>
          <li className="com-list-item"><strong>Security:</strong> all messages between PSP, switch and banks are encrypted and signed, and the device is bound to your SIM and phone during setup.</li>
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
              <tr><td>Strong consistency</td><td>Money is always correct</td><td>Slower, and a payment may fail when a system is unsure</td></tr>
              <tr><td>SQL with ACID</td><td>All-or-nothing money moves</td><td>Harder to scale; needs careful sharding</td></tr>
              <tr><td>Double-entry, append-only ledger</td><td>Full history, easy to audit and fix</td><td>More rows and more storage</td></tr>
              <tr><td>PENDING + status polling</td><td>No double debit on timeouts</td><td>User sees "pending" for a while</td></tr>
              <tr><td>Central switch (NPCI)</td><td>Any app works with any bank</td><td>The switch must be extremely reliable</td></tr>
              <tr><td>Synchronous replicas</td><td>No lost payment on crash</td><td>Each write is a bit slower</td></tr>
            </tbody>
          </table>
        </div>
        <p className="com-text">
          The main line to say in the interview: "In payments I choose correctness over speed. Every payment has a unique id, moves through clear states, and if I am not sure what happened, I check the status instead of retrying."
        </p>
        <p className="com-text">What you would do next:</p>
        <ol className="com-list">
          <li className="com-list-item">A fraud detection service that scores each payment (unusual amount, new device, new payee).</li>
          <li className="com-list-item">Notifications and a dispute (complaint) flow for "money cut, not received".</li>
          <li className="com-list-item">Archiving old transactions to cheaper storage after some time.</li>
        </ol>
      </section>
    </div>
  );
}

export default SystemDesignUPI;
