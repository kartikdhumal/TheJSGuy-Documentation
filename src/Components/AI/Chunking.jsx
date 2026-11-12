import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import '../../styles/ai.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Legend({ items }) {
  return (
    <div className="ai-legend">
      {items.map((item) => (
        <span key={item.label}><span className={`ai-legend-dot ${item.className}`} />{item.label}</span>
      ))}
    </div>
  );
}

function Chunking() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Chunking Strategies</h1>
      <p className="com-text">
        You can't embed a 200 page PDF as one vector. One vector for the whole book would be a blurry average of everything in it, and it would never match a specific question well. So you cut documents into smaller pieces called chunks, and embed each chunk on its own. How you cut them is called your chunking strategy, and it decides how good your search results are.
      </p>

      <div className="definition-box">
        <p className="definition-label">In one line</p>
        <p className="definition-text">Each chunk should be small enough to be about one thing, and big enough to make sense on its own.</p>
      </div>

      <section className="method-section">
        <h2 className="method-title">Why chunk size matters</h2>
        <div className="ai-table-wrap">
          <table className="ai-table">
            <thead>
              <tr><th></th><th>Too small (one sentence)</th><th>Too big (whole pages)</th></tr>
            </thead>
            <tbody>
              <tr><td>Problem</td><td>Loses context. "It costs 50 per month" means nothing without knowing what "it" is.</td><td>Mixes many topics, so the vector is vague and matches poorly.</td></tr>
              <tr><td>Effect on answers</td><td>The LLM gets facts without the surrounding meaning.</td><td>Fills the context window with text that is not relevant, costs more.</td></tr>
            </tbody>
          </table>
        </div>
        <p className="com-text">A common starting point is around 300 to 800 tokens per chunk, with 10 to 20 percent overlap. Then test with real questions and adjust.</p>
      </section>

      <section className="method-section">
        <h2 className="method-title">1. Fixed-size chunking</h2>
        <p className="com-text">Cut every N characters or tokens, no matter what. Simple and fast, but it can cut a sentence in half.</p>
        <div className="ai-chunks">
          <span className="ai-chunk ai-chunk-a">Employees get 20 days of paid leave per ye</span>
          <span className="ai-chunk ai-chunk-b">ar. Unused leave can be carried over to the nex</span>
          <span className="ai-chunk ai-chunk-c">t year, up to a maximum of 5 days.</span>
        </div>
        <p className="com-text">See the problem? "year" and "next" got cut in half, so no single chunk holds the full rule.</p>
      </section>

      <section className="method-section">
        <h2 className="method-title">2. Overlap: the simple fix</h2>
        <p className="com-text">Let each chunk repeat the end of the previous one. A fact that sits on a boundary now appears whole in at least one chunk.</p>
        <div className="ai-chunks">
          <span className="ai-chunk ai-chunk-a">Employees get 20 days of paid leave per year. </span>
          <span className="ai-chunk ai-chunk-overlap">Unused leave can be carried over</span>
          <span className="ai-chunk ai-chunk-b"> to the next year, up to a maximum of 5 days.</span>
        </div>
        <Legend items={[
          { label: 'Chunk 1', className: 'ai-chunk-a' },
          { label: 'Shared by both chunks (overlap)', className: 'ai-chunk-overlap' },
          { label: 'Chunk 2', className: 'ai-chunk-b' },
        ]} />
        <CodeBlock language="javascript" style={atomDark}>
          {`function chunkText(text, size = 1000, overlap = 150) {
  const chunks = [];
  for (let start = 0; start < text.length; start += size - overlap) {
    chunks.push(text.slice(start, start + size));
    if (start + size >= text.length) break;
  }
  return chunks;
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">3. Recursive chunking (the best default)</h2>
        <p className="com-text">
          Try to split on the biggest natural break first: paragraphs. If a piece is still too big, split it on lines, then sentences, then words. You end up with chunks that respect the structure of the text. This is what LangChain's RecursiveCharacterTextSplitter does, and it is a great default for most documents.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`const SEPARATORS = ['\\n\\n', '\\n', '. ', ' '];

function recursiveSplit(text, maxSize = 1000, separators = SEPARATORS) {
  if (text.length <= maxSize) return [text];
  const [separator, ...rest] = separators;
  if (!separator) return [text.slice(0, maxSize), ...recursiveSplit(text.slice(maxSize), maxSize, [])];

  const chunks = [];
  let current = '';
  for (const part of text.split(separator)) {
    const candidate = current ? current + separator + part : part;
    if (candidate.length <= maxSize) {
      current = candidate;
    } else {
      if (current) chunks.push(current);
      current = '';
      if (part.length > maxSize) chunks.push(...recursiveSplit(part, maxSize, rest));
      else current = part;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">4. Structure-based chunking</h2>
        <p className="com-text">Use the document's own structure as the cut points. One chunk per heading section in Markdown or HTML, one per function in code, one per row group in a table, one per FAQ question. Chunks then match how a human would read the document.</p>
      </section>

      <section className="method-section">
        <h2 className="method-title">5. Semantic chunking</h2>
        <p className="com-text">Embed every sentence, then start a new chunk wherever the meaning suddenly changes (two neighbouring sentences are not similar). Best quality for long mixed documents, but slower and more expensive, because you embed every sentence first.</p>
      </section>

      <section className="method-section">
        <h2 className="method-title">6. Chunking chat messages (how Walyze does it)</h2>
        <p className="com-text">Chats are not documents. A single message like "yes" means nothing alone. So Walyze groups messages into windows of 40 messages, where each window repeats the last 3 messages of the previous one (overlap). Every line keeps the sender, date and time, so the chunk still knows who said what and when.</p>
        <CodeBlock language="javascript" style={atomDark}>
          {`const CHUNK_SIZE = 40;   // messages per chunk
const CHUNK_OVERLAP = 3; // messages repeated from the previous chunk

function buildChunks(messages) {
  const chunks = [];
  const step = CHUNK_SIZE - CHUNK_OVERLAP;
  for (let start = 0; start < messages.length; start += step) {
    chunks.push(messages.slice(start, start + CHUNK_SIZE));
    if (start + CHUNK_SIZE >= messages.length) break;
  }
  return chunks;
}

// Each chunk becomes text like:
// Rahul (12/03/2026 21:14): are we meeting tomorrow?
// Priya (12/03/2026 21:15): yes, 10 am at the cafe`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Always store metadata with each chunk</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`{
  content: "Unused leave can be carried over to the next year, up to 5 days.",
  embedding: [0.012, -0.08, ...],
  metadata: {
    documentId: 42,
    title: "Leave Policy 2026",
    section: "Carry-over rules",
    page: 3,
    chunkIndex: 7
  }
}`}
        </CodeBlock>
        <ul className="com-list">
          <li className="com-list-item">Filter before searching: only this user's documents, only this tenant, only the latest version.</li>
          <li className="com-list-item">Show sources: "Answer based on Leave Policy 2026, page 3".</li>
          <li className="com-list-item">Add the title or section to the chunk text before embedding. It gives each chunk extra context and often improves matching.</li>
        </ul>
      </section>
    </div>
  );
}

export default Chunking;
