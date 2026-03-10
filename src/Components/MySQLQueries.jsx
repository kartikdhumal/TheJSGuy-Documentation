import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function MySQLQueries() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Important MySQL Queries</h1>
      <p>
        Common query patterns: filtering with IN/NOT IN, date functions, JOINs, GROUP BY, and subqueries. Example tables: <code>players</code> (id, first_name, last_name, DOB), <code>roles</code> (id, player_id, role).
      </p>

      <div className="method-section">
        <h2 className="method-title">1. Players who have a role</h2>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`SELECT * FROM players WHERE id IN (SELECT player_id FROM roles);`}
        </SyntaxHighlighter>
        <p>Returns only players whose <code>id</code> appears in <code>roles.player_id</code>.</p>
      </div>

      <div className="method-section">
        <h2 className="method-title">2. Players who don't have any role</h2>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`SELECT * FROM players WHERE id NOT IN (SELECT player_id FROM roles);`}
        </SyntaxHighlighter>
        <p><strong>Example result:</strong> KL Rahul (if his id is not in <code>roles</code>).</p>
      </div>

      <div className="method-section">
        <h2 className="method-title">3. Players born in a specific year</h2>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`SELECT * FROM players WHERE YEAR(DOB) = 1990;`}
        </SyntaxHighlighter>
        <p>Uses <code>YEAR()</code> to filter by birth year.</p>
      </div>

      <div className="method-section">
        <h2 className="method-title">4. Role-wise count of players</h2>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`SELECT role, COUNT(*) AS player_count FROM roles GROUP BY role;`}
        </SyntaxHighlighter>
        <p><strong>Example result:</strong> captain: 1, vice-captain: 1, wicketkeeper: 1, bowler: 1, batsman: 1.</p>
      </div>

      <div className="method-section">
        <h2 className="method-title">5. All players with their role (including no role)</h2>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`SELECT p.first_name, p.last_name, r.role
FROM players p
LEFT JOIN roles r ON p.id = r.player_id;`}
        </SyntaxHighlighter>
        <p>LEFT JOIN keeps every player; <code>role</code> is <code>NULL</code> when they have no role.</p>
      </div>

      <div className="method-section">
        <h2 className="method-title">6. Aliasing with AS</h2>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`SELECT p.first_name AS fname, p.last_name AS lname, r.role AS player_role
FROM players p
LEFT JOIN roles r ON p.id = r.player_id;`}
        </SyntaxHighlighter>
        <p>Use <code>AS</code> to rename columns or tables for readability.</p>
      </div>

      <div className="method-section">
        <h2 className="method-title">7. ORDER BY and LIMIT</h2>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`SELECT * FROM players ORDER BY DOB DESC LIMIT 5;
SELECT * FROM players ORDER BY first_name ASC LIMIT 10;`}
        </SyntaxHighlighter>
        <p>Sort results and restrict the number of rows returned.</p>
      </div>
    </div>
  );
}

export default MySQLQueries;
