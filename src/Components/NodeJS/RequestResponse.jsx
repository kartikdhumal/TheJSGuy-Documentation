import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function RequestResponse() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Request & Response in Express.js</h1>
      <p>
        Route handlers receive <code>req</code> (request) and <code>res</code> (response). Understanding their properties and methods is essential for building APIs and web apps.
      </p>

      <div className="method-section">
        <h2 className="method-title">Request (req) – params, query, body, headers</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`// GET /users/42?role=admin
// req.params  → { id: '42' }
// req.query   → { role: 'admin' }

app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const role = req.query.role;
  res.json({ userId, role });
});

// POST body (need express.json() middleware)
// req.body  → parsed JSON
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({ name, email });
});

// Headers
const token = req.headers.authorization;
const contentType = req.headers['content-type'];`}
        </CodeBlock>
      </div>

      <div className="method-section">
        <h2 className="method-title">Response (res) – status, send, json, redirect</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`res.status(200).send('OK');
res.status(201).json({ id: 1, name: 'John' });
res.status(404).send('Not Found');
res.redirect(302, '/login');
res.set('X-Custom-Header', 'value');
res.cookie('name', 'value', { maxAge: 3600000 });`}
        </CodeBlock>
      </div>
    </div>
  );
}

export default RequestResponse;
