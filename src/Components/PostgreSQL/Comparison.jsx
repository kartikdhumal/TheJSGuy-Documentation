import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const rows = [
  ['Type', 'Relational (SQL) + JSON support', 'Relational (SQL)', 'NoSQL document database'],
  ['Data stored as', 'Tables, rows, columns', 'Tables, rows, columns', 'JSON-like documents (BSON) in collections'],
  ['Schema', 'Fixed schema, but JSONB for flexible parts', 'Fixed schema', 'Flexible, each document can be different'],
  ['Query language', 'SQL (very close to the standard)', 'SQL (some own rules)', 'MongoDB query API (find, aggregate)'],
  ['Joins', 'Strong, all join types incl. FULL OUTER', 'Good, but no FULL OUTER JOIN', '$lookup, slower, not the main way'],
  ['Transactions (ACID)', 'Yes, always', 'Yes, with InnoDB engine', 'Yes since v4.0, but not its main design'],
  ['JSON support', 'JSONB: binary, indexable, very strong', 'JSON type, less powerful', 'Native, everything is JSON'],
  ['Concurrency', 'MVCC, reads never block writes', 'MVCC in InnoDB', 'Document-level locking'],
  ['Advanced features', 'CTEs, window functions, arrays, custom types, extensions', 'CTEs and window functions (v8+)', 'Aggregation pipeline, change streams'],
  ['Scaling', 'Mostly vertical + read replicas; Citus for sharding', 'Vertical + read replicas', 'Horizontal sharding built in'],
  ['Best for', 'Complex data, money, reports, mixed SQL + JSON', 'Simple web apps, read-heavy sites', 'Fast-changing data shape, huge scale, catalogs'],
];

function PostgreSQLComparison() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">PostgreSQL vs MySQL vs MongoDB</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">These are 3 popular databases. PostgreSQL and MySQL keep data in tables. MongoDB keeps data as JSON documents.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>PostgreSQL:</strong> SQL database with tables and many extra features.</li>
          <li className="com-list-item"><strong>MySQL:</strong> SQL database with tables, simple and very common.</li>
          <li className="com-list-item"><strong>MongoDB:</strong> NoSQL database, each record is a JSON-like document.</li>
          <li className="com-list-item definition-default"><strong>Defaults:</strong> ports are PostgreSQL 5432, MySQL 3306, MongoDB 27017. MySQL uses the InnoDB engine. MongoDB adds an _id (ObjectId) to every document.</li>
        </ol>
      </div>

      <section className="method-section">
        <h2 className="method-title">Quick comparison table</h2>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr><th>Point</th><th>PostgreSQL</th><th>MySQL</th><th>MongoDB</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r[0]}>{r.map((cell, i) => <td key={i}>{i === 0 ? <strong>{cell}</strong> : cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="method-section">
        <h2 className="method-title">PostgreSQL vs MySQL in simple words</h2>
        <p className="com-text">
          Both use SQL and tables, so basic queries look almost the same. MySQL is simple, fast for simple reads and very common in older PHP and WordPress style apps. PostgreSQL follows SQL rules more strictly and has more features: JSONB, arrays, FULL OUTER JOIN, RETURNING, partial indexes, better full-text search, custom types and extensions. If your app has complex queries, reports or money, PostgreSQL is usually the better choice.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`-- Auto increment id
-- MySQL
CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100));
-- PostgreSQL
CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(100));
-- or the modern way
CREATE TABLE users (id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name VARCHAR(100));

-- Get the inserted row back
-- MySQL: run INSERT, then SELECT LAST_INSERT_ID();
-- PostgreSQL: one step
INSERT INTO users (name) VALUES ('Kartik') RETURNING id, name;

-- Insert or update (upsert)
-- MySQL
INSERT INTO stock (product_id, qty) VALUES (1, 10)
ON DUPLICATE KEY UPDATE qty = VALUES(qty);
-- PostgreSQL
INSERT INTO stock (product_id, qty) VALUES (1, 10)
ON CONFLICT (product_id) DO UPDATE SET qty = EXCLUDED.qty;

-- Quotes for names
-- MySQL uses \`backticks\`, PostgreSQL uses "double quotes"`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">PostgreSQL vs MongoDB in simple words</h2>
        <p className="com-text">
          MongoDB stores each record as a JSON document, so you do not need to plan columns first. It is easy to start with and easy to scale across many servers. But relations (user → orders → items) are harder, and joins are weaker. PostgreSQL keeps strong relations and joins, and with JSONB you can still keep flexible JSON data in one column. So many teams now use PostgreSQL even for "semi-flexible" data.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`-- MongoDB
db.users.find({ "address.city": "Surat" })

-- PostgreSQL with a JSONB column
SELECT * FROM users WHERE address->>'city' = 'Surat';`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Which one should I pick?</h2>
        <p className="com-text">
          Pick PostgreSQL when: data has clear relations, you need joins and reports, data correctness matters (payments, orders, bookings), or you want SQL plus some JSON.
          Pick MySQL when: the app is simple and read-heavy, your team or hosting already uses MySQL, or you use a tool built for it (WordPress).
          Pick MongoDB when: the data shape changes a lot, each record is read as one whole document (product catalog, logs, CMS content), or you need easy sharding for very large data.
          For most new Node.js / NestJS backends, PostgreSQL is a safe default.
        </p>
      </section>
    </div>
  );
}

export default PostgreSQLComparison;
