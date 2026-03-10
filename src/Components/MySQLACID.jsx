import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function MySQLACID() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">ACID Properties in MySQL</h1>
      <p>
        ACID ensures reliable transactions: <strong>A</strong>tomicity, <strong>C</strong>onsistency, <strong>I</strong>solation, <strong>D</strong>urability. MySQL (InnoDB) supports ACID.
      </p>

      <div className="method-section">
        <h2 className="method-title">Atomicity</h2>
        <p>All operations in a transaction complete together, or none do. If one step fails, the whole transaction is rolled back.</p>
        <CodeBlock language="sql" style={atomDark}>
          {`START TRANSACTION;
UPDATE accounts SET balance = balance - 1000 WHERE id = 1;  -- Virat
UPDATE accounts SET balance = balance + 1000 WHERE id = 2;  -- Rohit
-- If either fails, both are rolled back
COMMIT;   -- or ROLLBACK;`}
        </CodeBlock>
        <p><strong>Example:</strong> Transfer ₹1000 from Virat to Rohit. Both debit and credit must succeed; otherwise neither happens.</p>
      </div>

      <div className="method-section">
        <h2 className="method-title">Consistency</h2>
        <p>The database moves from one valid state to another. All constraints (e.g. balance ≥ 0, foreign keys) remain satisfied.</p>
        <CodeBlock language="sql" style={atomDark}>
          {`-- Rule: total balance across accounts must not change on transfer
START TRANSACTION;
-- Debit and credit keep total same; if constraint fails, transaction aborted
COMMIT;`}
        </CodeBlock>
      </div>

      <div className="method-section">
        <h2 className="method-title">Isolation</h2>
        <p>Concurrent transactions do not see each other's uncommitted changes. One transfer does not interfere with another.</p>
        <CodeBlock language="sql" style={atomDark}>
          {`-- Transaction A: Virat -> Rohit 1000
-- Transaction B: Rohit -> Virat 500
-- They run as if one after the other; result is consistent`}
        </CodeBlock>
        <p>MySQL supports isolation levels: READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ (default), SERIALIZABLE.</p>
      </div>

      <div className="method-section">
        <h2 className="method-title">Durability</h2>
        <p>Once a transaction is committed, it stays committed even after a crash. Data is written to disk (e.g. redo logs).</p>
        <CodeBlock language="sql" style={atomDark}>
          {`COMMIT;  -- After this, transfer is permanent; server crash won't lose it`}
        </CodeBlock>
      </div>

      <div className="method-section">
        <h2 className="method-title">Simple transaction example</h2>
        <CodeBlock language="sql" style={atomDark}>
          {`START TRANSACTION;

INSERT INTO orders (user_id, total) VALUES (1, 99.99);
INSERT INTO order_items (order_id, product_id, qty) VALUES (LAST_INSERT_ID(), 5, 2);

COMMIT;   -- both inserts saved together
-- ROLLBACK;  -- use if error to undo both`}
        </CodeBlock>
      </div>
    </div>
  );
}

export default MySQLACID;
