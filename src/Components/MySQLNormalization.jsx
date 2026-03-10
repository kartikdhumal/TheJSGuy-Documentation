import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function MySQLNormalization() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Normalization in MySQL / DBMS</h1>
      <p>
        Normalization organizes data to reduce redundancy and improve integrity by splitting tables and defining relationships.
      </p>

      <div className="method-section">
        <h2 className="method-title">First Normal Form (1NF)</h2>
        <p>Rules: each cell has <strong>atomic (single) values</strong>; same data type per column; unique column names.</p>
        <p><strong>Not in 1NF:</strong> column <code>teams</code> has multiple values (e.g. "RCB, India").</p>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead><tr><th>player_id</th><th>player_name</th><th>teams</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>Virat Kohli</td><td>RCB, India</td></tr>
              <tr><td>2</td><td>MS Dhoni</td><td>CSK, India</td></tr>
            </tbody>
          </table>
        </div>
        <p><strong>In 1NF:</strong> one row per team (atomic values).</p>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead><tr><th>player_id</th><th>player_name</th><th>team</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>Virat Kohli</td><td>RCB</td></tr>
              <tr><td>1</td><td>Virat Kohli</td><td>India</td></tr>
              <tr><td>2</td><td>MS Dhoni</td><td>CSK</td></tr>
              <tr><td>2</td><td>MS Dhoni</td><td>India</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="method-section">
        <h2 className="method-title">Second Normal Form (2NF)</h2>
        <p>Already in 1NF + every non-key attribute is <strong>fully dependent</strong> on the primary key. Fix: split into separate tables.</p>
        <p><strong>Example:</strong> Players table (player_id, player_name) and Teams table (team, captain), with a junction table Player_Teams (player_id, team).</p>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`-- Players
CREATE TABLE players (player_id INT PRIMARY KEY, player_name VARCHAR(100));

-- Teams
CREATE TABLE teams (team VARCHAR(50) PRIMARY KEY, captain VARCHAR(100));

-- Junction (many-to-many)
CREATE TABLE player_teams (player_id INT, team VARCHAR(50),
  PRIMARY KEY (player_id, team),
  FOREIGN KEY (player_id) REFERENCES players(player_id),
  FOREIGN KEY (team) REFERENCES teams(team));`}
        </SyntaxHighlighter>
      </div>

      <div className="method-section">
        <h2 className="method-title">Third Normal Form (3NF)</h2>
        <p>Already in 2NF + no <strong>transitive dependency</strong>: non-key attributes depend only on the primary key, not on other non-key attributes.</p>
        <p><strong>Example:</strong> If Teams has (team, captain, owner) and owner depends on team, move owner to a separate table (e.g. team_owners) so Teams only has team and captain.</p>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`-- Teams (no owner here)
CREATE TABLE teams (team VARCHAR(50) PRIMARY KEY, captain VARCHAR(100));

-- Owners in separate table
CREATE TABLE team_owners (team VARCHAR(50) PRIMARY KEY, owner VARCHAR(100),
  FOREIGN KEY (team) REFERENCES teams(team));`}
        </SyntaxHighlighter>
      </div>

      <div className="method-section">
        <h2 className="method-title">Boyce-Codd Normal Form (BCNF)</h2>
        <p>Already in 3NF + for every functional dependency <code>A → B</code>, <code>A</code> must be a <strong>superkey</strong>.</p>
        <p>If you have <code>team → captain</code> and <code>captain → sponsor</code>, sponsor depends on captain (not a key). Split: one table (team, captain), another (captain, sponsor).</p>
        <SyntaxHighlighter language="sql" style={atomDark}>
          {`CREATE TABLE team_captain (team VARCHAR(50) PRIMARY KEY, captain VARCHAR(100));
CREATE TABLE captain_sponsor (captain VARCHAR(100) PRIMARY KEY, sponsor VARCHAR(100));`}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default MySQLNormalization;
