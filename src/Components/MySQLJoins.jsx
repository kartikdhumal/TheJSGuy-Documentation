import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function MySQLJoins() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">SQL Joins in MySQL</h1>
      <p>
        JOINs combine rows from two or more tables based on a related column. Common types: INNER, LEFT, RIGHT, and FULL OUTER (simulated in MySQL).
      </p>

      <div className="method-section">
        <h2 className="method-title">Sample tables</h2>
        <p><strong>players:</strong></p>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead><tr><th>player_id</th><th>player_name</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>Virat Kohli</td></tr>
              <tr><td>2</td><td>MS Dhoni</td></tr>
              <tr><td>3</td><td>Rohit Sharma</td></tr>
              <tr><td>4</td><td>Jasprit Bumrah</td></tr>
            </tbody>
          </table>
        </div>
        <p><strong>enrollments (player_id → team_id):</strong></p>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead><tr><th>enrollment_id</th><th>player_id</th><th>team_id</th></tr></thead>
            <tbody>
              <tr><td>101</td><td>1</td><td>201</td></tr>
              <tr><td>102</td><td>1</td><td>202</td></tr>
              <tr><td>103</td><td>2</td><td>203</td></tr>
              <tr><td>104</td><td>3</td><td>204</td></tr>
            </tbody>
          </table>
        </div>
        <p><strong>teams:</strong></p>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead><tr><th>team_id</th><th>team_name</th></tr></thead>
            <tbody>
              <tr><td>201</td><td>RCB</td></tr>
              <tr><td>202</td><td>India</td></tr>
              <tr><td>203</td><td>CSK</td></tr>
              <tr><td>204</td><td>MI</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="method-section">
        <h2 className="method-title">1. INNER JOIN</h2>
        <p>Returns only rows where there is a match in both tables. Players with no enrollment (e.g. Bumrah) are excluded.</p>
        <CodeBlock language="sql" style={atomDark}>
          {`SELECT players.player_name, teams.team_name
FROM players
INNER JOIN enrollments ON players.player_id = enrollments.player_id
INNER JOIN teams ON enrollments.team_id = teams.team_id;`}
        </CodeBlock>
        <p><strong>Result:</strong> Virat–RCB, Virat–India, MS Dhoni–CSK, Rohit–MI (4 rows).</p>
      </div>

      <div className="method-section">
        <h2 className="method-title">2. LEFT JOIN (LEFT OUTER JOIN)</h2>
        <p>Returns all rows from the left table (players) and matched rows from the right. No match → <code>NULL</code> on the right.</p>
        <CodeBlock language="sql" style={atomDark}>
          {`SELECT players.player_name, teams.team_name
FROM players
LEFT JOIN enrollments ON players.player_id = enrollments.player_id
LEFT JOIN teams ON enrollments.team_id = teams.team_id;`}
        </CodeBlock>
        <p><strong>Result:</strong> All four players; Jasprit Bumrah has <code>team_name = NULL</code>.</p>
      </div>

      <div className="method-section">
        <h2 className="method-title">3. RIGHT JOIN (RIGHT OUTER JOIN)</h2>
        <p>Returns all rows from the right table and matched rows from the left. Unmatched left columns are <code>NULL</code>.</p>
        <CodeBlock language="sql" style={atomDark}>
          {`SELECT players.player_name, teams.team_name
FROM players
RIGHT JOIN enrollments ON players.player_id = enrollments.player_id
RIGHT JOIN teams ON enrollments.team_id = teams.team_id;`}
        </CodeBlock>
        <p>All teams appear; if a team has no enrolled player, <code>player_name</code> is <code>NULL</code>.</p>
      </div>

      <div className="method-section">
        <h2 className="method-title">4. FULL OUTER JOIN (simulated)</h2>
        <p>MySQL does not support <code>FULL OUTER JOIN</code>. Use <code>LEFT JOIN</code> <code>UNION</code> <code>RIGHT JOIN</code> to get all rows from both sides.</p>
        <CodeBlock language="sql" style={atomDark}>
          {`SELECT players.player_name, teams.team_name
FROM players
LEFT JOIN enrollments ON players.player_id = enrollments.player_id
LEFT JOIN teams ON enrollments.team_id = teams.team_id

UNION

SELECT players.player_name, teams.team_name
FROM players
RIGHT JOIN enrollments ON players.player_id = enrollments.player_id
RIGHT JOIN teams ON enrollments.team_id = teams.team_id;`}
        </CodeBlock>
        <p>Result includes players with no team (NULL team) and teams with no players (NULL player).</p>
      </div>
    </div>
  );
}

export default MySQLJoins;
