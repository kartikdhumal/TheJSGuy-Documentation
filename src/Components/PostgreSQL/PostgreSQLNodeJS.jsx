import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function PostgreSQLNodeJS() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">PostgreSQL with Node.js</h1>
      <p className="com-text">
        From Node.js you can talk to PostgreSQL directly with the pg package (node-postgres), or use an ORM like Prisma or TypeORM. Even with an ORM it is good to know how pg works underneath.
      </p>

      <section className="method-section">
        <h2 className="method-title">Install and connect with a Pool</h2>
        <p className="com-text">
          A Pool keeps a few connections open and reuses them. Opening a new connection for every request is slow, so always use a Pool in a server.
        </p>
        <CodeBlock language="bash" style={atomDark}>
          {`npm install pg`}
        </CodeBlock>
        <CodeBlock language="javascript" style={atomDark}>
          {`// db.js
import pg from 'pg';

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL, // postgres://user:pass@localhost:5432/shopdb
  max: 10,                 // max connections in the pool
  idleTimeoutMillis: 30000,
});`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Run queries with parameters</h2>
        <p className="com-text">
          Always use $1, $2 placeholders and pass values in an array. Never put user input into the SQL string with template literals, that causes SQL injection.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`// ✅ safe
const { rows } = await pool.query(
  'SELECT id, name, email FROM users WHERE email = $1',
  [email]
);
const user = rows[0];

// ❌ unsafe - SQL injection
await pool.query(\`SELECT * FROM users WHERE email = '\${email}'\`);

// insert and get the new row
const { rows: [created] } = await pool.query(
  'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
  [name, email]
);`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Transactions in Node.js</h2>
        <p className="com-text">
          For a transaction, take ONE client from the pool and run all queries on it. pool.query() may use a different connection each time, so BEGIN and COMMIT would not be on the same connection.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`async function transferMoney(fromId, toId, amount) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, fromId]);
    await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, toId]);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();   // always give it back to the pool
  }
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Express API example</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`import express from 'express';
import { pool } from './db.js';

const app = express();
app.use(express.json());

app.get('/users/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [req.params.id]);
  if (!rows.length) return res.status(404).json({ message: 'User not found' });
  res.json(rows[0]);
});

app.post('/users', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email',
      [req.body.name, req.body.email]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ message: 'Email already exists' }); // unique violation
    throw err;
  }
});

app.listen(3000);`}
        </CodeBlock>
        <p className="com-text">
          Useful error codes: 23505 unique violation, 23503 foreign key violation, 23502 not null violation, 40001 serialization failure (retry), 40P01 deadlock (retry).
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">With Prisma</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`// schema.prisma
model User {
  id     Int     @id @default(autoincrement())
  name   String
  email  String  @unique
  orders Order[]
}

// code
const user = await prisma.user.findUnique({
  where: { email },
  include: { orders: true },
});`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">With TypeORM in NestJS</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  autoLoadEntities: true,
  synchronize: false,   // use migrations in production
});`}
        </CodeBlock>
        <p className="com-text">See the NestJS → Database with TypeORM page for entities, repositories and transactions.</p>
      </section>
    </div>
  );
}

export default PostgreSQLNodeJS;
