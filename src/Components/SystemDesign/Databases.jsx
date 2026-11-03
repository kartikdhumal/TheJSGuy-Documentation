import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function SystemDesignDatabases() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Databases &amp; Data Scaling</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">When data grows big, one simple table on one server is not enough. This page covers how to split data, copy it, and which kind of database to pick.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Partitioning:</strong> split one big table into smaller pieces on the same server.</li>
          <li className="com-list-item"><strong>Sharding:</strong> split data across many servers.</li>
          <li className="com-list-item"><strong>Replication:</strong> keep copies of the same data on many servers.</li>
          <li className="com-list-item"><strong>SQL vs NoSQL:</strong> tables with fixed columns vs flexible data models.</li>
        </ol>
      </div>

      <section id="partitioning" className="method-section">
        <h2 className="method-title">Partitioning</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Partitioning means cutting one huge table into smaller pieces, so the database only looks at the piece it needs.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Horizontal partitioning:</strong> split by rows. For example, orders of January in one piece, February in another.</li>
            <li className="com-list-item"><strong>Vertical partitioning:</strong> split by columns. Keep small, often-used columns in one table and big, rarely-used columns (like a long description or photo) in another.</li>
            <li className="com-list-item"><strong>Why:</strong> faster queries, smaller indexes, and you can delete old data by dropping a whole piece instead of running a slow DELETE.</li>
            <li className="com-list-item definition-default"><strong>Defaults:</strong> PostgreSQL and MySQL tables are not partitioned unless you add PARTITION BY to the CREATE TABLE.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Paytm keeps a transactions table with many years of data. Most users only check the last few months. If the table is partitioned by month, a query for "my transactions in October" only scans the October piece, not years of data. Old years can be moved to cheap storage.
          </p>
        </div>
        <CodeBlock language="sql" style={atomDark}>
          {`-- PostgreSQL: horizontal partitioning by month
CREATE TABLE transactions (
  id         BIGINT,
  user_id    BIGINT,
  amount     NUMERIC,
  created_at DATE NOT NULL
) PARTITION BY RANGE (created_at);

CREATE TABLE transactions_2026_10 PARTITION OF transactions
  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');

CREATE TABLE transactions_2026_11 PARTITION OF transactions
  FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');

-- Only scans the October piece
SELECT * FROM transactions
WHERE created_at >= '2026-10-01' AND created_at < '2026-11-01';`}
        </CodeBlock>
        <p className="com-text">
          Vertical example: a products table on Flipkart with id, name, price (read all the time) and a long HTML description (read only on the product page). Moving the description to a product_details table keeps the main table small and fast.
        </p>
      </section>

      <section id="partitioning-vs-sharding" className="method-section">
        <h2 className="method-title">Partitioning vs Sharding</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Partitioning = pieces inside ONE database server. Sharding = pieces spread across MANY database servers. Each server (shard) holds only part of the data.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Why shard:</strong> one server has a limit on disk, memory and how many writes it can take. Sharding spreads both data and writes across machines.</li>
            <li className="com-list-item"><strong>Shard key:</strong> the column that decides which shard a row goes to, like user_id. Pick one that spreads data evenly and that most queries use.</li>
            <li className="com-list-item"><strong>Hot shard:</strong> one shard gets far more traffic than others. For example, sharding by city puts all of Mumbai on one server.</li>
            <li className="com-list-item"><strong>Cross-shard joins:</strong> if the data you need sits on different shards, a JOIN becomes slow and hard. You often have to do it in your app code.</li>
            <li className="com-list-item definition-default"><strong>Defaults:</strong> MongoDB does not shard a collection until you enable sharding and call shardCollection. PostgreSQL and MySQL have no built-in sharding; you use tools like Citus or Vitess, or do it in your app.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            WhatsApp-scale chat apps have far too many messages for one server. They shard messages by chat or user id. Messages of chat 1 to 1 crore go to shard A, the next range to shard B, and so on (or by a hash of the id). When you open a chat, the app knows exactly which shard to ask.
          </p>
        </div>
        <CodeBlock language="text" style={atomDark}>
          {`Partitioning (one server):        Sharding (many servers):

[ DB Server ]                      user_id % 3
  orders_jan                        /     |     \\
  orders_feb                  [Shard 0][Shard 1][Shard 2]
  orders_mar                   users    users    users
                               0,3,6    1,4,7    2,5,8`}
        </CodeBlock>
        <p className="com-text">
          Consistent hashing in simple words: with user_id % 3, adding a 4th server changes the answer for almost every user, so nearly all data must move. Consistent hashing puts servers on a circle (a ring). Each key goes to the next server clockwise on the ring. When you add a server, only the keys between it and the server before it move. Most data stays where it is. Cassandra and DynamoDB use this idea.
        </p>
      </section>

      <section id="replication-vs-sharding" className="method-section">
        <h2 className="method-title">Replication vs Sharding</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Replication = many copies of the SAME data. Sharding = DIFFERENT parts of the data on different servers. You often use both together.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Replication helps with:</strong> more reads (spread reads over copies) and safety (if one server dies, a copy takes over).</li>
            <li className="com-list-item"><strong>Sharding helps with:</strong> data too big for one server, and too many writes for one server.</li>
            <li className="com-list-item"><strong>Leader-follower:</strong> all writes go to the leader (primary). Followers (replicas) copy changes from it and serve reads.</li>
            <li className="com-list-item"><strong>Replication lag:</strong> followers are a little behind the leader. Right after a write, a read from a follower may show old data.</li>
            <li className="com-list-item definition-default"><strong>Defaults:</strong> PostgreSQL streaming replication and MySQL replication are asynchronous by default (the leader doesn't wait for followers). In a MongoDB replica set, reads go to the primary by default (read preference "primary").</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            On Amazon, millions of people view products but far fewer change them. So product data has one leader for writes and many read replicas for viewing. Replication lag is why sometimes you update your address and the old one shows for a second. To avoid that, apps read from the leader right after a user's own write ("read your own writes").
          </p>
        </div>
        <CodeBlock language="text" style={atomDark}>
          {`Replication (same data copied):

            writes
              |
         [ Leader ]
         /    |    \\      copies changes
 [Follower][Follower][Follower]
     ^         ^         ^
     |------ reads ------|

Both together: each shard has its own leader + followers
  Shard A: Leader A -> Follower A1, A2   (users 0 - 1 crore)
  Shard B: Leader B -> Follower B1, B2   (users 1 - 2 crore)`}
        </CodeBlock>
      </section>

      <section id="sql-vs-nosql" className="method-section">
        <h2 className="method-title">SQL vs NoSQL</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">SQL databases store data in tables with fixed columns and links between tables. NoSQL databases store data in other shapes (documents, key-value, columns, graphs) and are built to spread easily across many servers.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>SQL examples:</strong> PostgreSQL, MySQL. Strong rules, JOINs, and ACID transactions (all-or-nothing, safe changes).</li>
            <li className="com-list-item"><strong>NoSQL examples:</strong> MongoDB, Redis, Cassandra, Neo4j. Flexible structure, easy to scale out.</li>
            <li className="com-list-item definition-default"><strong>Defaults:</strong> default ports are PostgreSQL 5432, MySQL 3306, MongoDB 27017, Redis 6379.</li>
          </ol>
        </div>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr><th>Point</th><th>SQL</th><th>NoSQL</th></tr>
            </thead>
            <tbody>
              <tr><td>Data shape</td><td>Tables, rows, fixed columns</td><td>Documents, key-value, columns, graphs</td></tr>
              <tr><td>Schema</td><td>Fixed, change with migrations</td><td>Flexible, each record can differ</td></tr>
              <tr><td>Relations</td><td>JOINs are easy</td><td>JOINs are limited, data is often copied (denormalized)</td></tr>
              <tr><td>Transactions</td><td>Strong ACID</td><td>Varies; many give weaker or limited guarantees</td></tr>
              <tr><td>Scaling</td><td>Mostly vertical, sharding is hard</td><td>Built for horizontal scaling</td></tr>
              <tr><td>Good for</td><td>Payments, orders, bookings</td><td>Huge data, flexible data, very high writes, caching</td></tr>
            </tbody>
          </table>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            PhonePe money transfers must never lose or double-count money, so that part uses a SQL database with transactions. The same company may use Redis for sessions and OTPs, and a NoSQL store like Cassandra for huge logs or activity history. Big apps mix both. This is called polyglot persistence.
          </p>
        </div>
        <p className="com-text">When to choose:</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Choose SQL:</strong> data has clear relations, you need transactions, and the data size fits a big server. When in doubt, start with PostgreSQL.</li>
          <li className="com-list-item"><strong>Choose NoSQL:</strong> the data shape changes a lot, you have very high write volume, or you need simple fast lookups by key at huge scale.</li>
        </ol>
      </section>

      <section id="nosql-types" className="method-section">
        <h2 className="method-title">Types of NoSQL Databases</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">NoSQL is not one thing. There are four main types, and each one fits a different kind of problem.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Document:</strong> stores JSON-like objects. MongoDB.</li>
            <li className="com-list-item"><strong>Key-value:</strong> a giant dictionary. Redis, DynamoDB.</li>
            <li className="com-list-item"><strong>Column-family:</strong> rows grouped by a key, built for huge writes. Cassandra, HBase.</li>
            <li className="com-list-item"><strong>Graph:</strong> nodes and connections. Neo4j.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            One app like Instagram could use all four: user profiles as documents, sessions in a key-value store, the activity feed in a column-family store, and "people you may know" from a graph.
          </p>
        </div>

        <div id="document-db">
          <h3 className="com-subtitle">Document Database (MongoDB)</h3>
          <div className="definition-box">
            <p className="definition-label">In simple words</p>
            <p className="definition-text">A document database stores each record as a JSON-like document. Related data can sit inside the same document, so one read gets everything.</p>
            <ol className="com-list">
              <li className="com-list-item"><strong>Flexible:</strong> two documents in the same collection can have different fields.</li>
              <li className="com-list-item"><strong>Good for:</strong> product catalogs, user profiles, content, anything that looks like a JSON object.</li>
              <li className="com-list-item definition-default"><strong>Defaults:</strong> port 27017. Every document gets an _id (an ObjectId) if you don't give one. Max document size is 16 MB. Default write concern is "majority" since MongoDB 5.0.</li>
            </ol>
          </div>
          <div className="example-box">
            <p className="example-label">Real-world example</p>
            <p className="com-text">
              On Flipkart, a phone has fields like RAM and battery, while a shirt has size and fabric. In SQL this is awkward. In MongoDB each product is just a document with its own fields.
            </p>
          </div>
          <CodeBlock language="javascript" style={atomDark}>
            {`db.products.insertOne({
  name: 'Redmi Note',
  price: 14999,
  specs: { ram: '8 GB', battery: '5000 mAh' }
});
db.products.find({ 'specs.ram': '8 GB' });`}
          </CodeBlock>
        </div>

        <div id="key-value-db">
          <h3 className="com-subtitle">Key-Value Database (Redis, DynamoDB)</h3>
          <div className="definition-box">
            <p className="definition-label">In simple words</p>
            <p className="definition-text">A key-value database is a giant dictionary. You give a key, you get the value back. Very fast, but you can only look things up by key.</p>
            <ol className="com-list">
              <li className="com-list-item"><strong>Redis:</strong> keeps data in memory, so reads take about a millisecond or less. Used for cache, sessions, OTPs, rate limits, leaderboards.</li>
              <li className="com-list-item"><strong>DynamoDB:</strong> AWS's managed key-value (and document) database. Stores on disk and scales almost without limit.</li>
              <li className="com-list-item definition-default"><strong>Defaults:</strong> Redis runs on port 6379. Keys never expire unless you set a TTL. AOF persistence is off by default (appendonly no).</li>
            </ol>
          </div>
          <div className="example-box">
            <p className="example-label">Real-world example</p>
            <p className="com-text">
              When Ola sends you a login OTP, the server saves it in Redis with a key like otp:9876543210 and a 5-minute TTL. When you type it in, one quick lookup checks it. After 5 minutes Redis deletes it by itself.
            </p>
          </div>
          <CodeBlock language="javascript" style={atomDark}>
            {`await redis.set('otp:9876543210', '482913', 'EX', 300); // 5 min
const otp = await redis.get('otp:9876543210');`}
          </CodeBlock>
        </div>

        <div id="column-family-db">
          <h3 className="com-subtitle">Column-Family Database (Cassandra, HBase)</h3>
          <div className="definition-box">
            <p className="definition-label">In simple words</p>
            <p className="definition-text">A column-family database groups rows by a partition key and keeps them sorted on disk. It is built to take a huge number of writes across many servers.</p>
            <ol className="com-list">
              <li className="com-list-item"><strong>Partition key:</strong> decides which server holds the data. All rows with the same key sit together.</li>
              <li className="com-list-item"><strong>Design rule:</strong> you design tables around your queries, not around relations. No JOINs.</li>
              <li className="com-list-item"><strong>Good for:</strong> chat messages, activity logs, sensor data, time-series.</li>
              <li className="com-list-item definition-default"><strong>Defaults:</strong> Cassandra's client (CQL) port is 9042. In cqlsh the default consistency level is ONE.</li>
            </ol>
          </div>
          <div className="example-box">
            <p className="example-label">Real-world example</p>
            <p className="com-text">
              A chat app stores messages with chat_id as the partition key and time as the sort order. Opening a chat reads one partition, already sorted by time. Discord has publicly talked about storing messages in Cassandra-style databases for this reason.
            </p>
          </div>
          <CodeBlock language="sql" style={atomDark}>
            {`-- Cassandra (CQL)
CREATE TABLE messages (
  chat_id    UUID,
  sent_at    TIMESTAMP,
  sender_id  UUID,
  text       TEXT,
  PRIMARY KEY (chat_id, sent_at)
) WITH CLUSTERING ORDER BY (sent_at DESC);

SELECT * FROM messages WHERE chat_id = ? LIMIT 50;`}
          </CodeBlock>
        </div>

        <div id="graph-db">
          <h3 className="com-subtitle">Graph Database (Neo4j)</h3>
          <div className="definition-box">
            <p className="definition-label">In simple words</p>
            <p className="definition-text">A graph database stores things (nodes) and the links between them (relationships). Following links is very fast, even many steps deep.</p>
            <ol className="com-list">
              <li className="com-list-item"><strong>Node:</strong> a thing, like a user or a product.</li>
              <li className="com-list-item"><strong>Relationship:</strong> a link, like FOLLOWS or BOUGHT.</li>
              <li className="com-list-item"><strong>Good for:</strong> friend suggestions, recommendations, fraud detection (finding accounts linked by the same phone or device).</li>
              <li className="com-list-item definition-default"><strong>Defaults:</strong> Neo4j uses port 7687 for the Bolt protocol (drivers) and 7474 for the HTTP browser.</li>
            </ol>
          </div>
          <div className="example-box">
            <p className="example-label">Real-world example</p>
            <p className="com-text">
              Instagram's "suggested for you": find people followed by the people you follow, whom you don't follow yet. In SQL this needs several self-joins on a huge table. In a graph database it is a short query that walks the links.
            </p>
          </div>
          <CodeBlock language="text" style={atomDark}>
            {`// Neo4j (Cypher): friends of friends I don't follow yet
MATCH (me:User {id: 1})-[:FOLLOWS]->(:User)-[:FOLLOWS]->(s:User)
WHERE NOT (me)-[:FOLLOWS]->(s) AND s <> me
RETURN s.name, count(*) AS mutual
ORDER BY mutual DESC LIMIT 10;`}
          </CodeBlock>
        </div>
      </section>
    </div>
  );
}

export default SystemDesignDatabases;
