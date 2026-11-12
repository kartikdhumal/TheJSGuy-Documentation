import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import '../../styles/ai.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Flow from './Flow';

function AdvancedRAG() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Advanced RAG</h1>
      <p className="com-text">
        Basic RAG works surprisingly well. But when answers are wrong, the cause is almost always retrieval: the right chunk was never found. These techniques make retrieval better. Add them one at a time, and only when you can measure that they help.
      </p>

      <Flow
        label="An improved query pipeline"
        steps={[
          { title: 'Rewrite', text: 'Make the question standalone' },
          { title: 'Hybrid search', text: 'Vector + keyword' },
          { title: 'Re-rank', text: 'Keep the best 5 of 30' },
          { title: 'Generate', text: 'Answer with sources' },
        ]}
      />

      <section className="method-section">
        <h2 className="method-title">1. Query rewriting (essential for chat)</h2>
        <p className="com-text">
          In a chat, follow-up questions don't make sense alone. If the user first asks about leave policy and then asks "what about sick days?", embedding "what about sick days?" alone gives poor results. So first ask a cheap, fast LLM call to turn it into a standalone question.
        </p>
        <CodeBlock language="text" style={atomDark}>
          {`Chat history:
User: How many leave days do I get?
Bot:  You get 20 days of paid leave per year.
User: what about sick days?

Rewritten standalone question:
"How many sick days do employees get per year?"`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">2. Hybrid search: vector + keyword</h2>
        <p className="com-text">
          Vector search is great at meaning but weak at exact terms: invoice numbers, error codes, product names, people's names. Keyword search (PostgreSQL full-text search, or BM25) is the opposite. Hybrid search runs both and merges the two result lists.
        </p>
        <div className="ai-table-wrap">
          <table className="ai-table">
            <thead>
              <tr><th>Query</th><th>Vector search</th><th>Keyword search</th></tr>
            </thead>
            <tbody>
              <tr><td>"I can't get into my account"</td><td className="ai-good">Finds "login problems"</td><td className="ai-bad">No shared words</td></tr>
              <tr><td>"Error ERR_4012"</td><td className="ai-bad">Returns vaguely similar errors</td><td className="ai-good">Exact match</td></tr>
            </tbody>
          </table>
        </div>
        <p className="com-text">A simple, popular way to merge both lists is Reciprocal Rank Fusion (RRF): each chunk scores 1 / (60 + its rank) in each list, and you add the scores up. Chunks that rank well in both lists rise to the top.</p>
        <CodeBlock language="javascript" style={atomDark}>
          {`function reciprocalRankFusion(vectorResults, keywordResults, k = 60) {
  const scores = new Map();
  [vectorResults, keywordResults].forEach((list) => {
    list.forEach((chunk, rank) => {
      scores.set(chunk.id, (scores.get(chunk.id) ?? 0) + 1 / (k + rank + 1));
    });
  });
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">3. Re-ranking</h2>
        <p className="com-text">
          Retrieve more than you need (say 30 chunks), then use a re-ranker to pick the best 5. A re-ranker (a cross-encoder model, or an LLM call) reads the question and each chunk together, so it judges relevance much more accurately than comparing two separate vectors. It is slower, which is why you only run it on a short list.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">4. Metadata filtering</h2>
        <p className="com-text">
          Narrow the search before comparing vectors: only this tenant, only documents from 2026, only the "HR" category. This is faster, more accurate, and it is also your permission check.
        </p>
        <CodeBlock language="sql" style={atomDark}>
          {`SELECT content
FROM document_chunks
WHERE tenant_id = $2 AND category = 'HR'
ORDER BY embedding <=> $1
LIMIT 5;`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">5. Parent-child chunks</h2>
        <p className="com-text">
          Small chunks match questions precisely, but big chunks give the LLM more context. Get both: search with small child chunks, and when one matches, send its bigger parent section (for example the full heading section) to the LLM.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">6. Evaluation: measure before you tune</h2>
        <p className="com-text">Build a small test set of 20 to 50 real questions where you know the right answer and the right source chunk. Run it after every change.</p>
        <ul className="com-list">
          <li className="com-list-item">Retrieval hit rate: did the correct chunk appear in the top K results?</li>
          <li className="com-list-item">Faithfulness: is every claim in the answer supported by the retrieved chunks? (no hallucination)</li>
          <li className="com-list-item">Answer relevance: does the answer actually address the question?</li>
        </ul>
        <CodeBlock language="javascript" style={atomDark}>
          {`const testSet = [
  { question: 'How many leave days carry over?', expectedChunkId: 7 },
  { question: 'Who approves overtime?', expectedChunkId: 19 },
];

let hits = 0;
for (const test of testSet) {
  const results = await retrieve(test.question, 5);
  if (results.some((chunk) => chunk.id === test.expectedChunkId)) hits++;
}
console.log(\`Hit rate @5: \${((hits / testSet.length) * 100).toFixed(0)}%\`);`}
        </CodeBlock>
      </section>
    </div>
  );
}

export default AdvancedRAG;
