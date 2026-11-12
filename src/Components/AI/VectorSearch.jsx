import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import '../../styles/ai.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Flow from './Flow';

function VectorSearch() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Vector Search &amp; pgvector</h1>
      <p className="com-text">
        Once your texts are embeddings, searching is easy to describe: turn the question into a vector too, then find the stored vectors that are closest to it. Closest vectors means closest meaning. A vector database (or PostgreSQL with the pgvector extension) is built to do exactly this, fast.
      </p>

      <div className="definition-box">
        <p className="definition-label">In one line</p>
        <p className="definition-text">Vector search = embed the question, then return the stored items whose vectors point in the most similar direction.</p>
      </div>

      <Flow
        label="Search flow"
        steps={[
          { title: 'Question', text: '"Can I work from home?"' },
          { title: 'Embed', text: 'Same model as the documents' },
          { title: 'Compare', text: 'Distance to every stored vector' },
          { title: 'Top K', text: 'Return the 5 closest chunks' },
        ]}
      />

      <section className="method-section">
        <h2 className="method-title">Cosine similarity, with tiny numbers</h2>
        <p className="com-text">
          Cosine similarity measures the angle between two vectors. It only cares about direction, not length. Same direction gives 1, unrelated (90 degrees) gives 0, opposite gives -1. Let's use 2 numbers instead of 3072 so you can see it:
        </p>
        <div className="ai-table-wrap">
          <table className="ai-table">
            <thead>
              <tr><th>Vectors</th><th>Direction</th><th>Cosine similarity</th></tr>
            </thead>
            <tbody>
              <tr><td>A = [1, 2] and B = [2, 4]</td><td>Exactly the same direction (B is just longer)</td><td className="ai-good">1.0 (same meaning)</td></tr>
              <tr><td>A = [1, 2] and C = [2, 1]</td><td>Similar direction</td><td>0.8</td></tr>
              <tr><td>A = [1, 2] and D = [2, -1]</td><td>At 90 degrees</td><td className="ai-bad">0.0 (unrelated)</td></tr>
            </tbody>
          </table>
        </div>
        <CodeBlock language="javascript" style={atomDark}>
          {`function cosineSimilarity(a, b) {
  let dot = 0, lengthA = 0, lengthB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    lengthA += a[i] * a[i];
    lengthB += b[i] * b[i];
  }
  return dot / (Math.sqrt(lengthA) * Math.sqrt(lengthB));
}

cosineSimilarity([1, 2], [2, 4]);  // 1
cosineSimilarity([1, 2], [2, 1]);  // 0.8
cosineSimilarity([1, 2], [2, -1]); // 0`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">The three distance operators in pgvector</h2>
        <div className="ai-table-wrap">
          <table className="ai-table">
            <thead>
              <tr><th>Operator</th><th>Meaning</th><th>When to use</th></tr>
            </thead>
            <tbody>
              <tr><td><code>&lt;=&gt;</code></td><td>Cosine distance (1 - cosine similarity)</td><td>Text embeddings. The usual choice.</td></tr>
              <tr><td><code>&lt;-&gt;</code></td><td>Euclidean (straight line) distance</td><td>When the length of the vector matters</td></tr>
              <tr><td><code>&lt;#&gt;</code></td><td>Negative inner product</td><td>Normalised vectors, slightly faster</td></tr>
            </tbody>
          </table>
        </div>
        <p className="com-text">They all return a distance, so smaller means closer. That is why you ORDER BY ascending.</p>
      </section>

      <section className="method-section">
        <h2 className="method-title">pgvector: store and search in PostgreSQL</h2>
        <p className="com-text">
          pgvector adds a vector column type to PostgreSQL. You keep your normal data and your vectors in the same database, with joins, transactions and WHERE filters, so you don't need a separate vector database for most apps.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE document_chunks (
  id          BIGSERIAL PRIMARY KEY,
  document_id BIGINT NOT NULL,
  content     TEXT   NOT NULL,
  embedding   vector(3072) NOT NULL
);

-- Find the 5 chunks closest in meaning to the question vector ($1)
SELECT id, content, 1 - (embedding <=> $1) AS similarity
FROM document_chunks
WHERE document_id = $2
ORDER BY embedding <=> $1
LIMIT 5;`}
        </CodeBlock>
        <CodeBlock language="javascript" style={atomDark}>
          {`// Node.js with the "pg" package: send the vector as a '[1,2,3]' string
const questionVector = await embed('Can I work from home?');

const { rows } = await pool.query(
  \`SELECT content, 1 - (embedding <=> $1) AS similarity
   FROM document_chunks
   ORDER BY embedding <=> $1
   LIMIT 5\`,
  [JSON.stringify(questionVector)],
);`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Indexes: making it fast</h2>
        <p className="com-text">
          Without an index, PostgreSQL compares the question with every single row. That is exact, and fine for a few thousand rows. For millions of rows you add an ANN index (Approximate Nearest Neighbour). It is much faster, and in return it may very rarely miss one of the true closest rows.
        </p>
        <ul className="com-list">
          <li className="com-list-item">HNSW: builds a graph of neighbours. Fast and accurate searches. Slower to build, uses more memory. The usual first choice.</li>
          <li className="com-list-item">IVFFlat: splits vectors into groups (lists) and only searches the nearest groups. Faster to build, but build it after you have data.</li>
        </ul>
        <CodeBlock language="sql" style={atomDark}>
          {`-- For vectors up to 2000 dimensions
CREATE INDEX ON document_chunks USING hnsw (embedding vector_cosine_ops);

-- pgvector indexes "vector" columns only up to 2000 dimensions.
-- For 3072-dimension embeddings, index a half-precision copy instead:
CREATE INDEX ON document_chunks
  USING hnsw ((embedding::halfvec(3072)) halfvec_cosine_ops);
-- and search with the same cast:
--   ORDER BY embedding::halfvec(3072) <=> $1::halfvec(3072)`}
        </CodeBlock>
        <p className="com-text">
          Match the index operator class to the operator you search with: vector_cosine_ops goes with &lt;=&gt;. If they don't match, PostgreSQL silently skips the index and scans every row.
        </p>
      </section>
    </div>
  );
}

export default VectorSearch;
