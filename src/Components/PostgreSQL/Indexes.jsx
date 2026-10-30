import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function PostgreSQLIndexes() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Indexes &amp; Query Performance</h1>
      <p className="com-text">
        An index is like the index at the back of a book. Without it, PostgreSQL reads every row to find what you want (Sequential Scan). With it, it jumps straight to the right rows (Index Scan). Indexes make reads faster but make writes a little slower and take extra space, so add them only where you search, join or sort.
      </p>

      <section className="method-section">
        <h2 className="method-title">Create an index</h2>
        <CodeBlock language="sql" style={atomDark}>
          {`CREATE INDEX idx_orders_customer_id ON orders (customer_id);

-- unique index (also blocks duplicates)
CREATE UNIQUE INDEX idx_users_email ON users (email);

-- build without locking writes on a live table
CREATE INDEX CONCURRENTLY idx_orders_created_at ON orders (created_at);

DROP INDEX idx_orders_created_at;`}
        </CodeBlock>
        <p className="com-text">
          PRIMARY KEY and UNIQUE columns get an index automatically. Foreign key columns do NOT, so add one yourself if you join on them.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Types of indexes</h2>
        <p className="com-text">
          B-tree (default): for =, &lt;, &gt;, BETWEEN, ORDER BY. Used 90% of the time.
          Hash: only for = checks.
          GIN: for "contains" searches inside JSONB, arrays and full-text search.
          GiST: for locations, ranges and geometry (PostGIS).
          BRIN: very small index for huge tables where data is stored in order, like log tables sorted by time.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`CREATE INDEX idx_products_attrs ON products USING GIN (attributes);   -- JSONB
CREATE INDEX idx_posts_tags     ON posts    USING GIN (tags);         -- array
CREATE INDEX idx_logs_time      ON logs     USING BRIN (created_at);  -- huge log table`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Composite index (many columns)</h2>
        <p className="com-text">
          An index on (a, b) helps queries on a, or on a + b, but not on b alone. So put the column you filter by most (usually the = column) first.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`CREATE INDEX idx_orders_cust_date ON orders (customer_id, created_at);

-- uses the index
SELECT * FROM orders WHERE customer_id = 5 ORDER BY created_at DESC;
-- cannot use it well
SELECT * FROM orders WHERE created_at > '2026-01-01';`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Partial and expression indexes</h2>
        <p className="com-text">
          Partial index: index only some rows, so it is smaller and faster. Expression index: index the result of a function, like LOWER(email).
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`-- only pending orders are searched often
CREATE INDEX idx_orders_pending ON orders (created_at) WHERE status = 'pending';

-- case-insensitive email login
CREATE INDEX idx_users_lower_email ON users (LOWER(email));
SELECT * FROM users WHERE LOWER(email) = 'kartik@mail.com';`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">EXPLAIN and EXPLAIN ANALYZE</h2>
        <p className="com-text">
          EXPLAIN shows the plan PostgreSQL will use. EXPLAIN ANALYZE actually runs the query and shows real time. Look for "Seq Scan" on big tables, which usually means a missing index.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 5;

-- Before index:
-- Seq Scan on orders  (actual time=0.02..45.10 rows=12)
-- After index:
-- Index Scan using idx_orders_customer_id on orders (actual time=0.01..0.05 rows=12)`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Simple performance tips</h2>
        <p className="com-text">
          1. Do not use SELECT * in app code, pick the columns you need.
          2. Index columns used in WHERE, JOIN and ORDER BY.
          3. A function on a column (WHERE LOWER(email) = ...) skips a normal index; use an expression index.
          4. LIKE '%abc' (starting with %) cannot use a B-tree index; use pg_trgm or full-text search.
          5. For deep pagination, use keyset pagination (WHERE id &gt; last_id LIMIT 20) instead of a big OFFSET.
          6. Use a connection pool (pg Pool or PgBouncer); opening a new connection each time is slow.
          7. Run ANALYZE after big data changes so the planner has fresh statistics.
        </p>
      </section>
    </div>
  );
}

export default PostgreSQLIndexes;
