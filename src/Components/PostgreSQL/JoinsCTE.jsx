import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function PostgreSQLJoinsCTE() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Joins, Subqueries &amp; CTEs</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">Your data is split into many tables. A join puts them back together in one result.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Join:</strong> match rows from two tables using a common column, like orders.customer_id = customers.id.</li>
          <li className="com-list-item"><strong>Subquery:</strong> a query inside another query.</li>
          <li className="com-list-item"><strong>CTE (WITH):</strong> give a name to a small query and use it in the next step, so big SQL is easy to read.</li>
          <li className="com-list-item definition-default"><strong>Defaults:</strong> writing just JOIN means INNER JOIN. UNION removes duplicate rows (UNION ALL keeps them). Since PostgreSQL 12, a simple CTE used once is merged into the main query, not stored separately.</li>
        </ol>
      </div>
      <p className="com-text">Sample tables we will use on this page:</p>
      <CodeBlock language="sql" style={atomDark}>
        {`CREATE TABLE customers (id SERIAL PRIMARY KEY, name TEXT);
CREATE TABLE orders (
  id          SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  amount      NUMERIC(10, 2)
);

INSERT INTO customers (name) VALUES ('Kartik'), ('Sameer'), ('Riya');
INSERT INTO orders (customer_id, amount) VALUES (1, 500), (1, 300), (2, 900);
-- Riya has no orders`}
      </CodeBlock>

      <section className="method-section">
        <h2 className="method-title">INNER JOIN</h2>
        <p className="com-text">Only rows that match in both tables. Riya is not shown because she has no orders.</p>
        <CodeBlock language="sql" style={atomDark}>
          {`SELECT c.name, o.amount
FROM customers c
INNER JOIN orders o ON o.customer_id = c.id;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">LEFT JOIN</h2>
        <p className="com-text">All rows from the left table, and matching rows from the right. No match gives NULL. Use it to find "customers with no orders".</p>
        <CodeBlock language="sql" style={atomDark}>
          {`SELECT c.name, o.amount
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id;

-- customers who never ordered
SELECT c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">RIGHT, FULL OUTER and CROSS JOIN</h2>
        <p className="com-text">
          RIGHT JOIN is the opposite of LEFT. FULL OUTER JOIN gives all rows from both sides, with NULL where there is no match (MySQL does not have this, PostgreSQL does). CROSS JOIN gives every combination (rows × rows), useful for things like sizes × colors.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`SELECT c.name, o.amount
FROM customers c
FULL OUTER JOIN orders o ON o.customer_id = c.id;

SELECT s.size, cl.color
FROM sizes s CROSS JOIN colors cl;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Self join</h2>
        <p className="com-text">A table joined with itself. Classic example: employee and their manager in the same table.</p>
        <CodeBlock language="sql" style={atomDark}>
          {`SELECT e.name AS employee, m.name AS manager
FROM staff e
LEFT JOIN staff m ON e.manager_id = m.id;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Subqueries</h2>
        <p className="com-text">A query inside another query.</p>
        <CodeBlock language="sql" style={atomDark}>
          {`-- orders bigger than the average order
SELECT * FROM orders
WHERE amount > (SELECT AVG(amount) FROM orders);

-- customers who have at least one order (EXISTS stops at first match, fast)
SELECT name FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">CTE (WITH clause)</h2>
        <p className="com-text">
          A CTE is a named temporary result you can use in the next query. It works like a variable for a query, so long SQL becomes easy to read step by step.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`WITH customer_totals AS (
  SELECT customer_id, SUM(amount) AS total
  FROM orders
  GROUP BY customer_id
)
SELECT c.name, ct.total
FROM customer_totals ct
JOIN customers c ON c.id = ct.customer_id
WHERE ct.total > 500;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Recursive CTE</h2>
        <p className="com-text">
          A CTE that calls itself. Used for tree data: categories with sub-categories, comments with replies, employees with managers.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`-- categories(id, name, parent_id)
WITH RECURSIVE tree AS (
  SELECT id, name, parent_id, 1 AS level
  FROM categories
  WHERE parent_id IS NULL          -- start from top level
  UNION ALL
  SELECT c.id, c.name, c.parent_id, t.level + 1
  FROM categories c
  JOIN tree t ON c.parent_id = t.id  -- then children of each row
)
SELECT * FROM tree ORDER BY level;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">UNION vs UNION ALL</h2>
        <p className="com-text">Both stack results of two queries. UNION removes duplicates (slower), UNION ALL keeps all rows (faster).</p>
      </section>
    </div>
  );
}

export default PostgreSQLJoinsCTE;
