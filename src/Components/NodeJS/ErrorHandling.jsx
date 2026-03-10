import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ErrorHandling() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Error Handling in Node.js</h1>
      <p>
        Proper error handling prevents crashes and helps with debugging. Use try/catch for sync code and callbacks or .catch() for async code. Handle <code>uncaughtException</code> and <code>unhandledRejection</code> for safety.
      </p>

      <div className="method-section">
        <h2 className="method-title">Try/Catch for synchronous code</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`try {
  const data = JSON.parse(invalidJson);
} catch (err) {
  console.error('Parse error:', err.message);
}`}
        </SyntaxHighlighter>
      </div>

      <div className="method-section">
        <h2 className="method-title">Async: callbacks and Promises</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`// Callback style
fs.readFile('file.txt', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});

// Promise / async-await
async function read() {
  try {
    const data = await fs.promises.readFile('file.txt', 'utf8');
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}`}
        </SyntaxHighlighter>
      </div>

      <div className="method-section">
        <h2 className="method-title">Global error handlers</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});`}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default ErrorHandling;
