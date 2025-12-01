import React from 'react';
import '../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function QNA() {
  return (
    <div className="debounce-container">
      <h1 className="section-title">DBMS</h1>

      <div className="subsection">

        {/** all forms and its examples */}
        <div className="faq-item">
          <h4 className="faq-question">What is Normalization?</h4>
          <p className="faq-answer">
            Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. It involves dividing large tables into smaller, related tables and defining relationships between them.
          </p>
        </div>

        <h2>MYSQL DEFAULT PORT : <span>3306</span></h2>

        <p>MySQL listens on TCP port <strong>3306</strong> for client connections.</p>

        <h3>Change MySQL Port</h3>
        <pre><code>mysqld --port=3307</code></pre>

        <h3>Connect Using Custom Port</h3>
        <pre><code>mysql -u username -p --port=3307</code></pre>

        <h3>MySQL Connection URI</h3>
        <pre><code>mysql://username:password@localhost:3306/database_name</code></pre>

        <h2>MYSQL OVER SSL (ENCRYPTED CONNECTION)</h2>

        <p>MySQL can use SSL/TLS to encrypt traffic between client and server.
          By default this still uses the same MySQL port <strong>3306</strong>,
          unless you configure a different one.</p>

        <h3>Connect to MySQL Using SSL</h3>
        <pre><code>
          mysql -u username -p \
          --host=your-hostname \
          --port=3306 \
          --ssl-ca=ca.pem \
          --ssl-cert=client-cert.pem \
          --ssl-key=client-key.pem
        </code></pre>

        <h2>HTTPS / SSL DEFAULT PORT : <span>443</span></h2>

        <p>HTTPS (HTTP over SSL/TLS) uses TCP port <strong>443</strong> by default.</p>

        <h3>Examples</h3>
        <pre><code>https://example.com
          https://your-domain.com:443</code></pre>

        <h3>Notes</h3>
        <p>
          • Port <strong>443</strong> is for secure web traffic (HTTPS), not for MySQL.<br />
          • Web servers like Nginx / Apache terminate SSL on port 443 and can proxy to MySQL on port 3306.<br />
        </p>



        <div className="faq-item">
          <h4 className="faq-question">What are the different Normal Forms?</h4>
          <p>
            Normalization is the process of organizing data in a database to reduce redundancy and
            improve data integrity. The main goal is to split large, repetitive tables into smaller,
            well-structured tables and connect them using relationships.
          </p>

          <h2>1. First Normal Form (1NF)</h2>
          <p>A table is in <b>1NF</b> when:</p>
          <ul>
            <li>Each cell contains only <b>atomic (single) values</b>.</li>
            <li>Entries in a column are of the <b>same data type</b>.</li>
            <li>Each column has a <b>unique name</b>.</li>
            <li>The order of data doesn’t matter.</li>
          </ul>

          <b>Unnormalized Table (Not in 1NF):</b>
          <div className="table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr><th>player_id</th><th>player_name</th><th>teams</th></tr>
              </thead>
              <tbody>
                <tr><td>1</td><td>Virat Kohli</td><td>RCB, India</td></tr>
                <tr><td>2</td><td>MS Dhoni</td><td>CSK, India</td></tr>
                <tr><td>3</td><td>Rohit Sharma</td><td>MI, India</td></tr>
                <tr><td>4</td><td>Jasprit Bumrah</td><td>MI, India</td></tr>
              </tbody>
            </table>
          </div>

          <b>Converted into 1NF:</b>
          <div className="table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr><th>player_id</th><th>player_name</th><th>team</th></tr>
              </thead>
              <tbody>
                <tr><td>1</td><td>Virat Kohli</td><td>RCB</td></tr>
                <tr><td>1</td><td>Virat Kohli</td><td>India</td></tr>
                <tr><td>2</td><td>MS Dhoni</td><td>CSK</td></tr>
                <tr><td>2</td><td>MS Dhoni</td><td>India</td></tr>
                <tr><td>3</td><td>Rohit Sharma</td><td>MI</td></tr>
                <tr><td>3</td><td>Rohit Sharma</td><td>India</td></tr>
                <tr><td>4</td><td>Jasprit Bumrah</td><td>MI</td></tr>
                <tr><td>4</td><td>Jasprit Bumrah</td><td>India</td></tr>
              </tbody>
            </table>
          </div>

          <h2>2. Second Normal Form (2NF)</h2>
          <p>A table is in <b>2NF</b> when:</p>
          <ul>
            <li>It is already in <b>1NF</b>.</li>
            <li>All non-key attributes are <b>fully dependent</b> on the primary key.</li>
          </ul>

          <p><b>Fix:</b> Break into separate tables.</p>

          <div className="table-wrapper">
            <h3>Players Table</h3>
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

          <div className="table-wrapper">
            <h3>Teams Table</h3>
            <table className="comparison-table">
              <thead><tr><th>team</th><th>captain</th></tr></thead>
              <tbody>
                <tr><td>RCB</td><td>Virat Kohli</td></tr>
                <tr><td>CSK</td><td>MS Dhoni</td></tr>
                <tr><td>MI</td><td>Rohit Sharma</td></tr>
                <tr><td>India</td><td>Rohit Sharma</td></tr>
              </tbody>
            </table>
          </div>

          <div className="table-wrapper">
            <h3>Player_Teams Table</h3>
            <table className="comparison-table">
              <thead><tr><th>player_id</th><th>team</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>RCB</td></tr>
                <tr><td>1</td><td>India</td></tr>
                <tr><td>2</td><td>CSK</td></tr>
                <tr><td>2</td><td>India</td></tr>
                <tr><td>3</td><td>MI</td></tr>
                <tr><td>3</td><td>India</td></tr>
                <tr><td>4</td><td>MI</td></tr>
                <tr><td>4</td><td>India</td></tr>
              </tbody>
            </table>
          </div>

          <h2>3. Third Normal Form (3NF)</h2>
          <p>A table is in <b>3NF</b> when:</p>
          <ul>
            <li>It is already in <b>2NF</b>.</li>
            <li>No <b>transitive dependencies</b> exist (non-key attributes depend only on primary key).</li>
          </ul>

          <p><b>Example:</b> Teams table with owner info (owner depends on team, not on player).</p>

          <div className="table-wrapper">
            <h3>Teams Table</h3>
            <table className="comparison-table">
              <thead><tr><th>team</th><th>captain</th><th>owner</th></tr></thead>
              <tbody>
                <tr><td>RCB</td><td>Virat Kohli</td><td>Vijay Mallya</td></tr>
                <tr><td>CSK</td><td>MS Dhoni</td><td>India Cements</td></tr>
                <tr><td>MI</td><td>Rohit Sharma</td><td>Reliance Industries</td></tr>
                <tr><td>India</td><td>Rohit Sharma</td><td>BCCI</td></tr>
              </tbody>
            </table>
          </div>

          <p><b>Fix:</b> Create a separate Owners table.</p>

          <div className="table-wrapper">
            <h3>Owners Table</h3>
            <table className="comparison-table">
              <thead><tr><th>owner_id</th><th>owner_name</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>Vijay Mallya</td></tr>
                <tr><td>2</td><td>India Cements</td></tr>
                <tr><td>3</td><td>Reliance Industries</td></tr>
                <tr><td>4</td><td>BCCI</td></tr>
              </tbody>
            </table>
          </div>

          <h2>4. Boyce-Codd Normal Form (BCNF)</h2>
          <p>A table is in <b>BCNF</b> when:</p>
          <ul>
            <li>It is already in <b>3NF</b>.</li>
            <li>For every functional dependency <b>A → B</b>, <b>A</b> must be a <b>superkey</b>.</li>
          </ul>

          <p><b>Problem Example:</b></p>
          <p>Consider a table where:</p>
          <ul>
            <li><b>team → captain</b></li>
            <li><b>captain → sponsor</b></li>
          </ul>
          <p>Here, <b>sponsor</b> depends on <b>captain</b>, which is not a superkey. This violates BCNF.</p>

          <div className="table-wrapper">
            <h3>Teams Table (Before BCNF)</h3>
            <table className="comparison-table">
              <thead>
                <tr><th>team</th><th>captain</th><th>sponsor</th></tr>
              </thead>
              <tbody>
                <tr><td>RCB</td><td>Virat Kohli</td><td>Red Bull</td></tr>
                <tr><td>CSK</td><td>MS Dhoni</td><td>India Cements</td></tr>
                <tr><td>MI</td><td>Rohit Sharma</td><td>Reliance</td></tr>
                <tr><td>India</td><td>Jasprit Bumrah</td><td>BCCI</td></tr>
              </tbody>
            </table>
          </div>

          <p><b>Fix (Convert to BCNF):</b> Split the table so that every determinant is a superkey:</p>

          <div className="table-wrapper">
            <h3>Teams Table (After BCNF)</h3>
            <table className="comparison-table">
              <thead>
                <tr><th>team</th><th>captain</th></tr>
              </thead>
              <tbody>
                <tr><td>RCB</td><td>Virat Kohli</td></tr>
                <tr><td>CSK</td><td>MS Dhoni</td></tr>
                <tr><td>MI</td><td>Rohit Sharma</td></tr>
                <tr><td>India</td><td>Jasprit Bumrah</td></tr>
              </tbody>
            </table>
          </div>

          <div className="table-wrapper">
            <h3>Captains Table</h3>
            <table className="comparison-table">
              <thead>
                <tr><th>captain</th><th>sponsor</th></tr>
              </thead>
              <tbody>
                <tr><td>Virat Kohli</td><td>Red Bull</td></tr>
                <tr><td>MS Dhoni</td><td>India Cements</td></tr>
                <tr><td>Rohit Sharma</td><td>Reliance</td></tr>
                <tr><td>Jasprit Bumrah</td><td>BCCI</td></tr>
              </tbody>
            </table>
          </div>

          <p>✅ Now, every functional dependency has a superkey on the left, so the schema adheres to BCNF.
            This ensures minimal redundancy and avoids anomalies while updating sponsors or captains.</p>

        </div>

      </div>

      <div className="subsection">

        <div className="faq-item">
          <h4 className="faq-question">What does ACID stand for?</h4>
          <p className="faq-answer">
            ACID stands for <b>Atomicity</b>, <b>Consistency</b>, <b>Isolation</b>, and <b>Durability</b>. These properties ensure reliable processing of database transactions.
          </p>
        </div>

        <div className="faq-item">
          <h4 className="faq-question">Explain each ACID property.</h4>
          <p>
            <div>
              <p className="faq-answer"><h2>Atomicity:</h2> Ensures that all parts of a transaction are completed; if not, the transaction is aborted.
                <div className="faq-item">
                  Example: Imagine virat  wants to transfer ₹1,000 from his bank account to rohit's account. Atomicity ensures that both actions—deducting ₹1,000 from virat 's account and adding ₹1,000 to rohit's account—are completed successfully. If, for any reason, the second action fails (e.g., system crash after deducting the amount), the entire transaction is rolled back, and virat 's ₹1,000 remains in his account. This prevents scenarios where virat  loses money without rohit receiving it.
                </div>
              </p>
              <p className="faq-answer"><h2>Consistency:</h2> Ensures that a transaction brings the database from one valid state to another, maintaining database invariants.
                <div className="faq-item">
                  Example: In a banking system, there might be a rule that the total amount of money across all accounts must remain constant unless a deposit or withdrawal occurs. When virat  transfers ₹1,000 to rohit, consistency ensures that the total sum of all accounts before and after the transaction remains accurate. If the transfer would violate any database rules (like allowing a negative balance), the transaction is rejected to maintain consistency.
                </div>
              </p>
              <p className="faq-answer"><h2>Isolation:</h2> Ensures that concurrent transactions do not interfere with each other.
                <div className="faq-item">
                  Example: Suppose virat  is transferring ₹1,000 to rohit while, at the same time, rohit is transferring ₹500 to virat . Isolation ensures that these two transactions are processed independently without affecting each other. This means virat 's transfer will either complete entirely or not at all without being influenced by rohit's simultaneous transfer, and vice versa. As a result, both transfers maintain their integrity without causing any inconsistencies in either account.
                </div>
              </p>
              <p className="faq-answer"><h2>Durability:</h2> Ensures that once a transaction is committed, it remains so, even in the case of a system failure.
                <div className="faq-item">
                  Example: After virat  successfully transfers ₹1,000 to rohit's account and the transaction is committed, durability guarantees that this change is permanently recorded in the database. Even if the system crashes immediately after the transaction, the ₹1,000 transfer will still be reflected in rohit's account once the system is restored. This ensures that committed transactions are not lost and that the database remains reliable.
                </div>
              </p>
            </div>
          </p>
        </div>
      </div>

      <div className="subsection">

        <div className="faq-item">
          <h4 className="faq-question">What are some advanced MySQL queries?</h4>
          <p className="faq-answer">
            Examples:
            <div>
              <p>JOINs with Table Examples: </p>
              {/* INNER JOIN Example */}
              <div className="p-6 bg-gray-900 text-white rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4">1. INNER JOIN Example</h2>

                <p className="mb-4">
                  An <b>INNER JOIN</b> returns only those records that have matching values in both tables.
                  Let’s take a cricket example where players are enrolled in different matches.
                </p>

                {/* Players Table */}
                <h3 className="text-xl font-semibold mb-2">Players Table</h3>
                <div className="table-wrapper mb-6">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>player_id</th>
                        <th>player_name</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Virat Kohli</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>MS Dhoni</td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>Rohit Sharma</td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>Jasprit Bumrah</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Enrollments Table */}
                <h3 className="text-xl font-semibold mb-2">Enrollments Table</h3>
                <div className="table-wrapper mb-6">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>enrollment_id</th>
                        <th>player_id</th>
                        <th>match_id</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>101</td>
                        <td>1</td>
                        <td>201</td>
                      </tr>
                      <tr>
                        <td>102</td>
                        <td>1</td>
                        <td>202</td>
                      </tr>
                      <tr>
                        <td>103</td>
                        <td>2</td>
                        <td>203</td>
                      </tr>
                      <tr>
                        <td>104</td>
                        <td>3</td>
                        <td>204</td>
                      </tr>
                      <tr>
                        <td>105</td>
                        <td>3</td>
                        <td>205</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Matches Table */}
                <h3 className="text-xl font-semibold mb-2">Matches Table</h3>
                <div className="table-wrapper mb-6">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>match_id</th>
                        <th>match_name</th>
                        <th>year</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>201</td>
                        <td>India vs Pakistan</td>
                        <td>2023</td>
                      </tr>
                      <tr>
                        <td>202</td>
                        <td>India vs Australia</td>
                        <td>2024</td>
                      </tr>
                      <tr>
                        <td>203</td>
                        <td>India vs England</td>
                        <td>2020</td>
                      </tr>
                      <tr>
                        <td>204</td>
                        <td>India vs South Africa</td>
                        <td>2025</td>
                      </tr>
                      <tr>
                        <td>205</td>
                        <td>India vs New Zealand</td>
                        <td>2026</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* SQL Query */}
                <h3 className="text-xl font-semibold mb-2">SQL Query</h3>
                <SyntaxHighlighter language="sql" style={atomDark}>
                  {`
SELECT players.player_name, matches.match_name
FROM players
INNER JOIN Enrollments ON players.player_id = Enrollments.player_id
INNER JOIN matches ON Enrollments.match_id = matches.match_id;
`}
                </SyntaxHighlighter>

                {/* Result Table */}
                <h3 className="text-xl font-semibold mb-2">Result</h3>
                <div className="table-wrapper">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>player_name</th>
                        <th>match_name</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Virat Kohli</td>
                        <td>India vs Pakistan</td>
                      </tr>
                      <tr>
                        <td>Virat Kohli</td>
                        <td>India vs Australia</td>
                      </tr>
                      <tr>
                        <td>MS Dhoni</td>
                        <td>India vs England</td>
                      </tr>
                      <tr>
                        <td>Rohit Sharma</td>
                        <td>India vs South Africa</td>
                      </tr>
                      <tr>
                        <td>Rohit Sharma</td>
                        <td>India vs New Zealand</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* LEFT JOIN Example */}
              <div>
                <h2>2. LEFT JOIN (LEFT OUTER JOIN)</h2>

                <p>
                  A <b>LEFT JOIN</b> returns <b>all records from the left table</b> (players) and the
                  matched records from the right tables (enrollments, teams). If there is no match,
                  the result is <code>NULL</code> on the right side.
                </p>

                <h3>Sample Tables:</h3>

                {/* Players Table */}
                <p><b>players Table:</b></p>
                <div className="table-wrapper">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>player_id</th>
                        <th>player_name</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>1</td><td>Virat Kohli</td></tr>
                      <tr><td>2</td><td>Rohit Sharma</td></tr>
                      <tr><td>3</td><td>MS Dhoni</td></tr>
                      <tr><td>4</td><td>Jasprit Bumrah</td></tr>
                    </tbody>
                  </table>
                </div>

                {/* Enrollments Table */}
                <p><b>enrollments Table:</b></p>
                <div className="table-wrapper">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>enrollment_id</th>
                        <th>player_id</th>
                        <th>team_id</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>101</td><td>1</td><td>201</td></tr>
                      <tr><td>102</td><td>1</td><td>202</td></tr>
                      <tr><td>103</td><td>2</td><td>203</td></tr>
                      <tr><td>104</td><td>3</td><td>204</td></tr>
                      {/* Jasprit Bumrah (id=4) intentionally missing enrollment → to show LEFT JOIN NULL */}
                    </tbody>
                  </table>
                </div>

                {/* Teams Table */}
                <p><b>teams Table:</b></p>
                <div className="table-wrapper">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>team_id</th>
                        <th>team_name</th>
                        <th>year</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>201</td><td>RCB</td><td>2024</td></tr>
                      <tr><td>202</td><td>India</td><td>2023</td></tr>
                      <tr><td>203</td><td>MI</td><td>2022</td></tr>
                      <tr><td>204</td><td>CSK</td><td>2021</td></tr>
                    </tbody>
                  </table>
                </div>

                {/* SQL Query */}
                <h3>Query:</h3>
                <SyntaxHighlighter language="sql" style={atomDark}>
                  {`
SELECT players.player_name, teams.team_name
FROM players
LEFT JOIN enrollments ON players.player_id = enrollments.player_id
LEFT JOIN teams ON enrollments.team_id = teams.team_id;
`}
                </SyntaxHighlighter>

                {/* Result Table */}
                <h3>Result:</h3>
                <div className="table-wrapper">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>player_name</th>
                        <th>team_name</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Virat Kohli</td><td>RCB</td></tr>
                      <tr><td>Virat Kohli</td><td>India</td></tr>
                      <tr><td>Rohit Sharma</td><td>MI</td></tr>
                      <tr><td>MS Dhoni</td><td>CSK</td></tr>
                      <tr><td>Jasprit Bumrah</td><td>NULL</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>


              {/* RIGHT JOIN Example */}
              <div>
                <h3>3. RIGHT JOIN (RIGHT OUTER JOIN):</h3>

                <p>
                  A <b>RIGHT JOIN</b> returns <b>all records from the right table</b>
                  and the <b>matched records from the left table</b>.
                  If there is no match, the result will contain <code>NULL</code> on the left side.
                </p>

                <p><b>Query:</b></p>
                <SyntaxHighlighter language="sql" style={atomDark}>
                  {`
SELECT players.player_name, teams.team_name
FROM players
RIGHT JOIN Enrollments ON players.player_id = Enrollments.player_id
RIGHT JOIN teams ON Enrollments.team_id = teams.team_id;
    `}
                </SyntaxHighlighter>

                <p><b>Explanation:</b>
                  - Start with the <code>teams</code> table (right side).
                  - Match with <code>Enrollments</code> and then <code>players</code>.
                  - If a team has no player enrolled, the <code>player_name</code> will be <code>NULL</code>.
                  - But all teams will appear in the result.
                </p>

                <p><b>Result:</b></p>
                <div className="table-wrapper">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>player_name</th>
                        <th>team_name</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Virat Kohli</td>
                        <td>RCB</td>
                      </tr>
                      <tr>
                        <td>Faf du Plessis</td>
                        <td>RCB</td>
                      </tr>
                      <tr>
                        <td>MS Dhoni</td>
                        <td>CSK</td>
                      </tr>
                      <tr>
                        <td>Ruturaj Gaikwad</td>
                        <td>CSK</td>
                      </tr>
                      <tr>
                        <td>Rohit Sharma</td>
                        <td>MI</td>
                      </tr>
                      <tr>
                        <td>Suryakumar Yadav</td>
                        <td>MI</td>
                      </tr>
                      {/* Example when a team has no enrolled player */}
                      <tr>
                        <td>NULL</td>
                        <td>GT</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* FULL OUTER JOIN Example */}
              <div>
                <h3>4. FULL OUTER JOIN:</h3>

                <p>
                  A <b>FULL OUTER JOIN</b> returns <b>all records</b> when there is a match
                  in either the left or the right table.
                  <br />
                  ⚠️ Note: MySQL does not support <b>FULL OUTER JOIN</b> directly.
                  But we can achieve it using a combination of <b>LEFT JOIN</b> and <b>RIGHT JOIN</b> with <code>UNION</code>.
                </p>

                <p><b>Query:</b></p>
                <SyntaxHighlighter language="sql" style={atomDark}>
                  {`
SELECT players.player_name, teams.team_name
FROM players
LEFT JOIN Enrollments ON players.player_id = Enrollments.player_id
LEFT JOIN teams ON Enrollments.team_id = teams.team_id

UNION

SELECT players.player_name, teams.team_name
FROM players
RIGHT JOIN Enrollments ON players.player_id = Enrollments.player_id
RIGHT JOIN teams ON Enrollments.team_id = teams.team_id;
    `}
                </SyntaxHighlighter>

                <p><b>Explanation:</b></p>
                <ul>
                  <li><b>LEFT JOIN</b> → brings all players (even if they are not in a team).</li>
                  <li><b>RIGHT JOIN</b> → brings all teams (even if they have no players).</li>
                  <li><b>UNION</b> → combines both results, so you get a full set.</li>
                </ul>

                <p><b>Result:</b></p>
                <div className="table-wrapper">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>player_name</th>
                        <th>team_name</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Virat Kohli</td>
                        <td>RCB</td>
                      </tr>
                      <tr>
                        <td>Faf du Plessis</td>
                        <td>RCB</td>
                      </tr>
                      <tr>
                        <td>MS Dhoni</td>
                        <td>CSK</td>
                      </tr>
                      <tr>
                        <td>Ruturaj Gaikwad</td>
                        <td>CSK</td>
                      </tr>
                      <tr>
                        <td>Rohit Sharma</td>
                        <td>MI</td>
                      </tr>
                      <tr>
                        <td>Suryakumar Yadav</td>
                        <td>MI</td>
                      </tr>
                      {/* Player without a team */}
                      <tr>
                        <td>Jasprit Bumrah</td>
                        <td>NULL</td>
                      </tr>
                      {/* Team without players */}
                      <tr>
                        <td>NULL</td>
                        <td>GT</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Advanced SQL Queries*/}
            </div>
            <div>
              <h3>5. Important SQL Queries</h3>

              <p>
                You can rename tables and columns in your queries using the <code>AS</code> keyword
                to make them more readable or to avoid conflicts.
              </p>

              {/* Players Table */}
              <div className="table-wrapper">
                <h6>Players Table</h6>
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>id</th>
                      <th>first_name</th>
                      <th>last_name</th>
                      <th>DOB</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Virat</td>
                      <td>Kohli</td>
                      <td>1988-11-05</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Rohit</td>
                      <td>Sharma</td>
                      <td>1987-04-30</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>MS</td>
                      <td>Dhoni</td>
                      <td>1981-07-07</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>Jasprit</td>
                      <td>Bumrah</td>
                      <td>1993-12-06</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>KL</td>
                      <td>Rahul</td>
                      <td>1992-04-18</td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td>Suryakumar</td>
                      <td>Yadav</td>
                      <td>1990-09-14</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Roles Table */}
              <div className="table-wrapper">
                <h6>Roles Table</h6>
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>id</th>
                      <th>player_id</th>
                      <th>role</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>1</td>
                      <td>captain</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>2</td>
                      <td>vice-captain</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>3</td>
                      <td>wicketkeeper</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>4</td>
                      <td>bowler</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>6</td>
                      <td>batsman</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4>SQL Queries:</h4>

              {/* Query 1 */}
              <div>
                <p><b>1. Fetch records present in Roles but not in Players:</b></p>
                <SyntaxHighlighter language="sql" style={atomDark}>
                  {`SELECT * FROM roles WHERE player_id NOT IN (SELECT id FROM players);`}
                </SyntaxHighlighter>
                <p><b>Output:</b> (Empty, because all role player_ids exist in Players)</p>
              </div>

              {/* Query 2 */}
              <div>
                <p><b>2. Fetch players who don’t have any role assigned:</b></p>
                <SyntaxHighlighter language="sql" style={atomDark}>
                  {`SELECT * FROM players WHERE id NOT IN (SELECT player_id FROM roles);`}
                </SyntaxHighlighter>
                <p><b>Output:</b></p>
                <div className="table-wrapper">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>id</th>
                        <th>first_name</th>
                        <th>last_name</th>
                        <th>DOB</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>5</td>
                        <td>KL</td>
                        <td>Rahul</td>
                        <td>1992-04-18</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Query 3 */}
              <div>
                <p><b>3. Fetch all players born in 1990:</b></p>
                <SyntaxHighlighter language="sql" style={atomDark}>
                  {`SELECT * FROM players WHERE YEAR(DOB) = 1990;`}
                </SyntaxHighlighter>
                <p><b>Output:</b></p>
                <div className="table-wrapper">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>id</th>
                        <th>first_name</th>
                        <th>last_name</th>
                        <th>DOB</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>6</td>
                        <td>Suryakumar</td>
                        <td>Yadav</td>
                        <td>1990-09-14</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Query 4 */}
              <div>
                <p><b>4. Fetch players who have a role assigned:</b></p>
                <SyntaxHighlighter language="sql" style={atomDark}>
                  {`SELECT * FROM players WHERE id IN (SELECT player_id FROM roles);`}
                </SyntaxHighlighter>
                <p><b>Output:</b></p>
                <div className="table-wrapper">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>id</th>
                        <th>first_name</th>
                        <th>last_name</th>
                        <th>DOB</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Virat</td>
                        <td>Kohli</td>
                        <td>1988-11-05</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Rohit</td>
                        <td>Sharma</td>
                        <td>1987-04-30</td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>MS</td>
                        <td>Dhoni</td>
                        <td>1981-07-07</td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>Jasprit</td>
                        <td>Bumrah</td>
                        <td>1993-12-06</td>
                      </tr>
                      <tr>
                        <td>6</td>
                        <td>Suryakumar</td>
                        <td>Yadav</td>
                        <td>1990-09-14</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Query 5 */}
              <div>
                <p><b>5. Fetch role-wise count of players:</b></p>
                <SyntaxHighlighter language="sql" style={atomDark}>
                  {`SELECT role, COUNT(*) AS player_count FROM roles GROUP BY role;`}
                </SyntaxHighlighter>
                <p><b>Output:</b></p>
                <div className="table-wrapper">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>role</th>
                        <th>player_count</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>captain</td>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>vice-captain</td>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>wicketkeeper</td>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>bowler</td>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>batsman</td>
                        <td>1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Query 6 */}
              <div>
                <p><b>6. Fetch player names even if they don’t have a role:</b></p>
                <SyntaxHighlighter language="sql" style={atomDark}>
                  {`
SELECT p.first_name, p.last_name, r.role
FROM players p 
LEFT JOIN roles r ON p.id = r.player_id;
      `}
                </SyntaxHighlighter>
                <p><b>Output:</b></p>
                <div className="table-wrapper">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>first_name</th>
                        <th>last_name</th>
                        <th>role</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Virat</td>
                        <td>Kohli</td>
                        <td>captain</td>
                      </tr>
                      <tr>
                        <td>Rohit</td>
                        <td>Sharma</td>
                        <td>vice-captain</td>
                      </tr>
                      <tr>
                        <td>MS</td>
                        <td>Dhoni</td>
                        <td>wicketkeeper</td>
                      </tr>
                      <tr>
                        <td>Jasprit</td>
                        <td>Bumrah</td>
                        <td>bowler</td>
                      </tr>
                      <tr>
                        <td>KL</td>
                        <td>Rahul</td>
                        <td>NULL</td>
                      </tr>
                      <tr>
                        <td>Suryakumar</td>
                        <td>Yadav</td>
                        <td>batsman</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </p>
        </div>

        <div className="faq-item">
          <h4 className="faq-question">What are indexes in MySQL and how do you create them?</h4>
          <p className="faq-answer">
            Indexes are used to speed up the retrieval of data from the database. They can be created on one or more columns of a table.

            <b>Creating an Index:</b>
            <SyntaxHighlighter language="javascript" style={atomDark}>
              {`
CREATE INDEX idx_name ON players (player_name);
              `}
            </SyntaxHighlighter>

            <b>Types of Indexes:</b>
            <div>
              <p>Primary Key Index</p>
              <p>Unique Index</p>
              <p>Composite Index</p>
              <p>Full-Text Index</p>
            </div>
          </p>
        </div>
      </div>
    </div>
  );
}

export default QNA;
