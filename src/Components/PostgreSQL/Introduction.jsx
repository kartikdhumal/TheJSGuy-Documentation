import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function PostgreSQLIntroduction() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Introduction to PostgreSQL</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text"><strong>PostgreSQL</strong> (or just Postgres) is a powerful, open-source object-relational database management system (ORDBMS). It stores and manages structured and semi-structured data using the SQL language. </p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Table:</strong> like an Excel sheet. Each row is one record (one user), each column is one detail (name, email).</li>
          <li className="com-list-item"><strong>Relational:</strong> tables are linked to each other. For example, an order keeps the id of the user who placed it.</li>
          <li className="com-list-item"><strong>SQL:</strong> you use SQL to save and get data, like SELECT * FROM users;</li>
          <li className="com-list-item"><strong>Free:</strong> it is open source, nobody pays for it.</li>
          <li className="com-list-item"><strong>Known for:</strong> keeping your data safe, strong SQL, and extras like JSONB (save JSON in a column).</li>
          <li className="com-list-item definition-default"><strong>Defaults:</strong> port 5432, admin user postgres, first database postgres, new tables go into the public schema, isolation level Read Committed.</li>
        </ol>
      </div>

      <section className="method-section">
        <h2 className="method-title">Why is PostgreSQL used?</h2>
        <ol className="com-list">
          <li className="com-list-item"><strong>Data safety:</strong> it is fully ACID, so your data does not get half-saved or lost.</li>
          <li className="com-list-item"><strong>Strong SQL:</strong> joins, subqueries, CTEs (WITH), window functions all work very well.</li>
          <li className="com-list-item"><strong>JSONB:</strong> you can store JSON in a column and query it fast, so you get some MongoDB-like flexibility inside a SQL database.</li>
          <li className="com-list-item"><strong>Many readers and writers at the same time:</strong> it uses MVCC, so reads do not block writes.</li>
          <li className="com-list-item"><strong>Extensions:</strong> PostGIS (maps and locations), pgvector (AI embeddings), pg_trgm (fuzzy search) and many more.</li>
          <li className="com-list-item">Free and open source, with no single company owning it.</li>
        </ol>
        <p className="com-text">
          This is why many companies pick PostgreSQL as their main database for web apps, fintech, analytics and SaaS products.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Where is it used?</h2>
        <p className="com-text">
          E-commerce (orders, payments, stock), banking and payments (money needs ACID), SaaS apps with many users, reporting and analytics, apps with location data (PostGIS), and AI apps that store vectors (pgvector). Supabase, Neon, AWS RDS and Google Cloud SQL all give you managed PostgreSQL.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Quick setup</h2>
        <p className="com-text">The easiest way to run PostgreSQL locally is Docker. The default port is 5432.</p>
        <CodeBlock language="bash" style={atomDark}>
          {`# Run PostgreSQL in Docker
docker run -d --name postgres \\
  -e POSTGRES_PASSWORD=secret \\
  -p 5432:5432 postgres

# Open the psql shell
docker exec -it postgres psql -U postgres`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Useful psql commands</h2>
        <p className="com-text">psql is the command line tool for PostgreSQL. Commands starting with a backslash are psql shortcuts, not SQL.</p>
        <CodeBlock language="bash" style={atomDark}>
          {`\\l              -- list all databases
\\c shopdb       -- connect to database shopdb
\\dt             -- list tables
\\d users        -- show columns of table users
\\du             -- list users (roles)
\\x              -- turn on expanded view (good for wide rows)
\\q              -- quit`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Your first database and table</h2>
        <CodeBlock language="sql" style={atomDark}>
          {`CREATE DATABASE shopdb;
\\c shopdb

CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO users (name, email) VALUES ('Kartik', 'kartik@mail.com');

SELECT * FROM users;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Database, schema and table</h2>
        <p className="com-text">
          In PostgreSQL one server can have many databases. Each database has schemas (like folders), and each schema has tables. The default schema is called public. So the full name of a table is database.schema.table, for example shopdb.public.users. In MySQL, "database" and "schema" mean the same thing, but in PostgreSQL they are different levels.
        </p>
      </section>
    </div>
  );
}

export default PostgreSQLIntroduction;
