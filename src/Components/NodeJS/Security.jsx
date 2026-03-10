import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Security() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Security in Express.js</h1>
      <p>
        Use <strong>helmet</strong> for secure headers, <strong>rate limiting</strong> to prevent abuse, and avoid exposing sensitive data. Always validate and sanitize input.
      </p>

      <div className="method-section">
        <h2 className="method-title">Helmet – secure HTTP headers</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`// npm install helmet
const helmet = require('helmet');
const app = express();

app.use(helmet());
// Sets X-Content-Type-Options, X-Frame-Options, etc.`}
        </SyntaxHighlighter>
      </div>

      <div className="method-section">
        <h2 className="method-title">Rate limiting</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`// npm install express-rate-limit
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100                    // max 100 requests per window
});
app.use(limiter);`}
        </SyntaxHighlighter>
      </div>

      <div className="method-section">
        <h2 className="method-title">Best practices</h2>
        <ul>
          <li>Keep dependencies updated (<code>npm audit</code>).</li>
          <li>Use environment variables for secrets (never commit).</li>
          <li>Validate and sanitize all input; use parameterized queries for DB.</li>
          <li>Use HTTPS in production.</li>
        </ul>
      </div>
    </div>
  );
}

export default Security;
