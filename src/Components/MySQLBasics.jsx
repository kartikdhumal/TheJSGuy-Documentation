import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function MySQLBasics() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">MySQL Basics: DDL, DML & Data Types</h1>

      <div className="method-section">
        <h2 className="method-title">DDL (Data Definition Language)</h2>
        <p>Commands that define or change the structure of the database: <code>CREATE</code>, <code>ALTER</code>, <code>DROP</code>.</p>
        <h3>CREATE database and table</h3>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`CREATE DATABASE mydb;
USE mydb;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
        </SyntaxHighlighter>
        <h3>ALTER table (add column, modify)</h3>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`ALTER TABLE users ADD COLUMN age INT;
ALTER TABLE users MODIFY COLUMN name VARCHAR(200);
ALTER TABLE users DROP COLUMN age;`}
        </SyntaxHighlighter>
        <h3>DROP table or database</h3>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`DROP TABLE users;
DROP DATABASE mydb;`}
        </SyntaxHighlighter>
      </div>

      <div className="method-section">
        <h2 className="method-title">DML (Data Manipulation Language)</h2>
        <p>Commands that work with data: <code>SELECT</code>, <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>.</p>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`-- Insert
INSERT INTO users (name, email) VALUES ('Kartik', 'kartik@example.com');
INSERT INTO users (name, email) VALUES ('Rohit', 'rohit@example.com'), ('Virat', 'virat@example.com');

-- Select
SELECT * FROM users;
SELECT name, email FROM users WHERE id = 1;

-- Update
UPDATE users SET name = 'Kartik Dhumal' WHERE id = 1;

-- Delete
DELETE FROM users WHERE id = 2;`}
        </SyntaxHighlighter>
      </div>

      <div className="method-section">
        <h2 className="method-title">Common Data Types</h2>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr><th>Type</th><th>Description</th><th>Example</th></tr>
            </thead>
            <tbody>
              <tr><td>INT, BIGINT</td><td>Integer</td><td>42, 1000000</td></tr>
              <tr><td>DECIMAL(p,s)</td><td>Exact decimal</td><td>DECIMAL(10,2) for price</td></tr>
              <tr><td>VARCHAR(n)</td><td>Variable-length string</td><td>VARCHAR(255)</td></tr>
              <tr><td>TEXT</td><td>Long text</td><td>Description, content</td></tr>
              <tr><td>DATE, DATETIME, TIMESTAMP</td><td>Date and time</td><td>2024-01-15, NOW()</td></tr>
              <tr><td>BOOLEAN</td><td>True/False</td><td>TRUE, FALSE (stored as TINYINT)</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="method-section">
        <h2 className="method-title">Constraints</h2>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  sku VARCHAR(50) UNIQUE,
  category_id INT,
  price DECIMAL(10,2) CHECK (price >= 0),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);`}
        </SyntaxHighlighter>
        <p><strong>PRIMARY KEY</strong> — unique identifier; <strong>UNIQUE</strong> — no duplicates; <strong>NOT NULL</strong> — required; <strong>FOREIGN KEY</strong> — reference to another table; <strong>CHECK</strong> — condition on value.</p>
      </div>
    </div>
  );
}

export default MySQLBasics;
