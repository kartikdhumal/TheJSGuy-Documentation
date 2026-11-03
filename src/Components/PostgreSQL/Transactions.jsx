import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function PostgreSQLTransactions() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Transactions, MVCC &amp; Locks</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">A transaction is a group of queries that work as one: either all of them succeed, or none of them do.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Example:</strong> sending money. Take 1000 from A and add 1000 to B. Both must happen, never only one.</li>
          <li className="com-list-item"><strong>MVCC:</strong> the way PostgreSQL lets many people read and write at the same time without waiting for each other.</li>
          <li className="com-list-item"><strong>Locks:</strong> a way to stop two people from changing the same row at the same time.</li>
          <li className="com-list-item definition-default"><strong>Defaults:</strong> isolation level is Read Committed. Auto-commit is on, so every query is its own transaction unless you write BEGIN. Autovacuum is on. A query waits for a lock forever (lock_timeout = 0). Deadlocks are checked after 1 second (deadlock_timeout).</li>
        </ol>
      </div>

      <section className="method-section">
        <h2 className="method-title">BEGIN, COMMIT, ROLLBACK</h2>
        <CodeBlock language="sql" style={atomDark}>
          {`BEGIN;
UPDATE accounts SET balance = balance - 1000 WHERE id = 1;
UPDATE accounts SET balance = balance + 1000 WHERE id = 2;
COMMIT;      -- save both

-- if something goes wrong
ROLLBACK;    -- undo everything since BEGIN`}
        </CodeBlock>
        <p className="com-text">
          SAVEPOINT lets you undo only part of a transaction: SAVEPOINT sp1; ... ROLLBACK TO sp1;
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">ACID in simple words</h2>
        <p className="com-text">
          Atomicity: all or nothing.
          Consistency: rules (keys, CHECK, NOT NULL) are always respected, so data never becomes invalid.
          Isolation: running transactions do not see each other's half-done work.
          Durability: once COMMIT returns, the data is safe even if the server crashes (it is written to the WAL log first).
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">What is MVCC?</h2>
        <p className="com-text">
          MVCC means Multi-Version Concurrency Control. When you UPDATE a row, PostgreSQL does not overwrite it. It creates a new version of the row and marks the old one as dead. Each transaction sees the version that was valid when it started. Because of this, readers never block writers and writers never block readers. The downside is that old dead rows pile up, and VACUUM has to clean them.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">VACUUM and autovacuum</h2>
        <p className="com-text">
          VACUUM removes dead row versions so the space can be reused. ANALYZE updates statistics for the query planner. Autovacuum runs both automatically in the background; keep it ON. VACUUM FULL rewrites the whole table to give space back to the disk, but it locks the table, so avoid it on busy tables.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`VACUUM ANALYZE orders;

-- check dead rows per table
SELECT relname, n_live_tup, n_dead_tup, last_autovacuum
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Isolation levels</h2>
        <p className="com-text">
          Read Committed (default): each query sees data committed before that query started. Two SELECTs in the same transaction can see different data.
          Repeatable Read: the whole transaction sees one snapshot from when it started. If someone else changed the same row, your update fails and you retry.
          Serializable: strongest. Transactions behave as if they ran one by one. PostgreSQL may cancel one with a serialization error, so your app must retry.
          (Read Uncommitted exists in syntax, but PostgreSQL treats it as Read Committed, so dirty reads never happen.)
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`BEGIN ISOLATION LEVEL REPEATABLE READ;
SELECT balance FROM accounts WHERE id = 1;
-- ...
COMMIT;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Row locks: SELECT ... FOR UPDATE</h2>
        <p className="com-text">
          When you read a row and then update it based on what you read, another transaction can change it in between (race condition). FOR UPDATE locks the row until your transaction ends, so others wait.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`BEGIN;
SELECT stock FROM products WHERE id = 7 FOR UPDATE;   -- others wait here
-- app checks stock >= 1
UPDATE products SET stock = stock - 1 WHERE id = 7;
COMMIT;

-- job queue trick: each worker takes a different row, nobody waits
SELECT * FROM jobs WHERE status = 'pending'
ORDER BY id LIMIT 1
FOR UPDATE SKIP LOCKED;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Deadlock</h2>
        <p className="com-text">
          A deadlock happens when transaction A waits for a row locked by B, and B waits for a row locked by A. PostgreSQL detects this and cancels one of them with an error. To avoid it, always lock rows in the same order (for example, by id ascending) and keep transactions short.
        </p>
      </section>
    </div>
  );
}

export default PostgreSQLTransactions;
