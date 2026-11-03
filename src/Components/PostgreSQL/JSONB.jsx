import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function PostgreSQLJSONB() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">JSONB in PostgreSQL</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">JSONB lets you save JSON inside a normal table column, and still search it fast.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>When to use:</strong> data whose shape changes, like product details (a phone has RAM, a shirt has size), user settings or API responses.</li>
          <li className="com-list-item"><strong>How:</strong> fixed data goes in normal columns, the changing part goes in one JSONB column.</li>
          <li className="com-list-item"><strong>JSON vs JSONB:</strong> JSONB is saved in a binary format, so it is faster to search and can have an index.</li>
          <li className="com-list-item definition-default"><strong>Defaults:</strong> if a key is missing, -&gt;&gt; gives NULL (no error). JSONB does not keep key order or extra spaces. If the same key comes twice, the last one wins.</li>
        </ol>
      </div>

      <section className="method-section">
        <h2 className="method-title">JSON vs JSONB</h2>
        <p className="com-text">
          JSON keeps the exact text (spaces, key order, duplicate keys). It is fast to insert but slow to search.
          JSONB converts it into a binary format: removes spaces, drops duplicate keys, and can be indexed with GIN. Slightly slower to insert, much faster to query. Use JSONB almost always.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Create and insert</h2>
        <CodeBlock language="sql" style={atomDark}>
          {`CREATE TABLE products (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  price      NUMERIC(10, 2),
  attributes JSONB
);

INSERT INTO products (name, price, attributes) VALUES
  ('iPhone', 79999, '{"brand": "Apple", "ram": 8, "colors": ["black", "white"]}'),
  ('T-Shirt', 499, '{"brand": "Puma", "size": "M", "material": {"type": "cotton"}}');`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Read values: -&gt; and -&gt;&gt;</h2>
        <p className="com-text">
          -&gt; returns JSON (so you can go deeper). -&gt;&gt; returns plain text. #&gt;&gt; reads a nested path as text.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`SELECT name,
       attributes->'colors'               AS colors_json,
       attributes->>'brand'               AS brand,
       attributes#>>'{material,type}'     AS material
FROM products;

-- filter
SELECT * FROM products WHERE attributes->>'brand' = 'Apple';

-- numbers come out as text, so cast them
SELECT * FROM products WHERE (attributes->>'ram')::int >= 8;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Contains (@&gt;) and key exists (?)</h2>
        <CodeBlock language="sql" style={atomDark}>
          {`-- JSON contains this part
SELECT * FROM products WHERE attributes @> '{"brand": "Puma"}';

-- has the key "size"
SELECT * FROM products WHERE attributes ? 'size';

-- fast with a GIN index
CREATE INDEX idx_products_attributes ON products USING GIN (attributes);`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Update JSONB</h2>
        <CodeBlock language="sql" style={atomDark}>
          {`-- set / change one key
UPDATE products
SET attributes = jsonb_set(attributes, '{ram}', '12')
WHERE id = 1;

-- merge new keys in (|| joins two JSONB values)
UPDATE products
SET attributes = attributes || '{"warranty": "1 year"}'
WHERE id = 1;

-- remove a key
UPDATE products SET attributes = attributes - 'warranty' WHERE id = 1;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Turn rows into JSON</h2>
        <p className="com-text">Handy when your API needs nested JSON: build it in one query.</p>
        <CodeBlock language="sql" style={atomDark}>
          {`SELECT c.id, c.name,
       json_agg(json_build_object('id', o.id, 'amount', o.amount)) AS orders
FROM customers c
JOIN orders o ON o.customer_id = c.id
GROUP BY c.id;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">When NOT to use JSONB</h2>
        <p className="com-text">
          If a field is always there, is used in joins, needs a foreign key, or is filtered all the time, make it a normal column. Putting everything in JSONB loses type checks and relations, and you end up with a slow MongoDB inside Postgres.
        </p>
      </section>
    </div>
  );
}

export default PostgreSQLJSONB;
