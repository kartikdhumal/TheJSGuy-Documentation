import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function MySQLAggregate() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">MySQL Aggregate Functions</h1>
      <p>
        Aggregate functions perform a calculation on a set of values and return a single value. They are often used with <code>GROUP BY</code>. <code>NULL</code> values are ignored except in <code>COUNT(*)</code>.
      </p>

      <div className="method-section">
        <h2 className="method-title">Sample table: <code>orders</code></h2>
        <p>Used in examples below:</p>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr><th>order_id</th><th>customer_id</th><th>amount</th><th>region</th></tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>101</td><td>250.00</td><td>North</td></tr>
              <tr><td>2</td><td>102</td><td>180.50</td><td>South</td></tr>
              <tr><td>3</td><td>101</td><td>320.00</td><td>North</td></tr>
              <tr><td>4</td><td>103</td><td>95.00</td><td>East</td></tr>
              <tr><td>5</td><td>102</td><td>410.00</td><td>South</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="method-section">
        <h2 className="method-title">1. COUNT()</h2>
        <p>Returns the number of rows. <code>COUNT(*)</code> counts all rows including <code>NULL</code>s; <code>COUNT(column)</code> counts non-NULL values in that column.</p>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`-- Total number of orders
SELECT COUNT(*) AS total_orders FROM orders;
-- Result: 5

-- Number of orders per customer
SELECT customer_id, COUNT(*) AS order_count
FROM orders
GROUP BY customer_id;`}
        </SyntaxHighlighter>
        <p><strong>Example result (GROUP BY):</strong> 101 → 2, 102 → 2, 103 → 1.</p>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`-- Count distinct customers who placed orders
SELECT COUNT(DISTINCT customer_id) AS unique_customers FROM orders;
-- Result: 3`}
        </SyntaxHighlighter>
      </div>

      <div className="method-section">
        <h2 className="method-title">2. SUM()</h2>
        <p>Returns the sum of numeric values. Ignores <code>NULL</code>.</p>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`-- Total revenue from all orders
SELECT SUM(amount) AS total_revenue FROM orders;
-- Result: 1255.50

-- Total amount per customer
SELECT customer_id, SUM(amount) AS total_spent
FROM orders
GROUP BY customer_id;`}
        </SyntaxHighlighter>
        <p><strong>Example result:</strong> 101 → 570.00, 102 → 590.50, 103 → 95.00.</p>
      </div>

      <div className="method-section">
        <h2 className="method-title">3. AVG()</h2>
        <p>Returns the average of numeric values. <code>NULL</code>s are excluded from the calculation.</p>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`-- Average order amount
SELECT AVG(amount) AS avg_order_value FROM orders;
-- Result: 251.10

-- Average order value per region
SELECT region, AVG(amount) AS avg_amount
FROM orders
GROUP BY region;`}
        </SyntaxHighlighter>
        <p><strong>Example result:</strong> North → 285.00, South → 295.25, East → 95.00.</p>
      </div>

      <div className="method-section">
        <h2 className="method-title">4. MIN() and MAX()</h2>
        <p><code>MIN()</code> returns the smallest value; <code>MAX()</code> returns the largest. Work with numbers, dates, and strings.</p>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`-- Smallest and largest order amount
SELECT MIN(amount) AS min_order, MAX(amount) AS max_order FROM orders;
-- Result: min_order = 95.00, max_order = 410.00

-- Per region
SELECT region, MIN(amount) AS min_amt, MAX(amount) AS max_amt
FROM orders
GROUP BY region;`}
        </SyntaxHighlighter>
        <p>For dates: <code>SELECT MIN(created_at), MAX(created_at) FROM orders;</code></p>
      </div>

      <div className="method-section">
        <h2 className="method-title">5. GROUP_CONCAT()</h2>
        <p>Concatenates values from multiple rows into a single string. Useful for listing related values per group.</p>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`-- List all order_ids per customer (comma-separated)
SELECT customer_id, GROUP_CONCAT(order_id) AS order_ids
FROM orders
GROUP BY customer_id;`}
        </SyntaxHighlighter>
        <p><strong>Example result:</strong> 101 → "1,3", 102 → "2,5", 103 → "4".</p>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`-- Custom separator and ordering
SELECT region, GROUP_CONCAT(amount ORDER BY amount DESC SEPARATOR ' | ') AS amounts
FROM orders
GROUP BY region;`}
        </SyntaxHighlighter>
      </div>

      <div className="method-section">
        <h2 className="method-title">6. Using HAVING with aggregates</h2>
        <p><code>WHERE</code> filters rows before aggregation; <code>HAVING</code> filters after aggregation (on the result of aggregate functions).</p>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`-- Customers with more than 1 order
SELECT customer_id, COUNT(*) AS order_count
FROM orders
GROUP BY customer_id
HAVING COUNT(*) > 1;

-- Regions where total sales exceed 400
SELECT region, SUM(amount) AS total_sales
FROM orders
GROUP BY region
HAVING SUM(amount) > 400;`}
        </SyntaxHighlighter>
      </div>

      <div className="method-section">
        <h2 className="method-title">7. STDDEV() / STDDEV_POP() and VARIANCE() / VAR_POP()</h2>
        <p>Standard deviation and variance of a numeric column. Useful for statistics.</p>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`SELECT
  AVG(amount) AS avg_amt,
  STDDEV(amount) AS stddev_amt,
  VARIANCE(amount) AS variance_amt
FROM orders;`}
        </SyntaxHighlighter>
        <p><code>STDDEV_SAMP()</code> and <code>VAR_SAMP()</code> use sample (n-1) instead of population (n).</p>
      </div>

      <div className="method-section">
        <h2 className="method-title">Quick reference</h2>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr><th>Function</th><th>Description</th></tr>
            </thead>
            <tbody>
              <tr><td>COUNT(expr)</td><td>Number of non-NULL values (COUNT(*) counts all rows)</td></tr>
              <tr><td>SUM(expr)</td><td>Sum of values</td></tr>
              <tr><td>AVG(expr)</td><td>Average of values</td></tr>
              <tr><td>MIN(expr)</td><td>Minimum value</td></tr>
              <tr><td>MAX(expr)</td><td>Maximum value</td></tr>
              <tr><td>GROUP_CONCAT(expr)</td><td>Concatenate values into a string</td></tr>
              <tr><td>STDDEV(expr)</td><td>Population standard deviation</td></tr>
              <tr><td>VARIANCE(expr)</td><td>Population variance</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MySQLAggregate;
