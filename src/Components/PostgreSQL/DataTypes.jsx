import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function PostgreSQLDataTypes() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">PostgreSQL Data Types</h1>
      <p className="com-text">
        Every column has a type. Picking the right type saves space, keeps data clean and makes queries faster. PostgreSQL has all the normal SQL types plus some extra ones like UUID, JSONB, arrays and ENUM.
      </p>

      <section className="method-section">
        <h2 className="method-title">Numbers</h2>
        <p className="com-text">
          SMALLINT (small numbers), INTEGER / INT (normal numbers), BIGINT (very big numbers, like ids in big tables), NUMERIC(10,2) (exact decimals, use for money), REAL / DOUBLE PRECISION (approximate decimals, do not use for money). SERIAL and BIGSERIAL are INT / BIGINT with auto increment.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`CREATE TABLE products (
  id     BIGSERIAL PRIMARY KEY,
  price  NUMERIC(10, 2) NOT NULL,   -- 99999999.99 max, exact
  stock  INTEGER DEFAULT 0
);`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Text</h2>
        <p className="com-text">
          VARCHAR(n) has a max length, TEXT has no limit, CHAR(n) is fixed length (padded with spaces, rarely used). In PostgreSQL TEXT and VARCHAR are equally fast, so many people just use TEXT and add a CHECK if they need a limit.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Date and time</h2>
        <p className="com-text">
          DATE (only date), TIME (only time), TIMESTAMP (date + time, no timezone), TIMESTAMPTZ (date + time with timezone), INTERVAL (a duration like '2 days'). Always prefer TIMESTAMPTZ: it stores time in UTC and converts to the user's timezone, so you avoid timezone bugs.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`SELECT NOW();                          -- current timestamp with timezone
SELECT NOW() + INTERVAL '7 days';      -- one week later
SELECT * FROM orders
WHERE created_at > NOW() - INTERVAL '1 day';   -- last 24 hours`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Boolean, UUID and ENUM</h2>
        <p className="com-text">
          BOOLEAN stores true / false. UUID stores a unique id like 'a3f1...'; it is good when ids should not be guessable or are created by many servers. ENUM is a fixed list of allowed values.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'cancelled');

CREATE TABLE orders (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status     order_status DEFAULT 'pending',
  is_gift    BOOLEAN DEFAULT false
);`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Arrays</h2>
        <p className="com-text">
          A column can hold a list of values. Good for small lists like tags. For big or related data, use a separate table instead.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`CREATE TABLE posts (
  id    SERIAL PRIMARY KEY,
  title TEXT,
  tags  TEXT[]
);

INSERT INTO posts (title, tags) VALUES ('Learn PG', ARRAY['sql', 'postgres']);

SELECT * FROM posts WHERE 'sql' = ANY(tags);     -- has tag 'sql'
SELECT * FROM posts WHERE tags @> ARRAY['sql'];  -- contains`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">JSON and JSONB</h2>
        <p className="com-text">
          JSON stores the text as it is. JSONB stores it in a binary format: a bit slower to insert, but much faster to search, and it can be indexed. In almost all cases use JSONB. See the JSONB page for full examples.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Constraints (rules on columns)</h2>
        <p className="com-text">
          PRIMARY KEY (unique + not null id), FOREIGN KEY / REFERENCES (link to another table), UNIQUE (no duplicates), NOT NULL (value required), CHECK (custom rule), DEFAULT (value if none is given).
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`CREATE TABLE order_items (
  id         SERIAL PRIMARY KEY,
  order_id   UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id),
  qty        INT NOT NULL CHECK (qty > 0),
  price      NUMERIC(10, 2) NOT NULL
);`}
        </CodeBlock>
      </section>
    </div>
  );
}

export default PostgreSQLDataTypes;
