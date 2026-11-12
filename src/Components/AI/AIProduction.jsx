import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import '../../styles/ai.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Flow from './Flow';

function AIProduction() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">AI in Production</h1>
      <p className="com-text">
        A demo that calls an LLM takes an hour. A real AI feature that is fast, affordable, safe and reliable takes real backend engineering. This page covers the parts that matter once real users arrive.
      </p>

      <section className="method-section">
        <h2 className="method-title">1. Streaming: show the answer while it is written</h2>
        <p className="com-text">
          A full answer can take 5 to 10 seconds. If the user stares at a spinner that whole time, it feels broken. With streaming, the first words appear in under a second and the rest flows in, exactly like ChatGPT. The total time is the same, but it feels much faster.
        </p>
        <Flow
          steps={[
            { title: 'LLM', text: 'Produces tokens one by one' },
            { title: 'Your server', text: 'Forwards each piece (SSE)' },
            { title: 'Browser', text: 'Appends text as it arrives' },
          ]}
        />
        <CodeBlock language="javascript" style={atomDark}>
          {`// Express: stream the answer with Server-Sent Events (SSE)
app.post('/api/chat', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');

  const result = await chatModel.generateContentStream(req.body.question);
  for await (const chunk of result.stream) {
    res.write(\`data: \${JSON.stringify({ text: chunk.text() })}\\n\\n\`);
  }
  res.write('data: [DONE]\\n\\n');
  res.end();
});`}
        </CodeBlock>
        <CodeBlock language="javascript" style={atomDark}>
          {`// Browser: read the stream and append the text
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  appendToChat(decoder.decode(value)); // parse the "data:" lines in a real app
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">2. Cost control</h2>
        <p className="com-text">You pay for input tokens (everything you send) and output tokens (the answer). Output tokens usually cost several times more than input tokens.</p>
        <ul className="com-list">
          <li className="com-list-item">Send fewer tokens: fewer, better chunks in RAG, and trim old chat history.</li>
          <li className="com-list-item">Cap the answer with maxOutputTokens.</li>
          <li className="com-list-item">Use a small, cheap model for simple jobs (classification, query rewriting, suggestions) and a bigger one only where quality really matters.</li>
          <li className="com-list-item">Cache answers to repeated questions in Redis, and never re-embed text you already embedded.</li>
          <li className="com-list-item">Set per-user daily limits so one user (or a bug in a loop) cannot burn your whole budget.</li>
        </ul>
      </section>

      <section className="method-section">
        <h2 className="method-title">3. Rate limits, retries and timeouts</h2>
        <p className="com-text">
          AI APIs limit requests per minute and tokens per minute, and they sometimes return 429 (too many requests) or 503 (overloaded). Treat them like any slow, unreliable external service.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`async function withRetry(fn, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      const retryable = error.status === 429 || error.status === 503;
      if (!retryable || i === attempts - 1) throw error;
      await new Promise((r) => setTimeout(r, 1000 * 2 ** i)); // 1s, 2s, 4s
    }
  }
}

const vector = await withRetry(() => embedder.embedContent(text));`}
        </CodeBlock>
        <p className="com-text">For big jobs, like embedding a whole uploaded file, use a background queue such as BullMQ. It processes in batches, retries failures, and keeps your API fast.</p>
      </section>

      <section className="method-section">
        <h2 className="method-title">4. Privacy and security</h2>
        <ul className="com-list">
          <li className="com-list-item">Everything you send to an AI API leaves your server. Check the provider's data policy, and don't send passwords, payment data or ID numbers.</li>
          <li className="com-list-item">Encrypt sensitive stored data (chunks and even embeddings), and delete it when it is no longer needed. Walyze encrypts stored chats and deletes them after the session ends.</li>
          <li className="com-list-item">Always filter retrieved data by the logged-in user or tenant in SQL. Never rely on the prompt for access control.</li>
          <li className="com-list-item">Defend against prompt injection: treat model output as untrusted, and keep secrets out of prompts.</li>
        </ul>
      </section>

      <section className="method-section">
        <h2 className="method-title">5. Observability: know what is happening</h2>
        <p className="com-text">For every AI call, log the model, input and output token counts, the time it took, and whether it failed. Keep the retrieved chunk ids for RAG answers, so when a user reports a wrong answer you can see exactly why. Watch the cost per day on a dashboard.</p>
      </section>

      <section className="method-section">
        <h2 className="method-title">6. Fallbacks and graceful failure</h2>
        <ul className="com-list">
          <li className="com-list-item">If the AI API is down, show a clear message instead of a blank screen or endless spinner.</li>
          <li className="com-list-item">If the daily quota is reached, tell the user when it resets.</li>
          <li className="com-list-item">Keep the rest of your app working without AI. AI should be a feature, not a single point of failure.</li>
        </ul>
      </section>
    </div>
  );
}

export default AIProduction;
