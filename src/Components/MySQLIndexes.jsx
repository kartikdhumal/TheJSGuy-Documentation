import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function MySQLIndexes() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Indexes in MySQL</h1>
      <p>
        Indexes speed up <code>SELECT</code> and <code>WHERE</code>, <code>JOIN</code>, and <code>ORDER BY</code> by helping the server find rows without scanning the whole table. Overuse or large indexes can slow down <code>INSERT</code>/<code>UPDATE</code>/<code>DELETE</code>.
      </p>

      <div className="method-section">
        <h2 className="method-title">Create an index</h2>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`-- Single column
CREATE INDEX idx_player_name ON players (player_name);

-- Multiple columns (composite index)
CREATE INDEX idx_name_dob ON players (player_name, DOB);`}
        </SyntaxHighlighter>
        <p>Create indexes on columns you filter or join on frequently.</p>
      </div>

      <div className="method-section">
        <h2 className="method-title">Types of indexes</h2>
        <ul>
          <li><strong>Primary Key:</strong> Unique index on the primary key column(s). Created automatically with <code>PRIMARY KEY</code>.</li>
          <li><strong>Unique Index:</strong> No duplicate values in the indexed column(s).</li>
          <li><strong>Composite Index:</strong> Index on multiple columns; column order matters for left-prefix matching.</li>
          <li><strong>Full-Text Index:</strong> For full-text search on <code>TEXT</code> columns.</li>
        </ul>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`-- Unique index (e.g. email)
CREATE UNIQUE INDEX idx_email ON users (email);

-- Full-text (for search)
ALTER TABLE articles ADD FULLTEXT INDEX ft_content (title, body);
-- Query: SELECT * FROM articles WHERE MATCH(title, body) AGAINST ('keyword');`}
        </SyntaxHighlighter>
      </div>

      <div className="method-section">
        <h2 className="method-title">Drop an index</h2>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`DROP INDEX idx_player_name ON players;`}
        </SyntaxHighlighter>
      </div>

      <div className="method-section">
        <h2 className="method-title">When to use indexes</h2>
        <ul>
          <li>Columns in <code>WHERE</code>, <code>JOIN</code>, <code>ORDER BY</code>, <code>GROUP BY</code>.</li>
          <li>Columns with high cardinality (many distinct values) benefit more.</li>
          <li>Avoid too many indexes on tables that are written to often.</li>
        </ul>
      </div>
    </div>
  );
}

export default MySQLIndexes;
