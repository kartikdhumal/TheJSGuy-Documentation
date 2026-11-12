import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import '../../styles/ai.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Flow from './Flow';

function RAG() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">RAG (Retrieval-Augmented Generation)</h1>
      <p className="com-text">
        An LLM knows nothing about your private data: your company's policies, your product docs, your WhatsApp chats. RAG fixes that without retraining the model. Before the model answers, you search your own data for the most relevant pieces and paste them into the prompt. The model then answers from those facts.
      </p>
      <p className="com-text">
        It is like an open-book exam. The student (the LLM) is smart, but instead of answering from memory, they first find the right pages in the book (retrieval), then write the answer using those pages (generation).
      </p>

      <div className="definition-box">
        <p className="definition-label">In one line</p>
        <p className="definition-text">RAG = search your data for relevant chunks, put them in the prompt, and ask the LLM to answer only from them.</p>
      </div>

      <section className="method-section">
        <h2 className="method-title">The two pipelines</h2>
        <p className="com-text">RAG always has two separate parts. One runs once per document (often in a background job). The other runs on every question.</p>
        <Flow
          label="1. Ingestion (once per document)"
          steps={[
            { title: 'Load', text: 'PDF, docs, chats' },
            { title: 'Chunk', text: 'Split into pieces' },
            { title: 'Embed', text: 'Each chunk to a vector' },
            { title: 'Store', text: 'Vector + text + metadata in pgvector' },
          ]}
        />
        <Flow
          label="2. Query (every question)"
          steps={[
            { title: 'Question', text: 'From the user' },
            { title: 'Embed', text: 'Same model as ingestion' },
            { title: 'Retrieve', text: 'Top 5 closest chunks' },
            { title: 'Augment', text: 'Put chunks in the prompt' },
            { title: 'Generate', text: 'LLM answers from them' },
          ]}
        />
      </section>

      <section className="method-section">
        <h2 className="method-title">Setup used in the code below</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`import { GoogleGenerativeAI } from '@google/generative-ai';
import { Pool } from 'pg';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embedder = genAI.getGenerativeModel({ model: 'gemini-embedding-2' });
const chatModel = genAI.getGenerativeModel({
  model: 'gemini-3.5-flash-lite',
  generationConfig: { temperature: 0.2 },
});
const pool = new Pool({ connectionString: process.env.DATABASE_URL });`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Step 1: Ingestion code</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`async function ingestDocument(documentId, title, fullText) {
  const chunks = recursiveSplit(fullText, 1000);          // see Chunking Strategies
  const texts = chunks.map((chunk) => \`\${title}\\n\\n\${chunk}\`); // add the title for context

  const { embeddings } = await embedder.batchEmbedContents({
    requests: texts.map((text) => ({ content: { role: 'user', parts: [{ text }] } })),
  });

  for (let i = 0; i < chunks.length; i++) {
    await pool.query(
      'INSERT INTO document_chunks (document_id, content, embedding) VALUES ($1, $2, $3)',
      [documentId, chunks[i], JSON.stringify(embeddings[i].values)],
    );
  }
}`}
        </CodeBlock>
        <p className="com-text">
          In a real app this runs in a background queue (for example BullMQ), because embedding a big document can take a while and you don't want the upload request to wait for it.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Step 2: Retrieval</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`async function retrieve(question, topK = 5) {
  const { embedding } = await embedder.embedContent(question);

  const { rows } = await pool.query(
    \`SELECT id, content, 1 - (embedding <=> $1) AS similarity
     FROM document_chunks
     ORDER BY embedding <=> $1
     LIMIT $2\`,
    [JSON.stringify(embedding.values), topK],
  );

  return rows.filter((row) => row.similarity > 0.5); // drop weak matches
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Step 3: Augment and generate</h2>
        <p className="com-text">This prompt is where RAG succeeds or fails. Tell the model to use only the context, and what to do when the answer is not there.</p>
        <CodeBlock language="javascript" style={atomDark}>
          {`async function answer(question) {
  const chunks = await retrieve(question);
  if (chunks.length === 0) return "I couldn't find anything about that in your documents.";

  const context = chunks
    .map((chunk, i) => \`[\${i + 1}] \${chunk.content}\`)
    .join('\\n\\n');

  const prompt = \`Answer the question using ONLY the context below.
If the answer is not in the context, say "I don't know based on the documents."
Mention the source number like [1] after each fact you use.

Context:
\${context}

Question: \${question}\`;

  const result = await chatModel.generateContent(prompt);
  return result.response.text();
}

// answer('How many leave days can I carry over?')
// -> "You can carry over up to 5 unused leave days to the next year [1]."`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Why RAG instead of fine-tuning?</h2>
        <div className="ai-table-wrap">
          <table className="ai-table">
            <thead>
              <tr><th></th><th>RAG</th><th>Fine-tuning</th></tr>
            </thead>
            <tbody>
              <tr><td>Teaches the model</td><td>New facts, at question time</td><td>A style, format or behaviour</td></tr>
              <tr><td>Data changes daily?</td><td className="ai-good">Just re-index the changed document</td><td className="ai-bad">Retrain again</td></tr>
              <tr><td>Shows sources</td><td className="ai-good">Yes, you know which chunks were used</td><td className="ai-bad">No</td></tr>
              <tr><td>Per-user permissions</td><td className="ai-good">Filter chunks with a WHERE clause</td><td className="ai-bad">Impossible, facts are baked in</td></tr>
              <tr><td>Cost to start</td><td className="ai-good">Low</td><td>Higher</td></tr>
            </tbody>
          </table>
        </div>
        <p className="com-text">For "answer questions about my data", RAG is almost always the right first choice.</p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Common RAG mistakes</h2>
        <ul className="com-list">
          <li className="com-list-item">Bad chunks: chunks that cut facts in half. Fix the chunking before anything else.</li>
          <li className="com-list-item">No permission filter: user A's question retrieves user B's documents. Always filter by user or tenant in the SQL query, before the LLM sees anything.</li>
          <li className="com-list-item">Too many chunks: stuffing 50 chunks in confuses the model and costs more. Start with 3 to 8.</li>
          <li className="com-list-item">No "I don't know" rule: the model makes something up when retrieval finds nothing useful.</li>
          <li className="com-list-item">Never measuring: keep a list of real questions with known answers and check that the right chunks come back (see Advanced RAG).</li>
        </ul>
      </section>
    </div>
  );
}

export default RAG;
