import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function HTTPModule() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">HTTP Module in Node.js</h1>
      <p>
        The built-in <code>http</code> module lets you create HTTP servers and make HTTP requests without Express. Useful for understanding how Express works under the hood.
      </p>

      <div className="method-section">
        <h2 className="method-title">Create a simple HTTP server</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Node.js HTTP server');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});`}
        </SyntaxHighlighter>
      </div>

      <div className="method-section">
        <h2 className="method-title">Handling URL and method</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (url === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Welcome' }));
  } else if (url === '/users' && method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(body);
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});`}
        </SyntaxHighlighter>
      </div>

      <div className="method-section">
        <h2 className="method-title">Making HTTP requests (client)</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`const http = require('http');

const options = {
  hostname: 'api.example.com',
  path: '/users',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(JSON.parse(data)));
});
req.on('error', err => console.error(err));
req.end();`}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default HTTPModule;
