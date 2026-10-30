import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function PostgreSQLQueries() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">CRUD Queries in PostgreSQL</h1>
      <p className="com-text">
        CRUD means Create, Read, Update, Delete. These are the queries you write every day. We will use one simple table for all examples.
      </p>
      <CodeBlock language="sql" style={atomDark}>
        {`CREATE TABLE employees (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  department TEXT,
  salary     NUMERIC(10, 2),
  joined_on  DATE DEFAULT CURRENT_DATE
);`}
      </CodeBlock>

      <section className="method-section">
        <h2 className="method-title">INSERT (Create)</h2>
        <p className="com-text">
          Add one or many rows. RETURNING gives you back the inserted row, so you do not need a second SELECT to get the new id.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`INSERT INTO employees (name, email, department, salary)
VALUES ('Kartik', 'kartik@mail.com', 'IT', 60000)
RETURNING id;

-- many rows at once
INSERT INTO employees (name, email, department, salary) VALUES
  ('Sameer', 'sameer@mail.com', 'IT', 55000),
  ('Riya',   'riya@mail.com',   'HR', 45000),
  ('Aman',   'aman@mail.com',   'Sales', 40000);`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">SELECT (Read)</h2>
        <CodeBlock language="sql" style={atomDark}>
          {`SELECT * FROM employees;
SELECT name, salary FROM employees WHERE department = 'IT';
SELECT * FROM employees WHERE salary BETWEEN 40000 AND 60000;
SELECT * FROM employees WHERE department IN ('IT', 'HR');
SELECT * FROM employees WHERE name LIKE 'K%';     -- starts with K (case sensitive)
SELECT * FROM employees WHERE name ILIKE 'k%';    -- same, but ignores case (PostgreSQL only)
SELECT * FROM employees WHERE department IS NULL;

-- sort and paginate
SELECT * FROM employees ORDER BY salary DESC LIMIT 10 OFFSET 20;   -- page 3

-- unique values
SELECT DISTINCT department FROM employees;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">UPDATE</h2>
        <p className="com-text">Always use WHERE in UPDATE, or every row will change. RETURNING works here too.</p>
        <CodeBlock language="sql" style={atomDark}>
          {`UPDATE employees
SET salary = salary * 1.10
WHERE department = 'IT'
RETURNING name, salary;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">DELETE</h2>
        <CodeBlock language="sql" style={atomDark}>
          {`DELETE FROM employees WHERE id = 4 RETURNING *;

-- remove ALL rows fast (no WHERE), and reset the id counter back to 1
TRUNCATE employees RESTART IDENTITY;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">UPSERT (insert or update)</h2>
        <p className="com-text">
          ON CONFLICT says what to do if the row already exists (same unique key). EXCLUDED means "the values I tried to insert".
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`INSERT INTO employees (name, email, department, salary)
VALUES ('Kartik', 'kartik@mail.com', 'IT', 70000)
ON CONFLICT (email)
DO UPDATE SET salary = EXCLUDED.salary;

-- or just skip it
INSERT INTO employees (name, email) VALUES ('Kartik', 'kartik@mail.com')
ON CONFLICT (email) DO NOTHING;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">GROUP BY and aggregate functions</h2>
        <p className="com-text">
          COUNT, SUM, AVG, MIN, MAX work on groups of rows. WHERE filters rows before grouping, HAVING filters groups after grouping.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`SELECT department, COUNT(*) AS total, ROUND(AVG(salary), 2) AS avg_salary
FROM employees
GROUP BY department
HAVING COUNT(*) > 1
ORDER BY avg_salary DESC;

-- count with a condition (PostgreSQL FILTER)
SELECT
  COUNT(*) FILTER (WHERE salary > 50000) AS high_paid,
  COUNT(*) FILTER (WHERE salary <= 50000) AS others
FROM employees;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">ALTER TABLE</h2>
        <CodeBlock language="sql" style={atomDark}>
          {`ALTER TABLE employees ADD COLUMN phone TEXT;
ALTER TABLE employees RENAME COLUMN phone TO mobile;
ALTER TABLE employees ALTER COLUMN salary SET NOT NULL;
ALTER TABLE employees DROP COLUMN mobile;`}
        </CodeBlock>
      </section>
    </div>
  );
}

export default PostgreSQLQueries;
