import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import '../../styles/ai.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Flow from './Flow';

const SIMILARITY = [
  { text: '"How do I change my password?"', score: 0.92 },
  { text: '"I forgot my login details"', score: 0.81 },
  { text: '"Update my email address"', score: 0.55 },
  { text: '"What is the weather today?"', score: 0.08 },
];

function Embeddings() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Embeddings</h1>
      <p className="com-text">
        Computers are great with numbers but bad with meaning. An embedding turns a piece of text into a long list of numbers (a vector) that captures its meaning. Texts with similar meaning get similar numbers, even if they use completely different words.
      </p>

      <div className="definition-box">
        <p className="definition-label">In one line</p>
        <p className="definition-text">An embedding is text turned into a list of numbers, where similar meaning means the numbers are close together.</p>
      </div>

      <section className="method-section">
        <h2 className="method-title">The map idea</h2>
        <p className="com-text">
          Imagine a giant map where every sentence gets a pin. "Reset my password" and "I forgot my login" get pins right next to each other. "Best pizza in town" gets a pin far away. An embedding is just the coordinates of that pin. A real map has 2 coordinates (x, y). An embedding has hundreds or thousands, for example 768, 1536 or 3072. More dimensions let the model capture more detail about meaning.
        </p>
        <Flow
          steps={[
            { title: 'Text', text: '"Reset my password"' },
            { title: 'Embedding model', text: 'e.g. gemini-embedding-2' },
            { title: 'Vector', text: '[0.021, -0.443, 0.118, ... ] 3072 numbers' },
          ]}
        />
      </section>

      <section className="method-section">
        <h2 className="method-title">Meaning, not keywords</h2>
        <p className="com-text">
          Here is how close some sentences are to the query "I can't log in to my account". A score near 1 means very similar meaning. Notice the second one shares almost no words with the query, but it still scores high, because the meaning matches. A normal keyword search would miss it.
        </p>
        {SIMILARITY.map((item) => (
          <div key={item.text} className="ai-bar-row">
            <span className="ai-bar-label">{item.text}</span>
            <span className="ai-bar-track"><span className="ai-bar-fill" style={{ width: `${item.score * 100}%`, display: 'block' }} /></span>
            <span className="ai-bar-value">{item.score.toFixed(2)}</span>
          </div>
        ))}
        <p className="com-text">These scores are illustrative, to show the idea. Real numbers depend on the model.</p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Creating an embedding in Node.js</h2>
        <p className="com-text">This is the same call Walyze makes. One text in, one vector out.</p>
        <CodeBlock language="javascript" style={atomDark}>
          {`import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embedder = genAI.getGenerativeModel({ model: 'gemini-embedding-2' });

const result = await embedder.embedContent('How do I reset my password?');
const vector = result.embedding.values;

console.log(vector.length); // 3072
console.log(vector.slice(0, 3)); // [ 0.0213, -0.0441, 0.0118 ] (example values)`}
        </CodeBlock>
        <p className="com-text">When you have many texts, send them in one batch call. It is much faster than one request per text.</p>
        <CodeBlock language="javascript" style={atomDark}>
          {`const texts = ['First chunk', 'Second chunk', 'Third chunk'];

const { embeddings } = await embedder.batchEmbedContents({
  requests: texts.map((text) => ({ content: { role: 'user', parts: [{ text }] } })),
});

const vectors = embeddings.map((e) => e.values); // 3 vectors, same order as texts`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Rules you must follow</h2>
        <ul className="com-list">
          <li className="com-list-item">Use the same embedding model for your stored documents and for the search query. Vectors from two different models are like coordinates from two different maps. Comparing them is meaningless.</li>
          <li className="com-list-item">If you switch models, you must re-embed everything you stored.</li>
          <li className="com-list-item">The vector size is fixed by the model. Your database column must match it, for example vector(3072).</li>
          <li className="com-list-item">Embed once and store the result. Embedding costs money and time, so never re-embed the same text on every search.</li>
        </ul>
      </section>

      <section className="method-section">
        <h2 className="method-title">What embeddings are used for</h2>
        <ul className="com-list">
          <li className="com-list-item">Semantic search: find documents by meaning, not exact words.</li>
          <li className="com-list-item">RAG: find the right facts to give an LLM before it answers.</li>
          <li className="com-list-item">Recommendations: "people who read this also liked..."</li>
          <li className="com-list-item">Duplicate detection and clustering: group similar support tickets or reviews.</li>
        </ul>
      </section>
    </div>
  );
}

export default Embeddings;
