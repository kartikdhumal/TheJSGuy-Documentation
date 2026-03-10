import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NextJSEnv() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Environment Variables</h1>
      <p>
        Put env vars in <code>.env.local</code> (or <code>.env</code>). Variables starting with <code>NEXT_PUBLIC_</code> are exposed to the browser; others are server-only. Never commit secrets; use <code>.env.local</code> and add it to <code>.gitignore</code>.
      </p>
      <div className="method-section">
        <h2 className="method-title">Server-only (default)</h2>
        <CodeBlock language="text" style={atomDark}>
          {`# .env.local
DATABASE_URL=postgresql://...
API_SECRET=xyz`}
        </CodeBlock>
        <CodeBlock language="javascript" style={atomDark}>
          {`// Only available on server (API routes, Server Components)
const url = process.env.DATABASE_URL;`}
        </CodeBlock>
      </div>
      <div className="method-section">
        <h2 className="method-title">Expose to browser</h2>
        <CodeBlock language="text" style={atomDark}>
          {`NEXT_PUBLIC_APP_URL=https://myapp.com`}
        </CodeBlock>
        <CodeBlock language="javascript" style={atomDark}>
          {`// Client or Server
const url = process.env.NEXT_PUBLIC_APP_URL;`}
        </CodeBlock>
      </div>
    </div>
  );
}

export default NextJSEnv;
