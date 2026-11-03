import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function PostgreSQLExamples() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Real-World Examples</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">Here we build a small online shop database and write the queries a real app needs.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Tables:</strong> users, products, orders and order_items.</li>
          <li className="com-list-item"><strong>Each example:</strong> answers one real question, like "who are my top 5 customers?"</li>
          <li className="com-list-item"><strong>Interviews:</strong> many of these queries are asked in interviews too.</li>
        </ol>
      </div>

      <section className="method-section">
        <h2 className="method-title">The schema</h2>
        <CodeBlock language="sql" style={atomDark}>
          {`CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  city       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE products (
  id       SERIAL PRIMARY KEY,
  name     TEXT NOT NULL,
  category TEXT,
  price    NUMERIC(10, 2) NOT NULL,
  stock    INT NOT NULL DEFAULT 0 CHECK (stock >= 0)
);

CREATE TABLE orders (
  id         SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id),
  status     TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  order_id   INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  qty        INT NOT NULL CHECK (qty > 0),
  price      NUMERIC(10, 2) NOT NULL,      -- price at the time of order
  PRIMARY KEY (order_id, product_id)
);

CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_order_items_product_id ON order_items (product_id);`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">1. Total amount of each order</h2>
        <CodeBlock language="sql" style={atomDark}>
          {`SELECT o.id, u.name, SUM(oi.qty * oi.price) AS total
FROM orders o
JOIN users u        ON u.id = o.user_id
JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, u.name
ORDER BY total DESC;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">2. Top 5 customers by spending</h2>
        <CodeBlock language="sql" style={atomDark}>
          {`SELECT u.id, u.name, SUM(oi.qty * oi.price) AS spent
FROM users u
JOIN orders o       ON o.user_id = u.id AND o.status = 'paid'
JOIN order_items oi ON oi.order_id = o.id
GROUP BY u.id
ORDER BY spent DESC
LIMIT 5;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">3. Products never sold</h2>
        <CodeBlock language="sql" style={atomDark}>
          {`SELECT p.*
FROM products p
WHERE NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.id);`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">4. Best selling product in each category</h2>
        <CodeBlock language="sql" style={atomDark}>
          {`WITH sales AS (
  SELECT p.category, p.name, SUM(oi.qty) AS sold,
         ROW_NUMBER() OVER (PARTITION BY p.category ORDER BY SUM(oi.qty) DESC) AS rn
  FROM products p
  JOIN order_items oi ON oi.product_id = p.id
  GROUP BY p.id
)
SELECT category, name, sold FROM sales WHERE rn = 1;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">5. Monthly revenue</h2>
        <CodeBlock language="sql" style={atomDark}>
          {`SELECT date_trunc('month', o.created_at) AS month,
       SUM(oi.qty * oi.price) AS revenue
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
WHERE o.status = 'paid'
GROUP BY month
ORDER BY month;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">6. Second highest price (classic interview)</h2>
        <CodeBlock language="sql" style={atomDark}>
          {`-- simple
SELECT DISTINCT price FROM products ORDER BY price DESC OFFSET 1 LIMIT 1;

-- Nth highest with DENSE_RANK (works with ties)
SELECT price FROM (
  SELECT price, DENSE_RANK() OVER (ORDER BY price DESC) AS r FROM products
) t WHERE r = 2 LIMIT 1;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">7. Find and delete duplicate emails</h2>
        <CodeBlock language="sql" style={atomDark}>
          {`-- find
SELECT email, COUNT(*) FROM customers_import GROUP BY email HAVING COUNT(*) > 1;

-- delete, keep the row with the smallest id
DELETE FROM customers_import a
USING customers_import b
WHERE a.email = b.email AND a.id > b.id;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">8. Place an order safely (stock check)</h2>
        <p className="com-text">
          The UPDATE only works if enough stock is left. If two users buy the last item at the same time, only one UPDATE matches, so stock never goes negative.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`BEGIN;

UPDATE products SET stock = stock - 2
WHERE id = 7 AND stock >= 2
RETURNING price;               -- 0 rows returned = out of stock → ROLLBACK

INSERT INTO orders (user_id) VALUES (1) RETURNING id;   -- say it returns 55
INSERT INTO order_items (order_id, product_id, qty, price) VALUES (55, 7, 2, 999);

COMMIT;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">9. Keyset pagination (fast for big tables)</h2>
        <CodeBlock language="sql" style={atomDark}>
          {`-- first page
SELECT id, name FROM products ORDER BY id LIMIT 20;
-- next page: pass the last id you got (say 120)
SELECT id, name FROM products WHERE id > 120 ORDER BY id LIMIT 20;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">10. Users per city with a percentage</h2>
        <CodeBlock language="sql" style={atomDark}>
          {`SELECT city, COUNT(*) AS users,
       ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS percent
FROM users
GROUP BY city
ORDER BY users DESC;`}
        </CodeBlock>
      </section>
    </div>
  );
}

export default PostgreSQLExamples;
