import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function PostgreSQLAdvanced() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Advanced PostgreSQL Features</h1>
      <p className="com-text">
        These features are what make PostgreSQL more than "just another SQL database". You will see them in real projects and in interviews.
      </p>

      <section className="method-section">
        <h2 className="method-title">Window functions</h2>
        <p className="com-text">
          GROUP BY squeezes many rows into one. A window function does a calculation over a group of rows but keeps every row. Used for ranking, running totals, and "top N per group".
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`-- rank employees by salary inside each department
SELECT name, department, salary,
       RANK()       OVER (PARTITION BY department ORDER BY salary DESC) AS rnk,
       ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS row_no,
       AVG(salary)  OVER (PARTITION BY department) AS dept_avg
FROM employees;

-- running total of sales by day
SELECT day, amount,
       SUM(amount) OVER (ORDER BY day) AS running_total
FROM daily_sales;

-- difference from the previous day
SELECT day, amount,
       amount - LAG(amount) OVER (ORDER BY day) AS change
FROM daily_sales;`}
        </CodeBlock>
        <p className="com-text">
          ROW_NUMBER gives 1,2,3,4 always. RANK gives 1,2,2,4 (skips after a tie). DENSE_RANK gives 1,2,2,3 (no skip).
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Views and materialized views</h2>
        <p className="com-text">
          A view is a saved query that you use like a table. It runs the query every time, so data is always fresh.
          A materialized view saves the result on disk. It is very fast to read, but the data is only as fresh as the last REFRESH. Good for heavy reports and dashboards.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`CREATE VIEW active_users AS
SELECT id, name, email FROM users WHERE is_active = true;

SELECT * FROM active_users;

CREATE MATERIALIZED VIEW monthly_sales AS
SELECT date_trunc('month', created_at) AS month, SUM(amount) AS total
FROM orders
GROUP BY 1;

-- update the saved data (CONCURRENTLY needs a unique index, but does not block reads)
REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_sales;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Functions and stored procedures</h2>
        <p className="com-text">
          A function returns a value and can be used inside SELECT. A procedure (CALL) does not return a value but can COMMIT inside it. Most logic should stay in your Node.js code; use these for small things close to the data.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`CREATE OR REPLACE FUNCTION order_total(p_order_id INT)
RETURNS NUMERIC AS $$
  SELECT COALESCE(SUM(qty * price), 0) FROM order_items WHERE order_id = p_order_id;
$$ LANGUAGE sql;

SELECT id, order_total(id) FROM orders;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Triggers</h2>
        <p className="com-text">
          A trigger runs a function automatically when a row is inserted, updated or deleted. Common use: auto-update updated_at, or write an audit log.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Full-text search</h2>
        <p className="com-text">
          LIKE '%word%' is slow and does not understand words. Full-text search splits text into words (tsvector), handles forms like "run / running", and ranks results. For simple search, you do not need Elasticsearch.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`ALTER TABLE articles ADD COLUMN search tsvector
  GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || body)) STORED;

CREATE INDEX idx_articles_search ON articles USING GIN (search);

SELECT title, ts_rank(search, q) AS rank
FROM articles, websearch_to_tsquery('english', 'postgres index') q
WHERE search @@ q
ORDER BY rank DESC;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Partitioning</h2>
        <p className="com-text">
          Split one huge table into smaller pieces (partitions), for example one per month. Queries for one month only read that piece, and deleting old data is just dropping a partition.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`CREATE TABLE logs (
  id         BIGSERIAL,
  message    TEXT,
  created_at TIMESTAMPTZ NOT NULL
) PARTITION BY RANGE (created_at);

CREATE TABLE logs_2026_10 PARTITION OF logs
  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Extensions</h2>
        <p className="com-text">
          Extensions add new features with one command. Popular ones: pgcrypto (hashing, gen_random_uuid), pg_trgm (fuzzy search, fast LIKE '%abc%'), PostGIS (maps and distance), pgvector (AI embeddings and similarity search), pg_stat_statements (find slow queries).
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_users_name_trgm ON users USING GIN (name gin_trgm_ops);
SELECT * FROM users WHERE name ILIKE '%kar%';   -- now uses the index`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Replication and backups</h2>
        <p className="com-text">
          Streaming replication copies every change (from the WAL log) to replica servers. Replicas can serve read queries and can be promoted if the main server dies. For backups use pg_dump (one database, logical) or pg_basebackup + WAL archiving (whole server, point-in-time recovery).
        </p>
        <CodeBlock language="bash" style={atomDark}>
          {`pg_dump -U postgres -d shopdb -F c -f shopdb.dump     # backup
pg_restore -U postgres -d shopdb_new shopdb.dump       # restore`}
        </CodeBlock>
      </section>
    </div>
  );
}

export default PostgreSQLAdvanced;
